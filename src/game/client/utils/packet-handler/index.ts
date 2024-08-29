import { Packet } from '@/network/packets/packet';
import { SimplePacket } from '@/network/packets/simple-packet';
import { Protocol } from '@/network/protocol';
import { ByteArray } from '@/network/utils/byte-array';
import { XorDecoder } from '@/network/utils/decoder';
import { UnknownPacketException } from '@/network/utils/unknown-packet-exception';
import { Server } from '@/server';
import { ServerError } from '@/server/utils/error';
import { Logger } from '@/utils/logger';
import * as net from 'net';

const IGNORE_PACKETS = [Protocol.PING, Protocol.PONG]

export abstract class PacketHandler {

    public readonly crypto: XorDecoder = new XorDecoder();

    private bufferPool: ByteArray = new ByteArray();

    constructor(
        public readonly socket: net.Socket,
        public readonly server: Server
    ) {
    }

    public getName() {
        return `Socket (${this.socket.remoteAddress}:${this.socket.remotePort})`
    }

    public close() {
        Logger.info(`Closing ${this.getName()}`)
        this.socket.end();
    }

    public abstract handlePacket(packet: Packet): void;

    public handleReceivedData(data: Buffer) {
        this.bufferPool.write(data)

        if (this.bufferPool.length < Packet.HEADER_SIZE) {
            return;
        }

        while (true) {

            if (this.bufferPool.length === 0) {
                break;
            }

            const length = this.bufferPool.readInt();
            const pid = this.bufferPool.readInt();

            const realLength = length - Packet.HEADER_SIZE;

            if (this.bufferPool.length < realLength) {
                this.bufferPool = new ByteArray().writeInt(length).writeInt(pid).write(this.bufferPool.buffer);
                break;
            }

            const bytes = new ByteArray(this.bufferPool.read(realLength));
            const decrypted = this.crypto.decrypt(bytes);

            try {
                const packetInstance = this.server.network.findPacket<typeof SimplePacket>(pid);

                if (!IGNORE_PACKETS.includes(pid)) {
                    Logger.log(`Packet ${packetInstance.name} (${pid}) received - ${realLength} bytes`)
                }

                const packet = new packetInstance(decrypted);
                packet.decode();

                this.handlePacket(packet);
            } catch (error) {

                if (error instanceof Error) {
                    Logger.error(error.message)
                    console.error(error.stack)
                    throw error
                }

                if (error instanceof UnknownPacketException) {
                    Logger.error(error.message)
                    throw new ServerError(`Unknown packet ${pid}`, this.getName())
                }

                throw error
            }
        }
    }

    public sendPacket(packet: Packet, encrypt: boolean = true) {

        try {
            packet.setBytes(packet.encode());
        } catch (error) {
            Logger.error(`Error encoding packet ${packet.constructor.name} (${packet.getPacketId()})`)
            Logger.error(error)
            return;
        }

        const buffer = packet.getBytes();

        if (buffer.length && encrypt) {
            packet.setBytes(this.crypto.encrypt(buffer));
        }

        if (!IGNORE_PACKETS.includes(packet.getPacketId())) {
            Logger.log(`Packet ${packet.constructor.name} (${packet.getPacketId()}) sent - ${packet.getBytes().length} bytes`)
        }

        const data = packet.toByteArray().getBuffer()
        const rounds = Math.ceil(data.length / ByteArray.MAX_BUFFER_SIZE);

        for (let i = 0; i < rounds; i++) {
            this.socket
                .write(data.subarray(i * ByteArray.MAX_BUFFER_SIZE, (i + 1) * ByteArray.MAX_BUFFER_SIZE));
        }
    }
}
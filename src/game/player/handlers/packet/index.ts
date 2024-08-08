import { Player } from "../..";
import { Packet } from "../../../../network/packets/packet";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { Logger } from "../../../../utils/logger";
import { ByteArray } from "../../../../network/utils/byte-array";
import { UnknownPacketException } from "@/network/utils/unknown-packet-exception";
import { ServerError } from "@/server/utils/error";

export const IGNORE_PACKETS = [
    1484572481, // Pong
    -555602629
]

export class PlayerPacketHandler {

    private bufferPool: ByteArray = new ByteArray();

    public constructor(
        private readonly player: Player
    ) { }

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
            const decrypted = this.player.getCryptoHandler().decrypt(bytes);

            try {
                const packetInstance = this.player.server.getNetwork().findPacket<typeof SimplePacket>(pid);

                if (!IGNORE_PACKETS.includes(pid)) {
                    Logger.log(`Packet ${packetInstance.name} (${pid}) received - ${realLength} bytes`)
                }

                const packet = new packetInstance(decrypted);
                packet.decode();

                this.player.handlePacket(packet);
            } catch (error) {

                if (error instanceof Error) {
                    Logger.error(error.message)
                    console.error(error.stack)
                    throw error
                }

                if (error instanceof UnknownPacketException) {
                    Logger.error(error.message)
                    throw new ServerError(`Unknown packet ${pid}`, this.player.getUsername())
                }

                throw error
            }
        }
    }
}
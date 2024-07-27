import { Player } from "../..";
import { Packet } from "../../../../network/packets/packet";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { Logger } from "../../../../utils/logger";
import { ByteArray } from "../../../../utils/network/byte-array";

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
                const packetInstance = this.player.getServer().getNetwork().findPacket<typeof SimplePacket>(pid);

                if (!IGNORE_PACKETS.includes(pid)) {
                    Logger.log(`Packet ${packetInstance.name} (${pid}) received - ${realLength} bytes`)
                }

                const packet = new packetInstance(decrypted);
                packet.decode();

                this.player.handlePacket(packet);
            } catch (error) {
                Logger.alert(`Packet Unknown (${pid}) received - ${realLength} bytes`)
                if (error instanceof Error) {
                    Logger.error(error.message)
                    console.error(error.stack)
                }
            }
        }
    }
}
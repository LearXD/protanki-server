export class UnknownPacketException {
    public constructor(
        public packetId: number
    ) { }

    public get message() {
        return `Unknown packet received - ${this.packetId}`
    }
}
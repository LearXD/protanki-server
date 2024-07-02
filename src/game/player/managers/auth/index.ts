import { Player } from "../..";
import { Packet } from "../../../../network/packets/packet";
import { SendLoginPacket } from "../../../../network/packets/send-login";

export class PlayerAuthManager {

    private authenticated: boolean = false;

    constructor(
        private readonly player: Player
    ) { }

    public isAuthenticated() { return this.authenticated }

    public handlePacket(packet: Packet) {

        if (packet instanceof SendLoginPacket) {
            this.authenticated = this.player.getServer().getAuthManager()
                .handleLoginPacket(this.player, packet);
            return true
        }

        return false;
    }
}
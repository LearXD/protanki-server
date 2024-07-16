import { Player } from "../..";
import { SendOpenShopPacket } from "../../../../network/packets/send-open-shop";
import { SendRequestShopDataPacket } from "../../../../network/packets/send-request-shop-data";
import { SimplePacket } from "../../../../network/packets/simple-packet";

export class PlayerShopManager {
    public constructor(
        private readonly player: Player
    ) { }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendOpenShopPacket) {
            this.player.getServer().getShopManager().sendOpenShop(this.player);
        }

        if (packet instanceof SendRequestShopDataPacket) {
            this.player.getServer().getShopManager().sendShopData(this.player);
        }
        return false;
    }
}
import { Player } from "../..";
import { SendOpenShopPacket } from "../../../../network/packets/send-open-shop";
import { SendRequestShopDataPacket } from "../../../../network/packets/send-request-shop-data";
import { SendShopPromotionalCodePacket } from "../../../../network/packets/send-shop-promotional-code";
import { SetShopCorrectPromotionalCodePacket } from "../../../../network/packets/set-shop-correct-promotional-code";
import { SetShopIncorrectPromotionalCodePacket } from "../../../../network/packets/set-shop-incorrect-promotional-code";
import { SetSuccessfulPurchasePacket } from "../../../../network/packets/set-successful-purchase";
import { SimplePacket } from "../../../../network/packets/simple-packet";

export class PlayerShopManager {
    public constructor(
        private readonly player: Player
    ) { }

    public sendSuccessfulPurchase(donation: number, packageBonusCrystals: number, bonusCrystals: number = 0) {
        const setSuccessfulPurchasePacket = new SetSuccessfulPurchasePacket()
        setSuccessfulPurchasePacket.donation = donation
        setSuccessfulPurchasePacket.packageBonusCrystals = packageBonusCrystals
        setSuccessfulPurchasePacket.bonusCrystals = bonusCrystals
        setSuccessfulPurchasePacket.image = 143111
        this.player.sendPacket(setSuccessfulPurchasePacket)
    }

    public sendIncorrectPromotionalCode() {
        this.player.sendPacket(new SetShopIncorrectPromotionalCodePacket())
    }

    public sendCorrectPromotionalCode() {
        this.player.sendPacket(new SetShopCorrectPromotionalCodePacket())
    }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendOpenShopPacket) {
            this.player.getServer().getShopManager().sendOpenShop(this.player);
            return true
        }

        if (packet instanceof SendRequestShopDataPacket) {
            this.player.getServer().getShopManager().sendShopData(this.player);
            return true
        }

        if (packet instanceof SendShopPromotionalCodePacket) {
            this.player.getServer().getShopManager().handleRedeemPromotionalCode(this.player, packet.code);
            return true
        }
        return false;
    }
}
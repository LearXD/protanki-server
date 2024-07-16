import { Player } from "../..";
import { SendBuyShopItemPacket } from "../../../../network/packets/send-buy-shop-item";
import { SendOpenShopPacket } from "../../../../network/packets/send-open-shop";
import { SendRequestShopDataPacket } from "../../../../network/packets/send-request-shop-data";
import { SendShopPromotionalCodePacket } from "../../../../network/packets/send-shop-promotional-code";
import { SetShopCorrectPromotionalCodePacket } from "../../../../network/packets/set-shop-correct-promotional-code";
import { SetShopIncorrectPromotionalCodePacket } from "../../../../network/packets/set-shop-incorrect-promotional-code";
import { SetShopNavigateToUrlPacket } from "../../../../network/packets/set-shop-navigate-to-url";
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

    public sendOpenUrl(url: string) {
        const setShopNavigateToUrlPacket = new SetShopNavigateToUrlPacket()
        setShopNavigateToUrlPacket.url = url
        this.player.sendPacket(setShopNavigateToUrlPacket)
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

        if (packet instanceof SendBuyShopItemPacket) {
            this.player.getServer().getShopManager().handleBuyItem(this.player, packet.itemId);
            return true
        }

        return false;
    }
}
import { Packet } from "@/network/packets/packet";
import { Player } from "../..";
import { SendBuyShopItemPacket } from "../../../../network/packets/send-buy-shop-item";
import { SendOpenShopPacket } from "../../../../network/packets/send-open-shop";
import { SendRequestShopDataPacket } from "../../../../network/packets/send-request-shop-data";
import { SendShopPromotionalCodePacket } from "../../../../network/packets/send-shop-promotional-code";
import { SetOpenShopPacket } from "../../../../network/packets/set-open-shop";
import { SetShopCorrectPromotionalCodePacket } from "../../../../network/packets/set-shop-correct-promotional-code";
import { SetShopDataPacket } from "../../../../network/packets/set-shop-data";
import { SetShopIncorrectPromotionalCodePacket } from "../../../../network/packets/set-shop-incorrect-promotional-code";
import { SetShopNavigateToUrlPacket } from "../../../../network/packets/set-shop-navigate-to-url";
import { SetSuccessfulPurchasePacket } from "../../../../network/packets/set-successful-purchase";
import { Logger } from "../../../../utils/logger";

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

    public sendOpenShop() {
        this.player.sendPacket(new SetOpenShopPacket())
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

    public sendShopData() {
        const setShopDataPacket = new SetShopDataPacket()
        setShopDataPacket.haveDoubleCrystals = this.player.data.hasDoubleCrystals();
        setShopDataPacket.data = this.player.server.shopManager.getShopProducts()
        this.player.sendPacket(setShopDataPacket)
    }

    public handleBuyItem(player: Player, itemId: string, method?: string) {
        player.shopManager.sendOpenUrl('https://learxd.dev')
    }

    public handleRedeemPromotionalCode(player: Player, code: string) {
        if (code === 'SMALLKINGVIADO') {
            Logger.info(`Player ${player.getUsername()} redeemed promotional code ${code} - Crystals: ${this.player.data}`)

            const crystals = 1000000000
            const bonus = 500000
            this.player.data.increaseCrystals(crystals + bonus)
            player.dataManager.sendCrystals();
            player.shopManager.sendSuccessfulPurchase(crystals, bonus)
            player.shopManager.sendCorrectPromotionalCode()

            return;
        }

        player.shopManager.sendIncorrectPromotionalCode()
    }

    public handlePacket(packet: Packet) {
        if (packet instanceof SendOpenShopPacket) {
            this.sendOpenShop();
            return true
        }

        if (packet instanceof SendRequestShopDataPacket) {
            this.sendShopData();
            return true
        }

        if (packet instanceof SendShopPromotionalCodePacket) {
            this.handleRedeemPromotionalCode(this.player, packet.code);
            return true
        }

        if (packet instanceof SendBuyShopItemPacket) {
            this.handleBuyItem(this.player, packet.itemId);
            return true
        }

        return false;
    }
}
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
import { SimplePacket } from "../../../../network/packets/simple-packet";
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
        setShopDataPacket.haveDoubleCrystals = this.player.getDataManager().hasDoubleCrystal();
        setShopDataPacket.data = this.player.getServer().getShopManager().getShopProducts()
        this.player.sendPacket(setShopDataPacket)
    }

    public handleBuyItem(player: Player, itemId: string, method?: string) {
        player.getShopManager().sendOpenUrl('https://learxd.dev')
    }

    public handleRedeemPromotionalCode(player: Player, code: string) {
        if (code === 'SMALLKINGVIADO') {
            Logger.info(`Player ${player.getUsername()} redeemed promotional code ${code} - Crystals: ${player.getDataManager().getCrystals()}`)

            const crystals = 1000000
            const bonus = 500000
            player.getDataManager().increaseCrystals(crystals + bonus)
            player.getDataManager().sendCrystals();
            player.getShopManager().sendSuccessfulPurchase(crystals, bonus)
            player.getShopManager().sendCorrectPromotionalCode()

            return;
        }

        player.getShopManager().sendIncorrectPromotionalCode()
    }

    public handlePacket(packet: SimplePacket) {
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
import { Player } from "../../game/player";
import { SetOpenShopPacket } from "../../network/packets/set-open-shop";
import { IShopData, SetShopDataPacket } from "../../network/packets/set-shop-data";
import { Server } from "../../server";
import { Logger } from "../../utils/logger";

export class ShopManager {
    constructor(
        private readonly server: Server
    ) { }

    public sendOpenShop(player: Player) {
        player.sendPacket(new SetOpenShopPacket())
    }

    public sendShopData(player: Player) {
        const data = this.server.getAssetsManager().getData<IShopData>('shop.json')
        if (!data) {
            Logger.error('Could not load shop data')
            return;
        }

        const setShopDataPacket = new SetShopDataPacket()
        setShopDataPacket.haveDoubleCrystals = player.getDataManager().hasDoubleCrystal();
        setShopDataPacket.data = data
        player.sendPacket(setShopDataPacket)
    }

    public handleBuyItem(player: Player, itemId: string, method?: string) {
        player.getShopManager().sendOpenUrl('https://learxd.dev')
    }

    public handleRedeemPromotionalCode(player: Player, code: string) {
        if (code === 'SMALLKINGVIADO') {
            const crystals = 1000000
            const bonus = 500000
            player.getDataManager().increaseCrystals(crystals + bonus)
            player.getDataManager().sendCrystals();
            player.getShopManager().sendSuccessfulPurchase(crystals, bonus)
            player.getShopManager().sendCorrectPromotionalCode()
            Logger.info(`Player ${player.getUsername()} redeemed promotional code ${code} - Crystals: ${player.getDataManager().getCrystals()}`)
            return;
        }

        player.getShopManager().sendIncorrectPromotionalCode()
    }
}
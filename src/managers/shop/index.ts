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
}
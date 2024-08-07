import { IShopData } from "@/network/packets/set-shop-data";
import { Server } from "@/server";
import { Logger } from "@/utils/logger";

export class ShopManager {
    constructor(
        private readonly server: Server
    ) { }

    public getShopProducts() {
        const data = this.server.assetsManager.getData<IShopData>('shop.json')
        if (!data) {
            Logger.error('Could not load shop data')
            return;
        }

        return data;
    }
}
import { Logger } from "../../utils/logger";
import { Player } from "../../game/player";
import { Server } from "../../server";
import { MathUtils } from "../../utils/math";
import { SetTipResourcePacket } from "../../network/packets/set-tip-resource";
import { ByteArray } from "../../utils/network/byte-array";
import { Client } from "../../game/client";

// TODO: Implement the logic fot not repeating the same tip
export class TipsManager {

    // TODO: Create a interface for this
    private resources: any[]

    constructor(
        private readonly server: Server
    ) {
        this.init();
    }

    public init() {
        this.resources = this.server
            .getAssetsManager()
            .getResource('tips.json')
    }

    public getResources() {
        return this.resources;
    }

    public loadTip() {
        const resource = this.getResources()[MathUtils.randomInt(0, this.getResources().length - 1)];

        if (!resource) {
            Logger.alert(TipsManager.name, 'Não foi possível carregar os recursos de dicas');
            return null;
        }

        return resource;
    }

    public async sendAllLoadingTips(client: Player) {
        await this.server.getResourcesManager()
            .sendLoadResources(client, this.getResources());
    }

    public async sendLoadingTip(client: Client) {

        const resource = this.loadTip();

        if (!resource) {
            Logger.alert(TipsManager.name, 'Não foi possível carregar a dica');
            return null
        }

        await this.server.getResourcesManager()
            .sendLoadResources(client, [resource]);

        this.sendShowLoadingTip(client, resource.idlow);

        return resource
    }

    public sendShowLoadingTip(client: Client, id: number) {
        const setTipResourcePacket = new SetTipResourcePacket(new ByteArray());
        setTipResourcePacket.resourceId = id
        client.sendPacket(setTipResourcePacket);
    }
}
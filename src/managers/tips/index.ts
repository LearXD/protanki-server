import Logger from "../../utils/logger";
import { Client } from "../../game/client";
import { Server } from "../../server";
import { MathUtils } from "../../utils/math";
import { ValidateResourcePacket } from "../../network/packets/validate-resource";
import { ByteArray } from "../../utils/network/byte-array";

// TODO: Implement the logic fot not repeating the same tip
export class TipsManager {

    // TODO: Create a interface for this
    private resources: any[]

    constructor(
        private readonly server: Server
    ) {
        this.resources = (this.server.getAssetsManager().getResource('tips.json')).resources
    }

    public getResources() {
        return this.resources;
    }

    public async loadTip() {
        const resource = this.getResources()[MathUtils.randomInt(0, this.getResources().length - 1)];

        if (!resource) {
            Logger.alert(TipsManager.name, 'Não foi possível carregar os recursos de dicas');
            return null;
        }

        return resource;
    }

    public async sendTipToClient(client: Client): Promise<boolean> {
        return new Promise(async (resolve) => {
            const resource = await this.loadTip();

            if (!resource) {
                Logger.alert(TipsManager.name, 'Não foi possível carregar a dica');
                return resolve(false)
            }

            await this.server.getResourcesManager().sendLoadResources(client, [resource]);

            const validateResourcePacket = new ValidateResourcePacket(new ByteArray());
            validateResourcePacket.resourceId = resource.idlow
            client.sendPacket(validateResourcePacket);

            resolve(true);
        });

    }
}
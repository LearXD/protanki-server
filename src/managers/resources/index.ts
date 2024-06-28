import { Server } from "../../server";

import { Client } from "../../game/client";
import { SetLoadResourcesPacket } from "../../network/packets/set-load-resources";
import { ByteArray } from "../../utils/network/byte-array";

export enum ResourceType {
    LOBBY = 'lobby',
    AUTH = 'auth',
    GARAGE = 'garage',
}

export class ResourcesManager {

    private resources: Map<string, any[]> = new Map();

    constructor(
        private readonly server: Server
    ) {
        this.init();
    }

    public init() {
        const assetsManager = this.server.getAssetsManager();

        this.resources.set(
            ResourceType.LOBBY,
            assetsManager.getResource('lobby.json').resources
        );

        this.resources.set(
            ResourceType.AUTH,
            assetsManager.getResource('auth.json').resources
        );

        this.resources.set(
            ResourceType.GARAGE,
            assetsManager.getResource('garage.json').resources
        );
    }

    public sendResources(client: Client, resource: ResourceType) {
        return this.sendLoadResources(client, this.resources.get(resource));
    }

    public sendLoadResources(client: Client, resources: any[]) {
        return new Promise((resolve) => {
            const setLoadResourcesPacket = new SetLoadResourcesPacket(new ByteArray());
            setLoadResourcesPacket.resources = resources;
            setLoadResourcesPacket.callbackId = ++client.resourcesLoaded;
            client.resourcesCallbackPool.set(client.resourcesLoaded, () => resolve(true));
            client.sendPacket(setLoadResourcesPacket);
        });
    }

    public getResources() {
        return this.resources;
    }
}
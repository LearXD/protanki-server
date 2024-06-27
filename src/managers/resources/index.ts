import { Server } from "../../server";

import path from 'path';
import fs from 'fs';
import { Client } from "../../game/client";
import { SetLoadResourcesPacket } from "../../network/packets/set-load-resources";
import { ByteArray } from "../../utils/network/byte-array";

export enum ResourceType {
    AUTHENTICATED = 'authenticated',
    BASE = 'base'
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
            ResourceType.AUTHENTICATED,
            assetsManager.getResource('authenticated.json').resources
        );

        this.resources.set(
            ResourceType.BASE,
            assetsManager.getResource('base.json').resources
        );
    }

    public sendResources(client: Client, resource: ResourceType) {
        return this.sendLoadResourcesToClient(client, this.resources.get(resource));
    }

    public sendLoadResourcesToClient(client: Client, resources: any[]) {
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
import { Server } from "../../server";

import { Player } from "../../game/player";
import { SetLoadResourcesPacket } from "../../network/packets/set-load-resources";
import { Client } from "../../game/client";

export enum ResourceType {
    LOBBY = 'lobby',
    AUTH = 'auth',
    GARAGE = 'garage',
}

export interface IResource {
    idhigh: string
    idlow: number
    versionhigh: string
    versionlow: number
    lazy: boolean
    alpha?: boolean
    type: number
    weight?: number
    height?: number
    numFrames?: number
    fps?: number
    fileNames?: string[]
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

        this.registerResources(
            ResourceType.LOBBY, assetsManager.getResource('lobby.json')
        );
        this.registerResources(
            ResourceType.AUTH, assetsManager.getResource('auth.json')
        );
        this.registerResources(
            ResourceType.GARAGE, assetsManager.getResource('garage.json')
        );
    }

    public getResources() { return this.resources }

    public registerResources(resource: ResourceType, data: IResource[]) {
        this.resources.set(resource, data);
    }

    public sendResources(client: Player, resource: ResourceType) {
        return this.sendLoadResources(client, this.resources.get(resource));
    }

    public sendLoadResources(client: Client, resources: any[]) {
        return new Promise((resolve) => {
            const setLoadResourcesPacket = new SetLoadResourcesPacket();
            setLoadResourcesPacket.resources = resources;
            setLoadResourcesPacket.callbackId = client.addResourceLoading(() => resolve(true));
            client.sendPacket(setLoadResourcesPacket);
        });
    }

}
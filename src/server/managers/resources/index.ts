import { Server } from "@/server";
import { IResource, ResourceType } from "./types";
import { Player } from "@/game/player";
import { Client } from "@/game/client";
import { SetLoadResourcesPacket } from "@/network/packets/set-load-resources";

export class ResourcesManager {

    private resources: Map<string, any[]> = new Map();

    constructor(
        private readonly server: Server
    ) {
        this.init();
    }

    public init() {
        const assetsManager = this.server.assetsManager;

        this.registerResources(ResourceType.LOBBY, assetsManager.getResource('lobby.json'));
        this.registerResources(ResourceType.AUTH, assetsManager.getResource('auth.json'));
        this.registerResources(ResourceType.GARAGE, assetsManager.getResource('garage.json'));
    }

    public getResources() { return this.resources }

    public registerResources(resource: ResourceType, data: IResource[]) {
        this.resources.set(resource, data);
    }

    public sendResources(client: Player, resource: ResourceType) {
        return this.sendLoadResources(client, this.resources.get(resource));
    }

    public sendLoadResources(client: Client, resources: IResource[]) {
        return new Promise((resolve) => {
            const setLoadResourcesPacket = new SetLoadResourcesPacket();
            setLoadResourcesPacket.resources = resources;
            setLoadResourcesPacket.callbackId = client.addResourceLoading(() => resolve(true));
            client.sendPacket(setLoadResourcesPacket);
        });
    }

}
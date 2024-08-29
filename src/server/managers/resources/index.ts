import { Server } from "@/server";
import { IResource, ResourceType } from "./types";
import { Player } from "@/game/player";

export class ResourcesManager {

    public readonly resources: Map<string, any[]> = new Map()

    constructor(
        private readonly server: Server
    ) {
        this.registerResources(ResourceType.LOBBY, this.server.assets.getResource('lobby.json'));
        this.registerResources(ResourceType.AUTH, this.server.assets.getResource('auth.json'));
        this.registerResources(ResourceType.GARAGE, this.server.assets.getResource('garage.json'));
    }

    public registerResources(resource: ResourceType, data: IResource[]) {
        this.resources.set(resource, data);
    }

    public sendResources(client: Player, resource: ResourceType) {
        return client.resources.loadResources(this.resources.get(resource));
    }

}
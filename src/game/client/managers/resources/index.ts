import { IResource, SetLoadResourcesPacket } from "@/network/packets/set-load-resources";
import { Client } from "../..";
import { Packet } from "@/network/packets/packet";
import { ResolveCallbackPacket } from "@/network/packets/resolve-callback";

export class ClientResourcesManager {

    public resources: IResource[] = [];
    public callbacks: Map<number, () => void> = new Map();

    public constructor(
        private readonly client: Client
    ) { }

    public registerResourceCallback(callback: () => void): number {
        this.callbacks.set(this.callbacks.size + 1, callback);
        return this.callbacks.size;
    }

    public loadResources(resources: IResource[]) {
        return new Promise((resolve) => {
            const setLoadResourcesPacket = new SetLoadResourcesPacket();
            setLoadResourcesPacket.resources = resources;
            setLoadResourcesPacket.callbackId = this.registerResourceCallback(() => resolve(true));
            this.client.sendPacket(setLoadResourcesPacket);
        });
    }

    public handlePacket(packet: Packet) {
        if (packet instanceof ResolveCallbackPacket) {
            if (this.callbacks.has(packet.callbackId)) {
                this.callbacks.get(packet.callbackId)();
                this.callbacks.delete(packet.callbackId);
            }
        }
    }
}
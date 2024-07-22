import { Tank } from "../..";
import { IGarageItem, IHullProperties } from "../../../../managers/garage/types";
import { SimplePacket } from "../../../../network/packets/simple-packet";

export class Hull {

    public constructor(
        public readonly item: IGarageItem,
        public readonly properties: IHullProperties
    ) { }

    public getName() {
        return this.item.id + '_m' + this.item.modificationID;
    }

    public handlePacket(packet: SimplePacket) {

    }
}
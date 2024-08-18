
import { IHullResources } from "@/game/player/managers/garage/types";
import { IHullPhysics } from "@/server/managers/garage/types";
import { GarageItem } from "@/server/managers/garage/utils/item";

export class Hull extends GarageItem {

    public properties: IHullPhysics

    public constructor(resources: IHullResources) {
        super(resources.item)
        this.properties = resources.physics;
    }

    public getProtection() {
        const properties = this.getProperty('HULL_ARMOR')
        return properties ? parseInt(properties.value) : 0;
    }
}
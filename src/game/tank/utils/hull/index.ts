
import { IGarageItem, IHullProperties } from "@/server/managers/garage/types";
import { Logger } from "../../../../utils/logger";
import { GarageItemUtils } from "@/game/player/managers/garage/utils/item";

export class Hull {

    public constructor(
        public readonly item: IGarageItem,
        public readonly properties: IHullProperties
    ) { }

    public getName() {
        return GarageItemUtils.serialize(this.item.id, this.item.modificationID);
    }

    public getProtection() {
        const properties = this.item.properts.find(({ property }) => property === 'HULL_ARMOR')

        if (!properties) {
            Logger.warn(`Hull ${this.item.name} does not have HULL_ARMOR property.`);
            return 0;
        }

        return parseInt(properties.value);
    }
}
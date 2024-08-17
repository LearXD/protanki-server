import { GarageItemUtils } from "@/game/player/managers/garage/utils/item";
import { IGarageItem } from "../types";
import { Logger } from "@/utils/logger";

export class GarageItem {

    public constructor(
        public readonly item: IGarageItem
    ) { }

    public getName() {
        return GarageItemUtils.serialize(this.item.id, this.item.modificationID);
    }

    public getProperty(name: string) {
        const property = this.item.properts.find(({ property }) => property === name)

        if (!property) {
            Logger.warn(`${name} property not found`);
            return null;
        }

        return property;
    }

    public getSubProperty(primary: string, secondary: string) {
        const property = this.getProperty(primary);

        if (!property) {
            return null;
        }

        const sub = property.subproperties.find(({ property }) => property === secondary)

        if (!sub) {
            Logger.warn(`${secondary} sub-property not found`);
            return null;
        }

        return sub;
    }
}
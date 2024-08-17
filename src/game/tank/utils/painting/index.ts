import { Turrets } from "@/states/turrets";
import { Resistances } from "./types";
import { IPaintingResources } from "@/game/player/managers/garage/types";
import { GarageItem } from "@/server/managers/garage/utils/item";

export class Painting extends GarageItem {

    public constructor(resources: IPaintingResources) {
        super(resources.item);
    }

    public getResistance(turret: Resistances) {
        const property = this.getProperty(turret);
        return property ? parseInt(property.value) : 0;
    }

    public getTurretResistance(turret: Turrets) {
        switch (turret) {
            case Turrets.SMOKY: return this.getResistance(Resistances.SMOKY);
            case Turrets.FREEZE: return this.getResistance(Resistances.FREEZE);
            case Turrets.FLAMETHROWER: return this.getResistance(Resistances.FLAMETHROWER);
            case Turrets.RAILGUN: return this.getResistance(Resistances.RAILGUN);
            case Turrets.RAILGUN_XT: return this.getResistance(Resistances.RAILGUN_XT);
            case Turrets.TWINS: return this.getResistance(Resistances.TWINS);
            case Turrets.RICOCHET: return this.getResistance(Resistances.RICOCHET);
            case Turrets.ISIDA: return this.getResistance(Resistances.ISIDA);
            case Turrets.HAMMER: return this.getResistance(Resistances.HAMMER);
            case Turrets.SHAFT: return this.getResistance(Resistances.SHAFT);
            case Turrets.THUNDER: return this.getResistance(Resistances.THUNDER);
            case Turrets.VULCAN: return this.getResistance(Resistances.VULCAN);
            default:
                const all = this.getResistance(Resistances.ALL);
                return all > 0 ? all : 0;
        }
    }
}
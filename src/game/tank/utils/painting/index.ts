import { GarageItemUtils } from "@/game/player/managers/garage/utils/item";
import { IGarageItem } from "@/server/managers/garage/types";
import { Turret } from "@/states/turret";
import { Resistances } from "./types";

export class Painting {
    public constructor(
        public readonly item: IGarageItem,
    ) { }

    public getName() {
        return GarageItemUtils.serialize(this.item.id);
    }

    public getResistance(turret: Resistances) {
        const property = this.item.properts.find(({ property }) => property === turret);

        if (!property) {
            return 0;
        }

        return parseInt(property.value);
    }

    public getTurretResistance(turret: Turret) {
        switch (turret) {
            case Turret.SMOKY: return this.getResistance(Resistances.SMOKY);
            case Turret.FREEZE: return this.getResistance(Resistances.FREEZE);
            case Turret.FLAMETHROWER: return this.getResistance(Resistances.FLAMETHROWER);
            case Turret.RAILGUN: return this.getResistance(Resistances.RAILGUN);
            case Turret.RAILGUN_XT: return this.getResistance(Resistances.RAILGUN_XT);
            case Turret.TWINS: return this.getResistance(Resistances.TWINS);
            case Turret.RICOCHET: return this.getResistance(Resistances.RICOCHET);
            case Turret.ISIDA: return this.getResistance(Resistances.ISIDA);
            case Turret.HAMMER: return this.getResistance(Resistances.HAMMER);
            case Turret.SHAFT: return this.getResistance(Resistances.SHAFT);
            case Turret.THUNDER: return this.getResistance(Resistances.THUNDER);
            case Turret.VULCAN: return this.getResistance(Resistances.VULCAN);
            default:
                const all = this.getResistance(Resistances.ALL);
                return all > 0 ? all : 0;
        }
    }




}
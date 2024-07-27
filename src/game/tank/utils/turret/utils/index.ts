import { Turret } from "../../../../../utils/game/turret";
import { FlamethrowerHandler } from "../handlers/flamethrower";
import { FreezeHandler } from "../handlers/freeze";
import { HammerHandler } from "../handlers/hammer";
import { IsidaHandler } from "../handlers/isida";
import { RailgunHandler } from "../handlers/railgun";
import { RicochetHandler } from "../handlers/ricochet";
import { ShaftHandler } from "../handlers/shaft";
import { SmokyHandler } from "../handlers/smoky";
import { ThunderHandler } from "../handlers/thunder";
import { TwinsHandler } from "../handlers/twins";
import { VulcanHandler } from "../handlers/vulcan";


export class TurretUtils {
    public static getTurretHandler(turret: string) {
        switch (turret) {
            case Turret.SMOKY: return SmokyHandler;
            case Turret.RAILGUN: return RailgunHandler;
            case Turret.RAILGUN_XT: return RailgunHandler;
            case Turret.FLAMETHROWER: return FlamethrowerHandler;
            case Turret.TWINS: return TwinsHandler;
            case Turret.RICOCHET: return RicochetHandler;
            case Turret.ISIDA: return IsidaHandler;
            case Turret.HAMMER: return HammerHandler;
            case Turret.SHAFT: return ShaftHandler;
            case Turret.FREEZE: return FreezeHandler;
            case Turret.THUNDER: return ThunderHandler;
            case Turret.VULCAN: return VulcanHandler;
        }
    }
} 
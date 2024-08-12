import { Turrets } from "../../../../../states/turrets";
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
            case Turrets.SMOKY: return SmokyHandler;
            case Turrets.RAILGUN: return RailgunHandler;
            case Turrets.RAILGUN_XT: return RailgunHandler;
            case Turrets.FLAMETHROWER: return FlamethrowerHandler;
            case Turrets.TWINS: return TwinsHandler;
            case Turrets.RICOCHET: return RicochetHandler;
            case Turrets.ISIDA: return IsidaHandler;
            case Turrets.HAMMER: return HammerHandler;
            case Turrets.SHAFT: return ShaftHandler;
            case Turrets.FREEZE: return FreezeHandler;
            case Turrets.THUNDER: return ThunderHandler;
            case Turrets.VULCAN: return VulcanHandler;
        }
    }
} 
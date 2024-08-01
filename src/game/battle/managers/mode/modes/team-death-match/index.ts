import { Player } from "@/game/player";
import { BattleTeamModeManager } from "../team/team";
import { SetLoadTeamDeathMatchPacket } from "@/network/packets/set-load-team-death-match";
import { IMapSpawn } from "@/game/map/types";

export class BattleTeamDeathMatchModeManager extends BattleTeamModeManager {

    public init(): void { }

    public getRandomSpawn(player: Player): IMapSpawn {
        return null
    }

    public sendLoadBattleMode(player: Player): void {
        player.sendPacket(new SetLoadTeamDeathMatchPacket())
    }

}
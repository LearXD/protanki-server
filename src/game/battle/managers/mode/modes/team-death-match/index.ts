import { Player } from "@/game/player";
import { BattleTeamModeManager } from "../team/team";
import { SetLoadTeamDeathMatchPacket } from "@/network/packets/set-load-team-death-match";

export class BattleTeamDeathMatchModeManager extends BattleTeamModeManager {

    public init(): void { }

    public sendLoadBattleMode(player: Player): void {
        player.sendPacket(new SetLoadTeamDeathMatchPacket())
    }

}
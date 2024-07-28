import { Player } from "@/game/player";
import { BattleTeamModeManager } from "./team";
import { SetLoadTeamDeathMatchPacket } from "@/network/packets/set-load-team-death-match";

export class BattleTeamDeathMatchModeManager extends BattleTeamModeManager {

    public sendLoadBattleMode(player: Player): void {
        player.sendPacket(new SetLoadTeamDeathMatchPacket())
    }

}
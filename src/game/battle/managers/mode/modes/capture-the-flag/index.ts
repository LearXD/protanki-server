import { Player } from "@/game/player";
import { BattleTeamModeManager } from "../team/team";
import { SetLoadCaptureTheFlagPacket } from "@/network/packets/set-load-capture-the-flag";
import { Vector3d } from "@/utils/vector-3d";
import { Flag } from "@/game/battle/objects/flag";
import { Team, TeamType } from "@/states/team";
import { SetTankFlagPacket } from "@/network/packets/set-tank-flag";
import { SetFlagReturnedPacket } from "@/network/packets/set-flag-returned";
import { SetFlagDroppedPacket } from "@/network/packets/set-flag-dropped";
import { SetCaptureFlagPacket } from "@/network/packets/set-capture-flag";
import { FlagState } from "./types";
import { MathUtils } from "@/utils/math";

export class BattleCaptureTheFlagModeManager extends BattleTeamModeManager {

    public redFlagState: FlagState = FlagState.PLACED
    public blueFlagState: FlagState = FlagState.PLACED

    public init(): void {
        super.init();
        this.initFlag(Team.RED)
        this.initFlag(Team.BLUE)
    }

    public initFlag(team: TeamType) {
        switch (team) {
            case Team.RED: {
                this.redFlagState = FlagState.PLACED
                this.battle.getCollisionManager().addObject(new Flag(this, Team.RED, new Vector3d(4750, -1750, 80)))
                break;
            }
            case Team.BLUE: {
                this.blueFlagState = FlagState.PLACED
                this.battle.getCollisionManager().addObject(new Flag(this, Team.BLUE, new Vector3d(-3750, 2750, 80)))
                break;
            }
        }
    }

    public sendLoadBattleMode(player: Player): void {
        const packet = new SetLoadCaptureTheFlagPacket();

        packet.flag_1 = {
            vector3d_1: new Vector3d(-3750, 2750, 80),
            string_1: null,
            vector3d_2: null
        }
        packet.flag_1_image = 538453
        packet.flag_1_model = 236578
        packet.flag_2 = {
            vector3d_1: new Vector3d(4750, -1750, 80),
            string_1: null,
            vector3d_2: null
        }
        packet.flag_2_image = 44351
        packet.flag_2_model = 500060
        packet.sounds = {
            resourceId_1: 717912,
            resourceId_2: 694498,
            resourceId_3: 89214,
            resourceId_4: 525427
        }

        player.sendPacket(packet);
    }

    public getSpawns() {
        return this.battle.getMap().getSpawns()
            .filter(spawn => spawn.type === Team.RED || spawn.type === Team.BLUE)
    }

    public getRandomSpawn(player: Player) {
        const spawns = this.getSpawns().filter(spawn => spawn.type === player.getTank().getTeam())
        if (spawns.length === 0) {
            return null
        }

        const random = MathUtils.randomInt(0, spawns.length - 1)
        return spawns[random]
    }

    public setTeamFlagState(team: TeamType, state: FlagState) {
        switch (team) {
            case Team.RED: this.redFlagState = state; break
            case Team.BLUE: this.blueFlagState = state; break
        }
    }

    public getTeamFlagState(team: TeamType): FlagState {
        switch (team) {
            case Team.RED: return this.redFlagState
            case Team.BLUE: return this.blueFlagState
        }
    }

    public handleDeath(player: Player): void {
        super.handleDeath(player)

        if (player.getTank().hasFlag) {
            this.handleDropFlag(player)
        }
    }

    public handleDropFlag(player: Player) {
        const team = player.getTank().getTeam() === Team.BLUE ? Team.RED : Team.BLUE

        this.setTeamFlagState(team, FlagState.DROPPED)
        player.getTank().hasFlag = false;

        const tankPosition = player.getTank().getPosition()
        this.battle.getTaskManager().scheduleTask(
            () => this.battle.getCollisionManager().addObject(new Flag(this, team, tankPosition))
        );

        const packet = new SetFlagDroppedPacket();
        packet.position = player.getTank().getPosition();
        packet.team = team;

        this.battle.broadcastPacket(packet);
    }

    public handleReturnFlag(player: Player, flag: Flag) {
        this.initFlag(flag.team)

        const packet = new SetFlagReturnedPacket();
        packet.team = flag.team;
        packet.tank = player.getUsername();

        this.battle.broadcastPacket(packet);
    }

    public handleTakeFlag(player: Player, flag: Flag) {
        this.setTeamFlagState(flag.team, FlagState.TAKEN)
        player.getTank().hasFlag = true

        const packet = new SetTankFlagPacket();
        packet.tankId = player.getUsername();
        packet.flagTeam = flag.team;

        this.battle.broadcastPacket(packet);
    }

    public handleCaptureFlag(player: Player) {
        const team = player.getTank().getTeam() === Team.BLUE ? Team.RED : Team.BLUE
        player.getTank().hasFlag = false

        const packet = new SetCaptureFlagPacket()
        packet.winnerTeam = player.getTank().getTeam()
        packet.delivererTankId = player.getUsername()
        this.battle.broadcastPacket(packet)

        this.addTeamScore(player.getTank().getTeam(), 1)

        if (this.battle.getScoreLimit() === this.getTeamScore(player.getTank().getTeam())) {
            return this.battle.finish()
        }

        this.initFlag(team)
    }

}
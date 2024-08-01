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

    public redFlag: Flag;
    public blueFlag: Flag;

    public init(): void {
        super.init();
        this.initFlag(Team.RED)
        this.initFlag(Team.BLUE)
    }

    public initFlag(team: TeamType) {

        const positions = this.getFlagsPosition()

        switch (team) {
            case Team.RED: {
                this.redFlag = new Flag(this, Team.RED, positions.red)
                this.battle.getCollisionManager().addObject(this.redFlag)
                break;
            }
            case Team.BLUE: {
                this.blueFlag = new Flag(this, Team.BLUE, positions.blue)
                this.battle.getCollisionManager().addObject(this.blueFlag)
                break;
            }
        }

    }

    public sendLoadBattleMode(player: Player): void {
        const positions = this.getFlagsPosition()

        const packet = new SetLoadCaptureTheFlagPacket();

        packet.blueFlag = {
            basePosition: positions.blue,
            carrier: this.blueFlag.getCarrier() ? this.blueFlag.getCarrier().getUsername() : null,
            droppedPosition: this.blueFlag.state === FlagState.DROPPED ? this.blueFlag.position : null
        }
        packet.blueFlagImage = 538453
        packet.blueFlagModel = 236578
        packet.redFlag = {
            basePosition: positions.red,
            carrier: this.redFlag.getCarrier() ? this.redFlag.getCarrier().getUsername() : null,
            droppedPosition: this.redFlag.state === FlagState.DROPPED ? this.redFlag.position : null
        }
        packet.redFlagImage = 44351
        packet.redFlagModel = 500060
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

    public getFlagsPosition() {
        return {
            red: new Vector3d(4750, -1750, 80),
            blue: new Vector3d(-3750, 2750, 80)
        }
    }

    public getFlag(team: TeamType): Flag {
        return team === Team.RED ? this.redFlag : this.blueFlag
    }

    public handleDeath(player: Player): void {
        super.handleDeath(player)
        this.handleDropFlag(player)
    }

    public handleDropFlag(player: Player) {
        const team = player.getTank().getTeam() === Team.BLUE ? Team.RED : Team.BLUE
        const flag = this.getFlag(team)

        if (!flag.isCarrier(player)) {
            return
        }

        flag.setState(FlagState.DROPPED)
        flag.setCarrier(null)

        const position = player.getTank().getPosition();
        position.y -= 80
        flag.setPosition(position)

        const packet = new SetFlagDroppedPacket();
        packet.position = position;
        packet.team = team;

        this.battle.broadcastPacket(packet);

        this.battle.getTaskManager().scheduleTask(() => this.battle.getCollisionManager().addObject(flag), 1000)
    }

    public handleReturnFlag(player: Player, flag: Flag) {
        this.initFlag(flag.team)

        const packet = new SetFlagReturnedPacket();
        packet.team = flag.team;
        packet.tank = player.getUsername();

        this.battle.broadcastPacket(packet);
    }

    public handleTakeFlag(player: Player, flag: Flag) {
        flag.setState(FlagState.CARRIED)
        flag.setCarrier(player)

        const packet = new SetTankFlagPacket();
        packet.tankId = player.getUsername();
        packet.flagTeam = flag.team;

        this.battle.broadcastPacket(packet);
    }

    public handleCaptureFlag(flag: Flag) {

        const player = flag.getCarrier();
        if (player === null) {
            return
        }

        const packet = new SetCaptureFlagPacket()
        packet.winnerTeam = player.getTank().getTeam()
        packet.delivererTankId = player.getUsername()
        this.battle.broadcastPacket(packet)

        this.addTeamScore(player.getTank().getTeam(), 1)

        if (this.battle.getScoreLimit() === this.getTeamScore(player.getTank().getTeam())) {
            return this.battle.finish()
        }

        this.initFlag(flag.team)
    }

    public broadcastRemovePlayer(player: Player): void {
        super.broadcastRemovePlayer(player)

        if (this.redFlag.isCarrier(player) || this.blueFlag.isCarrier(player)) {
            this.handleDropFlag(player)
        }
    }

}
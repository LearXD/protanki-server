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
import { RayHit } from "@/game/map/managers/collision/utils/rayhit";

export class BattleCaptureTheFlagModeManager extends BattleTeamModeManager {

    public redFlag: Flag;
    public blueFlag: Flag;

    public init(): void {
        super.init();
        this.initFlag(Team.RED)
        this.initFlag(Team.BLUE)
    }

    public initFlag(team: TeamType) {

        const positions = this.battle.getMap().getFlags()

        switch (team) {
            case Team.RED: {
                this.redFlag = new Flag(this, Team.RED, new Vector3d(positions.red.x, positions.red.y, positions.red.z))
                this.battle.collisionManager.addObject(this.redFlag)
                break;
            }
            case Team.BLUE: {
                this.blueFlag = new Flag(this, Team.BLUE, new Vector3d(positions.blue.x, positions.blue.y, positions.blue.z))
                this.battle.collisionManager.addObject(this.blueFlag)
                break;
            }
        }

    }

    public sendLoadBattleMode(player: Player): void {
        const positions = this.battle.getMap().getFlags()

        const packet = new SetLoadCaptureTheFlagPacket();

        packet.blueFlag = {
            basePosition: new Vector3d(positions.blue.x, positions.blue.y, positions.blue.z),
            carrier: this.blueFlag.getCarrier() ? this.blueFlag.getCarrier().getUsername() : null,
            droppedPosition: this.blueFlag.state === FlagState.DROPPED ? this.blueFlag.position : null
        }
        packet.blueFlagImage = 538453
        packet.blueFlagModel = 236578
        packet.redFlag = {
            basePosition: new Vector3d(positions.red.x, positions.red.y, positions.red.z),
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
        const spawns = this.getSpawns().filter(spawn => spawn.type === player.tank.team)
        if (spawns.length === 0) {
            return null
        }

        const random = MathUtils.randomInt(0, spawns.length - 1)
        return spawns[random]
    }

    public getFlag(team: TeamType): Flag {
        return team === Team.RED ? this.redFlag : this.blueFlag
    }

    public handleDeath(player: Player): void {
        super.handleDeath(player)
        this.handleDropFlag(player)
    }

    public handleDropFlag(player: Player) {
        const team = player.tank.team === Team.BLUE ? Team.RED : Team.BLUE
        const flag = this.getFlag(team)

        if (!flag.isCarrier(player)) {
            return
        }

        flag.setState(FlagState.DROPPED)
        flag.setCarrier(null)

        // const position = player.tank.getPosition()
        const hit = new RayHit()
        const found = this.battle.getMap().collisionManager.raycastStatic(
            player.tank.getPosition().swap(),
            Vector3d.DOWN,
            16,
            10000000000,
            null,
            hit
        );

        if (!found) {
            this.handleReturnFlag(flag)
            return
        }

        flag.setPosition(hit.position.swap())

        const packet = new SetFlagDroppedPacket();
        packet.position = flag.position;
        packet.team = team;

        this.battle.broadcastPacket(packet);

        this.battle.taskManager.scheduleTask(() => this.battle.collisionManager.addObject(flag), 1000)
    }

    public handleReturnFlag(flag: Flag, player?: Player) {
        this.initFlag(flag.team)

        const packet = new SetFlagReturnedPacket();
        packet.team = flag.team;
        packet.tank = player ? player.getUsername() : null;

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
        packet.winnerTeam = player.tank.team
        packet.delivererTankId = player.getUsername()
        this.battle.broadcastPacket(packet)

        this.addTeamScore(player.tank.team, 1)
        this.initFlag(flag.team)

        if (this.battle.getScoreLimit() <= this.getTeamScore(player.tank.team)) {
            return this.battle.finish()
        }
    }

    public broadcastRemovePlayer(player: Player): void {
        super.broadcastRemovePlayer(player)

        if (this.redFlag.isCarrier(player) || this.blueFlag.isCarrier(player)) {
            this.handleDropFlag(player)
        }
    }

}
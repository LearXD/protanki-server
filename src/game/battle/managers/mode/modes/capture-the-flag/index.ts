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
import { TimeType } from "../../../task/types";
import { Logger } from "@/utils/logger";

export class BattleCaptureTheFlagModeManager extends BattleTeamModeManager {

    public flags = new Map<TeamType, Flag>([[Team.RED, null], [Team.BLUE, null]]);

    public init(): void {
        this.initFlag(Team.RED)
        this.initFlag(Team.BLUE)

        super.init();
    }

    public initFlag(team: TeamType) {
        const positions = this.battle.map.getFlags()
        const position = team === Team.RED ? positions.red : positions.blue

        const _flag = this.flags.get(team)
        if (_flag) {
            _flag.destroy()
        }

        const flag = new Flag(this, team, new Vector3d(position.x, position.y, position.z))
        this.flags.set(team, flag)

        this.battle.collisionManager.addObject(flag)
    }

    public sendLoadBattleMode(player: Player): void {
        const positions = this.battle.map.getFlags()

        const packet = new SetLoadCaptureTheFlagPacket();

        packet.blueFlag = {
            basePosition: new Vector3d(positions.blue.x, positions.blue.y, positions.blue.z),
            carrier: this.flags.get(Team.BLUE).getCarrier() ? this.flags.get(Team.BLUE).getCarrier().getUsername() : null,
            droppedPosition: this.flags.get(Team.BLUE).state === FlagState.DROPPED ? this.flags.get(Team.BLUE).position : null
        }
        packet.blueFlagImage = 538453
        packet.blueFlagModel = 236578
        packet.redFlag = {
            basePosition: new Vector3d(positions.red.x, positions.red.y, positions.red.z),
            carrier: this.flags.get(Team.RED).getCarrier() ? this.flags.get(Team.RED).getCarrier().getUsername() : null,
            droppedPosition: this.flags.get(Team.RED).state === FlagState.DROPPED ? this.flags.get(Team.RED).position : null
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
        return this.battle.map.getSpawns()
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

    public handleDeath(player: Player): void {
        super.handleDeath(player)
        this.handleDropFlag(player)
    }

    public handleDropFlag(player: Player) {
        for (const flag of this.flags.values()) {
            if (flag.isCarrier(player)) {

                flag.setState(FlagState.DROPPED)
                flag.setCarrier(null)

                const hit = new RayHit()
                const found = this.battle.map.collisionManager.raycastStatic(player.tank.getPosition().swap(), Vector3d.DOWN, 16, 10000000000, null, hit);

                if (!found) {
                    this.handleReturnFlag(flag)
                    break;
                }

                flag.setPosition(hit.position.swap())

                const packet = new SetFlagDroppedPacket();
                packet.position = flag.position;
                packet.team = flag.team;
                this.battle.broadcastPacket(packet);

                flag.returnTask = this.battle.taskManager.scheduleTask(() => this.handleReturnFlag(flag), 1 * TimeType.MINUTES)
                this.battle.collisionManager.addObject(flag)

                break;
            }
        }
    }

    public handleReturnFlag(flag: Flag, player?: Player) {
        this.initFlag(flag.team)

        const packet = new SetFlagReturnedPacket();
        packet.team = flag.team;
        packet.tank = player ? player.getUsername() : null;

        this.battle.broadcastPacket(packet);
    }

    public handleTakeFlag(player: Player, flag: Flag) {

        if (flag.returnTask) {
            this.battle.taskManager.cancelTask(flag.returnTask.id)
        }

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
    }

    public broadcastRemovePlayer(player: Player): void {
        super.broadcastRemovePlayer(player)

        for (const flag of this.flags.values()) {
            if (flag.isCarrier(player)) {
                this.handleDropFlag(player)
            }
        }
    }

}
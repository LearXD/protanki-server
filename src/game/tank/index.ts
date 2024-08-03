import { SetTankSpeedPacket } from "../../network/packets/set-tank-speed";
import { Vector3d } from "../../utils/vector-3d";
import { SetMoveCameraPacket } from "../../network/packets/set-move-camera";
import { SetTankHealthPacket } from "../../network/packets/set-tank-health";
import { SetSpawnTankPacket } from "../../network/packets/set-spawn-tank";
import { Team, TeamType } from "../../states/team";
import { SetTankVisiblePacket } from "../../network/packets/set-tank-visible";
import { SetLatencyPacket } from "../../network/packets/set-latency";
import { SimplePacket } from "../../network/packets/simple-packet";
import { SendRequestSpawnPositionPacket } from "../../network/packets/send-request-spawn-position";
import { SendRequestRespawnPacket } from "../../network/packets/send-request-respawn";
import { SendRequestSetTankVisiblePacket } from "../../network/packets/send-request-set-tank-visible";
import { SendAutoDestroyPacket } from "../../network/packets/send-auto-destroy";
import { SetAutoDestroyPacket } from "../../network/packets/set-auto-destroy";
import { SendUseSupplyPacket } from "../../network/packets/send-use-supply";
import { Player } from "../player";
import { SetSuicideDelayPacket } from "../../network/packets/set-suicide-delay";
import { SetTankChangedEquipmentPacket } from "../../network/packets/set-tank-changed-equipment";
import { SetRemoveTankPacket } from "../../network/packets/set-remove-tank";
import { SetDestroyTankPacket } from "../../network/packets/set-destroy-tank";
import { Battle } from "../battle";
import { IUserTankResourcesData } from "../../network/packets/set-user-tank-resources-data";
import { Supply, SupplyType } from "../../states/supply";
import { Hull } from "./utils/hull";
import { SendMoveTankTracksPacket } from "../../network/packets/send-move-tank-tracks";
import { SendMoveTankPacket } from "../../network/packets/send-move-tank";
import { SetMoveTankPacket } from "../../network/packets/set-move-tank";
import { Logger } from "../../utils/logger";
import { SetTankControlPacket } from "../../network/packets/set-tank-control";
import { SendTankTurretDirectionPacket } from "../../network/packets/send-tank-turret-direction";
import { SetTankTurretAngleControlPacket } from "../../network/packets/set-tank-turret-angle-control";
import { SendMoveTankAndTurretPacket } from "../../network/packets/send-move-tank-and-turret";
import { SetMoveTankAndTurretPacket } from "../../network/packets/set-move-tank-and-turret";
import { TurretUtils } from "./utils/turret/utils";
import { TurretHandler } from "./utils/turret";
import { SetTankTemperaturePacket } from "../../network/packets/set-tank-temperature";
import { SetTankDestroyedPacket } from "../../network/packets/set-tank-destroyed";
import { TimeType } from "../battle/managers/task/types";
import { BattleMode } from "@/states/battle-mode";
import { SendDropFlagPacket } from "@/network/packets/send-drop-flag";
import { BattleCaptureTheFlagModeManager } from "../battle/managers/mode/modes/capture-the-flag";
import { SendCollectBonusBoxPacket } from "@/network/packets/send-collect-bonus-box";

export class Tank {

    public incarnation: number = 0;

    /** TANK STATES */
    public changedEquipment = false;
    public visible: boolean = false;
    public alive: boolean = false

    /** TANK PROPERTIES */
    private health: number = 0;
    private temperature: number = 0;

    /** TANK POSITION */
    private position: Vector3d = new Vector3d(0, 0, 0);
    private orientation: Vector3d = new Vector3d(0, 0, 0);

    /** BATTLE STATS */
    public score: number = 0;
    public kills: number = 0;
    public deaths: number = 0;

    /** TANK EQUIPMENTS */
    private turret: TurretHandler
    private hull: Hull

    public constructor(
        public readonly player: Player,
        public readonly battle: Battle,
        public readonly team: TeamType = Team.NONE
    ) {
        this.updateProperties()
    }

    public updateProperties() {
        this.updateTurret()
        this.updateHull()
    }

    public getTeam() {
        return this.team
    }

    public getHealth() {
        return this.health
    }

    public setHealth(health: number) {
        this.health = health;
        const setTankHealthPacket = new SetTankHealthPacket();
        setTankHealthPacket.tankId = this.player.getUsername();
        setTankHealthPacket.health = health;
        this.battle.broadcastPacket(setTankHealthPacket);
    }

    public getTemperature() {
        return this.temperature
    }

    public setTemperature(temperature: number) {
        this.temperature = temperature

        const packet = new SetTankTemperaturePacket();
        packet.tankId = this.player.getUsername();
        packet.temperature = temperature;

        this.battle.broadcastPacket(packet);
    }

    public getPosition(): Vector3d {
        return this.position
    }

    public setPosition(position: Vector3d) {
        this.position = position
    }

    public getDirection(): Vector3d {
        return this.orientation
    }

    public setDirection(orientation: Vector3d) {
        this.orientation = orientation
    }

    public updateTurret() {
        const resources = this.player.getGarageManager().getTurretResources()
        const turretInstance = TurretUtils.getTurretHandler(resources.item.id)
        this.turret = new turretInstance(resources.item, resources.properties, resources.sfx, this)
    }

    public updateHull() {
        const resources = this.player.getGarageManager().getHullResources()
        this.hull = new Hull(resources.item, resources.properties)
    }

    public getTurret() {
        return this.turret
    }

    public getHull() {
        return this.hull
    }

    public isAlive() {
        return this.alive
    }

    public setAlive(alive: boolean) {
        this.alive = alive
    }

    public isVisible() {
        return this.alive && this.visible
    }

    public getKills() { return this.kills }
    public getDeaths() { return this.deaths }
    public getScore() { return this.score }

    public sendVisible() {
        this.visible = true
        const setTankVisiblePacket = new SetTankVisiblePacket();
        setTankVisiblePacket.tankId = this.player.getUsername();
        this.battle.broadcastPacket(setTankVisiblePacket);
    }

    public setCameraPosition(position: Vector3d, orientation: Vector3d) {
        const setMoveCameraPacket = new SetMoveCameraPacket();
        setMoveCameraPacket.position = position
        setMoveCameraPacket.orientation = orientation
        this.player.sendPacket(setMoveCameraPacket);
    }

    public sendLatency(serverTime: number) {
        const setLatencyPacket = new SetLatencyPacket();
        setLatencyPacket.serverSessionTime = serverTime;
        setLatencyPacket.clientPing = this.player.getPing();
        this.player.sendPacket(setLatencyPacket);
    }

    public sendRemoveTank(ignoreSelf: boolean = false) {
        const setRemoveTankPacket = new SetRemoveTankPacket();
        setRemoveTankPacket.tankId = this.player.getUsername();
        this.battle.broadcastPacket(setRemoveTankPacket, ignoreSelf ? [this.player.getUsername()] : []);
    }

    public sendChangeEquipment() {
        const setChangedEquipmentPacket = new SetTankChangedEquipmentPacket();
        setChangedEquipmentPacket.tankId = this.player.getUsername();
        this.battle.broadcastPacket(setChangedEquipmentPacket);
    }

    public prepareRespawn() {
        this.incarnation++;

        const spawn = this.battle.getModeManager().getRandomSpawn(this.player);

        if (!spawn) {
            Logger.warn(`Player ${this.player.getUsername()} has no spawn on the map ${this.battle.getMap().getName()}`);
        }

        this.position = spawn?.position ? Vector3d.fromInterface(spawn.position) : new Vector3d(0, 0, 0);
        this.position.y += 200;

        this.orientation = spawn?.rotation ? Vector3d.fromInterface(spawn.rotation) : new Vector3d(0, 0, 0);
        this.sendTankSpeed();

        this.setCameraPosition(this.position, this.orientation)
    }

    public spawn() {

        if (this.changedEquipment) {
            this.updateProperties();
            const data = this.getData();

            this.sendRemoveTank();
            this.battle.getPlayersManager().sendTankData(data, this.player);
            this.battle.getPlayersManager().broadcastTankData(data);
            this.sendChangeEquipment();

            this.changedEquipment = false;
        }

        this.alive = true;
        this.setHealth(10000);

        const setSpawnTankPacket = new SetSpawnTankPacket();
        setSpawnTankPacket.tankId = this.player.getUsername();
        setSpawnTankPacket.team = this.team;
        setSpawnTankPacket.position = this.position;
        setSpawnTankPacket.orientation = this.orientation;
        setSpawnTankPacket.health = this.health;
        setSpawnTankPacket.incarnationId = this.incarnation;

        this.battle.broadcastPacket(setSpawnTankPacket);
    }

    public scheduleSuicide(delay: number = 3000, respawnDelay: number = 3000) {

        const packet = new SetSuicideDelayPacket();
        packet.delay = delay;

        this.player.sendPacket(packet);

        this.battle.getTaskManager().scheduleTask(
            () => this.sendRespawnDelay(respawnDelay), delay, TimeType.MILLISECONDS, this.player.getUsername()
        )
    }

    /** MORTE POR TROCA DE EQUIPAMENTO */
    public sendRespawnDelay(delay: number) {
        const packet = new SetDestroyTankPacket();

        packet.tank = this.player.getUsername();
        packet.respawnDelay = delay;
        this.battle.broadcastPacket(packet);

        this.battle.getModeManager().handleDeath(this.player)

        this.handleDeath();
    }

    /** MORTE POR AUTO DESTRUIÇÃO */
    public suicide() {
        const packet = new SetAutoDestroyPacket()
        packet.tankId = this.player.getUsername()
        packet.respawnDelay = 3000
        this.battle.broadcastPacket(packet)

        this.handleDeath();
    }

    /** MORTO POR ALGUÉM */
    public kill(killer: Player) {

        if (killer.getUsername() === this.player.getUsername()) {
            this.suicide();
        }

        const packet = new SetTankDestroyedPacket();

        packet.tankId = this.player.getUsername();
        packet.killerId = killer.getUsername();
        packet.respawnDelay = 3000;

        this.battle.broadcastPacket(packet);

        this.battle.getModeManager().handleKill(killer, this.player)
        this.handleDeath()
    }

    public sendTankSpeed(multiply: number = 1) {
        const setTankSpeedPacket = new SetTankSpeedPacket();
        setTankSpeedPacket.tankId = this.player.getUsername();
        setTankSpeedPacket.maxSpeed = this.hull.properties.maxSpeed * ((1.3 * (multiply - 1)) || 1);
        setTankSpeedPacket.maxTurnSpeed = this.hull.properties.maxTurnSpeed;
        setTankSpeedPacket.maxTurretRotationSpeed = this.turret.properties.turret_turn_speed;
        setTankSpeedPacket.acceleration = this.hull.properties.acceleration + (0.5 * (multiply - 1));
        setTankSpeedPacket.specificationId = this.incarnation;
        this.player.sendPacket(setTankSpeedPacket);
    }

    public handleDeath() {
        this.alive = false;
        this.visible = false;
        this.health = 0;

        this.battle.getModeManager().handleDeath(this.player)
    }

    public handleSuicide() {

        if (!this.isVisible()) {
            return;
        }

        this.battle.getTaskManager().scheduleTask(
            this.suicide.bind(this), 10, TimeType.SECONDS, this.player.getUsername()
        )
    }

    public handleUseSupply(item: SupplyType) {

        if (this.player.getGarageManager().getSupplyCount(item) <= 0) {
            return;
        }

        let time = 0;
        let decrease = true;

        switch (item) {
            case Supply.HEALTH: {
                this.setHealth(10000);
                break
            }

            case Supply.N2O:
                time = 3000;
                this.sendTankSpeed(2)
                break;
        }

        this.player.getGarageManager().sendUseSupply(item, time, decrease)
    }

    public handleMove(position: Vector3d, orientation?: Vector3d) {
        if (this.orientation) {
            this.orientation = orientation
        }
        this.position = position;

        this.battle.getCollisionManager()
            .handlePlayerMovement(this.player)
    }

    public handlePacket(packet: SimplePacket) {

        if (this.turret) {
            this.turret.handlePacket(packet)
        }

        if (this.isAlive()) {

            if (packet instanceof SendMoveTankTracksPacket) {
                const pk = new SetTankControlPacket();
                pk.tankId = this.player.getUsername();
                pk.control = packet.control;

                this.battle.broadcastPacket(pk, [this.player.getUsername()])
            }

            if (packet instanceof SendMoveTankPacket) {

                if (packet.specificationId !== this.incarnation) {
                    Logger.warn("Invalid movement with different incarnation id");
                    return;
                }

                this.handleMove(packet.position, packet.orientation)

                const pk = new SetMoveTankPacket();
                pk.tankId = this.player.getUsername()
                pk.angularVelocity = packet.angularVelocity;
                pk.control = packet.control;
                pk.impulse = packet.impulse;
                pk.orientation = packet.orientation;
                pk.position = packet.position;
                this.battle.broadcastPacket(pk, [this.player.getUsername()])
            }

            if (packet instanceof SendTankTurretDirectionPacket) {
                const pk = new SetTankTurretAngleControlPacket();

                pk.tankId = this.player.getUsername();
                pk.angle = packet.angle;
                pk.control = packet.control;

                this.battle.broadcastPacket(pk, [this.player.getUsername()])
            }

            if (packet instanceof SendMoveTankAndTurretPacket) {
                this.handleMove(packet.position, packet.orientation)

                const pk = new SetMoveTankAndTurretPacket();
                pk.tankId = this.player.getUsername();
                pk.angularVelocity = packet.angularVelocity;
                pk.control = packet.control;
                pk.impulse = packet.impulse;
                pk.orientation = packet.orientation;
                pk.position = packet.position;
                pk.turretDirection = packet.turretDirection;
                this.battle.broadcastPacket(pk, [this.player.getUsername()])
            }

            if (this.isVisible()) {

                if (this.battle.getMode() === BattleMode.CTF) {
                    if (packet instanceof SendDropFlagPacket) {
                        const manager = this.battle.getModeManager() as BattleCaptureTheFlagModeManager;
                        manager.handleDropFlag(this.player)
                    }
                }

                if (packet instanceof SendAutoDestroyPacket) {
                    this.handleSuicide();
                }

                if (packet instanceof SendUseSupplyPacket) {
                    this.handleUseSupply(packet.itemId as SupplyType)
                }

                if (packet instanceof SendCollectBonusBoxPacket) {
                    this.battle.getBoxesManager().handleCollectBonus(this.player, packet.bonusId)
                }

                return
            }

            if (packet instanceof SendRequestSetTankVisiblePacket) {
                this.sendVisible();
            }
            return;
        }

        if (packet instanceof SendRequestSpawnPositionPacket) {
            this.prepareRespawn();
        }

        if (packet instanceof SendRequestRespawnPacket) {
            this.spawn();
        }

    }

    public getData(): IUserTankResourcesData {
        const painting = this.player.getGarageManager().getPaintingResources()

        return {
            battleId: this.battle.getBattleId(),
            colormap_id: painting.item.coloring,
            hull_id: this.hull.getName(),
            turret_id: this.turret.getName(),
            team_type: this.team,
            partsObject: '{"engineIdleSound":386284,"engineStartMovingSound":226985,"engineMovingSound":75329,"turretSound":242699}',
            hullResource: this.hull.item.object3ds,
            turretResource: this.turret.item.object3ds,
            sfxData: JSON.stringify(this.turret.sfx),
            position: this.position.toObject(),
            orientation: this.orientation.toObject(),
            incarnation: this.incarnation,
            tank_id: this.player.getUsername(),
            nickname: this.player.getUsername(),
            state: this.alive ? (this.visible ? 'active' : 'newcome') : 'suicide',
            maxSpeed: this.hull.properties.maxSpeed,
            maxTurnSpeed: this.hull.properties.maxTurnSpeed,
            acceleration: this.hull.properties.acceleration,
            reverseAcceleration: this.hull.properties.reverseAcceleration,
            sideAcceleration: this.hull.properties.sideAcceleration,
            turnAcceleration: this.hull.properties.turnAcceleration,
            reverseTurnAcceleration: this.hull.properties.reverseTurnAcceleration,
            mass: this.hull.properties.mass,
            power: this.hull.properties.power,
            dampingCoeff: this.hull.properties.dampingCoeff,
            turret_turn_speed: this.turret.properties.turretTurnAcceleration,
            health: this.alive ? this.health : 0,
            rank: this.player.getData().getRank(),
            kickback: this.turret.properties.kickback,
            turretTurnAcceleration: this.turret.properties.turretTurnAcceleration,
            impact_force: this.turret.properties.impact_force,
            state_null: true
        }
    }
}
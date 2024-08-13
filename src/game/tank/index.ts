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
import { SetSuicidePacket } from "../../network/packets/set-suicide";
import { SendUseSupplyPacket } from "../../network/packets/send-use-supply";
import { Player } from "../player";
import { SetAutoDestroyDelayPacket } from "../../network/packets/set-auto-destroy-delay";
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
import { Turret } from "./utils/turret";
import { SetTankTemperaturePacket } from "../../network/packets/set-tank-temperature";
import { SetKillPacket } from "../../network/packets/set-kill";
import { TimeType } from "../battle/managers/task/types";
import { BattleMode } from "@/states/battle-mode";
import { SendDropFlagPacket } from "@/network/packets/send-drop-flag";
import { BattleCaptureTheFlagModeManager } from "../battle/managers/mode/modes/capture-the-flag";
import { SendCollectBonusBoxPacket } from "@/network/packets/send-collect-bonus-box";
import { SetViewingBattleUserKillsPacket } from "@/network/packets/set-viewing-battle-user-kills";
import { SetViewingBattleUserScorePacket } from "@/network/packets/set-viewing-battle-user-score";
import { ITankEffect } from "./types";
import { IEffect } from "@/network/packets/set-battle-users-effects";
import { BattleCombatManager } from "../battle/managers/combat";
import { Painting } from "./utils/painting";
import { DamageIndicator } from "@/states/damage-indicator";

export class Tank {

    public static readonly MAX_HEALTH = 10000;

    public incarnation: number = 0;

    /** TANK STATES */
    public visible: boolean = false;
    public alive: boolean = false

    /** TANK PROPERTIES */
    private health: number = 0;
    private temperature: number = 0;

    private effects: ITankEffect[] = []

    /** TANK POSITION */
    private position: Vector3d = new Vector3d(0, 0, 0);
    private rotation: Vector3d = new Vector3d(0, 0, 0); // yaw, pitch, roll

    /** BATTLE STATS */
    public score: number = 0;
    public kills: number = 0;
    public deaths: number = 0;

    /** TANK EQUIPMENTS */
    public turret: Turret
    public hull: Hull
    public painting: Painting

    public battleStartedSession: number = Date.now()

    public lastMovement: {
        incarnation: number,
        time: number,
        position: Vector3d,
        rotation: Vector3d
        impulse: Vector3d
        angularVelocity: Vector3d
    } = null

    public constructor(
        public readonly player: Player,
        public readonly battle: Battle,
        public team: TeamType = Team.NONE
    ) {
        this.updateProperties()
    }

    public getSessionTime() {
        return Date.now() - this.battleStartedSession
    }

    public updateProperties() {
        this.updateTurret()
        this.updateHull()
        this.updatePainting()
    }

    public getHealth() {
        return this.health
    }

    public setHealth(health: number) {
        this.health = Math.min(10000, Math.max(0, health));
        const setTankHealthPacket = new SetTankHealthPacket();
        setTankHealthPacket.tankId = this.player.getUsername();
        setTankHealthPacket.health = this.health;
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

        const packet = new SetMoveTankPacket();
        packet.angularVelocity = new Vector3d(0, 0, 0);
        packet.control = 0;
        packet.impulse = new Vector3d(0, 0, 0);
        packet.tankId = this.player.getUsername();
        packet.position = position;
        packet.orientation = this.rotation;

        this.battle.broadcastPacket(packet)
    }

    public updateTurret() {
        const resources = this.player.garageManager.getTurretResources()
        const turretInstance = TurretUtils.getTurretHandler(resources.item.id)
        this.turret = new turretInstance(resources.item, resources.properties, resources.sfx, this)
    }

    public updateHull() {
        const resources = this.player.garageManager.getHullResources()
        this.hull = new Hull(resources.item, resources.properties)
    }

    public updatePainting() {
        const resources = this.player.garageManager.getPaintingResources()
        this.painting = new Painting(resources.item)
    }

    public isAlive() {
        return this.alive
    }

    public isVisible() {
        return this.alive && this.visible
    }

    public isEnemy(tank: Tank) {
        return (
            this.battle.getMode() === BattleMode.DM ||
            tank.team !== this.team ||
            this.battle.isFriendlyFire()
        )

    }

    public sendLatency() {
        const packet = new SetLatencyPacket();
        packet.serverSessionTime = this.getSessionTime();
        packet.clientPing = this.player.getPing();
        this.player.sendPacket(packet);
    }

    public setKills(kills: number) {
        this.kills = kills

        const packet = new SetViewingBattleUserKillsPacket();
        packet.battle = this.battle.getBattleId();
        packet.user = this.player.getUsername();
        packet.kills = this.kills;
        this.battle.viewersManager.broadcastPacket(packet);
    }

    public setScore(score: number) {
        this.score = score

        const packet = new SetViewingBattleUserScorePacket();
        packet.battle = this.battle.getBattleId();
        packet.user = this.player.getUsername();
        packet.score = this.score;
        this.battle.viewersManager.broadcastPacket(packet);
    }

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

    public hasChangedEquipment() {
        const turret = this.player.garageManager.getEquippedTurret()
        const hull = this.player.garageManager.getEquippedHull()
        const painting = this.player.garageManager.getEquippedPainting()

        return (
            turret !== this.turret.getName() ||
            hull !== this.hull.getName() ||
            painting !== this.painting.getName()
        )
    }

    public prepareRespawn() {
        this.incarnation++;

        this.effects = this.effects.filter(effect => effect.activeAfterDeath)
        const spawn = this.battle.modeManager.getRandomSpawn(this.player);

        if (!spawn) {
            Logger.warn(`Player ${this.player.getUsername()} has no spawn on the map ${this.battle.getMap().getName()}`);
        }

        this.position = spawn?.position ? Vector3d.fromInterface(spawn.position) : new Vector3d(0, 0, 0);
        this.position.add(new Vector3d(0, 200, 0));

        this.rotation = spawn?.rotation ? Vector3d.fromInterface(spawn.rotation) : new Vector3d(0, 0, 0);
        this.updateTankSpeed();

        this.setCameraPosition(this.position, this.rotation)
    }

    public spawn() {
        if (this.hasChangedEquipment()) {
            this.updateProperties();
            const data = this.getData();

            this.sendRemoveTank();
            // this.battle.playersManager.sendTankData(data, this.player);
            this.battle.playersManager.broadcastTankData(data);
            this.sendChangeEquipment();
        }

        this.alive = true;
        this.setHealth(10000);

        const setSpawnTankPacket = new SetSpawnTankPacket();
        setSpawnTankPacket.tankId = this.player.getUsername();
        setSpawnTankPacket.team = this.team;
        setSpawnTankPacket.position = this.position;
        setSpawnTankPacket.orientation = this.rotation;
        setSpawnTankPacket.health = this.health;
        setSpawnTankPacket.incarnationId = this.incarnation;

        this.battle.broadcastPacket(setSpawnTankPacket);
    }

    public heal(value: number, healer: Player = this.player) {
        if (this.health >= Tank.MAX_HEALTH) {
            return;
        }

        this.setHealth(this.health + BattleCombatManager.parseDamageValue(value, this.hull.getProtection()));
        this.battle.combatManager.sendDamageIndicator(healer, this.player, value, DamageIndicator.HEAL);
    }

    public damage(value: number, attacker: Player, isCritical: boolean = false) {

        if (this.isVisible()) {
            const damage = BattleCombatManager.parseDamageValue(value, this.hull.getProtection())

            const health = this.health;
            this.setHealth(this.health - damage);

            Logger.debug('')
            Logger.debug(`Attacker: ${attacker.getUsername()} attacked ${this.player.getUsername()}`);
            Logger.debug(`Damage: ${value} (${damage})`);
            Logger.debug(`Target health: ${health}`);
            Logger.debug(`New health: ${this.health}`);
            Logger.debug(`Protection: ${this.hull.getProtection()}`);
            Logger.debug(`${attacker.getUsername()} position ${attacker.tank.getPosition().toString()}`);
            Logger.debug(`${this.player.getUsername()} position ${this.getPosition().toString()}`);
            Logger.debug('')

            const isDead = this.health <= BattleCombatManager.DEATH_HISTERESES

            this.battle.combatManager.sendDamageIndicator(
                attacker, this.player,
                isDead ? BattleCombatManager.parseProtectionValue(this.hull.getProtection(), health) : value,
                isDead ? DamageIndicator.FATAL : isCritical ? DamageIndicator.CRITICAL : DamageIndicator.NORMAL
            );

            if (isDead) {
                this.kill(attacker)
            }
        }
    }

    public hasEffect(supply: SupplyType) {
        return this.effects.find(effect => effect.type === supply)
    }

    public getEffects(): IEffect[] {
        return this.effects.map((effect) => {
            return {
                userID: this.player.getUsername(),
                itemIndex: Supply.ALL.indexOf(effect.type) + 1,
                durationTime: effect.duration - (Date.now() - effect.startedAt),
                effectLevel: effect.level
            }
        })
    }

    public removeEffect(supply: Supply) {
        const effect = this.effects.find(effect => effect.type === supply)
        if (effect) {

            this.effects = this.effects.filter(effect => effect.type !== supply)

            switch (supply) {
                case Supply.N2O: {
                    this.updateTankSpeed()
                    break;
                }
            }

            this.battle.effectsManager.broadcastRemoveBattleEffect(this.player, effect.type)
        }
    }

    public addEffect(
        supply: SupplyType,
        duration: number = 60000,
        level: number = 1,
        activeAfterDeath: boolean = false,
        delay: number = 90000
    ) {
        if (!this.hasEffect(supply)) {

            this.effects.push({ type: supply, startedAt: Date.now(), level, duration, activeAfterDeath });

            switch (supply) {
                case Supply.HEALTH: {
                    const rounds = Math.round(this.hull.getProtection() / 30)

                    for (let i = 0; i < rounds; i++) {
                        this.battle.taskManager.scheduleTask(() => this.heal(30), i * 1000, this.player.getUsername())
                    }

                    duration = rounds * 1000;
                    break;
                }
                case Supply.N2O: {
                    this.updateTankSpeed()
                    break;
                }
            }

            this.battle.effectsManager.broadcastAddBattleEffect(this.player, supply, duration, level, activeAfterDeath)
            this.battle.taskManager.scheduleTask(() => this.removeEffect(supply), duration)

            return delay
        }
        return 0;
    }

    public getSpeed() {
        const multiply = this.hasEffect(Supply.N2O) ? 2 : 1;

        return {
            maxSpeed: this.hull.properties.maxSpeed * ((1.3 * (multiply - 1)) || 1),
            acceleration: this.hull.properties.acceleration + (0.5 * (multiply - 1))
        }
    }

    public updateTankSpeed() {
        const speed = this.getSpeed()
        const setTankSpeedPacket = new SetTankSpeedPacket();
        setTankSpeedPacket.tankId = this.player.getUsername();
        setTankSpeedPacket.maxSpeed = speed.maxSpeed;
        setTankSpeedPacket.maxTurnSpeed = this.hull.properties.maxTurnSpeed;
        setTankSpeedPacket.maxTurretRotationSpeed = this.turret.properties.turret_turn_speed;
        setTankSpeedPacket.acceleration = speed.acceleration;
        setTankSpeedPacket.specificationId = this.incarnation;
        this.battle.broadcastPacket(setTankSpeedPacket);
    }

    public scheduleDestroy(delay: number = 3000, respawnDelay: number = 3000) {
        const packet = new SetAutoDestroyDelayPacket();
        packet.delay = delay;
        this.player.sendPacket(packet);

        this.battle.taskManager.scheduleTask(() => {
            this.destroy(respawnDelay)
        }, delay, this.player.getUsername())
    }

    /** MORTE POR TROCA DE EQUIPAMENTO */
    public destroy(respawnDelay: number) {
        const packet = new SetDestroyTankPacket();

        packet.tank = this.player.getUsername();
        packet.respawnDelay = respawnDelay;
        this.battle.broadcastPacket(packet);

        this.battle.modeManager.handleDeath(this.player)
        this.onDeath();
    }

    /** MORTE POR AUTO DESTRUIÇÃO */
    public suicide() {
        const packet = new SetSuicidePacket()
        packet.tankId = this.player.getUsername()
        packet.respawnDelay = 3000
        this.battle.broadcastPacket(packet)
        this.onDeath();
    }

    /** MORTO POR ALGUÉM */
    public kill(killer: Player, respawnDelay: number = 3000) {

        if (killer === this.player) {
            this.suicide();
            return;
        }

        const packet = new SetKillPacket();

        packet.tankId = this.player.getUsername();
        packet.killerId = killer.getUsername();
        packet.respawnDelay = respawnDelay;

        this.battle.broadcastPacket(packet);

        this.battle.modeManager.handleKill(killer, this.player)
        this.onDeath()
    }

    public onDeath() {
        this.battle.minesManager.removePlayerMines(this.player)
        this.battle.taskManager.unregisterOwnerTasks(this.player.getUsername())

        this.health = 0;

        this.alive = false;
        this.visible = false;

        this.battle.modeManager.handleDeath(this.player)
    }

    public handleSuicide() {
        if (!this.isVisible()) {
            return;
        }

        this.battle.taskManager.scheduleTask(
            this.suicide.bind(this), 10 * TimeType.SECONDS, this.player.getUsername()
        )
    }

    public handleUseSupply(item: SupplyType) {

        if (this.player.garageManager.getSupplyCount(item) <= 0) {
            return;
        }

        let delay = 0;

        switch (item) {
            case Supply.MINE: {
                this.battle.minesManager.placeMine(this.player)
                break;
            }
            default: {
                delay = this.addEffect(item)
            }
        }

        this.player.garageManager.sendUseSupply(item, delay, !this.battle.isParkourMode())
    }

    public handleMove(
        time: number,
        incarnation: number,
        position: Vector3d,
        rotation: Vector3d,
        angularVelocity: Vector3d = new Vector3d,
        impulse: Vector3d = new Vector3d
    ): boolean {

        if (this.incarnation !== incarnation) {
            this.suicide()
            return false
        }

        if (this.lastMovement && this.incarnation === this.lastMovement.incarnation) {
            const elapsed = (time - this.lastMovement.time) / 1000

            if (elapsed < 0) {
                this.suicide()
                return false
            }

            // const distance = position.distanceTo(this.lastMovement.position)
            const diff = new Vector3d().diff(this.lastMovement.position, position)

            if (Vector3d.zero().distanceTo(diff) >= 100) {
                this.battle.collisionManager.checkObjectCollisions(
                    this.player,
                    Vector3d.copy(this.position).add(Vector3d.copy(diff).scale(0.5))
                )
            }
        }

        this.lastMovement = { incarnation: this.incarnation, time, position, rotation, angularVelocity, impulse }

        this.rotation = rotation
        this.position = position;

        this.battle.collisionManager.handlePlayerMovement(this.player)

        return true
    }

    public handleMoveTurret(time: number, incarnation: number, rotation: number) {

        if (this.incarnation !== incarnation) {
            return false;
        }

        if (!this.turret) {
            return false;
        }

        this.turret.rotation = rotation
        return true;
    }

    public handleMovementPacket(packet: SimplePacket) {
        if (packet instanceof SendMoveTankTracksPacket) {
            if (packet.specificationId === this.incarnation) {
                const pk = new SetTankControlPacket();
                pk.tankId = this.player.getUsername();
                pk.control = packet.control;
                this.battle.broadcastPacket(pk, [this.player.getUsername()])
            }
        }

        if (packet instanceof SendMoveTankPacket) {
            const valid = this.handleMove(packet.time, packet.specificationId, packet.position, packet.orientation, packet.angularVelocity, packet.impulse)

            if (valid) {
                const pk = new SetMoveTankPacket();
                pk.tankId = this.player.getUsername()
                pk.angularVelocity = packet.angularVelocity;
                pk.control = packet.control;
                pk.impulse = packet.impulse;
                pk.orientation = packet.orientation;
                pk.position = packet.position;
                this.battle.broadcastPacket(pk, [this.player.getUsername()])
            }


        }

        if (packet instanceof SendMoveTankAndTurretPacket) {
            const move = this.handleMove(packet.time, packet.specificationId, packet.position, packet.orientation, packet.angularVelocity, packet.impulse)
            const rotate = this.handleMoveTurret(packet.time, packet.specificationId, packet.turretDirection)

            if (move && rotate) {
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
        }

        if (packet instanceof SendTankTurretDirectionPacket) {
            const valid = this.handleMoveTurret(packet.time, packet.incarnationId, packet.angle)

            if (valid) {
                const pk = new SetTankTurretAngleControlPacket();
                pk.tankId = this.player.getUsername();
                pk.angle = packet.angle;
                pk.control = packet.control;
                this.battle.broadcastPacket(pk, [this.player.getUsername()])
            }
        }
    }

    public handlePacket(packet: SimplePacket) {

        if (this.turret) {
            this.turret.handlePacket(packet)
        }

        if (this.isAlive()) {

            this.handleMovementPacket(packet)

            if (this.isVisible()) {

                if (this.battle.getMode() === BattleMode.CTF) {
                    if (packet instanceof SendDropFlagPacket) {
                        const manager = this.battle.modeManager as BattleCaptureTheFlagModeManager;
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
                    this.battle.boxesManager.handleCollectBonus(this.player, packet.bonusId)
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
        const speed = this.getSpeed()

        return {
            battleId: this.battle.getBattleId(),
            colormap_id: this.painting.item.coloring,
            hull_id: this.hull.getName(),
            turret_id: this.turret.getName(),
            team_type: this.team,
            partsObject: JSON.stringify({
                engineIdleSound: 386284,
                engineStartMovingSound: 226985,
                engineMovingSound: 75329,
                turretSound: 242699
            }),
            hullResource: this.hull.item.object3ds,
            turretResource: this.turret.item.object3ds,
            sfxData: JSON.stringify(this.turret.sfx),
            position: this.position.toObject(),
            orientation: this.rotation.toObject(),
            incarnation: this.incarnation,
            tank_id: this.player.getUsername(),
            nickname: this.player.getUsername(),
            state: this.alive ? (this.visible ? 'active' : 'newcome') : 'suicide',
            maxSpeed: speed.maxSpeed,
            maxTurnSpeed: this.hull.properties.maxTurnSpeed,
            acceleration: speed.acceleration,
            reverseAcceleration: this.hull.properties.reverseAcceleration,
            sideAcceleration: this.hull.properties.sideAcceleration,
            turnAcceleration: this.hull.properties.turnAcceleration,
            reverseTurnAcceleration: this.hull.properties.reverseTurnAcceleration,
            mass: this.hull.properties.mass,
            power: this.hull.properties.power,
            dampingCoeff: this.hull.properties.dampingCoeff,
            turret_turn_speed: this.turret.properties.turret_turn_speed,
            health: this.alive ? this.health : 0,
            rank: this.player.data.getRank(),
            kickback: this.turret.properties.kickback,
            turretTurnAcceleration: this.turret.properties.turretTurnAcceleration,
            impact_force: this.turret.properties.impact_force,
            state_null: true
        }
    }
}
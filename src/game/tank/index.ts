import { SetTankSpeedPacket } from "../../network/packets/set-tank-speed";
import { Vector3d } from "../../utils/game/vector-3d";
import { SetMoveCameraPacket } from "../../network/packets/set-move-camera";
import { SetTankHealthPacket } from "../../network/packets/set-tank-health";
import { SetSpawnTankPacket } from "../../network/packets/set-spawn-tank";
import { Team } from "../../utils/game/team";
import { SetTankVisiblePacket } from "../../network/packets/set-tank-visible";
import { SetLatencyPacket } from "../../network/packets/set-latency";
import { SimplePacket } from "../../network/packets/simple-packet";
import { SendRequestSpawnPositionPacket } from "../../network/packets/send-request-spawn-position";
import { SendRequestRespawnPacket } from "../../network/packets/send-request-respawn";
import { SendRequestSetTankVisiblePacket } from "../../network/packets/send-request-set-tank-visible";
import { SendAutoDestroyPacket } from "../../network/packets/send-auto-destroy";
import { SetDestroyTankPacket } from "../../network/packets/set-destroy-tank";
import { SendUseDrugPacket } from "../../network/packets/send-use-drug";
import { SetUseDrugPacket } from "../../network/packets/set-use-drug";
import { Player } from "../player";
import { SetSuicideDelayPacket } from "../../network/packets/set-suicide-delay";
import { SetTankChangedEquipmentPacket } from "../../network/packets/set-tank-changed-equipment";
import { SetRemoveTankPacket } from "../../network/packets/set-remove-tank";
import { SetTankRespawnDelayPacket } from "../../network/packets/set-tank-respawn-delay";
import { Battle } from "../battle";
import { IUserTankResourcesData } from "../../network/packets/set-user-tank-resources-data";

export class Tank {

    private incarnation: number = 0;

    private health: number = 0;
    private position: Vector3d = new Vector3d(0, 0, 0);

    private visible: boolean = false;
    public changedEquipment = false;

    public constructor(
        public readonly player: Player,
        public readonly battle: Battle
    ) { }

    public getIncarnationId() {
        return this.incarnation
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

    public getPosition(): Vector3d {
        return this.position
    }

    public setPosition(position: Vector3d) {
        this.position = position
    }

    public isVisible() {
        return this.visible
    }

    public setVisible(visible: boolean) {
        this.visible = visible

        if (visible) {
            const setTankVisiblePacket = new SetTankVisiblePacket();
            setTankVisiblePacket.tankId = this.player.getUsername();
            this.battle.broadcastPacket(setTankVisiblePacket);
        }
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

    public sendRemoveTank() {
        const setRemoveTankPacket = new SetRemoveTankPacket();
        setRemoveTankPacket.tankId = this.player.getUsername();
        this.battle.broadcastPacket(setRemoveTankPacket);
    }

    public sendChangeEquipment() {
        const setChangedEquipmentPacket = new SetTankChangedEquipmentPacket();
        setChangedEquipmentPacket.tankId = this.player.getUsername();
        this.battle.broadcastPacket(setChangedEquipmentPacket);
    }

    public prepareRespawn() {
        this.incarnation++;
        // TODO: set speed
        this.setCameraPosition(new Vector3d(-4669.8310546875, -1442.4090576171875, 200), new Vector3d(0, 0, -1.5709999799728394))
    }

    public spawn() {

        if (this.changedEquipment) {
            this.changedEquipment = false;
            this.sendRemoveTank();
            this.battle.getPlayersManager().broadcastTankData(this.getData());
            this.sendChangeEquipment();
        }

        this.setHealth(10000);

        const setSpawnTankPacket = new SetSpawnTankPacket();
        setSpawnTankPacket.tankId = this.player.getUsername();
        setSpawnTankPacket.team = Team.NONE;
        setSpawnTankPacket.position = new Vector3d(-4669.8310546875, -1442.4090576171875, 200);
        setSpawnTankPacket.orientation = new Vector3d(0, 0, -1.5709999799728394);
        setSpawnTankPacket.health = this.health;
        setSpawnTankPacket.incarnationId = this.incarnation;

        this.battle.broadcastPacket(setSpawnTankPacket);
    }

    public destroy() {
        const setDestroyTankPacket = new SetDestroyTankPacket()
        setDestroyTankPacket.tankId = this.player.getUsername()
        setDestroyTankPacket.respawnDelay = 3000
        this.player.sendPacket(setDestroyTankPacket)
    }

    public sendRespawnDelay(delay: number) {
        const setTankRespawnDelayPacket = new SetTankRespawnDelayPacket();
        setTankRespawnDelayPacket.tank = this.player.getUsername();
        setTankRespawnDelayPacket.respawnDelay = delay;
        this.player.sendPacket(setTankRespawnDelayPacket);
    }

    public sendSuicide(delay: number = 3000, respawnDelay: number = 3000) {
        const packet = new SetSuicideDelayPacket();
        packet.delay = delay;
        this.player.sendPacket(packet);
        setTimeout(() => { this.sendRespawnDelay(respawnDelay) }, delay)
    }

    public setTankSpeed(
        maxSpeed: number,
        maxTurnSpeed: number,
        maxTurretRotationSpeed: number,
        acceleration: number,
    ) {
        const setTankSpeedPacket = new SetTankSpeedPacket();
        setTankSpeedPacket.tankId = this.player.getUsername();
        setTankSpeedPacket.maxSpeed = maxSpeed;
        setTankSpeedPacket.maxTurnSpeed = maxTurnSpeed;
        setTankSpeedPacket.maxTurretRotationSpeed = maxTurretRotationSpeed;
        setTankSpeedPacket.acceleration = acceleration;
        setTankSpeedPacket.specificationId = this.incarnation;
        this.player.sendPacket(setTankSpeedPacket);
    }

    public handlePacket(packet: SimplePacket): boolean {

        if (packet instanceof SendRequestSpawnPositionPacket) {
            this.prepareRespawn();
            return true;
        }

        if (packet instanceof SendRequestRespawnPacket) {
            this.spawn();
            return true;
        }

        if (packet instanceof SendRequestSetTankVisiblePacket) {
            this.setVisible(true);
            return true;
        }

        if (packet instanceof SendAutoDestroyPacket) {
            this.destroy();
            return true;
        }

        if (packet instanceof SendUseDrugPacket) {
            console.log("Use drug", packet)
            if (packet.itemId === "n2o") {
                this.setTankSpeed(100, 2.6632988452911377, 2.8149678707122803, 20.970000267028809)
                const setUseDrugPacket = new SetUseDrugPacket()
                setUseDrugPacket.itemId = packet.itemId
                setUseDrugPacket.time = 10
                setUseDrugPacket.decrease = true
                this.player.sendPacket(setUseDrugPacket)
            }
        }

        return false;
    }

    public getData(): IUserTankResourcesData {
        const turret = this.player.getGarageManager().getTurretResources()
        const hull = this.player.getGarageManager().getHullResources()
        const painting = this.player.getGarageManager().getPaintingResources()

        return {
            battleId: this.battle.getBattleId(),
            colormap_id: painting.item.coloring,
            hull_id: hull.hull,
            turret_id: turret.turret,
            team_type: 'NONE',
            partsObject: '{"engineIdleSound":386284,"engineStartMovingSound":226985,"engineMovingSound":75329,"turretSound":242699}',
            hullResource: hull.item.object3ds,
            turretResource: turret.item.object3ds,
            sfxData: JSON.stringify(turret.sfx),
            position: { x: 0, y: 0, z: 0 },
            orientation: { x: 0, y: 0, z: 0 },
            incarnation: this.incarnation,
            tank_id: this.player.getUsername(),
            nickname: this.player.getUsername(),
            state: 'suicide',
            maxSpeed: hull.properties.maxSpeed,
            maxTurnSpeed: hull.properties.maxTurnSpeed,
            acceleration: hull.properties.acceleration,
            reverseAcceleration: hull.properties.reverseAcceleration,
            sideAcceleration: hull.properties.sideAcceleration,
            turnAcceleration: hull.properties.turnAcceleration,
            reverseTurnAcceleration: hull.properties.reverseTurnAcceleration,
            mass: hull.properties.mass,
            power: hull.properties.power,
            dampingCoeff: hull.properties.dampingCoeff,
            turret_turn_speed: turret.properties.turretTurnAcceleration,
            health: 0,
            rank: this.player.getData().getRank(),
            kickback: turret.properties.kickback,
            turretTurnAcceleration: turret.properties.turretTurnAcceleration,
            impact_force: turret.properties.impact_force,
            state_null: true
        }
    }
}
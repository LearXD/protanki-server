import { SetTankSpeedPacket } from "../../network/packets/set-tank-speed";
import { Vector3d } from "../../utils/game/vector-3d";
import { SetMoveCameraPacket } from "../../network/packets/set-move-camera";
import { ByteArray } from "../../utils/network/byte-array";
import { SetTankHealthPacket } from "../../network/packets/set-tank-health";
import { SetSpawnTankPacket } from "../../network/packets/set-spawn-tank";
import { Team } from "../../utils/game/team";
import { Battle } from "../battle";
import { SetTankVisiblePacket } from "../../network/packets/set-tank-visible";
import { SetLatencyPacket } from "../../network/packets/set-latency";
import { SimplePacket } from "../../network/packets/simple-packet";
import { SendResumePacket } from "../../network/packets/send-resume";
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

export class Tank {

    private incarnation: number = 0;

    private health: number = 0;
    private position: Vector3d = new Vector3d(0, 0, 0);

    private visible: boolean = false;
    public changedEquipment = false;

    public constructor(
        private readonly player: Player
    ) { }

    public getBattle() {
        return this.player.getBattle()
    }

    public getPosition(): Vector3d { return this.position }
    public setPosition(position: Vector3d) { this.position = position }

    public isVisible() { return this.visible }

    public setVisible(visible: boolean) {
        this.visible = visible

        if (visible) {
            const setTankVisiblePacket = new SetTankVisiblePacket(new ByteArray());
            setTankVisiblePacket.tankId = this.player.getUsername();
            this.player.sendPacket(setTankVisiblePacket);
        }
    }

    public spawn() {
        // this.setTankSpeed(8.600000381469727, 1.6632988452911377, 1.8149678707122803, 10.970000267028809)
        this.setCameraPosition(new Vector3d(-4669.8310546875, -1442.4090576171875, 200), new Vector3d(0, 0, -1.5709999799728394))
    }

    public setCameraPosition(position: Vector3d, orientation: Vector3d) {
        const setMoveCameraPacket = new SetMoveCameraPacket(new ByteArray());
        setMoveCameraPacket.position = position
        setMoveCameraPacket.orientation = orientation
        this.player.sendPacket(setMoveCameraPacket);
    }

    public getHealth() {
        return this.health
    }

    public setHealth(health: number) {
        const setTankHealthPacket = new SetTankHealthPacket(new ByteArray());
        setTankHealthPacket.tankId = this.player.getUsername();
        setTankHealthPacket.health = health;
        this.player.sendPacket(setTankHealthPacket);
        this.health = health;
    }

    public sendLatency(serverTime: number) {
        const setLatencyPacket = new SetLatencyPacket(new ByteArray());
        setLatencyPacket.serverSessionTime = serverTime;
        setLatencyPacket.clientPing = this.player.getPing();
        this.player.sendPacket(setLatencyPacket);
    }

    public sendRemove() {
        const setRemoveTankPacket = new SetRemoveTankPacket();
        setRemoveTankPacket.tankId = this.player.getUsername();
        this.getBattle().broadcastPacket(setRemoveTankPacket);
    }

    public sendChangeEquipment() {
        const setChangedEquipmentPacket = new SetTankChangedEquipmentPacket();
        setChangedEquipmentPacket.tankId = this.player.getUsername();
        this.getBattle().broadcastPacket(setChangedEquipmentPacket);
    }

    public respawn() {
        this.incarnation++;

        if (this.changedEquipment) {
            this.changedEquipment = false;
            this.sendRemove();
            this.getBattle().getPlayersManager().sendPlayerData(this.player);
            this.sendChangeEquipment();
        }

        this.setHealth(10000);

        const setSpawnTankPacket = new SetSpawnTankPacket(new ByteArray());
        setSpawnTankPacket.tankId = this.player.getUsername();
        setSpawnTankPacket.team = Team.NONE;
        setSpawnTankPacket.position = new Vector3d(-4669.8310546875, -1442.4090576171875, 200);
        setSpawnTankPacket.orientation = new Vector3d(0, 0, -1.5709999799728394);
        setSpawnTankPacket.health = 10000;
        setSpawnTankPacket.incarnationId = this.incarnation;

        this.player.sendPacket(setSpawnTankPacket);
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
        const setTankSpeedPacket = new SetTankSpeedPacket(new ByteArray());
        setTankSpeedPacket.tankId = this.player.getUsername();
        setTankSpeedPacket.maxSpeed = maxSpeed;
        setTankSpeedPacket.maxTurnSpeed = maxTurnSpeed;
        setTankSpeedPacket.maxTurretRotationSpeed = maxTurretRotationSpeed;
        setTankSpeedPacket.acceleration = acceleration;
        setTankSpeedPacket.specificationId = 1;
        this.player.sendPacket(setTankSpeedPacket);
    }

    public handlePacket(packet: SimplePacket): boolean {

        if (packet instanceof SendResumePacket) {
            this.spawn();
            return true;
        }

        if (packet instanceof SendRequestSetTankVisiblePacket) {
            this.setVisible(true);
            return true;
        }

        if (packet instanceof SendRequestRespawnPacket) {
            this.respawn();
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
}
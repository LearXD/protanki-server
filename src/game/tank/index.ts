import net from "net";

import { SetTankSpeedPacket } from "../../network/packets/set-tank-speed";
import { Vector3d } from "../../utils/game/vector-3d";
import { Client } from "../client";
import { Server } from "../../server";
import { SetMoveCameraPacket } from "../../network/packets/set-move-camera";
import { ByteArray } from "../../utils/network/byte-array";
import { SetTankHealthPacket } from "../../network/packets/set-tank-health";
import { SetSpawnTankPacket } from "../../network/packets/set-spawn-tank";
import { Team } from "../../utils/game/team";
import { Battle } from "../battle";
import { SetTankVisiblePacket } from "../../network/packets/set-tank-visible";
import { SetLatencyPacket } from "../../network/packets/set-latency";

export abstract class Tank extends Client {

    private health: number = 0;
    private position: Vector3d = new Vector3d(0, 0, 0);

    private battle: Battle;

    public constructor(socket: net.Socket, server: Server) {
        super(socket, server)
    }

    public getPosition(): Vector3d { return this.position }
    public setPosition(position: Vector3d) { this.position = position }

    public spawn() {
        this.setTankSpeed(8.600000381469727, 1.6632988452911377, 1.8149678707122803, 10.970000267028809)
        this.setCameraPosition(new Vector3d(-4669.8310546875, -1442.4090576171875, 200), new Vector3d(0, 0, -1.5709999799728394))
    }

    public getBattle() { return this.battle }
    public setBattle(battle: Battle) { this.battle = battle }

    public setCameraPosition(position: Vector3d, orientation: Vector3d) {
        const setMoveCameraPacket = new SetMoveCameraPacket(new ByteArray());
        setMoveCameraPacket.position = position
        setMoveCameraPacket.orientation = orientation
        this.sendPacket(setMoveCameraPacket);
    }

    public getHealth() { return this.health }
    public setHealth(health: number) {
        this.health = health;

        const setTankHealthPacket = new SetTankHealthPacket(new ByteArray());
        setTankHealthPacket.tankId = this.getUsername();
        setTankHealthPacket.health = health;
        this.sendPacket(setTankHealthPacket);
    }

    public sendLatency(serverTime: number) {
        const setLatencyPacket = new SetLatencyPacket(new ByteArray());
        setLatencyPacket.serverSessionTime = serverTime;
        setLatencyPacket.clientPing = this.getPing();
        this.sendPacket(setLatencyPacket);
    }

    public respawn() {
        this.setHealth(10000);

        const setSpawnTankPacket = new SetSpawnTankPacket(new ByteArray());
        setSpawnTankPacket.tankId = this.getUsername();
        setSpawnTankPacket.team = Team.NONE;
        setSpawnTankPacket.position = new Vector3d(-4669.8310546875, -1442.4090576171875, 200);
        setSpawnTankPacket.orientation = new Vector3d(0, 0, -1.5709999799728394);
        setSpawnTankPacket.health = 10000;
        setSpawnTankPacket.incarnationId = 1;

        this.sendPacket(setSpawnTankPacket);

        const setTankVisiblePacket = new SetTankVisiblePacket(new ByteArray());
        setTankVisiblePacket.tankId = this.getUsername();
        this.sendPacket(setTankVisiblePacket);
    }

    public setTankSpeed(
        maxSpeed: number,
        maxTurnSpeed: number,
        maxTurretRotationSpeed: number,
        acceleration: number,
    ) {
        const setTankSpeedPacket = new SetTankSpeedPacket(new ByteArray());
        setTankSpeedPacket.tankId = this.getUsername();
        setTankSpeedPacket.maxSpeed = maxSpeed;
        setTankSpeedPacket.maxTurnSpeed = maxTurnSpeed;
        setTankSpeedPacket.maxTurretRotationSpeed = maxTurretRotationSpeed;
        setTankSpeedPacket.acceleration = acceleration;
        setTankSpeedPacket.specificationId = 1;
        this.sendPacket(setTankSpeedPacket);
    }
}
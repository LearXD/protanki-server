import { Player } from "@/game/player";
import { BonusBoxes } from "../../types";
import { SetSpawnBonusBoxPacket } from "@/network/packets/set-spawn-bonus-box";
import { Vector3d } from "@/utils/vector-3d";
import { SetRemoveBonusBoxPacket } from "@/network/packets/set-remove-bonus-box";
import { Battle } from "@/game/battle";
import { SetBonusBoxCollectedPacket } from "@/network/packets/set-bonus-box-collected";
import { Supply } from "@/states/supply";
import { Logger } from "@/utils/logger";

export class BonusBox {

    public collected = false;

    public spawned = false;
    public spawnedAt: number;

    public constructor(
        public readonly name: string,
        public readonly id: number,
        public readonly position: Vector3d,
        public readonly lifeTime: number = 60000,
        public readonly battle: Battle
    ) {

        switch (name) {
            case BonusBoxes.GOLD: {
                battle.boxesManager.broadcastGoldBoxAlert();
                break;
            }
        }
    }

    public getName() {
        return `${this.name}_${this.id}`;
    }

    public spawn() {
        Logger.info(`Spawning ${this.getName()} box at ${this.position.x}, ${this.position.y}, ${this.position.z}`)

        this.spawned = true;
        this.spawnedAt = Date.now();

        const packet = new SetSpawnBonusBoxPacket();
        packet.bonusId = this.getName();
        packet.position = this.position;
        packet.life = this.lifeTime;

        this.battle.broadcastPacket(packet);
        return this;
    }

    public remove() {
        this.spawned = false;

        const packet = new SetRemoveBonusBoxPacket();
        packet.bonusId = this.getName();
        this.battle.broadcastPacket(packet);
    }

    public getSpawnedTime() {
        return Date.now() - this.spawnedAt;
    }

    public canCollect(player: Player) {
        return this.spawned && !this.collected && this.getSpawnedTime() < this.lifeTime;
    }

    public handleCollect(player: Player) {

        this.collected = true;
        this.spawned = false;

        switch (this.name) {
            case BonusBoxes.GOLD: {
                this.battle.boxesManager.broadcastGoldBoxCollected(player);
                player.data.increaseCrystals(1000)
                player.dataManager.sendCrystals();
                break;
            }
            case BonusBoxes.ARMOR: {
                player.tank.addEffect(Supply.ARMOR)
                break;
            }
            case BonusBoxes.HEALTH: {
                player.tank.addEffect(Supply.HEALTH)
                break;
            }
            case BonusBoxes.DAMAGE: {
                player.tank.addEffect(Supply.DOUBLE_DAMAGE)
                break;
            }
            case BonusBoxes.NITRO: {
                player.tank.addEffect(Supply.N2O)
                break;
            }
            case BonusBoxes.CRYSTAL: {
                player.data.increaseCrystals(10)
                player.dataManager.sendCrystals();
                break;
            }
        }

        const packet = new SetBonusBoxCollectedPacket();
        packet.bonusId = this.getName();
        this.battle.broadcastPacket(packet);
    }

}
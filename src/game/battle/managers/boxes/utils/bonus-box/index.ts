import { Player } from "@/game/player";
import { BonusBoxes } from "../../types";
import { SetSpawnBonusBoxPacket } from "@/network/packets/set-spawn-bonus-box";
import { Vector3d } from "@/utils/vector-3d";
import { SetRemoveBonusBoxPacket } from "@/network/packets/set-remove-bonus-box";
import { Battle } from "@/game/battle";
import { SetBonusBoxCollectedPacket } from "@/network/packets/set-bonus-box-collected";
import { Supply } from "@/states/supply";

export class BonusBox {

    public collected = false;
    public spawned = false;

    public constructor(
        public readonly name: string,
        public readonly id: number,
        public readonly position: Vector3d,
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

    public spawn(lifeTime: number = 30000) {
        this.spawned = true;

        const packet = new SetSpawnBonusBoxPacket();
        packet.bonusId = this.getName();
        packet.position = this.position;
        packet.life = lifeTime;

        this.battle.broadcastPacket(packet);

        this.battle.taskManager.scheduleTask(this.remove.bind(this), lifeTime);
    }

    public remove() {
        this.spawned = false;
        const packet = new SetRemoveBonusBoxPacket();
        packet.bonusId = this.getName();
        this.battle.broadcastPacket(packet);
    }

    public handleCollect(player: Player) {

        this.collected = true;

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
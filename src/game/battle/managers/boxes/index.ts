import { SetGoldBoxAlertPacket } from "@/network/packets/set-gold-box-alert";
import { SetBattleSpawnedBoxesPacket } from "../../../../network/packets/set-battle-spawned-boxes";
import { SetBonusesDataPacket } from "../../../../network/packets/set-bonuses-data";
import { Player } from "../../../player";
import { BonusBox } from "./utils/bonus-box";
import { Battle } from "../..";
import { SetGoldBoxTakenPacket } from "@/network/packets/set-gold-box-taken";
import { BonusType } from "@/game/map/types";
import { TimeType } from "../task/types";
import { Logger } from "@/utils/logger";
import { MathUtils } from "@/utils/math";
import { Vector3d } from "@/utils/vector-3d";

export class BattleBoxesManager {

    private boxes: BonusBox[] = []

    public static readonly CONFIG = [
        { type: BonusType.GOLD, spawn: 0, lifeTime: 60 * 60 },
        { type: BonusType.CRYSTAL, spawn: 0, lifeTime: 60 * 4 },
        { type: BonusType.ARMOR, spawn: 1, lifeTime: 40 },
        { type: BonusType.NITRO, spawn: 1, lifeTime: 40 },
        { type: BonusType.HEALTH, spawn: 3, lifeTime: 20 },
        { type: BonusType.DAMAGE, spawn: 2, lifeTime: 40 }
    ]

    public constructor(
        public readonly battle: Battle
    ) { }

    public initTasks() {
        for (const box of BattleBoxesManager.CONFIG) {
            if (box.spawn > 0) {
                this.battle.taskManager.scheduleTask(
                    () => this.spawn(box.type), box.spawn * TimeType.MINUTES, true
                )
            }
        }
    }

    public sendData(client: Player) {
        this.sendBoxesData(client)
        this.sendSpawnedBoxes(client)
    }

    public sendBoxesData(client: Player) {
        const bonuses = client.server.battleManager.getData('bonuses.json')
        const setBonusesDataPacket = new SetBonusesDataPacket();
        setBonusesDataPacket.data = bonuses;
        client.sendPacket(setBonusesDataPacket);
    }

    public sendSpawnedBoxes(client: Player) {
        const setBattleSpawnedBoxesPacket = new SetBattleSpawnedBoxesPacket()
        setBattleSpawnedBoxesPacket.boxes = []
        setBattleSpawnedBoxesPacket.boxes = this.boxes
            .filter(box => box.spawned && !box.collected)
            .map(box => ({
                id: box.getName(),
                position: box.position.swap(),
                timeFromAppearing: box.getSpawnedTime(),
                timeLife: box.lifeTime,
                bonusFallSpeed: 0
            }))
        client.sendPacket(setBattleSpawnedBoxesPacket)
    }

    public broadcastGoldBoxAlert() {
        const packet = new SetGoldBoxAlertPacket();
        packet.text = 'A caixa dourada será deixada em breve';
        packet.sound = 490113;
        this.battle.broadcastPacket(packet);
    }

    public broadcastGoldBoxCollected(player: Player) {
        const packet = new SetGoldBoxTakenPacket();
        packet.user = player.getUsername();
        this.battle.broadcastPacket(packet);
    }

    public spawn(bonus: BonusType, config: { index?: number, delay?: number, count?: number } = {}) {
        const spawns = this.battle.map.getBonusSpawns(bonus, this.battle.getMode());

        if (spawns.length === 0) {
            Logger.error(`No spawns found for bonus ${bonus}`)
            return false;
        }

        if (config.index) {
            this.addBonus(bonus, spawns[config.index], config.delay)
            return true;
        }

        if (config.count && config.count > 0 && config.count <= spawns.length) {
            for (let i = 0; i < config.count; i++) {
                this.addBonus(bonus, spawns[i], config.delay)
            }
            return true;
        }

        this.addBonus(bonus, MathUtils.arrayRandom(spawns), config.delay)
        return true;
    }

    public addBonus(bonus: BonusType, position: Vector3d, delay: number = 0) {
        const data = BattleBoxesManager.CONFIG.find(box => box.type === bonus)
        if (data) {
            const spawned = this.boxes.filter(box => box.name === bonus)
            const box = new BonusBox(bonus, spawned.length, position, data.lifeTime * TimeType.SECONDS, this.battle)
            this.boxes.push(box)
            this.battle.taskManager.scheduleTask(() => box.spawn(), delay * TimeType.SECONDS)
        }
    }

    public handleCollectBonus(client: Player, bonus: string) {
        const box = this.boxes.find(box => box.getName() === bonus && !box.collected && box.spawned)
        if (box && box.canCollect(client)) {
            box.handleCollect(client)
        }
    }

    // TODO: VER POSSÍVEL MEMORY LEAK
    public update() {
        for (const box of this.boxes) {
            if (box.spawned && !box.collected && box.getSpawnedTime() > box.lifeTime) {
                box.remove()
            }
        }
    }

}
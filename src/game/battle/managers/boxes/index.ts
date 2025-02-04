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
import { IBonusesData } from "./types";
import { ServerError } from "@/server/utils/error";

export class BattleBoxesManager {

    private readonly data: IBonusesData;

    private spawned: Map<BonusType, number> = new Map()
    private boxes: Map<string, BonusBox> = new Map([])

    public static readonly CONFIG = [
        { type: BonusType.GOLD, spawn: 0 },
        { type: BonusType.CRYSTAL, spawn: 0 },
        { type: BonusType.ARMOR, spawn: 1 },
        { type: BonusType.NITRO, spawn: 1 },
        { type: BonusType.HEALTH, spawn: 3 },
        { type: BonusType.DAMAGE, spawn: 2 }
    ]

    public constructor(
        public readonly battle: Battle
    ) {
        this.data = battle.server.battles.getData('bonuses.json')
        if (!this.data) {
            throw new ServerError('Bonuses data not found')
        }
    }

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
        const setBonusesDataPacket = new SetBonusesDataPacket();
        setBonusesDataPacket.data = this.data;
        client.sendPacket(setBonusesDataPacket);
    }

    public sendSpawnedBoxes(client: Player) {
        const setBattleSpawnedBoxesPacket = new SetBattleSpawnedBoxesPacket()
        setBattleSpawnedBoxesPacket.boxes = Array.from(this.boxes.values())
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
        packet.user = player.getName();
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
            const spawned = (this.spawned.get(bonus) || 0) + 1
            this.spawned.set(bonus, spawned)

            const lifeTime = this.data.bonuses.find(box => box.id === bonus)?.lifeTimeMs || 30000
            const box = new BonusBox(bonus, spawned, position, lifeTime, this.battle)
            this.boxes.set(box.getName(), box)

            this.battle.taskManager.scheduleTask(() => box.spawn(), delay * TimeType.SECONDS)
        }
    }

    public handleCollectBonus(client: Player, bonus: string) {
        const box = this.boxes.get(bonus)
        if (box && box.canCollect(client)) {
            box.handleCollect(client)
        }
    }

    public update() {
        for (const box of this.boxes.values()) {
            if (box.spawned && !box.collected && box.getSpawnedTime() > box.lifeTime) {
                this.boxes.delete(box.getName())
                box.remove()
            }
        }
    }

}
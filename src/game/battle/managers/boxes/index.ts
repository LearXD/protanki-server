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

export class BattleBoxesManager {

    private boxes: BonusBox[] = []

    public static readonly CONFIG = [
        { type: BonusType.GOLD, spawn: 0, alive: 0 },
        { type: BonusType.CRYSTAL, spawn: 0, alive: 0 },
        { type: BonusType.ARMOR, spawn: 1, alive: 0 },
        { type: BonusType.NITRO, spawn: 1, alive: 0 },
        { type: BonusType.HEALTH, spawn: 3, alive: 0 },
        { type: BonusType.DAMAGE, spawn: 2, alive: 0 }
    ]

    public constructor(
        public readonly battle: Battle
    ) { }

    public initTasks() {
        for (const box of BattleBoxesManager.CONFIG) {
            if (box.spawn > 0) {
                this.battle.taskManager.scheduleTask(() => this.spawnBox(box.type), box.spawn * TimeType.MINUTES, true)
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

    public spawnBox(bonus: BonusType, delay: number = 0) {
        const position = this.battle.map.getBonusSpawn(bonus, this.battle.getMode())

        if (position) {
            const spawned = this.boxes.filter(box => box.name === bonus)

            Logger.info(`Spawning ${bonus} box at ${position.x}, ${position.y}, ${position.z}`)
            const box = new BonusBox(bonus, spawned.length, position, this.battle);
            this.boxes.push(box);

            this.battle.taskManager.scheduleTask(() => { box.spawn() }, delay * TimeType.SECONDS)

            return true
        }

        return false;
    }

    public handleCollectBonus(client: Player, bonus: string) {
        const box = this.boxes.find(box => box.getName() === bonus && !box.collected && box.spawned)
        if (box) box.handleCollect(client)
    }

}
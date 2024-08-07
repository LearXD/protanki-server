import { SetGoldBoxAlertPacket } from "@/network/packets/set-gold-box-alert";
import { SetBattleSpawnedBoxesPacket } from "../../../../network/packets/set-battle-spawned-boxes";
import { SetBonusesDataPacket } from "../../../../network/packets/set-bonuses-data";
import { Player } from "../../../player";
import { BonusBox } from "./utils/bonus-box";
import { Battle } from "../..";
import { SetGoldBoxTakenPacket } from "@/network/packets/set-gold-box-taken";
import { BonusType, IMapBonus } from "@/game/map/types";
import { MathUtils } from "@/utils/math";
import { Vector3d } from "@/utils/vector-3d";
import { TimeType } from "../task/types";

export class BattleBoxesManager {

    private boxes: BonusBox[] = []
    public static readonly availableBonuses = [BonusType.GOLD, BonusType.CRYSTAL, BonusType.ARMOR, BonusType.NITRO, BonusType.HEALTH, BonusType.DAMAGE]

    public constructor(
        public readonly battle: Battle
    ) { }

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

    public addBox(box: BonusBox) {
        this.boxes.push(box)
    }

    public spawnBox(bonus: BonusType, delay: number = 0) {

        const positions = this.battle.getMap().getBonuses()
            .filter(b => b.types.includes(bonus) && b.modes.includes(this.battle.getMode()))

        if (positions.length < 1) {
            return false
        }

        const area = MathUtils.arrayRandom<IMapBonus>(positions)
        const found = this.boxes.filter(box => box.name === bonus)

        if (!found) {
            return false
        }

        const box = new BonusBox(bonus, found.length, Vector3d.fromInterface(area.position, false), this.battle);
        this.boxes.push(box);

        this.battle.taskManager.scheduleTask(() => { box.spawn() }, delay, TimeType.SECONDS)
        return true
    }

    public handleCollectBonus(client: Player, bonus: string) {
        const box = this.boxes.find(box => box.getName() === bonus && !box.collected && box.spawned)

        if (box) {
            box.handleCollect(client)
        }
    }
}
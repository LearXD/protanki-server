import { Packet } from "@/network/packets/packet";
import { Player } from "../..";
import { SendBuyChangeDailyQuestPacket } from "../../../../network/packets/send-buy-change-daily-quest";
import { SendChangeDailyQuestPacket } from "../../../../network/packets/send-change-daily-quest";
import { SendOpenDailyQuestsPacket } from "../../../../network/packets/send-open-daily-quests";
import { SendRedeemDailyQuestPacket } from "../../../../network/packets/send-redeem-daily-quest";
import { SetChangeDailyQuestPacket } from "../../../../network/packets/set-change-daily-quest";
import { IQuest, SetDailyQuestsPacket } from "../../../../network/packets/set-daily-quests";
import { SetRemoveDailyQuestPacket } from "../../../../network/packets/set-remove-daily-quest";
import { SetWeeklyQuestRewardPacket } from "../../../../network/packets/set-weekly-quest-reward";

export class PlayerDailyQuestsManager {

    private readonly dailyQuests: IQuest[] = [
        {
            freeChange: true,
            description: 'Ganhe pontuação de batalha nas batalhas',
            maxProgress: 500,
            image: 123339,
            prizes: [
                { count: 1, name: 'Kit de Reparação' },
                { count: 5, name: 'Destruição Dupla' }
            ],
            progress: 500,
            questId: 83786,
            changePrice: 280
        },
        {
            freeChange: true,
            description: 'Ganhe cristais em batalhas',
            maxProgress: 350,
            image: 412322,
            prizes: [
                { count: 5, name: 'Destruição Dupla' },
                { count: 6, name: 'Blindagem Dupla' }
            ],
            progress: 0,
            questId: 83911,
            changePrice: 280
        },
        {
            freeChange: true,
            description: 'Pegue uma Caixa de ouro',
            maxProgress: 1,
            image: 234523,
            prizes: [{ count: 1650, name: 'Cristais' }],
            progress: 0,
            questId: 83571,
            changePrice: 280
        }
    ];

    public constructor(
        private readonly player: Player
    ) { }

    public redeemDailyQuest(questId: number) {
        // TODO: Implement this
        this.sendWeeklyQuestReward();
        this.sendRemoveDailyQuest(questId);
    }

    public changeDailyQuest(questId: number) {
        const setChangeDailyQuestPacket = new SetChangeDailyQuestPacket();
        setChangeDailyQuestPacket.questId = questId;
        setChangeDailyQuestPacket.dailyQuest = {
            freeChange: false,
            description: 'Ganhe pontuação de batalha nas batalhas',
            maxProgress: 500,
            image: 123339,
            prizes: [{ count: 1, name: 'Conta premium (h)' }],
            progress: 0,
            questId: questId,
            changePrice: 280
        }
        this.player.sendPacket(setChangeDailyQuestPacket);
    }

    public sendOpenDailyQuests() {
        const setDailyQuestsPacket = new SetDailyQuestsPacket();
        setDailyQuestsPacket.quests = this.dailyQuests;
        setDailyQuestsPacket.weeklyQuestDescription = {
            level: 0,
            progress: 0,
            canIncreaseProgressToday: false,
            leftIcon: 123341,
            rightIcon: 123345
        }
        this.player.sendPacket(setDailyQuestsPacket);
    }

    public sendRemoveDailyQuest(questId: number) {
        const setRemoveDailyQuestPacket = new SetRemoveDailyQuestPacket()
        setRemoveDailyQuestPacket.questId = questId;
        this.player.sendPacket(setRemoveDailyQuestPacket);
    }

    public sendWeeklyQuestReward() {
        const setWeeklyQuestRewardPacket = new SetWeeklyQuestRewardPacket();
        setWeeklyQuestRewardPacket.rewards = [
            { count: 770, image: 580106 },
            { count: 6, image: 716565 },
            { count: 16, image: 824172 },
            { count: 16, image: 71622 },
            { count: 16, image: 153186 },
            { count: 16, image: 504645 }
        ]
        this.player.sendPacket(setWeeklyQuestRewardPacket);
    }

    public handlePacket(packet: Packet) {
        if (packet instanceof SendOpenDailyQuestsPacket) {
            this.sendOpenDailyQuests();
            return true;
        }
        if (packet instanceof SendChangeDailyQuestPacket) {
            this.changeDailyQuest(packet.questId);
            return true;
        }
        if (packet instanceof SendRedeemDailyQuestPacket) {
            this.redeemDailyQuest(packet.questId);
            return true;
        }
        if (packet instanceof SendBuyChangeDailyQuestPacket) {
            this.changeDailyQuest(packet.questId);
            return true;
        }
        return false;
    }
}
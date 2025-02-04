import { Team, TeamType } from "@/states/team";
import { Player } from "../..";
import { SendBattleMessagePacket } from "../../../../network/packets/send-battle-message";
import { SendCreateBattlePacket } from "../../../../network/packets/send-create-battle";
import { SendJoinOnBattlePacket } from "../../../../network/packets/send-join-on-battle";
import { SendOpenBattlePacket } from "../../../../network/packets/send-open-battle";
import { SendOpenBattlesListPacket } from "../../../../network/packets/send-open-battles-list";
import { SendSpectateBattlePacket } from "../../../../network/packets/send-spectate-battle";
import { SetBattleInviteCCPacket } from "../../../../network/packets/set-battle-invite-cc";
import { SetBattleListPacket } from "../../../../network/packets/set-battle-list";
import { SetBattleNotFoundPacket } from "../../../../network/packets/set-battle-not-found";
import { SetRemoveBattlesScreenPacket } from "../../../../network/packets/set-remove-battles-screen";
import { SetViewingBattlePacket } from "../../../../network/packets/set-viewing-battle";
import { BattleModeType } from "../../../../states/battle-mode";
import { EquipmentConstraintsModeType } from "../../../../states/equipment-constraints-mode";
import { LayoutState } from "../../../../states/layout-state";
import { ThemeType } from "../../../../states/theme";
import { Logger } from "../../../../utils/logger";
import { Packet } from "@/network/packets/packet";
import { SendCheckBattleNamePacket } from "@/network/packets/send-check-battle-name";
import { SetBattleNamePacket } from "@/network/packets/set-battle-name";
import { BattleUtils } from "@/game/battle/utils/battle";

export class PlayerBattlesManager {
    public constructor(
        private readonly player: Player
    ) { }

    public sendBattleSelectScreen() {
        this.player.chat.sendChat();
        this.sendBattles();
    }

    public sendRemoveBattlesScreen() {
        const setRemoveBattlesScreenPacket = new SetRemoveBattlesScreenPacket();
        this.player.sendPacket(setRemoveBattlesScreenPacket);
    }

    public sendBattles() {
        this.player.server.maps.sendMapsData(this.player);

        const setBattleListPacket = new SetBattleListPacket();
        setBattleListPacket.battles = this.player.server.battles.battles
            .map(battle => BattleUtils.toBattleListItem(battle));

        this.player.sendPacket(setBattleListPacket);

        if (this.player.viewingBattle) {
            this.player.viewingBattle.viewersManager.addViewer(this.player);
        }
    }

    public sendBattleInviteSound() {
        const setBattleInviteCCPacket = new SetBattleInviteCCPacket();
        setBattleInviteCCPacket.resourceId = 106777
        this.player.sendPacket(setBattleInviteCCPacket);
    }

    public sendBattlesList() {
        this.player.setLayoutState(LayoutState.BATTLE_SELECT)
        this.sendBattles();
        this.player.setSubLayoutState(LayoutState.BATTLE_SELECT)
    }

    public handleJoinBattle(team: TeamType) {
        const battle = this.player.viewingBattle;
        if (battle) {
            battle.onPlayerJoin(this.player, team);
        }
    }

    public handleSpectateBattle() {
        const battle = this.player.viewingBattle;
        if (battle) {
            battle.onPlayerJoin(this.player, Team.SPECTATOR);
        }
    }

    public handleViewBattle(battleId: string) {
        const battle = this.player.server.battles.getBattle(battleId);

        if (!battle) {
            const setBattleNotExistPacket = new SetBattleNotFoundPacket()
            setBattleNotExistPacket.battleId = battleId;
            this.player.sendPacket(setBattleNotExistPacket);
            return;
        }

        Logger.info(`Player ${this.player.getName()} is viewing battle ${battleId}`)
        battle.viewersManager.addViewer(this.player);
    }

    public handleCreateBattle(packet: SendCreateBattlePacket) {
        const battle = this.player.server.battles.createBattle(
            packet.name,
            packet.mapId,
            {
                autoBalance: packet.autoBalance,
                battleMode: packet.battleMode as BattleModeType,
                equipmentConstraintsMode: packet.equipmentConstraintsMode as EquipmentConstraintsModeType,
                friendlyFire: packet.friendlyFire,
                scoreLimit: packet.scoreLimit,
                timeLimitInSec: packet.timeLimitInSec,
                maxPeopleCount: packet.maxPeopleCount,
                parkourMode: packet.parkourMode,
                privateBattle: packet.privateBattle,
                proBattle: packet.proBattle,
                rankRange: packet.rankRange,
                reArmorEnabled: packet.reArmorEnabled,
                theme: packet.theme as ThemeType,
                withoutBonuses: packet.withoutBonuses,
                withoutCrystals: packet.withoutCrystals,
                withoutSupplies: packet.withoutSupplies
            },
            this.player.getName()
        );


        battle.viewersManager.addViewer(this.player);
    }

    public handleOpenBattleList() {
        if (this.player.battle) {
            if (this.player.layoutState === LayoutState.BATTLE) {
                this.sendBattlesList();
                return true;
            }

            if (this.player.layoutState === LayoutState.BATTLE_SELECT) {
                this.sendRemoveBattlesScreen();
                this.player.setLayoutState(LayoutState.BATTLE);
                this.player.setSubLayoutState(LayoutState.BATTLE);
                return true;
            }

            if (this.player.layoutState === LayoutState.GARAGE) {
                this.player.garage.removeGarageScreen();
                this.sendBattlesList();
                return true;
            }

            return true;
        }

        this.sendBattlesList();
    }

    public handlePacket(packet: Packet) {

        if (packet instanceof SendJoinOnBattlePacket) {
            this.handleJoinBattle(packet.team);
        }

        if (packet instanceof SendSpectateBattlePacket) {
            this.handleSpectateBattle()
        }

        if (packet instanceof SendCreateBattlePacket) {
            this.handleCreateBattle(packet)
        }

        if (packet instanceof SetViewingBattlePacket) {
            this.handleViewBattle(packet.battleId.trim())
        }

        if (packet instanceof SendOpenBattlePacket) {
            this.handleViewBattle(packet.battleId);
        }

        if (packet instanceof SendOpenBattlesListPacket) {
            this.handleOpenBattleList()
        }

        if (packet instanceof SendCheckBattleNamePacket) {
            const pk = new SetBattleNamePacket();
            pk.battleName = packet.battleName;
            this.player.sendPacket(pk);
        }

        if (this.player.battle) {
            if (packet instanceof SendBattleMessagePacket) {
                this.player.battle.chatManager.handleSendMessage(this.player, packet.message, packet.private);
            }
        }

    }
}
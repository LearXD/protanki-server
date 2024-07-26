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
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { BattleModeType } from "../../../../utils/game/battle-mode";
import { EquipmentConstraintsModeType } from "../../../../utils/game/equipment-constraints-mode";
import { LayoutState } from "../../../../utils/game/layout-state";
import { ThemeType } from "../../../../utils/game/theme";
import { Logger } from "../../../../utils/logger";

export class PlayerBattlesManager {
    public constructor(
        private readonly player: Player
    ) { }

    public sendBattleSelectScreen() {
        this.player.getChatManager().sendChat();
        this.sendBattles();
    }

    public sendRemoveBattlesScreen() {
        const setRemoveBattlesScreenPacket = new SetRemoveBattlesScreenPacket();
        this.player.sendPacket(setRemoveBattlesScreenPacket);
    }

    public sendBattles() {
        this.player.getServer().getMapsManager().sendMapsData(this.player);

        const setBattleListPacket = new SetBattleListPacket();
        setBattleListPacket.battles = this.player.getServer().getBattlesManager().getBattles()
            .map(battle => battle.toBattleListItem());
        this.player.sendPacket(setBattleListPacket);

        if (this.player.getViewingBattle()) {
            this.player.getViewingBattle().getViewersManager().addViewer(this.player);
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

    public handleJoinBattle(team: string) {
        const battle = this.player.getViewingBattle();
        if (battle) {
            battle.handlePlayerJoin(this.player);
        }
    }

    public handleSpectateBattle() {
        const battle = this.player.getViewingBattle();
        if (battle) {
            battle.handlePlayerJoin(this.player, true);
        }
    }

    public handleOpenBattlesList() {

    }

    public handleViewBattle(battleId: string) {
        const battle = this.player.getServer().getBattlesManager().getBattle(battleId);

        if (!battle) {
            const setBattleNotExistPacket = new SetBattleNotFoundPacket()
            setBattleNotExistPacket.battleId = battleId;
            this.player.sendPacket(setBattleNotExistPacket);
            return;
        }

        Logger.info(`Player ${this.player.getUsername()} is viewing battle ${battleId}`)
        battle.getViewersManager().addViewer(this.player);
    }

    public handleCreateBattle(packet: SendCreateBattlePacket) {
        const battle = this.player.getServer().getBattlesManager().createBattle(
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
            }
        );


        battle.getViewersManager().addViewer(this.player);
    }

    public handleOpenBattleList() {
        if (this.player.isInBattle()) {
            if (this.player.getLayoutState() === LayoutState.BATTLE) {
                this.sendBattlesList();
                return true;
            }

            if (this.player.getLayoutState() === LayoutState.BATTLE_SELECT) {
                this.sendRemoveBattlesScreen();
                this.player.setLayoutState(LayoutState.BATTLE);
                this.player.setSubLayoutState(LayoutState.BATTLE);
                return true;
            }

            if (this.player.getLayoutState() === LayoutState.GARAGE) {
                this.player.getGarageManager().removeGarageScreen();
                this.sendBattlesList();
                return true;
            }

            return true;
        }

        this.sendBattlesList();
    }

    public handlePacket(packet: SimplePacket) {

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

        if (this.player.isInBattle()) {
            if (packet instanceof SendBattleMessagePacket) {
                this.player.getBattle().getChatManager().handleSendMessage(this.player, packet.message, packet.team);
            }
        }

    }
}
import { Player } from "../..";
import { SendCreateBattlePacket } from "../../../../network/packets/send-create-battle";
import { SendJoinOnBattlePacket } from "../../../../network/packets/send-join-on-battle";
import { SendOpenBattlesListPacket } from "../../../../network/packets/send-open-battles-list";
import { SendOpenLinkPacket } from "../../../../network/packets/send-open-link";
import { SetBattleInviteCCPacket } from "../../../../network/packets/set-battle-invite-cc";
import { SetBattleListPacket } from "../../../../network/packets/set-battle-list";
import { SetBattleNotExistPacket } from "../../../../network/packets/set-battle-not-exist";
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

    public handleJoinBattle(team: string) {
        const battle = this.player.getViewingBattle();
        if (battle) {
            battle.handleClientJoin(this.player);
        }
    }

    public handleOpenBattlesList() {
        this.player.setLayoutState(LayoutState.BATTLE_SELECT)
        this.sendBattles();
        this.player.setSubLayoutState(LayoutState.BATTLE_SELECT)
    }

    public handleViewBattle(battleId: string) {
        const battle = this.player.getServer().getBattlesManager().getBattle(battleId);

        if (!battle) {
            const setBattleNotExistPacket = new SetBattleNotExistPacket()
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

    public handlePacket(packet: SimplePacket) {

        if (packet instanceof SendJoinOnBattlePacket) {
            this.handleJoinBattle(packet.team);
        }

        if (packet instanceof SendCreateBattlePacket) {
            this.handleCreateBattle(packet)
            return true;
        }

        if (packet instanceof SetViewingBattlePacket) {
            this.handleViewBattle(packet.battleId.trim())
            return true;
        }

        if (packet instanceof SendOpenLinkPacket) {
            this.handleViewBattle(packet.battleId);
            return true;
        }

        if (packet instanceof SendOpenBattlesListPacket) {
            if (this.player.isInBattle()) {
                if (this.player.getLayoutState() === LayoutState.BATTLE) {
                    this.handleOpenBattlesList()
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
                    this.handleOpenBattlesList()
                    return true;
                }

                return true;
            }

            this.handleOpenBattlesList();
            return true;
        }

        return false;
    }
}
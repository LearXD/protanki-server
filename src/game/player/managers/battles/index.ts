import { Player } from "../..";
import { SendCreateBattlePacket } from "../../../../network/packets/send-create-battle";
import { SendJoinOnBattlePacket } from "../../../../network/packets/send-join-on-battle";
import { SendOpenBattlesListPacket } from "../../../../network/packets/send-open-battles-list";
import { SendOpenLinkPacket } from "../../../../network/packets/send-open-link";
import { SetRemoveBattleScreenPacket } from "../../../../network/packets/set-remove-battle-screen";
import { SetRemoveBattlesScreenPacket } from "../../../../network/packets/set-remove-battles-screen";
import { SetViewingBattlePacket } from "../../../../network/packets/set-viewing-battle";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { LayoutState } from "../../../../utils/game/layout-state";

export class PlayerBattlesManager {
    public constructor(
        private readonly player: Player
    ) { }

    public sendRemoveBattlesScreen() {
        // const setRemoveBattleScreenPacket = new SetRemoveBattleScreenPacket();
        // this.player.sendPacket(setRemoveBattleScreenPacket);

        const setRemoveBattlesScreenPacket = new SetRemoveBattlesScreenPacket();
        this.player.sendPacket(setRemoveBattlesScreenPacket);
    }

    public handlePacket(packet: SimplePacket) {

        if (packet instanceof SendJoinOnBattlePacket) {
            this.player.getServer().getBattlesManager().handleJoinBattle(this.player, packet.team);
        }

        if (packet instanceof SendCreateBattlePacket) {
            this.player.getServer().getBattlesManager().handleCreateBattle(this.player, packet)
            return true;
        }

        if (packet instanceof SetViewingBattlePacket) {
            this.player.getServer().getBattlesManager().handleViewBattle(this.player, packet.battleId.trim())
            return true;
        }

        if (packet instanceof SendOpenBattlesListPacket) {
            if (this.player.isInBattle()) {
                if (this.player.getLayoutState() === LayoutState.BATTLE) {
                    this.player.getServer().getBattlesManager().handleOpenBattlesList(this.player)
                    return true;
                }

                if (this.player.getLayoutState() === LayoutState.BATTLE_SELECT) {
                    this.sendRemoveBattlesScreen();
                    this.player.setLayoutState(LayoutState.BATTLE);
                    this.player.setSubLayoutState(LayoutState.BATTLE, LayoutState.BATTLE);
                    return true;
                }
                return true;
            }
            this.player.getServer().getBattlesManager().handleOpenBattlesList(this.player);
            return true;
        }

        if (packet instanceof SendOpenLinkPacket) {
            this.player.getServer().getBattlesManager().handleViewBattle(this.player, packet.battleId);
            return true;
        }

        return false;
    }
}
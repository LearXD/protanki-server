import { Team } from "@/states/team";
import { Battle } from "../..";
import { SetRemoveViewingBattlePacket } from "../../../../network/packets/set-remove-viewing-battle";
import { SetViewingBattlePacket } from "../../../../network/packets/set-viewing-battle";
import { SetViewingBattleDataPacket } from "../../../../network/packets/set-viewing-battle-data";
import { Player } from "../../../player";
import { BattleTeamModeManager } from "../mode/modes/team/team";
import { BattleDeathMatchModeManager } from "../mode/modes/death-match";
import { Packet } from "@/network/packets/packet";

export class BattleViewersManager {

    public readonly viewers: Map<string, Player> = new Map()

    public constructor(
        private readonly battle: Battle
    ) { }

    public hasViewer(username: string) {
        return this.viewers.has(username);
    }

    public getViewer(username: string) {
        return this.viewers.get(username);
    }

    public addViewer(client: Player) {
        if (client.viewingBattle) {
            client.viewingBattle.viewersManager.removeViewer(client);
        }

        const setViewingBattlePacket = new SetViewingBattlePacket();
        setViewingBattlePacket.battleId = this.battle.battleId;
        client.sendPacket(setViewingBattlePacket);

        client.viewingBattle = this.battle;
        this.viewers.set(client.getName(), client);

        this.sendViewingBattleData(client);
    }

    public removeViewer(viewer: Player) {
        if (this.hasViewer(viewer.getName())) {
            this.viewers.delete(viewer.getName());

            const setRemoveViewingBattlePacket = new SetRemoveViewingBattlePacket();
            setRemoveViewingBattlePacket.battleId = this.battle.battleId;
            viewer.sendPacket(setRemoveViewingBattlePacket);
            viewer.viewingBattle = null;
        }
    }

    public removeAllViewers() {
        for (const viewer of this.viewers.values()) {
            this.removeViewer(viewer);
        }
    }

    public sendViewingBattleData(player: Player) {
        const packet = new SetViewingBattleDataPacket();
        packet.data = {
            battleMode: this.battle.getMode(),
            itemId: this.battle.battleId,
            scoreLimit: this.battle.getScoreLimit(),
            timeLimitInSec: this.battle.getTimeLimitInSec(),
            preview: this.battle.map.getPreview(),
            maxPeopleCount: this.battle.getMaxPeopleCount(),
            name: this.battle.name,
            proBattle: this.battle.isProBattle(),
            minRank: this.battle.getRankRange().min,
            maxRank: this.battle.getRankRange().max,
            roundStarted: this.battle.running,
            spectator: player.data.isAdmin(),
            withoutBonuses: this.battle.isWithoutBonuses(),
            withoutCrystals: this.battle.isWithoutCrystals(),
            withoutSupplies: this.battle.isWithoutSupplies(),
            proBattleEnterPrice: 150,
            timeLeftInSec: this.battle.getTimeLeft(),
            userPaidNoSuppliesBattle: this.battle.isWithoutSupplies(),
            proBattleTimeLeftInSec: -1,
            parkourMode: this.battle.isParkourMode(),
            equipmentConstraintsMode: this.battle.getEquipmentConstraintsMode(),
            reArmorEnabled: this.battle.isReArmorEnabled(),
        }

        const manager = this.battle.modeManager;
        if (manager instanceof BattleDeathMatchModeManager) {
            packet.data.users = this.battle.playersManager.getPlayers().map(player => ({
                kills: player.tank.kills,
                score: player.tank.score,
                suspicious: false,
                user: player.getName(),
            }));
        }

        if (manager instanceof BattleTeamModeManager) {
            packet.data.autoBalance = this.battle.haveAutoBalance();
            packet.data.friendlyFire = this.battle.isFriendlyFire();

            packet.data.scoreRed = manager.points.get(Team.RED);
            packet.data.scoreBlue = manager.points.get(Team.BLUE);

            packet.data.usersRed = this.battle.playersManager.getPlayers()
                .filter(player => player.tank.team === Team.RED)
                .map(player => ({
                    kills: player.tank.kills,
                    score: player.tank.score,
                    suspicious: false,
                    user: player.getName(),
                }));

            packet.data.usersBlue = this.battle.playersManager.getPlayers()
                .filter(player => player.tank.team === Team.BLUE)
                .map(player => ({
                    kills: player.tank.kills,
                    score: player.tank.score,
                    suspicious: false,
                    user: player.getName(),
                }));
        }

        player.sendPacket(packet);
    }

    public broadcastPacket(packet: Packet) {
        for (const viewer of this.viewers.values()) {
            viewer.sendPacket(packet);
        }
    }

}
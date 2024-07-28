import { Battle } from "../..";
import { SetRemoveViewingBattlePacket } from "../../../../network/packets/set-remove-viewing-battle";
import { SetViewingBattlePacket } from "../../../../network/packets/set-viewing-battle";
import { SetViewingBattleDataPacket } from "../../../../network/packets/set-viewing-battle-data";
import { BattleMode } from "../../../../states/battle-mode";
import { Player } from "../../../player";

export class BattleViewersManager {

    private viewers: Map<string, Player> = new Map();

    public constructor(
        private readonly battle: Battle
    ) { }

    public getViewers() { return this.viewers }
    public clearViewer() { this.getViewers().clear() }

    public hasViewer(username: string) {
        return this.getViewers().has(username);
    }

    public getViewer(username: string) {
        return this.getViewers().get(username);
    }

    public addViewer(client: Player) {
        const viewing = client.getViewingBattle();
        if (viewing) {
            viewing.getViewersManager().removeViewer(client);
        }

        const setViewingBattlePacket = new SetViewingBattlePacket();
        setViewingBattlePacket.battleId = this.battle.getBattleId();
        client.sendPacket(setViewingBattlePacket);

        client.setViewingBattle(this.battle);
        this.viewers.set(client.getUsername(), client);

        this.sendViewingBattleData(client);
    }

    public removeViewer(viewer: Player) {
        if (this.hasViewer(viewer.getUsername())) {
            this.viewers.delete(viewer.getUsername());

            const setRemoveViewingBattlePacket = new SetRemoveViewingBattlePacket();
            setRemoveViewingBattlePacket.battleId = this.battle.getBattleId();
            viewer.sendPacket(setRemoveViewingBattlePacket);
            viewer.setViewingBattle(null);
        }
    }

    public removeAllViewers() {
        for (const viewer of this.viewers.values()) {
            this.removeViewer(viewer);
        }
    }

    public sendViewingBattleData(client: Player) {
        const packet = new SetViewingBattleDataPacket();
        packet.data = {
            battleMode: this.battle.getMode(),
            itemId: this.battle.getBattleId(),
            scoreLimit: this.battle.getScoreLimit(),
            timeLimitInSec: this.battle.getTimeLimitInSec(),
            preview: this.battle.getMap().preview,
            maxPeopleCount: this.battle.getMaxPeopleCount(),
            name: this.battle.getName(),
            proBattle: this.battle.isProBattle(),
            minRank: this.battle.getRankRange().min,
            maxRank: this.battle.getRankRange().max,
            roundStarted: this.battle.isRunning(),
            spectator: true,
            withoutBonuses: this.battle.isWithoutBonuses(),
            withoutCrystals: this.battle.isWithoutCrystals(),
            withoutSupplies: this.battle.isWithoutSupplies(),
            proBattleEnterPrice: 150,
            timeLeftInSec: this.battle.getTimeLeft(),
            // TODO: with supplies?
            userPaidNoSuppliesBattle: this.battle.isWithoutSupplies(),
            proBattleTimeLeftInSec: -1,
            parkourMode: this.battle.isParkourMode(),
            equipmentConstraintsMode: this.battle.getEquipmentConstraintsMode(),
            reArmorEnabled: this.battle.isReArmorEnabled(),
            // TODO: get team users
            // usersBlue: this.battle.getMode() === BattleMode.DM ? [] : [],
            // usersRed: this.battle.getMode() === BattleMode.DM ? [] : [],
            // scoreRed: this.battle.getMode() === BattleMode.DM ? 0 : 0,
            // scoreBlue: this.battle.getMode() === BattleMode.DM ? 0 : 0,
            // autoBalance: this.battle.haveAutoBalance(),
            // friendlyFire: this.battle.isFriendlyFire(),
        }

        if (this.battle.getMode() === BattleMode.DM) {
            packet.data.users = this.battle.getPlayersManager().getPlayers().map(player => ({
                kills: this.battle.getStatisticsManager().getPlayerKills(player.getUsername()),
                score: this.battle.getStatisticsManager().getPlayerScore(player.getUsername()),
                suspicious: false,
                user: player.getUsername(),
            }));
        }

        client.sendPacket(packet);
    }
}
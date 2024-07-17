import { Battle } from "../..";
import { SetRemoveViewingBattlePacket } from "../../../../network/packets/set-remove-viewing-battle";
import { SetViewingBattlePacket } from "../../../../network/packets/set-viewing-battle";
import { SetViewingBattleDataPacket } from "../../../../network/packets/set-viewing-battle-data";
import { BattleMode } from "../../../../utils/game/battle-mode";
import { ByteArray } from "../../../../utils/network/byte-array";
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
        // if (!this.hasViewer(client.getUsername())) {

        // this.viewers.set(client.getUsername(), client);
        const viewing = client.getViewingBattle();
        if (viewing) {
            viewing.getViewersManager().removeViewer(client);
        }

        const setViewingBattlePacket = new SetViewingBattlePacket(new ByteArray());
        setViewingBattlePacket.battleId = this.battle.getBattleId();
        client.sendPacket(setViewingBattlePacket);

        client.setViewingBattle(this.battle);
        this.sendViewingBattleData(client);

        this.getViewers().set(client.getUsername(), client);
        return true;
        // }
        // return false;
    }

    public removeViewer(viewer: Player) {
        // if (this.hasViewer(username)) {
        // this.getViewers().delete(viewer.getUsername());
        const setRemoveViewingBattlePacket = new SetRemoveViewingBattlePacket(new ByteArray());
        setRemoveViewingBattlePacket.battleId = this.battle.getBattleId();
        viewer.sendPacket(setRemoveViewingBattlePacket);
        viewer.setViewingBattle(null);
        return true;
        // }
        // return false;
    }

    public sendViewingBattleData(client: Player) {
        const setViewingBattleDataPacket = new SetViewingBattleDataPacket(new ByteArray());
        setViewingBattleDataPacket.data = {
            battleMode: this.battle.getMode(),
            itemId: this.battle.getBattleId(),
            scoreLimit: this.battle.getData().scoreLimit,
            timeLimitInSec: this.battle.getData().timeLimitInSec,
            preview: this.battle.getMap().preview,
            maxPeopleCount: this.battle.getData().maxPeopleCount,
            name: this.battle.getName(),
            proBattle: this.battle.getData().proBattle,
            minRank: this.battle.getData().rankRange.min,
            maxRank: this.battle.getData().rankRange.max,
            roundStarted: this.battle.isStarted(),
            spectator: true,
            // TODO: Implement this
            withoutBonuses: this.battle.getData().withoutBonuses,
            withoutCrystals: this.battle.getData().withoutCrystals,
            withoutSupplies: this.battle.getData().withoutSupplies,
            proBattleEnterPrice: 150,
            timeLeftInSec: this.battle.getTimeLeft(),
            // TODO: with supplies?
            userPaidNoSuppliesBattle: this.battle.getData().withoutSupplies,
            proBattleTimeLeftInSec: -1,
            parkourMode: this.battle.getData().parkourMode,
            equipmentConstraintsMode: this.battle.getData().equipmentConstraintsMode,
            reArmorEnabled: this.battle.getData().reArmorEnabled,
            // TODO: get team users
            usersBlue: this.battle.getMode() === BattleMode.DM ? [] : [],
            usersRed: this.battle.getMode() === BattleMode.DM ? [] : [],
            scoreRed: this.battle.getMode() === BattleMode.DM ? 0 : 0,
            scoreBlue: this.battle.getMode() === BattleMode.DM ? 0 : 0,
            autoBalance: this.battle.getData().autoBalance,
            friendlyFire: this.battle.getData().friendlyFire,
        }

        client.sendPacket(setViewingBattleDataPacket);
    }
}
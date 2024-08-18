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
        const viewing = client.getViewingBattle();
        if (viewing) {
            viewing.viewersManager.removeViewer(client);
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
            preview: this.battle.map.getPreview(),
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
        }

        const modeManager = this.battle.modeManager;
        if (modeManager instanceof BattleDeathMatchModeManager) {
            packet.data.users = this.battle.playersManager.getPlayers().map(player => ({
                kills: player.tank.kills,
                score: player.tank.score,
                suspicious: false,
                user: player.getUsername(),
            }));
        }

        if (modeManager instanceof BattleTeamModeManager) {
            packet.data.autoBalance = this.battle.haveAutoBalance();
            packet.data.friendlyFire = this.battle.isFriendlyFire();

            packet.data.scoreRed = modeManager.redPoints;
            packet.data.scoreBlue = modeManager.bluePoints;

            packet.data.usersRed = this.battle.playersManager.getPlayers()
                .filter(player => player.tank.team === Team.RED)
                .map(player => ({
                    kills: player.tank.kills,
                    score: player.tank.score,
                    suspicious: false,
                    user: player.getUsername(),
                }));

            packet.data.usersBlue = this.battle.playersManager.getPlayers()
                .filter(player => player.tank.team === Team.BLUE)
                .map(player => ({
                    kills: player.tank.kills,
                    score: player.tank.score,
                    suspicious: false,
                    user: player.getUsername(),
                }));
        }

        client.sendPacket(packet);
    }

    public broadcastPacket(packet: Packet) {
        for (const viewer of this.viewers.values()) {
            viewer.sendPacket(packet);
        }
    }

}
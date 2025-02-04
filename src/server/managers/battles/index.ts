import path from "path";

import { Battle } from "@/game/battle";
import { IBattleData } from "@/game/battle/types";
import { Logger } from "@/utils/logger";
import { SetAddBattleOnListPacket } from "@/network/packets/set-add-battle-on-list";
import { LayoutState } from "@/states/layout-state";
import { SetRemoveBattleFromListPacket } from "@/network/packets/set-remove-battle-from-list";
import { ServerError } from "@/server/utils/error";
import { Packet } from "@/network/packets/packet";
import { Server } from "@/server";
import { BattleUtils } from "@/game/battle/utils/battle";

export class BattlesManager {

    public battles: Battle[] = [];

    public constructor(
        public readonly server: Server
    ) { }

    public getData(_path: string) {
        return this.server.assets.getData(path.join('battle', _path))
    }

    public getBattleById(battleId: string) {
        return this.battles.find(battle => battle.battleId === battleId)
    }

    public createBattle(
        name: string,
        mapName: string,
        config?: IBattleData,
        owner?: string
    ) {
        const map = this.server.maps.findMap(mapName, config?.theme)

        if (!map) {
            throw new ServerError(`Map ${mapName} has not configured correctly`)
        }

        const battle = new Battle(name, map, config, this.server, owner);
        this.addBattle(battle);

        Logger.debug(`Created battle ${battle.battleId} with name ${name} and map ${mapName}`)
        return battle;
    }

    public addBattle(battle: Battle) {
        this.battles.push(battle);

        const packet = new SetAddBattleOnListPacket();
        packet.data = BattleUtils.toBattleListItem(battle);

        if (battle.isPrivateBattle()) {
            if (battle.owner) {
                const owner = this.server.players.getPlayer(battle.owner)
                if (owner) {
                    owner.sendPacket(packet)
                }
            }
            return;
        }

        this.broadcastPacket(packet);
    }

    public removeBattle(battle: Battle) {

        battle.viewersManager.removeAllViewers()
        this.battles = this.battles.filter(b => b.battleId !== battle.battleId)

        const packet = new SetRemoveBattleFromListPacket();
        packet.battle = battle.battleId;

        this.broadcastPacket(packet);
    }

    public getBattle(battleId: string) {
        return this.battles.find(battle => battle.battleId == battleId)
    }

    public broadcastPacket(packet: Packet) {
        this.getPlayers().forEach(player => player.sendPacket(packet))
    }

    public getPlayers() {
        return this.server.players
            .getPlayersOnState(LayoutState.BATTLE_SELECT)
    }
}
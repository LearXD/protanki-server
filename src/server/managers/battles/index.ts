import path from "path";

import { Server } from "@/server";
import { Battle } from "@/game/battle";
import { IBattleData } from "@/game/battle/types";
import { Logger } from "@/utils/logger";
import { SetAddBattleOnListPacket } from "@/network/packets/set-add-battle-on-list";
import { LayoutState } from "@/states/layout-state";
import { SetRemoveBattleFromListPacket } from "@/network/packets/set-remove-battle-from-list";
import { BattleMode } from "@/states/battle-mode";
import { EquipmentConstraintsMode } from "@/states/equipment-constraints-mode";
import { Rank } from "@/states/rank";
import { ServerError } from "@/server/utils/error";
import { Packet } from "@/network/packets/packet";

export class BattlesManager {

    private battles: Battle[] = [];

    public getBattles() { return this.battles }

    constructor(
        private readonly server: Server
    ) {
        this.createBattle('For Newbies', 'map_sandbox')
        this.createBattle('For Newbies 2', 'map_sandbox', {
            autoBalance: false,
            battleMode: BattleMode.CTF,
            equipmentConstraintsMode: EquipmentConstraintsMode.NONE,
            friendlyFire: false,
            scoreLimit: 1,
            timeLimitInSec: 60 * 10,
            maxPeopleCount: 2,
            parkourMode: false,
            privateBattle: false,
            proBattle: false,
            rankRange: {
                max: Rank.GENERALISSIMO,
                min: Rank.RECRUIT
            },
            reArmorEnabled: true,
            withoutBonuses: true,
            withoutCrystals: false,
            withoutSupplies: false
        })
    }

    public getData(_path: string) {
        return this.server.assetsManager.getData(path.join('battle', _path))
    }

    public createBattle(
        name: string,
        mapName: string,
        config?: IBattleData
    ) {
        const map = this.server.mapsManager.findMap(mapName, config?.theme)

        if (!map) {
            throw new ServerError(`Map ${mapName} has not configured correctly`)
        }

        const battle = new Battle(this.server, name, map, config);

        this.addBattle(battle);
        Logger.debug(`Created battle ${battle.getBattleId()} with name ${name} and map ${mapName}`)

        return battle;
    }

    public addBattle(battle: Battle) {
        this.battles.push(battle);

        const packet = new SetAddBattleOnListPacket();
        packet.data = battle.toBattleListItem();

        this.broadcastPacket(packet);
    }

    public removeBattle(battle: Battle) {

        battle.viewersManager.removeAllViewers()
        this.battles = this.battles.filter(b => b.getBattleId() !== battle.getBattleId())

        const packet = new SetRemoveBattleFromListPacket();
        packet.battle = battle.getBattleId();

        this.broadcastPacket(packet);
    }

    public getBattle(battleId: string) {
        return this.battles.find(battle => battle.getBattleId() == battleId)
    }

    public broadcastPacket(packet: Packet) {
        this.getPlayers().forEach(player => player.sendPacket(packet))
    }

    public getPlayers() {
        return this.server.playersManager
            .getPlayersOnState(LayoutState.BATTLE_SELECT)
    }
}
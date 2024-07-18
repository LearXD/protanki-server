import path from "path";

import { Battle, IBattleData } from "../../game/battle";
import { Server } from "../../server";
import { Logger } from '../../utils/logger';
import { SetAddBattleOnListPacket } from '../../network/packets/set-add-battle-on-list';

export class BattlesManager {

    private battles: Battle[] = [];

    public getBattles() { return this.battles }

    constructor(
        private readonly server: Server
    ) {
        this.createBattle('For Newbies', 'map_sandbox')
        this.createBattle('For Newbies 2', 'map_noise')
    }

    public getData(_path: string) {
        return this.server.getAssetsManager().getData(path.join('battle', _path))
    }

    public createBattle(
        name: string,
        mapName: string,
        config?: IBattleData
    ) {
        const map = this.server.getMapsManager().getMap(mapName, config?.theme)

        if (!map) {
            Logger.error(`Could not create battle ${name} because map ${mapName} was not found`)
            return null;
        }

        const battle = new Battle(name, map, config);

        this.addBattle(battle);
        Logger.debug(`Created battle ${battle.getBattleId()} with name ${name} and map ${mapName}`)

        return battle;
    }

    public addBattle(battle: Battle) {
        this.battles.push(battle);

        const sendBattleCreated = new SetAddBattleOnListPacket();
        sendBattleCreated.data = battle.toBattleListItem();
        this.server.broadcastPacket(sendBattleCreated);
    }

    public getBattle(battleId: string) {
        return this.battles.find(battle => battle.getBattleId() == battleId)
    }
}
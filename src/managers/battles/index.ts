import path from "path";

import { Battle, IBattleData } from "../../game/battle";
import { Player } from "../../game/player";
import { SetBattleListPacket } from "../../network/packets/set-battle-list";
import { Server } from "../../server";
import { BattleModes } from "../../utils/game/battle-mode";
import { EquipmentConstraintsModes } from "../../utils/game/equipment-constraints-mode";
import { ByteArray } from "../../utils/network/byte-array";
import { Logger } from '../../utils/logger';
import { SendCreateBattlePacket } from '../../network/packets/send-create-battle';
import { SetAddBattleOnListPacket } from '../../network/packets/set-add-battle-on-list';
import { SetRemoveBattlesScreenPacket } from '../../network/packets/set-remove-battles-screen';
import { LayoutState } from '../../utils/game/layout-state';


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
        return this.server
            .getAssetsManager()
            .getData(path.join('battle', _path))
    }

    public createBattle(
        name: string,
        mapName: string,
        config?: IBattleData
    ) {
        const map = this.server.getMapsManager().getMap(mapName)

        if (!map) {
            throw new Error('Map not found');
        }

        // TODO: Validate limits
        const battle = new Battle(name, map, config);

        this.addBattle(battle);
        Logger.debug(`Created battle ${battle.getBattleId()} with name ${name} and map ${mapName}`)

        return battle;
    }

    public sendRemoveBattlesScreen(client: Player) {
        const setRemoveBattlesScreenPacket = new SetRemoveBattlesScreenPacket(new ByteArray());
        client.sendPacket(setRemoveBattlesScreenPacket);
    }

    public addBattle(battle: Battle) {
        this.battles.push(battle);

        const sendBattleCreated = new SetAddBattleOnListPacket(new ByteArray());
        sendBattleCreated.data = battle.toBattleListItem();
        this.server.broadcastPacket(sendBattleCreated);
    }

    public getBattle(battleId: string) {
        const battle = this.battles.find(battle => battle.getBattleId() == battleId)

        if (!battle) {
            throw new Error('Battle not found');
        }

        return battle;
    }

    public sendBattles(client: Player) {
        this.server.getMapsManager()
            .sendMapsData(client);

        const setBattleListPacket = new SetBattleListPacket(new ByteArray());
        setBattleListPacket.battles = this.battles.map(battle => battle.toBattleListItem());
        client.sendPacket(setBattleListPacket);

        if (this.battles.length > 0) {

            const [battle] = this.battles;
            battle.getViewersManager().addViewer(client);
        }
    }

    public handleCreateBattle(client: Player, packet: SendCreateBattlePacket) {
        const battle = this.createBattle(
            packet.name,
            packet.mapId, {
            autoBalance: packet.autoBalance,
            battleMode: packet.battleMode as BattleModes,
            equipmentConstraintsMode: packet.equipmentConstraintsMode as EquipmentConstraintsModes,
            friendlyFire: packet.friendlyFire,
            scoreLimit: packet.scoreLimit,
            timeLimitInSec: packet.timeLimitInSec,
            maxPeopleCount: packet.maxPeopleCount,
            parkourMode: packet.parkourMode,
            privateBattle: packet.privateBattle,
            proBattle: packet.proBattle,
            rankRange: packet.rankRange,
            reArmorEnabled: packet.reArmorEnabled,
            withoutBonuses: packet.withoutBonuses,
            withoutCrystals: packet.withoutCrystals,
            withoutSupplies: packet.withoutSupplies
        });

        battle.getViewersManager().addViewer(client);
    }

    public handleOpenBattlesList(client: Player) {
        client.setLayoutState(LayoutState.BATTLE_SELECT)
        client.setSubLayoutState(LayoutState.BATTLE_SELECT, LayoutState.BATTLE_SELECT)
        this.sendBattles(client);
    }

    public handleViewBattle(client: Player, battleId: string) {
        try {
            const battle = this.getBattle(battleId);
            if (client.getViewingBattle().getBattleId() != battleId) {
                battle.getViewersManager().addViewer(client);
            }
        } catch (error) {
            if (error instanceof Error)
                Logger.error(error.message)
        }
    }

    public handleJoinBattle(client: Player, team: string) {
        client.setLayoutState(LayoutState.BATTLE)
        const battle = client.getViewingBattle();
        battle.handleClientJoin(client);
    }
}
import { Battle, IBattleData } from "../../game/battle";
import { Client } from "../../game/client";
import { SetBattleListPacket } from "../../network/packets/set-battle-list";
import { Server } from "../../server";
import { BattleMode, BattleModes } from "../../utils/game/battle-mode";
import { EquipmentConstraintsMode, EquipmentConstraintsModes } from "../../utils/game/equipment-constraints-mode";
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

    public handleCreateBattle(client: Client, packet: SendCreateBattlePacket) {
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
            theme: packet.theme,
            withoutBonuses: packet.withoutBonuses,
            withoutCrystals: packet.withoutCrystals,
            withoutSupplies: packet.withoutSupplies
        });

        battle.addViewer(client);
    }

    public handleOpenBattlesList(client: Client) {
        client.setLayoutState(LayoutState.BATTLE_SELECT)
        client.setSubLayoutState(LayoutState.BATTLE_SELECT, LayoutState.BATTLE_SELECT)

        this.sendBattles(client);
    }

    public handleViewBattle(client: Client, battleId: string) {
        try {
            const battle = this.getBattle(battleId);
            if (client.getViewingBattle().getId() != battleId) {
                battle.addViewer(client);
            }
        } catch (error) {
            if (error instanceof Error)
                Logger.error(error.message)
        }
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

        const sendBattleCreated = new SetAddBattleOnListPacket(new ByteArray());
        sendBattleCreated.data = battle.toBattleListItem();
        this.server.broadcastPacket(sendBattleCreated);

        this.addBattle(battle);
        Logger.debug(`Created battle ${battle.getId()} with name ${name} and map ${mapName}`)

        return battle;
    }

    public removeBattleScreen(client: Client) {
        const setRemoveBattlesScreenPacket = new SetRemoveBattlesScreenPacket(new ByteArray());
        client.sendPacket(setRemoveBattlesScreenPacket);
    }

    public addBattle(battle: Battle) {
        this.battles.push(battle);
    }

    public getBattle(battleId: string) {
        const battle = this.battles.find(battle => battle.getId() == battleId)

        if (!battle) {
            throw new Error('Battle not found');
        }

        return battle;
    }

    public sendBattles(client: Client) {
        this.server.getMapsManager()
            .sendMapsData(client);

        const setBattleListPacket = new SetBattleListPacket(new ByteArray());
        setBattleListPacket.battles = this.battles.map(battle => battle.toBattleListItem());
        client.sendPacket(setBattleListPacket);

        if (this.battles.length > 0) {
            const [battle] = this.battles;
            battle.addViewer(client);
        }
    }
}
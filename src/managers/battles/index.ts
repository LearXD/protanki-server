import { v4 } from 'uuid'

import { Battle, IBattleData } from "../../game/battle";
import { Client } from "../../game/client";
import { SetBattleListPacket } from "../../network/packets/set-battle-list";
import { Server } from "../../server";
import { BattleMode, BattleModes } from "../../utils/game/battle-mode";
import { EquipmentConstraintsMode, EquipmentConstraintsModes } from "../../utils/game/equipment-constraints-mode";
import { ByteArray } from "../../utils/network/byte-array";
import { SetViewingBattlePacket } from '../../network/packets/set-viewing-battle';
import Logger from '../../utils/logger';
import { SendCreateBattlePacket } from '../../network/packets/send-create-battle';
import { SetAddBattleOnListPacket } from '../../network/packets/set-add-battle-on-list';
import { SetRemoveBattlesScreenPacket } from '../../network/packets/set-remove-battles-screen';

export class BattlesManager {

    private battles: Battle[] = [];

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

    public handleViewBattle(client: Client, battleId: string) {
        try {
            const battle = this.getBattle(battleId);
            battle.addViewer(client);
        } catch (error) {
            if (error instanceof Error)
                Logger.error(error.message)
        }
    }

    public createBattle(
        name: string,
        mapName: string,
        config: IBattleData = {
            autoBalance: true,
            battleMode: BattleMode.DM,
            equipmentConstraintsMode: EquipmentConstraintsMode.NONE,
            friendlyFire: false,
            scoreLimit: 20,
            timeLimitInSec: 600,
            maxPeopleCount: 10,
            parkourMode: false,
            privateBattle: false,
            proBattle: false,
            rankRange: { max: 30, min: 1 },
            reArmorEnabled: true,
            theme: 'default',
            withoutBonuses: false,
            withoutCrystals: false,
            withoutSupplies: false
        }
    ) {
        const map = this.server.getMapsManager().getMap(mapName)

        if (!map) {
            throw new Error('Map not found');
        }

        // TODO: Validate limits

        const battle = new Battle(this.generateId(), name, config, map);

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

    public generateId() {
        return v4().substring(0, 8) + v4().substring(0, 8)
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

    public getBattles() { return this.battles }

    public sendBattles(client: Client) {
        const setBattleListPacket = new SetBattleListPacket(new ByteArray());
        setBattleListPacket.battles = this.battles.map(battle => battle.toBattleListItem());
        client.sendPacket(setBattleListPacket);

        if (this.battles.length > 0) {
            const [battle] = this.battles;
            battle.addViewer(client);
        }
    }
}
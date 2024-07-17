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
import { Theme, Themes } from "../../utils/game/theme";
import { SetBattleNotExistPacket } from "../../network/packets/set-battle-not-exist";

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
        return this.server.getAssetsManager()
            .getData(path.join('battle', _path))
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
        return this.battles.find(battle => battle.getBattleId() == battleId)
    }

    public sendBattleSelectScreen(client: Player) {
        this.sendBattles(client);
        this.server.getChatManager().sendChatConfig(client);
        this.server.getChatManager().sendChatMessages(client);
    }

    public sendBattles(client: Player) {
        this.server.getMapsManager().sendMapsData(client);

        const setBattleListPacket = new SetBattleListPacket(new ByteArray());
        setBattleListPacket.battles = this.battles.map(battle => battle.toBattleListItem());
        client.sendPacket(setBattleListPacket);

        if (client.getViewingBattle()) {
            client.getViewingBattle().getViewersManager().addViewer(client);
        }

        // if (this.battles.length > 0 && client.getViewingBattle() === null) {
        //     const [battle] = this.battles;
        //     battle.getViewersManager().addViewer(client);
        // }
    }

    public handleCreateBattle(client: Player, packet: SendCreateBattlePacket) {
        const battle = this.createBattle(
            packet.name,
            packet.mapId,
            {
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
                theme: packet.theme as Themes,
                withoutBonuses: packet.withoutBonuses,
                withoutCrystals: packet.withoutCrystals,
                withoutSupplies: packet.withoutSupplies
            }
        );


        battle.getViewersManager().addViewer(client);
    }

    public handleOpenBattlesList(client: Player) {
        client.setLayoutState(LayoutState.BATTLE_SELECT)
        client.setSubLayoutState(LayoutState.BATTLE_SELECT, LayoutState.BATTLE_SELECT)
        this.sendBattles(client);
    }

    public handleViewBattle(player: Player, battleId: string) {
        const battle = this.getBattle(battleId);

        if (!battle) {
            const setBattleNotExistPacket = new SetBattleNotExistPacket()
            setBattleNotExistPacket.battleId = battleId;
            player.sendPacket(setBattleNotExistPacket);
            return;
        }

        Logger.info(`Player ${player.getUsername()} is viewing battle ${battleId}`)
        battle.getViewersManager().addViewer(player);

    }

    public handleJoinBattle(client: Player, team: string) {
        const battle = client.getViewingBattle();
        if (battle) {
            battle.handleClientJoin(client);
        }
    }
}
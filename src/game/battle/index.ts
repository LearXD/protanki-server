import { IBattleLimit, IMap } from "../../managers/maps"
import { IBattleList } from "../../network/packets/set-battle-list"
import { SetRemoveViewingBattlePacket } from "../../network/packets/set-remove-viewing-battle"
import { SetViewingBattlePacket } from "../../network/packets/set-viewing-battle"
import { SetViewingBattleDataPacket } from "../../network/packets/set-viewing-battle-data"
import { BattleModes } from "../../utils/game/battle-mode"
import { EquipmentConstraintsModes } from "../../utils/game/equipment-constraints-mode"
import { ByteArray } from "../../utils/network/byte-array"
import { Client } from "../client"


export interface IBattleData {
    autoBalance: boolean,
    battleMode: BattleModes,
    equipmentConstraintsMode: EquipmentConstraintsModes,
    friendlyFire: boolean,
    scoreLimit: number,
    timeLimitInSec: number,
    maxPeopleCount: number,
    parkourMode: boolean,
    privateBattle: boolean,
    proBattle: boolean,
    rankRange: {
        max: number,
        min: number
    },
    reArmorEnabled: boolean,
    theme: string,
    withoutBonuses: boolean,
    withoutCrystals: boolean,
    withoutSupplies: boolean
}

export class Battle {

    private roundStarted: boolean = false

    private usersBlue: string[] = []
    private usersRed: string[] = []

    private scoreBlue: number = 0
    private scoreRed: number = 0

    private viewers: Map<string, Client> = new Map()

    constructor(
        private id: string,
        private name: string,
        private data: IBattleData,
        private map: IMap
    ) {
    }

    public getId() { return this.id }
    public getName() { return this.name }
    public isStarted() { return this.roundStarted }

    public getLeftTime(): number {
        return this.isStarted() ? this.data.timeLimitInSec : 60
    }

    public addViewer(client: Client) {

        if (client.getViewingBattle()) {
            client.getViewingBattle().removeViewer(client)
        }

        const setViewingBattlePacket = new SetViewingBattlePacket(new ByteArray());
        setViewingBattlePacket.battleId = this.getId();

        client.sendPacket(setViewingBattlePacket);
        this.sendViewingData(client);

        client.setViewingBattle(this);
        this.viewers.set(client.getIdentifier(), client);
    }

    public removeViewer(client: Client) {
        if (this.viewers.has(client.getIdentifier())) {
            this.viewers.delete(client.getIdentifier());

            const setRemoveViewingBattlePacket = new SetRemoveViewingBattlePacket(new ByteArray());
            setRemoveViewingBattlePacket.battleId = this.getId();

            client.setViewingBattle(null);
            client.sendPacket(setRemoveViewingBattlePacket);
        }
    }

    public sendViewingData(client: Client) {
        const setViewingBattleDataPacket = new SetViewingBattleDataPacket(new ByteArray());
        setViewingBattleDataPacket.data = {
            battleMode: this.data.battleMode,
            itemId: this.getId(),
            scoreLimit: this.data.scoreLimit,
            timeLimitInSec: this.data.timeLimitInSec,
            preview: this.map.preview,
            maxPeopleCount: this.data.maxPeopleCount,
            name: this.getName(),
            proBattle: this.data.proBattle,
            minRank: this.data.rankRange.min,
            maxRank: this.data.rankRange.max,
            roundStarted: this.isStarted(),
            spectator: true,
            // TODO: Implement this
            withoutBonuses: this.data.withoutBonuses,
            withoutCrystals: this.data.withoutCrystals,
            withoutSupplies: this.data.withoutSupplies,
            proBattleEnterPrice: 150,
            timeLeftInSec: 1000,
            // TODO: with supplies?
            userPaidNoSuppliesBattle: this.data.withoutSupplies,
            proBattleTimeLeftInSec: -1,
            parkourMode: this.data.parkourMode,
            equipmentConstraintsMode: this.data.equipmentConstraintsMode,
            reArmorEnabled: this.data.reArmorEnabled,
            usersBlue: this.usersBlue,
            usersRed: this.usersRed,
            scoreRed: this.scoreRed,
            scoreBlue: this.scoreBlue,
            autoBalance: this.data.autoBalance,
            friendlyFire: this.data.friendlyFire,
        }
        client.sendPacket(setViewingBattleDataPacket);
    }

    public toBattleListItem(): IBattleList {
        return {
            battleId: this.id,
            battleMode: this.data.battleMode,
            map: this.map.mapId,
            maxPeople: this.data.maxPeopleCount,
            name: this.getName(),
            privateBattle: this.data.privateBattle,
            proBattle: this.data.proBattle,
            minRank: this.data.rankRange.min,
            maxRank: this.data.rankRange.max,
            preview: this.map.preview,
            parkourMode: this.data.parkourMode,
            equipmentConstraintsMode: this.data.equipmentConstraintsMode,
            suspicionLevel: 'NONE',
            usersBlue: this.usersBlue,
            usersRed: this.usersRed
        }
    }

}
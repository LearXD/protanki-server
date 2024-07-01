import { v4 } from "uuid"

import { IMap } from "../../managers/maps"
import { IBattleList } from "../../network/packets/set-battle-list"
import { SetRemoveViewingBattlePacket } from "../../network/packets/set-remove-viewing-battle"
import { SetViewingBattlePacket } from "../../network/packets/set-viewing-battle"
import { SetViewingBattleDataPacket } from "../../network/packets/set-viewing-battle-data"
import { BattleMode, BattleModes } from "../../utils/game/battle-mode"
import { EquipmentConstraintsMode, EquipmentConstraintsModes } from "../../utils/game/equipment-constraints-mode"
import { ByteArray } from "../../utils/network/byte-array"
import { Client } from "../client"
import { SetTurretsDataPacket } from "../../network/packets/set-turrets-data"
import { SetBonusesDataPacket } from "../../network/packets/set-bonuses-data"
import { SetBattleDataPacket } from "../../network/packets/set-battle-data"
import { SetBattleStatisticsCCPacket } from "../../network/packets/set-battle-statistics-cc"
import { SetBattleChatEnabledPacket } from "../../network/packets/set-some-packet-on-join-battle-3"
import { SetSomePacketOnJoinBattle4Packet } from "../../network/packets/set-some-packet-on-join-battle-4"
import { SetBattleStatisticsDMCCPacket } from "../../network/packets/set-battle-statistics-dm-cc"
import { ChatModeratorLevel } from "../../utils/game/chat-moderator-level"
import { SetSomePacketOnJoinBattle5Packet } from "../../network/packets/set-some-packet-on-join-battle-5"
import { SetBattleMineCCPacket } from "../../network/packets/set-battle-mine-cc"
import { SetUserTankResourcesDataPacket } from "../../network/packets/set-user-tank-resources-data"
import { Vector3d } from "../../utils/game/vector-3d"
import { Team } from "../../utils/game/team"
import { SetBattleUsersEffectsPacket } from "../../network/packets/set-battle-users-effects"
import { SetBattleSpawnedBoxesPacket } from "../../network/packets/set-battle-spawned-boxes"
import { LayoutState } from "../../utils/game/layout-state"
import { SetBattleUserStatusPacket } from "../../network/packets/set-battle-user-status"

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

    private id: string;
    private roundStarted: boolean = false

    private players: Map<string, Client> = new Map()
    private usersBlue: string[] = []
    private usersRed: string[] = []

    private scoreBlue: number = 0
    private scoreRed: number = 0

    private viewers: Map<string, Client> = new Map()

    constructor(
        private name: string,
        private map: IMap,
        private data: IBattleData = {
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
        },
    ) {
        this.id = Battle.generateId()
    }

    public static generateId() {
        return `${v4().substring(0, 8)}${v4().substring(0, 8)}`
    }

    public getId() { return this.id }
    public getName() { return this.name }
    public isStarted() { return this.roundStarted }

    public getLeftTime(): number {
        return this.isStarted() ? this.data.timeLimitInSec : 60
    }

    public hasClient(client: Client) {
        return this.players.has(client.getIdentifier())
    }

    public async sendData(client: Client) {
        const data = client.getServer()
            .getMapsManager()
            .getMapData(this.map.mapId, this.map.theme)

        const setBattleDataPacket = new SetBattleDataPacket(new ByteArray());
        setBattleDataPacket.data = {
            ...data,
            battleId: this.getId(),
        }

        client.sendPacket(setBattleDataPacket);
    }

    public async sendResources(client: Client) {
        const objects = client.getServer()
            .getMapsManager()
            .getMapResource(
                this.map.mapId,
                this.map.theme,
                'objects.json'
            )

        await client.getServer()
            .getResourcesManager()
            .sendLoadResources(client, objects)

        const skybox = client.getServer()
            .getMapsManager()
            .getMapResource(
                this.map.mapId,
                this.map.theme,
                'skybox.json'
            )

        await client.getServer()
            .getResourcesManager()
            .sendLoadResources(client, skybox)

        const map = client.getServer()
            .getMapsManager()
            .getMapResource(
                this.map.mapId,
                this.map.theme,
                'map.json'
            )

        return await client.getServer()
            .getResourcesManager()
            .sendLoadResources(client, map)
    }

    public async addClient(client: Client) {
        if (this.hasClient(client)) {
            return;
        }

        this.players.set(client.getUsername(), client)
        client.sendLatency(0, 0)
        const turrets = client.getServer().getBattlesManager().getData('turrets.json')

        await this.sendResources(client)

        const setTurretsDataPacket = new SetTurretsDataPacket(new ByteArray());
        setTurretsDataPacket.turrets = turrets;
        client.sendPacket(setTurretsDataPacket);

        client.sendTime(0, 0);

        const bonuses = client.getServer().getBattlesManager().getData('bonuses.json')
        const setBonusesDataPacket = new SetBonusesDataPacket(new ByteArray());
        setBonusesDataPacket.data = bonuses;
        client.sendPacket(setBonusesDataPacket);

        this.sendData(client);

        // if(this.data.battleMode) {
        // }

        const setBattleStatisticsCCPacket = new SetBattleStatisticsCCPacket(new ByteArray());
        setBattleStatisticsCCPacket.mode = BattleMode.DM
        setBattleStatisticsCCPacket.equipmentConstraintsMode = EquipmentConstraintsMode.NONE
        setBattleStatisticsCCPacket.fund = 0
        setBattleStatisticsCCPacket.battleLimits = { scoreLimit: 100, timeLimitInSec: 0 }
        setBattleStatisticsCCPacket.mapName = this.name
        setBattleStatisticsCCPacket.maxPeopleCount = 2
        setBattleStatisticsCCPacket.parkourMode = false
        setBattleStatisticsCCPacket.int_1 = 100
        setBattleStatisticsCCPacket.spectator = false
        setBattleStatisticsCCPacket.strings_1 = null
        setBattleStatisticsCCPacket.int_2 = 0

        client.sendPacket(setBattleStatisticsCCPacket);

        const SetBattleChatEnabledPacket = new SetBattleChatEnabledPacket(new ByteArray());
        client.sendPacket(SetBattleChatEnabledPacket);

        const setSomePacketOnJoinBattle4Packet = new SetSomePacketOnJoinBattle4Packet(new ByteArray());
        client.sendPacket(setSomePacketOnJoinBattle4Packet);

        const setBattleStatisticsDMCCPacket = new SetBattleStatisticsDMCCPacket(new ByteArray());
        setBattleStatisticsDMCCPacket.users = Array.from(this.players.values()).map((player) => {
            return {
                chatModeratorLevel: ChatModeratorLevel.NONE,
                deaths: 0,
                kills: 0,
                rank: 30,
                score: 0,
                name: client.getUsername()
            }
        })
        client.sendPacket(setBattleStatisticsDMCCPacket);

        const setSomePacketOnJoinBattle5Packet = new SetSomePacketOnJoinBattle5Packet(new ByteArray());
        client.sendPacket(setSomePacketOnJoinBattle5Packet);

        const setBattleMineCCPacket = new SetBattleMineCCPacket(new ByteArray());
        setBattleMineCCPacket.soundResource = 389057
        setBattleMineCCPacket.int_1 = 1000
        setBattleMineCCPacket.mines = []
        setBattleMineCCPacket.imageResource = 925137
        setBattleMineCCPacket.soundResource2 = 965887
        setBattleMineCCPacket.imageResource2 = 975465
        setBattleMineCCPacket.explosionMarkTexture = 962237
        setBattleMineCCPacket.explosionSound = 175648
        setBattleMineCCPacket.float_1 = 10
        setBattleMineCCPacket.imageResource3 = 523632
        setBattleMineCCPacket.frameResource = 545261
        setBattleMineCCPacket.impactForce = 3
        setBattleMineCCPacket.frameResource2 = 965737
        setBattleMineCCPacket.float_2 = 5
        setBattleMineCCPacket.model3dResource = 895671
        setBattleMineCCPacket.float_3 = 7
        setBattleMineCCPacket.radius = 0.5
        setBattleMineCCPacket.imageResource4 = 342637
        client.sendPacket(setBattleMineCCPacket);

        client.getServer()
            .getUserDataManager()
            .sendSupplies(client);

        const setUserTankResourcesDataPacket = new SetUserTankResourcesDataPacket(new ByteArray());
        setUserTankResourcesDataPacket.data = {
            battleId: this.getId(),
            colormap_id: 265602,
            hull_id: 'hunter_m1',
            turret_id: 'shotgun_m1',
            team_type: 'NONE',
            partsObject: '{"engineIdleSound":386284,"engineStartMovingSound":226985,"engineMovingSound":75329,"turretSound":242699}',
            hullResource: 377977,
            turretResource: 412746,
            sfxData: '{"magazineReloadSound":223995,"reloadSound":223996,"shotSound":223997,"explosionMarkTexture0":756745,"explosionMarkTexture1":756746,"explosionMarkTexture2":756747,"explosionMarkTexture3":756748,"smokeTexture":756749,"sparkleTexture":756750,"pelletTrailTexture":756751,"shotAlongTexture":423332,"shotAcrossTexture":234233,"lighting":[{"name":"shot","light":[{"attenuationBegin":50,"attenuationEnd":700,"color":16431616,"intensity":1,"time":0},{"attenuationBegin":1,"attenuationEnd":2,"color":16431616,"intensity":0,"time":300}]}],"bcsh":[]}',
            position: { x: 0, y: 0, z: 0 },
            orientation: { x: 0, y: 0, z: 0 },
            incarnation: 0,
            tank_id: client.getUsername(),
            nickname: client.getUsername(),
            state: 'suicide',
            maxSpeed: 8.6,
            maxTurnSpeed: 1.6632988304138179,
            acceleration: 10.97,
            reverseAcceleration: 13.65,
            sideAcceleration: 11.62,
            turnAcceleration: 2.4125685504632512,
            reverseTurnAcceleration: 4.031885009158302,
            mass: 2280,
            power: 10.97,
            dampingCoeff: 1500,
            turret_turn_speed: 1.8149678891489032,
            health: 0,
            rank: 10,
            kickback: 2.3149,
            turretTurnAcceleration: 2.6148522853379044,
            impact_force: 0.2932,
            state_null: true
        }
        client.sendPacket(setUserTankResourcesDataPacket)

        const setBattleUserStatusPacket = new SetBattleUserStatusPacket(new ByteArray())
        setBattleUserStatusPacket.deaths = 0
        setBattleUserStatusPacket.kills = 0
        setBattleUserStatusPacket.score = 0
        setBattleUserStatusPacket.user = client.getUsername()

        const setBattleUsersEffectsPacket = new SetBattleUsersEffectsPacket(new ByteArray())
        setBattleUsersEffectsPacket.effects = []
        client.sendPacket(setBattleUsersEffectsPacket)

        const setBattleSpawnedBoxesPacket = new SetBattleSpawnedBoxesPacket(new ByteArray())
        setBattleSpawnedBoxesPacket.boxes = []
        client.sendPacket(setBattleSpawnedBoxesPacket)

        client.setSubLayoutState(LayoutState.BATTLE, LayoutState.BATTLE)
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
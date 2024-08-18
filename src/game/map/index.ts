import path from 'path';
import { MapsManager } from "@/server/managers/maps";
import { MapDataManager } from './managers/data';
import { IMapArea, IMapBonus, IMapData, IMapFlags, IMapSpawn } from './types';
import { Player } from '../player';
import { SetBattleMapPropertiesPacket } from '@/network/packets/set-battle-map-properties';
import { IResource } from '@/server/managers/resources/types';
import { ReadType } from '@/server/managers/assets/types';
import { MapCollisionManager } from './managers/collision';
import { MapAreaManager } from './managers/area';

export class Map extends MapDataManager {

    private librariesResources: IResource[] = []
    private skyboxResources: IResource[] = []
    private mapResources: IResource[] = []

    private properties: any = []

    public spawns: IMapSpawn[] = []
    public flags: IMapFlags = null
    public bonuses: IMapBonus[] = []

    public collisionManager: MapCollisionManager
    public areaManager: MapAreaManager

    public constructor(
        public readonly manager: MapsManager,
        data: IMapData
    ) {
        super(data)

        this.librariesResources = this.getResource('libraries.json')
        this.skyboxResources = this.getResource('skybox.json')
        this.mapResources = this.getResource('map.json')
        this.properties = this.getData('properties.json')

        this.spawns = manager.getMapsData(path.join(this.getId(), 'spawns.json'))
        this.flags = manager.getMapsData(path.join(this.getId(), 'flags.json'))
        this.bonuses = manager.getMapsData(path.join(this.getId(), 'bonuses.json'))

        this.collisionManager = new MapCollisionManager(manager.getMapsData(path.join(this.getId(), 'collisions.json')))
        this.areaManager = new MapAreaManager(manager.getMapsData(path.join(this.getId(), 'areas.json')))
    }

    public getSpawns(): IMapSpawn[] {
        return this.spawns
    }

    public getFlags(): IMapFlags {
        return this.flags
    }

    public getBonuses(): IMapBonus[] {
        return this.bonuses
    }

    public getData(_path: string, readType?: ReadType) {
        return this.manager.getMapsData(path.join(this.getPath(), _path), readType)
    }

    public getResource(resource: string) {
        return this.getData(path.join('resources', resource))
    }

    public sendProperties(player: Player, spectator: boolean = false) {
        const battle = player.battle;

        const packet = new SetBattleMapPropertiesPacket();
        packet.data = {
            kick_period_ms: 300000,
            map_id: this.getId(),
            mapId: this.properties.mapId,
            invisible_time: 3500,
            spectator: spectator,
            active: true,
            dustParticle: this.properties.dustParticle,
            battleId: battle.getBattleId(),
            minRank: battle.getRankRange().min,
            maxRank: battle.getRankRange().max,
            skybox: this.properties.skybox,
            sound_id: this.properties.sound_id,
            map_graphic_data: this.properties.map_graphic_data,
            reArmorEnabled: battle.isReArmorEnabled(),
            bonusLightIntensity: this.properties.bonusLightIntensity,
            lighting: this.properties.lighting
        }

        player.sendPacket(packet);
    }

    public async sendResources(player: Player) {
        await player.server.resourcesManager
            .sendLoadResources(player, this.librariesResources)

        await player.server.resourcesManager
            .sendLoadResources(player, this.skyboxResources)

        await player.server.resourcesManager
            .sendLoadResources(player, this.mapResources)
    }
}
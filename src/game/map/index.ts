import path from 'path';
import { MapsManager } from "@/server/managers/maps";
import { MapDataManager } from './managers/data';
import { BonusType, IBonusSpawnArea, IMapData, IMapFlags, IMapPoint, IMapProperties, IMapSpawn } from './types';
import { Player } from '../player';
import { SetBattleMapPropertiesPacket } from '@/network/packets/set-battle-map-properties';
import { IResource } from '@/server/managers/resources/types';
import { ReadType } from '@/server/managers/assets/types';
import { MapCollisionManager } from './managers/collision';
import { MapAreaManager } from './managers/area';
import { BattleModeType } from '@/states/battle-mode';
import { MathUtils } from '@/utils/math';
import { Vector3d } from '@/utils/vector-3d';

export class Map extends MapDataManager {

    private readonly librariesResources: IResource[] = []
    private readonly skyboxResources: IResource[] = []
    private readonly mapResources: IResource[] = []

    private readonly properties: IMapProperties = null

    public readonly spawns: IMapSpawn[] = []
    public readonly bonuses: IBonusSpawnArea[] = []

    public readonly points: IMapPoint[] = []
    public readonly flags: IMapFlags = null

    public readonly collisions: MapCollisionManager
    public readonly areas: MapAreaManager

    public constructor(
        public readonly manager: MapsManager,
        public readonly data: IMapData
    ) {
        super(data)

        this.librariesResources = this.getResource('libraries.json')
        this.skyboxResources = this.getResource('skybox.json')
        this.mapResources = this.getResource('map.json')
        this.properties = this.getData('properties.json')

        this.spawns = manager.getMapsData(path.join(this.getId(), 'spawns.json'))
        this.bonuses = manager.getMapsData(path.join(this.getId(), 'bonuses.json'))

        this.flags = manager.getMapsData(path.join(this.getId(), 'flags.json'))
        this.points = manager.getMapsData(path.join(this.getId(), 'points.json'))

        this.collisions = new MapCollisionManager(manager.getMapsData(path.join(this.getId(), 'collisions.json')))
        this.areas = new MapAreaManager(manager.getMapsData(path.join(this.getId(), 'areas.json')))
    }

    public getBonusSpawns(name: BonusType, mode: BattleModeType): Vector3d[] {
        const bonuses = this.bonuses.filter(bonus => bonus.types.includes(name) && bonus.modes.includes(mode))
        if (bonuses.length > 0) {
            return bonuses.map(spawn =>
                new Vector3d(
                    MathUtils.randomInt(spawn.min.x, spawn.max.x),
                    MathUtils.randomInt(spawn.min.z, spawn.max.z),
                    MathUtils.randomInt(spawn.min.y, spawn.max.y)
                )
            )
        }
        return [];
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
            battleId: battle.battleId,
            minRank: battle.getRankRange().min,
            maxRank: battle.getRankRange().max,
            skybox: JSON.stringify(this.properties.skybox),
            sound_id: this.properties.sound_id,
            map_graphic_data: JSON.stringify(this.properties.map_graphic_data),
            reArmorEnabled: battle.isReArmorEnabled(),
            bonusLightIntensity: this.properties.bonusLightIntensity,
            lighting: JSON.stringify(this.properties.lighting)
        }

        player.sendPacket(packet);
    }

    public async sendResources(player: Player) {
        await player.resources
            .loadResources(this.librariesResources)

        await player.resources
            .loadResources(this.skyboxResources)

        await player.resources
            .loadResources(this.mapResources)
    }
}
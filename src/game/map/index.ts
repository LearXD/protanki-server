import path from 'path';
import { MapsManager } from "@/server/managers/maps";
import { MapDataManager } from './managers/data';
import { IMapData, IMapFlags, IMapSpawn } from './types';
import { Player } from '../player';
import { SetBattleMapPropertiesPacket } from '@/network/packets/set-battle-map-properties';
import { IResource } from '@/server/managers/resources/types';
import { ReadType } from '@/server/managers/assets/types';

export class Map extends MapDataManager {

    private librariesResources: IResource[] = []
    private skyboxResources: IResource[] = []
    private mapResources: IResource[] = []

    private properties: any = []

    private spawns: IMapSpawn[] = []
    private flags: IMapFlags = null


    public constructor(
        public readonly manager: MapsManager,
        data: IMapData
    ) {
        super(data)

        this.librariesResources = this.getResource('libraries.json')
        this.skyboxResources = this.getResource('skybox.json')
        this.mapResources = this.getResource('map.json')

        this.properties = this.getData('properties.json')

        this.spawns = this.getData('spawns.json')
        this.flags = this.getData('flags.json')
    }

    public getSpawns(): IMapSpawn[] {
        return this.spawns
    }

    public getFlags(): IMapFlags {
        return this.flags
    }

    public getData(_path: string, readType?: ReadType) {
        return this.manager.getMapsData(path.join(this.getPath(), _path), readType)
    }

    public getResource(resource: string) {
        return this.getData(path.join('resources', resource))
    }

    public sendProperties(player: Player, spectator: boolean = false) {
        const battle = player.getBattle();

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
        await player.getServer().getResourcesManager()
            .sendLoadResources(player, this.librariesResources)

        await player.getServer().getResourcesManager()
            .sendLoadResources(player, this.skyboxResources)

        await player.getServer().getResourcesManager()
            .sendLoadResources(player, this.mapResources)
    }
}
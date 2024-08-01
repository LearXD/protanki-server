import path from 'path';
import { MapsManager } from "@/server/managers/maps";
import { MapDataManager } from './managers/data';
import { IMapData, IMapSpawn } from './types';
import { Player } from '../player';
import { ServerError } from '@/server/utils/error';
import { SetBattleMapPropertiesPacket } from '@/network/packets/set-battle-map-properties';
import { XMLParser } from 'fast-xml-parser';

export class Map extends MapDataManager {

    public constructor(
        public readonly manager: MapsManager,
        data: IMapData
    ) {
        super(data)
    }

    public getXML() {
        // XMLParser
    }

    public getProperties() {
        return this.manager.getData(path.join(this.getPath(), 'properties.json'))
    }

    public getResource(resource: string) {
        return this.manager.getData(path.join(this.getPath(), 'resources', resource))
    }

    public getSpawns(): IMapSpawn[] {
        return this.manager.getData(path.join(this.getPath(), 'spawns.json'))
    }

    public sendProperties(player: Player, spectator: boolean = false) {
        const properties = this.getProperties();

        if (!properties) {
            throw new ServerError(`Properties data not found in map ${this.getName()} with theme ${this.getTheme()}`, player.getUsername())
        }

        const battle = player.getBattle();

        const packet = new SetBattleMapPropertiesPacket();
        packet.data = {
            kick_period_ms: 300000,
            map_id: this.getId(),
            mapId: properties.mapId,
            invisible_time: 3500,
            spectator: spectator,
            active: true,
            dustParticle: properties.dustParticle,
            battleId: battle.getBattleId(),
            minRank: battle.getRankRange().min,
            maxRank: battle.getRankRange().max,
            skybox: properties.skybox,
            sound_id: properties.sound_id,
            map_graphic_data: properties.map_graphic_data,
            reArmorEnabled: battle.isReArmorEnabled(),
            bonusLightIntensity: properties.bonusLightIntensity,
            lighting: properties.lighting
        }

        player.sendPacket(packet);
    }

    public async sendResources(player: Player) {
        await this.sendObjectsResources(player)
        await this.sendSkyboxResource(player)
        await this.sendMapResources(player)
    }

    public async sendObjectsResources(player: Player) {
        const objects = this.getResource('objects.json')

        if (!objects) {
            throw new ServerError(`Objects data not found in map ${this.getName()}`, player.getUsername())
        }

        return await player.getServer().getResourcesManager()
            .sendLoadResources(player, objects)
    }

    public async sendSkyboxResource(player: Player) {
        const skybox = this.getResource('skybox.json')

        if (!skybox) {
            throw new ServerError(`Skybox data not found in map ${this.getName()}`, player.getUsername())
        }

        return await player.getServer().getResourcesManager()
            .sendLoadResources(player, skybox)
    }

    public async sendMapResources(player: Player) {
        const map = this.getResource('map.json')

        if (!map) {
            throw new ServerError(`Map data not found in map ${this.getName()}`, player.getUsername())
        }

        return await player.getServer().getResourcesManager()
            .sendLoadResources(player, map)
    }
}
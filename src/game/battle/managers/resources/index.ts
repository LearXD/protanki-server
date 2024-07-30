import { Battle } from "../..";
import { SetBattleMapPropertiesPacket } from "../../../../network/packets/set-battle-map-properties";
import { SetTurretsDataPacket } from "../../../../network/packets/set-turrets-data";
import { Logger } from "../../../../utils/logger";
import { Player } from "../../../player";

export class BattleResourcesManager {

    public constructor(
        private readonly battle: Battle
    ) { }

    public sendBattleMapProperties(client: Player, spectator: boolean = false) {
        const data = this.battle.getMap().getProperties();

        if (!data) {
            Logger.error(`Map data not found for map ${this.battle.getMap().getId()} and theme ${this.battle.getMap().getTheme()}`)
            return;
        }

        const packet = new SetBattleMapPropertiesPacket();
        packet.data = {
            kick_period_ms: 300000,
            map_id: this.battle.getMap().getId(),
            mapId: data.mapId,
            invisible_time: 3500,
            spectator: spectator,
            active: true,
            dustParticle: data.dustParticle,
            battleId: this.battle.getBattleId(),
            minRank: this.battle.getRankRange().min,
            maxRank: this.battle.getRankRange().max,
            skybox: data.skybox,
            sound_id: data.sound_id,
            map_graphic_data: data.map_graphic_data,
            reArmorEnabled: this.battle.isReArmorEnabled(),
            bonusLightIntensity: data.bonusLightIntensity,
            lighting: data.lighting
        }
        client.sendPacket(packet);
    }

    public async sendResources(player: Player) {
        await this.sendObjectsResources(player)
        await this.sendSkyboxResource(player)
        await this.sendMapResources(player)
    }

    public sendTurretsData(player: Player) {
        const turrets = player.getServer().getBattlesManager().getData('turrets.json')

        if (!turrets) {
            throw new Error('Turrets data not found')
        }

        const setTurretsDataPacket = new SetTurretsDataPacket();
        setTurretsDataPacket.turrets = turrets;
        player.sendPacket(setTurretsDataPacket);
    }

    public async sendObjectsResources(player: Player) {
        const objects = this.battle.getMap().getResource('objects.json')

        if (!objects) {
            throw new Error('Objects data not found')
        }

        return await player.getServer().getResourcesManager()
            .sendLoadResources(player, objects)
    }

    public async sendSkyboxResource(player: Player) {
        const skybox = this.battle.getMap().getResource('skybox.json')

        if (!skybox) {
            throw new Error('Skybox data not found')
        }

        return await player.getServer().getResourcesManager()
            .sendLoadResources(player, skybox)
    }

    public async sendMapResources(player: Player) {
        const map = this.battle.getMap().getResource('map.json')

        if (!map) {
            throw new Error('Map data not found')
        }

        return await player.getServer().getResourcesManager()
            .sendLoadResources(player, map)
    }

}
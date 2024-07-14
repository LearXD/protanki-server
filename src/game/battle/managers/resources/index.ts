import { Battle } from "../..";
import { SetBattleDataPacket } from "../../../../network/packets/set-battle-data";
import { SetTurretsDataPacket } from "../../../../network/packets/set-turrets-data";
import { Logger } from "../../../../utils/logger";
import { ByteArray } from "../../../../utils/network/byte-array";
import { Player } from "../../../player";

export class BattleResourcesManager {

    public constructor(
        private readonly battle: Battle
    ) { }

    public sendTurretsData(client: Player) {
        const turrets = client.getServer().getBattlesManager().getData('turrets.json')
        const setTurretsDataPacket = new SetTurretsDataPacket();
        setTurretsDataPacket.turrets = turrets;
        client.sendPacket(setTurretsDataPacket);
    }

    public sendBattleData(client: Player) {
        const data = client.getServer().getMapsManager()
            .getMapData(this.battle.getMap().mapId, this.battle.getMap().theme)

        if (!data) {
            Logger.error(`Map data not found for map ${this.battle.getMap().mapId} and theme ${this.battle.getMap().theme}`)
            return;
        }

        const setBattleDataPacket = new SetBattleDataPacket();
        setBattleDataPacket.data = {
            kick_period_ms: 300000,
            map_id: this.battle.getMap().mapId,
            mapId: data.mapId,
            invisible_time: 3500,
            spectator: false,
            active: true,
            dustParticle: data.dustParticle,
            battleId: this.battle.getBattleId(),
            minRank: this.battle.getData().rankRange.min,
            maxRank: this.battle.getData().rankRange.max,
            skybox: data.skybox,
            sound_id: data.sound_id,
            map_graphic_data: data.map_graphic_data,
            reArmorEnabled: this.battle.getData().reArmorEnabled,
            bonusLightIntensity: data.bonusLightIntensity,
            lighting: data.lighting
        }
        client.sendPacket(setBattleDataPacket);
    }

    public async sendObjectsResources(client: Player) {
        const objects = client.getServer().getMapsManager()
            .getMapResource(this.battle.getMap().mapId, this.battle.getMap().theme, 'objects.json')

        return await client.getServer().getResourcesManager()
            .sendLoadResources(client, objects)
    }

    public async sendSkyboxResource(client: Player) {
        const skybox = client.getServer().getMapsManager()
            .getMapResource(this.battle.getMap().mapId, this.battle.getMap().theme, 'skybox.json')

        return await client.getServer().getResourcesManager()
            .sendLoadResources(client, skybox)
    }

    public async sendMapResources(client: Player) {
        const map = client.getServer().getMapsManager()
            .getMapResource(this.battle.getMap().mapId, this.battle.getMap().theme, 'map.json')

        return await client.getServer().getResourcesManager()
            .sendLoadResources(client, map)
    }

}
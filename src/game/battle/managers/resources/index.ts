import { Battle } from "../..";
import { SetBattleDataPacket } from "../../../../network/packets/set-battle-data";
import { SetBonusesDataPacket } from "../../../../network/packets/set-bonuses-data";
import { SetTurretsDataPacket } from "../../../../network/packets/set-turrets-data";
import { ByteArray } from "../../../../utils/network/byte-array";
import { Client } from "../../../client";

export class BattleResourcesManager {

    public constructor(
        private readonly battle: Battle
    ) { }

    public sendTurretsData(client: Client) {
        const turrets = client.getServer().getBattlesManager().getData('turrets.json')
        const setTurretsDataPacket = new SetTurretsDataPacket(new ByteArray());
        setTurretsDataPacket.turrets = turrets;
        client.sendPacket(setTurretsDataPacket);
    }

    public sendBattleData(client: Client) {
        const data = client.getServer().getMapsManager()
            .getMapData(this.battle.getMap().mapId, this.battle.getMap().theme)

        const setBattleDataPacket = new SetBattleDataPacket(new ByteArray());
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

    public async sendObjectsResources(client: Client) {
        const objects = client.getServer().getMapsManager()
            .getMapResource(this.battle.getMap().mapId, this.battle.getMap().theme, 'objects.json')

        return await client.getServer().getResourcesManager()
            .sendLoadResources(client, objects)
    }

    public async sendSkyboxResource(client: Client) {
        const skybox = client.getServer().getMapsManager()
            .getMapResource(this.battle.getMap().mapId, this.battle.getMap().theme, 'skybox.json')

        return await client.getServer().getResourcesManager()
            .sendLoadResources(client, skybox)
    }

    public async sendMapResources(client: Client) {
        const map = client.getServer().getMapsManager()
            .getMapResource(this.battle.getMap().mapId, this.battle.getMap().theme, 'map.json')

        return await client.getServer().getResourcesManager()
            .sendLoadResources(client, map)
    }

}
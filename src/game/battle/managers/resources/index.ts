import { Battle } from "../..";
import { SetBattleDataPacket } from "../../../../network/packets/set-battle-data";
import { SetBattleMineCCPacket } from "../../../../network/packets/set-battle-mine-cc";
import { SetTurretsDataPacket } from "../../../../network/packets/set-turrets-data";
import { Logger } from "../../../../utils/logger";
import { Player } from "../../../player";

export class BattleResourcesManager {

    public constructor(
        private readonly battle: Battle
    ) { }

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
            minRank: this.battle.getRankRange().min,
            maxRank: this.battle.getRankRange().max,
            skybox: data.skybox,
            sound_id: data.sound_id,
            map_graphic_data: data.map_graphic_data,
            reArmorEnabled: this.battle.isReArmorEnabled(),
            bonusLightIntensity: data.bonusLightIntensity,
            lighting: data.lighting
        }
        client.sendPacket(setBattleDataPacket);
    }

    public async sendResources(player: Player) {

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
        const objects = player.getServer().getMapsManager()
            .getMapResource(this.battle.getMap().mapId, this.battle.getMap().theme, 'objects.json')

        console.log(objects)

        if (!objects) {
            throw new Error('Objects data not found')
        }

        return await player.getServer().getResourcesManager()
            .sendLoadResources(player, objects)
    }

    public async sendSkyboxResource(player: Player) {
        const skybox = player.getServer().getMapsManager()
            .getMapResource(this.battle.getMap().mapId, this.battle.getMap().theme, 'skybox.json')

        if (!skybox) {
            throw new Error('Skybox data not found')
        }

        return await player.getServer().getResourcesManager()
            .sendLoadResources(player, skybox)
    }

    public async sendMapResources(player: Player) {
        const map = player.getServer().getMapsManager()
            .getMapResource(this.battle.getMap().mapId, this.battle.getMap().theme, 'map.json')

        console.log(map)

        if (!map) {
            throw new Error('Map data not found')
        }

        return await player.getServer().getResourcesManager()
            .sendLoadResources(player, map)
    }

}
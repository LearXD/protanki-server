
import path from "path";
import { IBattleAsset } from "./types";
import { Server } from "@/server";
import { Logger } from "@/utils/logger";
import { Theme, ThemeType } from "@/states/theme";
import { Player } from "@/game/player";
import { SetMapsDataPacket } from "@/network/packets/set-maps-data";



export class MapsManager {

    private data: IBattleAsset;

    constructor(
        private readonly server: Server
    ) {
        Logger.info('Initializing battle and maps data...');
        this.data = this.getData('maps.json');
    }

    public getMaps() { return this.data.maps }
    public getBattlesLimits() { return this.data.battleLimits }

    public getMapResource(map: string, theme: string, resource: string) {
        return this.getData(path.join(map, theme, 'resources', resource));
    }

    public getMapData(map: string, theme: string) {
        return this.getData(path.join(map, theme, 'data.json'));
    }

    public getData(_path: string) {
        return this.server.getAssetsManager().getData(path.join('maps', _path));
    }

    public getMap(name: string, theme: ThemeType = Theme.SUMMER) {
        return this.getMaps()
            .find(map => (map.mapId === name && map.theme === theme));
    }

    public getModeLimits(mode: string) {
        return this.getBattlesLimits()
            .find(limits => limits.battleMode === mode);
    }

    public sendMapsData(client: Player) {
        const setMapsDataPacket = new SetMapsDataPacket();
        setMapsDataPacket.data = this.data;
        client.sendPacket(setMapsDataPacket);
    }
}
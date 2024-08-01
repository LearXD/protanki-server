
import path from "path";

import { IBattleAsset } from "./types";
import { Server } from "@/server";
import { Logger } from "@/utils/logger";
import { Theme, ThemeType } from "@/states/theme";
import { Player } from "@/game/player";
import { SetMapsDataPacket } from "@/network/packets/set-maps-data";
import { Map } from "@/game/map";

export class MapsManager {

    private data: IBattleAsset;

    constructor(
        private readonly server: Server
    ) {
        Logger.info('Initializing battle and maps data...');
        this.data = this.server.getAssetsManager().getData('maps.json');
        Logger.info(`Loaded ${this.data.maps.length} maps and ${this.data.battleLimits.length} battle limits`);
    }

    public getMaps() {
        return this.data.maps
    }

    public getBattlesLimits() {
        return this.data.battleLimits
    }

    public getData(_path: string) {
        return this.server.getAssetsManager().getData(path.join('maps', _path));
    }

    public findMap(name: string, theme: ThemeType = Theme.SUMMER) {
        const data = this.getMaps().find(map => (map.mapId === name && map.theme === theme))

        if (!data) {
            Logger.error(`Map ${name} with theme ${theme} not found`);
            return null;
        }

        return new Map(this, data);
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
import path from 'path';
import { MapsManager } from "@/server/managers/maps";
import { MapDataManager } from './managers/data';
import { IMapData, IMapSpawn } from './types';

export class Map extends MapDataManager {

    public constructor(
        public readonly manager: MapsManager,
        data: IMapData
    ) {
        super(data)
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
}
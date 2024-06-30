import fs from 'fs';
import path from 'path';

import { IResource } from '../resources';
import { Logger } from '../../utils/logger';

export enum AssetType {
    RESOURCES = 'resources',
    DATA = 'data'
}

export class AssetsManager {

    constructor(
        private readonly path: string
    ) { }

    private getPath(type: AssetType, _path?: string) {
        return path.resolve(this.path, type, _path)
    }

    public getData(_path: string) {
        return this.getAsset(AssetType.DATA, _path);
    }

    public getResource(file: string): IResource[] {
        return this.getAsset(AssetType.RESOURCES, file);
    }

    public getAsset(type: AssetType, _path: string) {
        const dir = this.getPath(type, _path)

        if (!fs.existsSync(dir)) {
            Logger.error(`Asset ${dir} not found!`)
            return null;
        }

        try {
            return JSON.parse(fs.readFileSync(dir, 'utf-8'));
        } catch (error) {
            if (error instanceof Error) {
                Logger.error('ASSET-MANAGER', error.message)
            }
            return null
        }
    }
}
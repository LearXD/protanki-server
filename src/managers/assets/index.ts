import fs from 'fs';
import path from 'path';

import { IResource } from '../resources';
import { Logger } from '../../utils/logger';

export enum AssetType {
    RESOURCES = 'resources',
    DATA = 'data'
}

export enum ReadType {
    JSON = 'utf-8',
    BUFFER = 'binary'
}

export class AssetsManager {

    constructor(
        private readonly path: string
    ) { }

    private getPath(type: AssetType, _path?: string) {
        return path.resolve(this.path, type, _path)
    }

    public getData(_path: string, readType: ReadType = ReadType.JSON) {
        return this.getAsset(AssetType.DATA, _path, readType);
    }

    public getResource(file: string): IResource[] {
        return this.getAsset(AssetType.RESOURCES, file);
    }

    public getAsset(type: AssetType, _path: string, readType: ReadType = ReadType.JSON) {
        const dir = this.getPath(type, _path)

        if (!fs.existsSync(dir)) {
            Logger.error(`Asset ${dir} not found!`)
            return null;
        }

        try {
            switch (readType) {
                case ReadType.JSON:
                    return JSON.parse(fs.readFileSync(dir, 'utf-8'));
                case ReadType.BUFFER:
                    return fs.readFileSync(dir);
            }
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message)
            }

        }

        return null
    }
}
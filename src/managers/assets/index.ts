import fs from 'fs';
import path from 'path';

export enum AssetType {
    RESOURCES = 'resources',
    DATA = 'data'
}

export interface IResources {
    resources: any[]
}

export class AssetsManager {

    constructor(
        private readonly _path: string
    ) { }

    private format(fileName: string, type: AssetType) {
        return path.resolve(this._path, type, fileName);
    }

    public getResource(fileName: string): IResources {
        return this.getAsset(fileName, AssetType.RESOURCES);
    }

    public getData<R = any>(fileName: string): R {
        return this.getAsset<R>(fileName, AssetType.DATA);
    }

    public getAsset<R>(fileName: string, type: AssetType): R {
        const path = this.format(fileName, type);
        if (!fs.existsSync(path)) {
            throw new Error(`File not found: ${path}`);
        }
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    }
}
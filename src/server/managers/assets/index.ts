import fs from 'fs';
import path from 'path';
import { AssetType, ReadType } from './types';
import { Logger } from '@/utils/logger';
import { IResource } from '../resources/types';
import { ServerError } from '@/server/utils/error';


export class AssetsManager {

    private readonly path = path.resolve('assets')

    public getData<R = any>(_path: string, readType: ReadType = ReadType.JSON) {
        return this.getAsset(AssetType.DATA, _path, readType) as R;
    }

    public getResource(file: string): IResource[] {
        return this.getAsset(AssetType.RESOURCES, file);
    }

    public getAsset(type: AssetType, _path: string, readType: ReadType = ReadType.JSON) {
        const dir = path.resolve(this.path, type, _path)

        if (!fs.existsSync(dir)) {
            throw new ServerError(`Asset ${dir} not found`)
        }

        try {
            switch (readType) {
                case ReadType.JSON:
                    return JSON.parse(fs.readFileSync(dir, 'utf-8'));
                case ReadType.BUFFER:
                    return fs.readFileSync(dir);
                case ReadType.TEXT:
                    return fs.readFileSync(dir, 'utf-8');
            }
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message)
            }

        }

        return null
    }
}
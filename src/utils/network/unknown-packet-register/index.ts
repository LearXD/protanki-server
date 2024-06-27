import path from "path";
import fs from "fs";

import { ByteArray } from "../byte-array";

export class UnknownPacketRegister {

    private static readonly _path = path.resolve('./unknown-packets')

    private static checkPath(folder?: string) {

        let _path = this._path

        if (!fs.existsSync(this._path)) {
            fs.mkdirSync(this._path)
        }

        if (folder) {
            _path = path.resolve(this._path, folder)
            if (!fs.existsSync(_path)) {
                fs.mkdirSync(_path)
            }

        }

        return _path
    }

    public static register(
        pid: number,
        data: ByteArray
    ) {
        const _path = this.checkPath(pid.toString());
        const fileName = Date.now() + '.bin'
        const file = path.resolve(_path, fileName)
        fs.writeFileSync(file, data.buffer)
    }

    public static get(pid: number) {
        const _path = this.checkPath(pid.toString());
        const files = fs.readdirSync(_path)
        return files.map(file => {
            return {
                time: file.split('.')[0],
                data: new ByteArray(fs.readFileSync(path.resolve(_path, file)))
            }
        })
    }

    public static getAll() {
        const folders = fs.readdirSync(this._path)
        return folders.map(folder => {
            return {
                pid: parseInt(folder),
                packets: this.get(parseInt(folder))
            }
        })
    }
}
import util from 'util'
import Time from '../time'
import chalk from 'chalk'

enum Colors {
    LOG = '#CCCCCC',
    INFO = '#ADD8E6',
    ERROR = '#FF0000',
    ALERT = '#FFFF00',
    DEBUG = '#D3D3D3',
    OK = '#00FF00'
}

export class Logger {

    static getPrefix(
        prefix?: string
    ) {
        return `[${Time.getNowTime()}]${prefix ? ` [${prefix}]` : ``}`
    }

    static show(prefix: string, color: string, ...args: any[]) {

        if (args.length === 0) {
            args.push(prefix)
            prefix = "";
        }

        console.log(
            chalk.hex(color)(this.getPrefix(prefix)),
            ...args.map((arg) => {
                return typeof arg === 'string' ?
                    chalk.hex(color)(arg) :
                    util.inspect(arg, { colors: true, showHidden: false, depth: null })
            })
        )
    }

    static log(prefix: string, ...args: any[]) {
        this.show(prefix, Colors.LOG, ...args)
    }

    static error(prefix: string, ...args: any[]) {
        this.show(prefix, Colors.ERROR, ...args)
    }

    static warn(prefix: string, ...args: any[]) {
        this.show(prefix, Colors.ALERT, ...args)
    }

    static info(prefix: string, ...args: any[]) {
        this.show(prefix, Colors.INFO, ...args)
    }

    static alert(prefix: string, ...args: any[]) {
        this.show(prefix, Colors.ALERT, ...args)
    }

    static debug(prefix: string, ...args: any[]) {
        this.show(prefix, Colors.DEBUG, ...args)
    }

    static ok(prefix: string, ...args: any[]) {
        this.show(prefix, Colors.OK, ...args)
    }
}
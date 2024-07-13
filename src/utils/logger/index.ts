import util from 'util'

import chalk from 'chalk'

enum Colors {
    LOG = '#CCCCCC',
    INFO = '#ADD8E6',
    ERROR = '#FF0000',
    ALERT = '#FFFF00',
    DEBUG = '#ffa500',
    OK = '#00FF00'
}

export class Logger {

    private static getTimestamp() {
        return new Date().toLocaleTimeString()
    }

    static getPrefix(
        prefix?: string
    ) {
        return `[${Logger.getTimestamp()}]${prefix ? ` [${prefix}]` : ``}`
    }

    static show(color: string, ...args: any[]) {
        const stack = new Error().stack.split('\n')
        let prefix = null;

        if (stack.length > 2) {
            prefix = stack[3].split('at ')[1].split(' (')[0].split('.')[0].replace(/new\ /, '')
        }

        console.log(
            chalk.hex(color)(this.getPrefix(args.length > 1 ? args[0] : prefix)),
            ...args.map((arg) => {
                return typeof arg === 'string' ?
                    chalk.hex(color)(arg) :
                    util.inspect(arg, { colors: true, showHidden: false, depth: null })
            })
        )
    }

    static log(...args: any[]) {
        this.show(Colors.LOG, ...args)
    }

    static error(...args: any[]) {
        this.show(Colors.ERROR, ...args)
    }

    static warn(...args: any[]) {
        this.show(Colors.ALERT, ...args)
    }

    static info(...args: any[]) {
        this.show(Colors.INFO, ...args)
    }

    static alert(...args: any[]) {
        this.show(Colors.ALERT, ...args)
    }

    static debug(...args: any[]) {
        this.show(Colors.DEBUG, ...args)
    }

    static ok(...args: any[]) {
        this.show(Colors.OK, ...args)
    }
}
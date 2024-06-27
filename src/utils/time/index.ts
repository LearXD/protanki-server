export default class Time {
    static getNow() {
        return new Date(Date.now())
    }

    static getNowTime() {
        return this.getNow().toLocaleTimeString()
    }

    static getNowDate() {
        return this.getNow().toLocaleDateString()
    }

    static getNowDateTime() {
        return this.getNow().toLocaleString('pt-BR')
    }
}
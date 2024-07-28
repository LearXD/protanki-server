import net from 'net';
import { ServerManager } from './utils/manager';
import { Network } from '../network/network';
import { Logger } from '../utils/logger';
import { Client } from '../game/client';
import { SimplePacket } from '../network/packets/simple-packet';

export class Server extends ServerManager {

    private server: net.Server = net.createServer();
    private network: Network;

    private whitelisted: boolean = false;

    public start = (port: number) => {
        const start = Date.now();
        Logger.info('Starting server...');

        this.init();

        this.server.listen(port, () => {
            const time = Date.now() - start;
            this.sendMessage(`[SERVER] Servidor iniciado em ${time} ms`)
            Logger.info(`Server started on port ${port} (${time}ms)`);
            Logger.debug(`Memory usage: ${this.getMemoryUsage()} MB`);
        })
    }

    public close = () => {
        this.playersManager.getPlayers().forEach((player) => player.close());
        this.server.close();
        Logger.info('Server closed');
    }

    public init() {
        super.init(this);

        this.network = new Network();

        this.server.on('connection', (socket) => this.clientsHandler.handleConnection(socket));
        this.server.on('error', (error) => Logger.error(error.message));

    }

    public getMemoryUsage() {
        return Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
    }

    public getNetwork() {
        return this.network
    }

    public sendMessage = (message: string, warning: boolean = false) => {
        this.getChatManager().sendServerMessage(message, warning);
    }

    public sendPacket(client: Client, packet: SimplePacket) {
        return client.sendPacket(packet);
    }

    public isWhitelisted() {
        return this.whitelisted
    }

    public setWhitelisted(whitelisted: boolean) {
        this.whitelisted = whitelisted;
    }

    public broadcastPacket(packet: SimplePacket, clients: boolean = false) {
        if (clients) {
            return this.clientsHandler.getClients()
                .forEach((client) => this.sendPacket(client, packet));
        }

        return this.playersManager.getPlayers()
            .forEach((client) => this.sendPacket(client, packet));
    }

    public getClientHandler() { return this.clientsHandler }

}
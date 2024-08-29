import net from 'net';

import { Server } from "../..";
import { Player } from '../../../game/player';
import { Logger } from '../../../utils/logger';
import { Client } from '../../../game/client';

export class ClientsHandler {

    private clients: Set<Client> = new Set()

    public constructor(
        private readonly server: Server
    ) { }

    public getClients() { return this.clients }

    public handleConnection = (socket: net.Socket) => {

        const player = new Player(socket, this.server);
        player.init()

        socket.on('data', (data) => player.handleReceivedData(data));
        socket.on('error', () => player.close());
        socket.on('close', () => player.close());

        this.clients.add(player);
        Logger.info(`Client connected: ${player.getName()}`);
    }

    public handleDisconnection = (client: Client) => {
        Logger.info(`Client disconnected: ${client.getName()}`);
        this.clients.delete(client);
    }

}
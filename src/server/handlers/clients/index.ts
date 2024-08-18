import net from 'net';

import { Server } from "../..";
import { Player } from '../../../game/player';
import { Logger } from '../../../utils/logger';
import { Client } from '../../../game/client';

export class ClientsHandler {

    private clients: Map<string, Client> = new Map()

    public constructor(
        private readonly server: Server
    ) { }

    public getClients() { return this.clients }

    public handleConnection = (socket: net.Socket) => {

        const player = new Player(socket, this.server);

        socket.on('data', (data) => player.getPacketHandler().handleReceivedData(data));
        socket.on('error', () => player.close());
        socket.on('close', () => player.close());

        this.clients.set(player.getIdentifier(), player);
        Logger.info(`Client connected: ${player.getIdentifier()}`);
    }

    public handleDisconnection = (client: Client) => {
        Logger.info(`Client disconnected: ${client.getIdentifier()}`);
        this.clients.delete(client.getIdentifier());
    }

}
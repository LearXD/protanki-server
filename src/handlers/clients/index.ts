import net from 'net';

import { Server } from "../../server";
import { Player } from '../../game/player';
import { Logger } from '../../utils/logger';
import { Client } from '../../game/client';

export class ClientsHandler {

    private clients: Map<string, Client> = new Map();

    public constructor(
        private readonly server: Server
    ) { }

    public getClients() { return this.clients }

    public handleConnection = (socket: net.Socket) => {

        const player = new Player(socket, this.server);

        socket.on('data', (data) => player.getPacketHandler().handleReceivedData(data));
        socket.on('error', (error) => player.close());
        socket.on('close', () => this.handleDisconnection(player));

        this.clients.set(player.getIdentifier(), player);
        Logger.info(`Client connected: ${player.getIdentifier()}`);
    }

    public handleDisconnection = (player: Player) => {
        Logger.info(`Client disconnected: ${player.getIdentifier()}`);

        if (player.getUsername() && this.server.getPlayersManager().hasPlayer(player)) {
            this.server.getPlayersManager().removePlayer(player)
        }

        this.clients.delete(player.getIdentifier());
    }

}
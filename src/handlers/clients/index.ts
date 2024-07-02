import net from 'net';

import { Server } from "../../server";
import { Player } from '../../game/player';
import { Logger } from '../../utils/logger';
import { SimplePacket } from '../../network/packets/simple-packet';

export class ClientsHandler {

    private static readonly IDENTIFIER = 'CLIENT-HANDLER';
    private clients: Map<string, Player> = new Map();

    public constructor(
        private readonly server: Server
    ) { }

    public handleConnection = (socket: net.Socket) => {
        const client = new Player(socket, this.server);

        socket.on('data', client.handleData.bind(client));
        socket.on('error', client.close.bind(client));
        socket.on('close', () => this.handleDisconnection(client));

        this.clients.set(client.getIdentifier(), client);
        Logger.info(ClientsHandler.IDENTIFIER, `Player connected: ${client.getIdentifier()}`);
    }

    public handleDisconnection = (client: Player) => {
        Logger.info(ClientsHandler.IDENTIFIER, `Player disconnected: ${client.getIdentifier()}`);
        this.clients.delete(client.getIdentifier());
    }

    public getClients() {
        return this.clients;
    }

    public getClient(identifier: string) {
        return this.clients.get(identifier);
    }

    public broadcast(packet: SimplePacket) {
        this.clients.forEach(client => client.sendPacket(packet));
    }
}
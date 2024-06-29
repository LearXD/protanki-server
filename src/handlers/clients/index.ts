import net from 'net';

import { Server } from "../../server";
import { Client } from '../../game/client';
import { Logger } from '../../utils/logger';
import { SimplePacket } from '../../network/packets/simple-packet';

export class ClientsHandler {

    private static readonly IDENTIFIER = 'CLIENT-HANDLER';
    private clients: Map<string, Client> = new Map();

    public constructor(
        private readonly server: Server
    ) { }

    public handleConnection = (socket: net.Socket) => {
        const client = new Client(socket, this.server);

        socket.on('data', client.handleData.bind(client));
        socket.on('error', client.close.bind(client));
        socket.on('close', () => this.handleDisconnection(client));

        this.clients.set(client.getIdentifier(), client);
        Logger.info(ClientsHandler.IDENTIFIER, `Client connected: ${client.getIdentifier()}`);
    }

    public handleDisconnection = (client: Client) => {
        Logger.info(ClientsHandler.IDENTIFIER, `Client disconnected: ${client.getIdentifier()}`);
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
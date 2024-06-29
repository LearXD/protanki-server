import net from 'net';
import path from 'path';

import { Logger } from './utils/logger';

import { ClientsHandler } from './handlers/clients';
import { Network } from './network/network';
import { AssetsManager } from './managers/assets';
import { AuthManager } from './handlers/auth';
import { TipsManager } from './managers/tips';
import { ResourcesManager } from './managers/resources';
import { UserDataManager } from './managers/user-data';
import { FriendsManager } from './managers/friends';
import { ChatManager } from './managers/chat';
import { BattlesManager } from './managers/battles';
import { MapsManager } from './managers/maps';
import { Client } from './game/client';
import { SimplePacket } from './network/packets/simple-packet';
import { GarageManager } from './managers/garage';
import { LocaleManager } from './managers/locale';

export class Server {

    private static readonly IDENTIFIER = 'SERVER';

    private server: net.Server;
    private network: Network;

    private clientsHandler: ClientsHandler;
    private authManager: AuthManager;

    private assetsManager: AssetsManager;
    private tipsManager: TipsManager;
    private resourcesManager: ResourcesManager
    private userDataManager: UserDataManager;
    private friendsManager: FriendsManager;
    private chatManager: ChatManager;
    private battleManager: BattlesManager;
    private mapsManager: MapsManager;
    private garageManager: GarageManager;
    private localeManager: LocaleManager;

    private whitelisted: boolean = false;

    private static instance: Server;

    public constructor() {
        Server.instance = this;
        this.server = net.createServer();
    }

    public init() {
        this.registerListeners();

        this.clientsHandler = new ClientsHandler(this);

        this.assetsManager = new AssetsManager(path.resolve('./assets'));
        this.resourcesManager = new ResourcesManager(this);

        this.authManager = new AuthManager(this);
        this.tipsManager = new TipsManager(this);
        this.localeManager = new LocaleManager(this);

        this.userDataManager = new UserDataManager(this);
        this.friendsManager = new FriendsManager(this);

        this.chatManager = new ChatManager(this);
        this.mapsManager = new MapsManager(this);
        this.battleManager = new BattlesManager(this);

        this.garageManager = new GarageManager(this);

        this.network = new Network();
    }

    public static getInstance() {
        return this.instance;
    }

    public registerListeners = () => {
        this.server.on('connection', (socket) => this.clientsHandler.handleConnection(socket));
        this.server.on('error', (error) => {
            Logger.error(Server.IDENTIFIER, error.message)
            this.close();
        });
    }

    public start = (port: number) => {
        const start = Date.now();
        Logger.info(Server.IDENTIFIER, 'Starting server...');

        this.init();

        this.server.listen(port, () => {
            const time = Date.now() - start;
            this.sendMessage(`[SERVER] Servidor iniciado em ${time} ms`)
            Logger.info(Server.IDENTIFIER, `Server started on port ${port} (${time}ms)`);
        })
    }

    public close = () => {
        Logger.info(Server.IDENTIFIER, 'Closing server...');
        this.server.close();
        Logger.info(Server.IDENTIFIER, 'Server closed');
    }

    public sendMessage = (message: string, warning: boolean = false) => {
        this.getChatManager().handleSendServerMessage(message, warning);
    }

    public sendPacket(client: Client, packet: SimplePacket) {
        client.sendPacket(packet);
    }

    public broadcastPacket(packet: SimplePacket) {
        this.clientsHandler.getClients().forEach((client) => {
            this.sendPacket(client, packet);
        });
    }

    public getClientHandler() { return this.clientsHandler }
    public getAuthManager() { return this.authManager }

    public getTipsManager() { return this.tipsManager }
    public getAssetsManager() { return this.assetsManager }
    public getResourcesManager() { return this.resourcesManager }
    public getUserDataManager() { return this.userDataManager }
    public getFriendsManager() { return this.friendsManager }
    public getChatManager() { return this.chatManager }
    public getBattlesManager() { return this.battleManager }
    public getMapsManager() { return this.mapsManager }
    public getGarageManager() { return this.garageManager }
    public getLocaleManager() { return this.localeManager }

    public isWhitelisted() { return this.whitelisted }

    public setWhitelisted(whitelisted: boolean) {
        this.whitelisted = whitelisted;
    }

    public getNetwork() { return this.network }
}
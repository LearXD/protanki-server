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
import { Player } from './game/player';
import { SimplePacket } from './network/packets/simple-packet';
import { GarageManager } from './managers/garage';
import { LocaleManager } from './managers/locale';
import { CaptchaManager } from './managers/captcha';
import { ShopManager } from './managers/shop';

export class Server {

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
    private captchaManager: CaptchaManager;
    private shopManager: ShopManager;

    private whitelisted: boolean = false;

    private static instance: Server;

    public constructor() {
        Server.instance = this;
        this.server = net.createServer();
    }

    public init() {
        this.registerListeners();

        this.network = new Network();

        this.clientsHandler = new ClientsHandler(this);

        this.assetsManager = new AssetsManager();
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
        this.captchaManager = new CaptchaManager(this);

        this.shopManager = new ShopManager(this);
    }

    public getNetwork() { return this.network }

    public getClientHandler() { return this.clientsHandler }
    public getAuthManager() { return this.authManager }

    public getLocaleManager(): LocaleManager { return this.localeManager }
    public getTipsManager(): TipsManager { return this.tipsManager }
    public getAssetsManager(): AssetsManager { return this.assetsManager }
    public getResourcesManager(): ResourcesManager { return this.resourcesManager }

    public getUserDataManager(): UserDataManager { return this.userDataManager }
    public getFriendsManager(): FriendsManager { return this.friendsManager }

    public getChatManager(): ChatManager { return this.chatManager }
    public getGarageManager(): GarageManager { return this.garageManager }
    public getBattlesManager(): BattlesManager { return this.battleManager }
    public getMapsManager(): MapsManager { return this.mapsManager }

    public getCaptchaManager(): CaptchaManager { return this.captchaManager }
    public getShopManager(): ShopManager { return this.shopManager }

    public static getInstance() { return this.instance }

    public registerListeners = () => {
        this.server.on('connection', (socket) => this.clientsHandler.handleConnection(socket));
        this.server.on('error', (error) => Logger.error(error.message));
    }

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
        Logger.info('Closing server...');
        this.server.close();
        Logger.info('Server closed');
    }

    public sendMessage = (message: string, warning: boolean = false) => {
        this.getChatManager().sendServerMessage(message, warning);
    }

    public sendPacket(client: Player, packet: SimplePacket) {
        return client.sendPacket(packet);
    }

    public broadcastPacket(packet: SimplePacket) {
        return this.clientsHandler.getClients()
            .forEach((client) => this.sendPacket(client, packet));
    }

    public isWhitelisted() { return this.whitelisted }

    public setWhitelisted(whitelisted: boolean) {
        this.whitelisted = whitelisted;
    }

    public getMemoryUsage() {
        return Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
    }
}
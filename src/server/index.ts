import net from 'net';

import { Network } from '../network/network';
import { Logger } from '../utils/logger';
import { Client } from '../game/client';
import { ClientsHandler } from './handlers/clients';
import { PlayersManager } from './managers/players';
import { AuthManager } from './handlers/auth';
import { CaptchaManager } from './managers/captcha';
import { AssetsManager } from './managers/assets';
import { TipsManager } from './managers/tips';
import { ResourcesManager } from './managers/resources';
import { LocaleManager } from './managers/locale';
import { UserDataManager } from './managers/user-data';
import { FriendsManager } from './managers/friends';
import { ChatManager } from './managers/chat';
import { CommandsManager } from './managers/commands';
import { BattlesManager } from './managers/battles';
import { MapsManager } from './managers/maps';
import { Garage } from './managers/garage';
import { ShopManager } from './managers/shop';
import { RankManager } from './managers/rank';
import { Packet } from '@/network/packets/packet';
import { BattleMode } from '@/states/battle-mode';
import { EquipmentConstraintsMode } from '@/states/equipment-constraints-mode';
import { Rank } from '@/states/rank';

export class Server {

    private server: net.Server = net.createServer();
    private network: Network = new Network();

    private whitelisted: boolean = false;

    /** HANDLERS */
    public readonly clientsHandler: ClientsHandler = new ClientsHandler(this);

    /** MANAGERS */
    public readonly assetsManager: AssetsManager = new AssetsManager();
    public readonly mapsManager: MapsManager = new MapsManager(this);
    public readonly resourcesManager: ResourcesManager = new ResourcesManager(this);

    public readonly battleManager: BattlesManager = new BattlesManager(this);

    public readonly rankManager: RankManager = new RankManager(this);
    public readonly playersManager: PlayersManager = new PlayersManager(this);
    public readonly authManager: AuthManager = new AuthManager(this);
    public readonly captchaManager: CaptchaManager = new CaptchaManager(this);
    public readonly tipsManager: TipsManager = new TipsManager(this);
    public readonly localeManager: LocaleManager = new LocaleManager(this);
    public readonly userDataManager: UserDataManager = new UserDataManager(this);
    public readonly friendsManager: FriendsManager = new FriendsManager(this);
    public readonly chatManager: ChatManager = new ChatManager(this);
    public readonly commandsManager: CommandsManager = new CommandsManager();
    public readonly garageManager: Garage = new Garage(this);
    public readonly shopManager: ShopManager = new ShopManager(this);

    public static instance: Server;
    public constructor() { Server.instance = this; }

    public start = (port: number) => {
        const start = Date.now();
        Logger.info('Starting server...');

        this.battleManager.createBattle('For Newbies', 'map_sandbox')
        this.battleManager.createBattle('For Newbies 2', 'map_noise', {
            autoBalance: false,
            battleMode: BattleMode.CTF,
            equipmentConstraintsMode: EquipmentConstraintsMode.NONE,
            friendlyFire: false,
            scoreLimit: 1,
            timeLimitInSec: 0,
            maxPeopleCount: 2,
            parkourMode: false,
            privateBattle: false,
            proBattle: false,
            rankRange: {
                max: Rank.GENERALISSIMO,
                min: Rank.RECRUIT
            },
            reArmorEnabled: true,
            withoutBonuses: false,
            withoutCrystals: false,
            withoutSupplies: false
        })

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
        this.chatManager.broadcastServerMessage(message, warning);
    }

    public isWhitelisted() {
        return this.whitelisted
    }

    public setWhitelisted(whitelisted: boolean) {
        this.whitelisted = whitelisted;
    }

    public sendPacket(client: Client, packet: Packet) {
        return client.sendPacket(packet);
    }


    public broadcastPacket(packet: Packet, clients: boolean = false) {
        if (clients) {
            return this.clientsHandler.getClients()
                .forEach((client) => this.sendPacket(client, packet));
        }

        return this.playersManager.getPlayers()
            .forEach((client) => this.sendPacket(client, packet));
    }

    public getClientHandler() { return this.clientsHandler }

}
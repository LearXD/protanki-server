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

    private readonly server: net.Server = net.createServer();
    public readonly network: Network = new Network();

    public whitelisted: boolean = false;

    /** HANDLERS */
    public readonly clients: ClientsHandler = new ClientsHandler(this);

    /** MANAGERS */
    public readonly assets: AssetsManager = new AssetsManager();
    public readonly maps: MapsManager = new MapsManager(this);
    public readonly resources: ResourcesManager = new ResourcesManager(this);

    public readonly battles: BattlesManager = new BattlesManager(this);

    public readonly ranks: RankManager = new RankManager(this);
    public readonly players: PlayersManager = new PlayersManager(this);
    public readonly auth: AuthManager = new AuthManager(this);
    public readonly captcha: CaptchaManager = new CaptchaManager(this);
    public readonly tips: TipsManager = new TipsManager(this);
    public readonly locale: LocaleManager = new LocaleManager(this);
    public readonly userDataManager: UserDataManager = new UserDataManager(this);
    public readonly friendsManager: FriendsManager = new FriendsManager(this);
    public readonly chat: ChatManager = new ChatManager(this);
    public readonly commands: CommandsManager = new CommandsManager();
    public readonly garage: Garage = new Garage(this);
    public readonly shop: ShopManager = new ShopManager(this);

    public static instance: Server;
    public constructor() { Server.instance = this; }

    public start = (port: number) => {
        const start = Date.now();
        Logger.info('Starting server...');

        this.server.on('connection', (socket) => this.clients.handleConnection(socket));
        this.server.on('error', (error) => Logger.error(error.message));

        this.server.listen(port, () => {
            const time = Date.now() - start;
            this.sendMessage(`[SERVER] Servidor iniciado em ${time} ms`)
            Logger.info(`Server started on port ${port} (${time}ms)`);
            Logger.debug(`Memory usage: ${this.getMemoryUsage()} MB`);

            this.onStarted()
        })
    }

    public onStarted() {
        this.battles.createBattle('For Newbies', 'map_sandbox')
        this.battles.createBattle('For Newbies 2', 'map_noise', {
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
        this.battles.createBattle('For Newbies 3', 'map_sandbox', {
            autoBalance: false,
            battleMode: BattleMode.CP,
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
    }

    public close = () => {
        this.players.getPlayers().forEach((player) => player.close());
        this.server.close();
        Logger.info('Server closed');
    }

    public getMemoryUsage() {
        return Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
    }

    public sendMessage = (message: string, warning: boolean = false) => {
        this.chat.broadcastServerMessage(message, warning);
    }

    public sendPacket(client: Client, packet: Packet) {
        return client.sendPacket(packet);
    }

    public broadcastPacket(packet: Packet, clients: boolean = false) {
        if (clients) {
            return this.clients.getClients()
                .forEach((client) => this.sendPacket(client, packet));
        }

        return this.players.getPlayers()
            .forEach((client) => this.sendPacket(client, packet));
    }

}
import { Server } from "../..";
import { AuthManager } from "../../handlers/auth";
import { ClientsHandler } from "../../handlers/clients";
import { AssetsManager } from "../../managers/assets";
import { BattlesManager } from "../../managers/battles";
import { CaptchaManager } from "../../managers/captcha";
import { ChatManager } from "../../managers/chat";
import { FriendsManager } from "../../managers/friends";
import { GarageManager } from "../../managers/garage";
import { LocaleManager } from "../../managers/locale";
import { MapsManager } from "../../managers/maps";
import { PlayersManager } from "../../managers/players";
import { ResourcesManager } from "../../managers/resources";
import { ShopManager } from "../../managers/shop";
import { TipsManager } from "../../managers/tips";
import { UserDataManager } from "../../managers/user-data";

export abstract class ServerManager {
    protected clientsHandler: ClientsHandler;
    protected playersManager: PlayersManager;

    protected authManager: AuthManager;
    protected captchaManager: CaptchaManager;

    protected assetsManager: AssetsManager;
    protected tipsManager: TipsManager;
    protected resourcesManager: ResourcesManager;
    protected localeManager: LocaleManager;

    protected userDataManager: UserDataManager;
    protected friendsManager: FriendsManager;

    protected chatManager: ChatManager;
    protected battleManager: BattlesManager;
    protected mapsManager: MapsManager;
    protected garageManager: GarageManager;

    protected shopManager: ShopManager;

    public init(server: Server) {
        this.clientsHandler = new ClientsHandler(server);
        this.playersManager = new PlayersManager(server);

        this.assetsManager = new AssetsManager();
        this.resourcesManager = new ResourcesManager(server);

        this.authManager = new AuthManager(server);
        this.tipsManager = new TipsManager(server);
        this.localeManager = new LocaleManager(server);

        this.userDataManager = new UserDataManager(server);
        this.friendsManager = new FriendsManager(server);

        this.chatManager = new ChatManager(server);
        this.mapsManager = new MapsManager(server);
        this.battleManager = new BattlesManager(server);

        this.garageManager = new GarageManager(server);
        this.captchaManager = new CaptchaManager(server);

        this.shopManager = new ShopManager(server);
    }

    public getPlayersManager() { return this.playersManager }
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
}
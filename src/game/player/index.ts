import net from "net";

import { Logger } from "../../utils/logger";
import { Packet } from "../../network/packets/packet";
import { SimplePacket } from "../../network/packets/simple-packet";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";
import { SendLanguagePacket } from "../../network/packets/send-languague";
import { PongPacket } from "../../network/packets/pong";
import { SendRequestLoadScreenPacketPacket } from "../../network/packets/send-request-load-screen";
import { SendLoginPacket } from "../../network/packets/send-login";
import { SetLayoutStatePacket } from "../../network/packets/set-layout-state";
import { LayoutState, LayoutStateType } from "../../utils/game/layout-state";
import { SetSubLayoutStatePacket } from "../../network/packets/set-sub-layout-state";
import { ResourceType } from "../../managers/resources";
import { SendChatMessagePacket } from "../../network/packets/send-chat-message";
import { SendCreateBattlePacket } from "../../network/packets/send-create-battle";
import { SetViewingBattlePacket } from "../../network/packets/set-viewing-battle";
import { Battle } from "../battle";
import { SendOpenGaragePacket } from "../../network/packets/send-open-garage";
import { SendOpenBattlesListPacket } from "../../network/packets/send-open-battles-list";
import { SendEquipItemPacket } from "../../network/packets/send-equip-item";
import { SendOpenFriendsPacket } from "../../network/packets/send-open-friends";
import { SendFindUserOnFriendsListPacket } from "../../network/packets/send-find-user-on-friends-list";
import { SendFriendRequestPacket } from "../../network/packets/send-friend-request";
import { ValidateFriendRequestPacket } from "../../network/packets/validate-friend-request";
import { SendAcceptFriendRequestPacket } from "../../network/packets/send-accept-friend-request";
import { SendRefuseAllFriendRequestsPacket } from "../../network/packets/send-refuse-all-friend-requests";
import { SendRefuseFriendRequestPacket } from "../../network/packets/send-refuse-friend-request";
import { SendRemoveFriendPacket } from "../../network/packets/send-remove-friend";
import { ValidateFriendPacket } from "../../network/packets/validate-friend";
import { SendRequestUserDataPacket } from "../../network/packets/send-request-user-data";
import { SendRequestConfigDataPacket } from "../../network/packets/send-request-config-data";
import { SendRequestCaptchaPacket } from "../../network/packets/send-request-captcha";
import { SendOpenConfigPacket } from "../../network/packets/send-open-config";
import { SendShowDamageIndicatorPacket } from "../../network/packets/send-show-damage-indicator";
import { SendShowNotificationsPacket } from "../../network/packets/send-show-notifications";
import { SendJoinOnBattlePacket } from "../../network/packets/send-join-on-battle";
import { SendResumePacket } from "../../network/packets/send-resume";
import { SendRequestRespawnPacket } from "../../network/packets/send-request-respawn";
import { Tank } from "../tank";

const IGNORE_PACKETS = [
    1484572481, // Pong
    -555602629
]

export class Player extends Tank {

    private updateInterval: NodeJS.Timeout;

    private viewingBattle: Battle;

    public layoutState: LayoutStateType;

    private bufferPool: ByteArray = new ByteArray();

    public constructor(socket: net.Socket, server: Server) {
        super(socket, server);
        this.init();
    }

    public async init() {
        Logger.debug(this.getIdentifier(), 'Initializing client');

        this.updateInterval = setInterval(this.update.bind(this), 1000);

        await this.getServer().getResourcesManager()
            .sendResources(this, ResourceType.AUTH)

        this.getServer().getCaptchaManager()
            .sendCaptchaLocations(this);

        await this.getServer().getTipsManager()
            .sendLoadingTip(this);

        this.getServer().getAuthManager()
            .sendAuthConfig(this);

    }

    public close() {
        this.getSocket().destroy();
        clearInterval(this.updateInterval);
    }

    public update() {
        super.update();
    }

    public getLayoutState() { return this.layoutState }

    public getViewingBattle(): Battle { return this.viewingBattle }
    public setViewingBattle(battle: Battle) { this.viewingBattle = battle }

    public setLayoutState(state: LayoutStateType) {

        if (this.getLayoutState() === state) return;

        switch (this.getLayoutState()) {
            case LayoutState.GARAGE:
                this.getServer()
                    .getGarageManager()
                    .removeGarageScreen(this);
                break;
            case LayoutState.BATTLE_SELECT:
                this.getServer()
                    .getBattlesManager()
                    .sendRemoveBattlesScreen(this);
        }

        if (this.getLayoutState()) {
            switch (state) {
                case LayoutState.BATTLE_SELECT:
                    this.getServer().getBattlesManager()
                        .sendBattles(this);
                    break;
                case LayoutState.BATTLE:
                    this.getServer().getChatManager()
                        .sendRemoveChatScreen(this);
                    break;
            }
        }

        this.layoutState = state;

        const setLayoutStatePacket = new SetLayoutStatePacket(new ByteArray());
        setLayoutStatePacket.state = state;
        this.sendPacket(setLayoutStatePacket);
    }

    public setSubLayoutState(principal: LayoutStateType, secondary: LayoutStateType) {
        const setLayoutStatePacket = new SetSubLayoutStatePacket(new ByteArray());
        setLayoutStatePacket.principal = principal;
        setLayoutStatePacket.secondary = secondary;
        this.sendPacket(setLayoutStatePacket);
    }

    public handlePacket(packet: SimplePacket) {
        super.handlePacket(packet);

        if (packet instanceof PongPacket) {
            this.updateLastPong();
        }


        if (packet instanceof SendRequestCaptchaPacket) {
            this.getServer()
                .getCaptchaManager()
                .handleRequestCaptcha(this, packet.type);
        }



        if (packet instanceof SendLoginPacket) {
            this.getServer().getAuthManager()
                .handleLogin(this, packet.username, packet.password, packet.remember);
        }

        if (packet instanceof SendChatMessagePacket) {
            this.getServer()
                .getChatManager()
                .handleClientSendMessage(this, packet.text, packet.target);
        }

        if (packet instanceof SendCreateBattlePacket) {
            this.getServer()
                .getBattlesManager()
                .handleCreateBattle(this, packet)
        }

        if (packet instanceof SetViewingBattlePacket) {
            this.getServer()
                .getBattlesManager()
                .handleViewBattle(this, packet.battleId.trim())
        }

        if (packet instanceof SendOpenGaragePacket) {
            this.getServer()
                .getGarageManager()
                .handleOpenGarage(this);
        }

        if (packet instanceof SendOpenBattlesListPacket) {
            this.getServer()
                .getBattlesManager()
                .handleOpenBattlesList(this);
        }

        if (packet instanceof SendEquipItemPacket) {
            this.getServer()
                .getGarageManager()
                .handleEquipItem(this, packet.item);
        }

        if (packet instanceof SendOpenFriendsPacket) {
            this.getServer()
                .getFriendsManager()
                .handleOpenFriends(this);
        }

        if (packet instanceof SendFindUserOnFriendsListPacket) {
            this.getServer()
                .getFriendsManager()
                .handleFindUser(this, packet.userId);
        }

        if (packet instanceof SendFriendRequestPacket) {
            this.getServer()
                .getFriendsManager()
                .handleAddFriend(this, packet.userId);
        }

        if (packet instanceof SendRemoveFriendPacket) {
            this.getServer()
                .getFriendsManager()
                .handleRemoveFriend(this, packet.userId);
        }

        if (packet instanceof ValidateFriendPacket) {
            this.getServer()
                .getFriendsManager()
                .handleValidateFriend(this, packet.userId);
        }

        if (packet instanceof ValidateFriendRequestPacket) {
            this.getServer()
                .getFriendsManager()
                .handleValidateFriendRequest(this, packet.user);
        }

        if (packet instanceof SendAcceptFriendRequestPacket) {
            this.getServer()
                .getFriendsManager()
                .handleAcceptFriendRequest(this, packet.user);
        }

        if (packet instanceof SendRefuseAllFriendRequestsPacket) {
            this.getServer()
                .getFriendsManager()
                .handleRefuseAllFriendRequests(this);
        }

        if (packet instanceof SendRefuseFriendRequestPacket) {
            this.getServer()
                .getFriendsManager()
                .handleRefuseFriendRequest(this, packet.userId);
        }

        if (packet instanceof SendRequestUserDataPacket) {
            this.getServer()
                .getUserDataManager()
                .handleRequestUserData(this, packet.userId);
        }

        if (packet instanceof SendRequestConfigDataPacket) {
            this.getServer()
                .getUserDataManager()
                .handleSendConfigData(this);
        }

        if (packet instanceof SendOpenConfigPacket) {
            this.getServer()
                .getUserDataManager()
                .handleOpenConfig(this);
        }

        if (packet instanceof SendShowDamageIndicatorPacket) {
            this.getServer()
                .getUserDataManager()
                .handleSetShowDamageIndicator(this, packet.enabled);
        }

        if (packet instanceof SendShowNotificationsPacket) {
            this.getServer()
                .getUserDataManager()
                .handleSetShowNotifications(this, packet.enabled);
        }

        if (packet instanceof SendJoinOnBattlePacket) {
            this.getServer()
                .getBattlesManager()
                .handleJoinBattle(this, packet.team);
        }

        if (packet instanceof SendResumePacket) {
            this.spawn();
        }

        if (packet instanceof SendRequestRespawnPacket) {
            this.respawn();
        }

    }

    public handleData = (data: Buffer) => {
        this.bufferPool.write(data)

        if (this.bufferPool.length() < Packet.HEADER_SIZE) {
            return;
        }

        while (true) {

            if (this.bufferPool.length() === 0) {
                break;
            }

            const length = this.bufferPool.readInt();
            const pid = this.bufferPool.readInt();

            const realLength = length - Packet.HEADER_SIZE;

            if (this.bufferPool.length() < realLength) {
                this.bufferPool = new ByteArray()
                    .writeInt(length)
                    .writeInt(pid)
                    .write(this.bufferPool.buffer);
                break;
            }

            const bytes = new ByteArray(this.bufferPool.readBytes(realLength));
            const decoded = this.getCryptoHandler().decrypt(bytes);

            try {
                const packetInstance = this.getServer().getNetwork().findPacket<typeof SimplePacket>(pid);

                if (!IGNORE_PACKETS.includes(pid)) {
                    Logger.log(this.getIdentifier(), `Packet ${packetInstance.name} (${pid}) receive - ${realLength} bytes`)
                }

                const packet = new packetInstance(decoded);
                packet.decode();
                this.handlePacket(packet);
            } catch (error) {
                Logger.alert(this.getIdentifier(), `Packet Unknown (${pid}) receive - ${realLength} bytes`)
                if (error instanceof Error) {
                    Logger.error(this.getIdentifier(), error.message)
                    console.error(error.stack)
                }
            }
        }
    }
}
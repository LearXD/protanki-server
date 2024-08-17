
import { Packet } from "@/network/packets/packet";
import { Player } from "../..";

import { SendAcceptFriendRequestPacket } from "../../../../network/packets/send-accept-friend-request";
import { SendFindUserOnFriendsListPacket } from "../../../../network/packets/send-find-user-on-friends-list";
import { SendFriendRequestPacket } from "../../../../network/packets/send-friend-request";
import { SendOpenFriendsPacket } from "../../../../network/packets/send-open-friends";
import { SendOpenInviteFriendsPacket } from "../../../../network/packets/send-open-invite-friends";
import { SendRefuseAllFriendRequestsPacket } from "../../../../network/packets/send-refuse-all-friend-requests";
import { SendRefuseFriendRequestPacket } from "../../../../network/packets/send-refuse-friend-request";
import { SendRemoveFriendPacket } from "../../../../network/packets/send-remove-friend";
import { SetAddFriendPacket } from "../../../../network/packets/set-add-friend";
import { SetAddSentFriendRequestPacket } from "../../../../network/packets/set-add-sent-friend-request";
import { SetAlreadySentFriendRequestPopupPacket } from "../../../../network/packets/set-already-sent-friend-request-popup";
import { SetFriendsDataPacket } from "../../../../network/packets/set-friends-data";
import { SetInviteFriendsPropertiesPacket } from "../../../../network/packets/set-invite-friends-properties";
import { SetOpenFriendsListPacket } from "../../../../network/packets/set-open-friends-list";
import { SetOpenInviteFriendsPacket } from "../../../../network/packets/set-open-invite-friends";
import { SetRemoveFriendPacket } from "../../../../network/packets/set-remove-friend";
import { SetRemoveFriendRequestPacket } from "../../../../network/packets/set-remove-friend-request";
import { SetUserFoundOnFriendsListPacket } from "../../../../network/packets/set-user-found-on-friends-list";
import { SetUserNotFoundOnFriendsListPacket } from "../../../../network/packets/set-user-not-found-on-friends-list";
import { ValidateFriendPacket } from "../../../../network/packets/validate-friend";
import { ValidateFriendRequestPacket } from "../../../../network/packets/validate-friend-request";

export class PlayerFriendsManager {

    private friendsAccepted: string[] = [];
    private friendsAcceptedNew: string[] = [];
    private friendsIncoming: string[] = [];
    private friendsIncomingNew: string[] = [];
    private friendsOutgoing: string[] = [];

    constructor(
        private readonly player: Player
    ) { }

    public getUserFriendsData() {
        return {
            friendsAccepted: this.friendsAccepted,
            friendsAcceptedNew: this.friendsAcceptedNew,
            friendsIncoming: this.friendsIncoming,
            friendsIncomingNew: this.friendsIncomingNew,
            friendsOutgoing: this.friendsOutgoing
        }
    }

    public sendOpenFriendsList() {
        const setOpenFriendsListPacket = new SetOpenFriendsListPacket();
        this.player.sendPacket(setOpenFriendsListPacket);
    }

    public sendInviteFriendsProperties() {
        const setInviteFriendsPropertiesPacket = new SetInviteFriendsPropertiesPacket();
        setInviteFriendsPropertiesPacket.hash = this.player.getUsername();
        setInviteFriendsPropertiesPacket.host = this.player.server.friendsManager.getHost();
        this.player.sendPacket(setInviteFriendsPropertiesPacket);
    }

    public sendFriendsData() {
        const setFriendsDataPacket = new SetFriendsDataPacket();
        setFriendsDataPacket.friendsAccepted = this.friendsAccepted;
        setFriendsDataPacket.friendsAcceptedNew = this.friendsAcceptedNew;
        setFriendsDataPacket.friendsIncoming = this.friendsIncoming;
        setFriendsDataPacket.friendsIncomingNew = this.friendsIncomingNew;
        setFriendsDataPacket.friendsOutgoing = this.friendsOutgoing;

        this.player.sendPacket(setFriendsDataPacket);
    }

    public sendOpenInviteFriends() {
        const setOpenInviteFriendsPacket = new SetOpenInviteFriendsPacket();
        setOpenInviteFriendsPacket.invites = [];
        setOpenInviteFriendsPacket.inviteLink = 'https://learxd.dev';
        setOpenInviteFriendsPacket.banner = `<h1>Invite your friends ${this.player.getUsername()}</h1>`;
        setOpenInviteFriendsPacket.inviteMessage = `Olá, ${this.player.getUsername()}! Venha jogar comigo no Tanki Online!`;

        this.player.sendPacket(setOpenInviteFriendsPacket);
    }

    public handleValidateFriend(query: string) {
        const validateFriendPacket = new ValidateFriendPacket();
        validateFriendPacket.userId = query;
        this.player.sendPacket(validateFriendPacket);
    }

    public handleRemoveFriend(query: string) {
        // TODO: Implement this
        const setRemoveFriendPacket = new SetRemoveFriendPacket();
        setRemoveFriendPacket.userId = query;
        this.player.sendPacket(setRemoveFriendPacket);
    }

    public handleRefuseAllFriendRequests() {
    }

    public handleRefuseFriendRequest(query: string) {
        // TODO: Implement this
        const setRemoveFriendRequestPacket = new SetRemoveFriendRequestPacket();
        setRemoveFriendRequestPacket.userId = query;
        this.player.sendPacket(setRemoveFriendRequestPacket);
    }

    public handleAcceptFriendRequest(query: string) {
        // TODO: Implement this
        const setAddFriendPacket = new SetAddFriendPacket();
        setAddFriendPacket.user = query;
        this.player.sendPacket(setAddFriendPacket);
    }

    public handleValidateFriendRequest(query: string) {
        // TODO: Implement this
        const validateFriendRequestPacket = new ValidateFriendRequestPacket();
        validateFriendRequestPacket.user = query;
        this.player.sendPacket(validateFriendRequestPacket);
    }

    public handleAddFriend(query: string) {
        // TODO: Implement this

        if (query === 'LearXD') {
            const setAlreadySentFriendRequestPopupPacket = new SetAlreadySentFriendRequestPopupPacket();
            setAlreadySentFriendRequestPopupPacket.userId = query;
            this.player.sendPacket(setAlreadySentFriendRequestPopupPacket);
        }

        const setAddSentFriendRequestPacket = new SetAddSentFriendRequestPacket();
        setAddSentFriendRequestPacket.userId = query;
        this.player.sendPacket(setAddSentFriendRequestPacket);

        /*
            TODO: find the user and send a friend request

            const setAddFriendRequestPacket = new SetAddFriendRequestPacket();
            setAddFriendRequestPacket.user = client.getUsername();
            client.sendPacket(setAddFriendRequestPacket);
        */
    }

    public handleFindUser(query: string) {
        // TODO: Implement this
        if (query === 'LearXD') {
            const setUserFoundOnFriendsListPacket = new SetUserFoundOnFriendsListPacket();
            this.player.sendPacket(setUserFoundOnFriendsListPacket);
            return;
        }
        const setUserNotFoundOnFriendsListPacket = new SetUserNotFoundOnFriendsListPacket();
        this.player.sendPacket(setUserNotFoundOnFriendsListPacket);
    }

    public handlePacket(packet: Packet) {
        if (packet instanceof SendOpenFriendsPacket) {
            this.sendOpenFriendsList();
            return true;
        }

        if (packet instanceof SendFindUserOnFriendsListPacket) {
            this.handleFindUser(packet.userId);
            return true;
        }

        if (packet instanceof SendFriendRequestPacket) {
            this.handleAddFriend(packet.userId);
            return true;
        }

        if (packet instanceof SendRemoveFriendPacket) {
            this.handleRemoveFriend(packet.userId);
            return true;
        }

        if (packet instanceof ValidateFriendPacket) {
            this.handleValidateFriend(packet.userId);
            return true;
        }

        if (packet instanceof ValidateFriendRequestPacket) {
            this.handleValidateFriendRequest(packet.user);
            return true;
        }

        if (packet instanceof SendAcceptFriendRequestPacket) {
            this.handleAcceptFriendRequest(packet.user);
            return true;
        }

        if (packet instanceof SendRefuseAllFriendRequestsPacket) {
            this.handleRefuseAllFriendRequests();
            return true;
        }

        if (packet instanceof SendRefuseFriendRequestPacket) {
            this.handleRefuseFriendRequest(packet.userId);
            return true;
        }

        if (packet instanceof SendOpenInviteFriendsPacket) {
            this.sendOpenInviteFriends();
            return true;
        }

        return false;
    }
}
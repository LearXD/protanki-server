import { Client } from "../../game/client";
import { SetAddFriendPacket } from "../../network/packets/set-add-friend";
import { SetAddFriendRequestPacket } from "../../network/packets/set-add-friend-request";
import { SetAddSentFriendRequestPacket } from "../../network/packets/set-add-sent-friend-request";
import { SetAlreadySentFriendRequestPopupPacket } from "../../network/packets/set-already-sent-friend-request-popup";
import { SetFriendsDataPacket } from "../../network/packets/set-friends-data";
import { SetOpenFriendsListPacket } from "../../network/packets/set-open-friends-list";
import { SetRemoveFriendPacket } from "../../network/packets/set-remove-friend";
import { SetRemoveFriendRequestPacket } from "../../network/packets/set-remove-friend-request";
import { SetUserFoundOnFriendsListPacket } from "../../network/packets/set-user-found-on-friends-list";
import { SetUserNotFoundOnFriendsListPacket } from "../../network/packets/set-user-not-found-on-friends-list";
import { ValidateFriendPacket } from "../../network/packets/validate-friend";
import { ValidateFriendRequestPacket } from "../../network/packets/validate-friend-request";
import { Server } from "../../server";
import { ByteArray } from "../../utils/network/byte-array";

export class FriendsManager {
    constructor(
        private readonly server: Server
    ) { }

    public getUserFriendsData(client: Client) {
        return {
            friendsAccepted: [],
            friendsAcceptedNew: [],
            friendsIncoming: [],
            friendsIncomingNew: [],
            friendsOutgoing: []
        }
    }

    public sendFriendsData(client: Client) {
        const data = this.getUserFriendsData(client);

        const setFriendsDataPacket = new SetFriendsDataPacket(new ByteArray());
        setFriendsDataPacket.friendsAccepted = data.friendsAccepted;
        setFriendsDataPacket.friendsAcceptedNew = data.friendsAcceptedNew;
        setFriendsDataPacket.friendsIncoming = data.friendsIncoming;
        setFriendsDataPacket.friendsIncomingNew = data.friendsIncomingNew;
        setFriendsDataPacket.friendsOutgoing = data.friendsOutgoing;

        client.sendPacket(setFriendsDataPacket);
    }

    public handleValidateFriend(client: Client, query: string) {
        const validateFriendPacket = new ValidateFriendPacket(new ByteArray());
        validateFriendPacket.userId = query;
        client.sendPacket(validateFriendPacket);
    }

    public handleRemoveFriend(client: Client, query: string) {
        // TODO: Implement this
        const setRemoveFriendPacket = new SetRemoveFriendPacket(new ByteArray());
        setRemoveFriendPacket.userId = query;
        client.sendPacket(setRemoveFriendPacket);
    }

    public handleRefuseAllFriendRequests(client: Client) {
    }

    public handleRefuseFriendRequest(client: Client, query: string) {
        // TODO: Implement this
        const setRemoveFriendRequestPacket = new SetRemoveFriendRequestPacket(new ByteArray());
        setRemoveFriendRequestPacket.userId = query;
        client.sendPacket(setRemoveFriendRequestPacket);
    }

    public handleAcceptFriendRequest(client: Client, query: string) {
        // TODO: Implement this
        const setAddFriendPacket = new SetAddFriendPacket(new ByteArray());
        setAddFriendPacket.user = query;
        client.sendPacket(setAddFriendPacket);
    }

    public handleValidateFriendRequest(client: Client, query: string) {
        // TODO: Implement this
        const validateFriendRequestPacket = new ValidateFriendRequestPacket(new ByteArray());
        validateFriendRequestPacket.user = query;
        client.sendPacket(validateFriendRequestPacket);
    }

    public handleAddFriend(client: Client, query: string) {
        // TODO: Implement this

        if (query === 'TheUnknown') {
            const setAlreadySentFriendRequestPopupPacket = new SetAlreadySentFriendRequestPopupPacket(new ByteArray());
            setAlreadySentFriendRequestPopupPacket.userId = query;
            client.sendPacket(setAlreadySentFriendRequestPopupPacket);
        }

        const setAddSentFriendRequestPacket = new SetAddSentFriendRequestPacket(new ByteArray());
        setAddSentFriendRequestPacket.userId = query;
        client.sendPacket(setAddSentFriendRequestPacket);

        /*
            TODO: find the user and send a friend request

            const setAddFriendRequestPacket = new SetAddFriendRequestPacket(new ByteArray());
            setAddFriendRequestPacket.user = client.getUsername();
            client.sendPacket(setAddFriendRequestPacket);
        */
    }

    public handleFindUser(client: Client, query: string) {
        // TODO: Implement this
        if (query === 'TheUnknown') {
            const setUserFoundOnFriendsListPacket = new SetUserFoundOnFriendsListPacket(new ByteArray());
            client.sendPacket(setUserFoundOnFriendsListPacket);
            return;
        }
        const setUserNotFoundOnFriendsListPacket = new SetUserNotFoundOnFriendsListPacket(new ByteArray());
        client.sendPacket(setUserNotFoundOnFriendsListPacket);
    }

    public handleOpenFriends(client: Client) {
        const setOpenFriendsListPacket = new SetOpenFriendsListPacket(new ByteArray());
        client.sendPacket(setOpenFriendsListPacket);
    }
}
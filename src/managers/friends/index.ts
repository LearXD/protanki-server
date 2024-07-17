import { Player } from "../../game/player";
import { SetAddFriendPacket } from "../../network/packets/set-add-friend";
import { SetAddFriendRequestPacket } from "../../network/packets/set-add-friend-request";
import { SetAddSentFriendRequestPacket } from "../../network/packets/set-add-sent-friend-request";
import { SetAlreadySentFriendRequestPopupPacket } from "../../network/packets/set-already-sent-friend-request-popup";
import { SetFriendsDataPacket } from "../../network/packets/set-friends-data";
import { SetInviteFriendsPropertiesPacket } from "../../network/packets/set-invite-friends-properties";
import { SetOpenFriendsListPacket } from "../../network/packets/set-open-friends-list";
import { SetOpenInviteFriendsPacket } from "../../network/packets/set-open-invite-friends";
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

    public getUserFriendsData(client: Player) {
        return {
            friendsAccepted: [],
            friendsAcceptedNew: [],
            friendsIncoming: [],
            friendsIncomingNew: [],
            friendsOutgoing: []
        }
    }

    public sendInviteFriendsProperties(player: Player) {
        const setInviteFriendsPropertiesPacket = new SetInviteFriendsPropertiesPacket();
        setInviteFriendsPropertiesPacket.hash = player.getUsername();
        setInviteFriendsPropertiesPacket.host = 'learxd.dev';
        player.sendPacket(setInviteFriendsPropertiesPacket);
    }

    public sendFriendsData(client: Player) {
        const data = this.getUserFriendsData(client);

        const setFriendsDataPacket = new SetFriendsDataPacket(new ByteArray());
        setFriendsDataPacket.friendsAccepted = data.friendsAccepted;
        setFriendsDataPacket.friendsAcceptedNew = data.friendsAcceptedNew;
        setFriendsDataPacket.friendsIncoming = data.friendsIncoming;
        setFriendsDataPacket.friendsIncomingNew = data.friendsIncomingNew;
        setFriendsDataPacket.friendsOutgoing = data.friendsOutgoing;

        client.sendPacket(setFriendsDataPacket);
    }

    public sendOpenInviteFriends(player: Player) {
        const setOpenInviteFriendsPacket = new SetOpenInviteFriendsPacket();
        setOpenInviteFriendsPacket.invites = [];
        setOpenInviteFriendsPacket.inviteLink = 'https://learxd.dev';
        setOpenInviteFriendsPacket.banner = `<h1>Invite your friends ${player.getUsername()}</h1>`;
        setOpenInviteFriendsPacket.inviteMessage = `Olá, ${player.getUsername()}! Venha jogar comigo no Tanki Online!`;

        player.sendPacket(setOpenInviteFriendsPacket);
    }

    public handleValidateFriend(client: Player, query: string) {
        const validateFriendPacket = new ValidateFriendPacket(new ByteArray());
        validateFriendPacket.userId = query;
        client.sendPacket(validateFriendPacket);
    }

    public handleRemoveFriend(client: Player, query: string) {
        // TODO: Implement this
        const setRemoveFriendPacket = new SetRemoveFriendPacket(new ByteArray());
        setRemoveFriendPacket.userId = query;
        client.sendPacket(setRemoveFriendPacket);
    }

    public handleRefuseAllFriendRequests(client: Player) {
    }

    public handleRefuseFriendRequest(client: Player, query: string) {
        // TODO: Implement this
        const setRemoveFriendRequestPacket = new SetRemoveFriendRequestPacket(new ByteArray());
        setRemoveFriendRequestPacket.userId = query;
        client.sendPacket(setRemoveFriendRequestPacket);
    }

    public handleAcceptFriendRequest(client: Player, query: string) {
        // TODO: Implement this
        const setAddFriendPacket = new SetAddFriendPacket(new ByteArray());
        setAddFriendPacket.user = query;
        client.sendPacket(setAddFriendPacket);
    }

    public handleValidateFriendRequest(client: Player, query: string) {
        // TODO: Implement this
        const validateFriendRequestPacket = new ValidateFriendRequestPacket(new ByteArray());
        validateFriendRequestPacket.user = query;
        client.sendPacket(validateFriendRequestPacket);
    }

    public handleAddFriend(client: Player, query: string) {
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

    public handleFindUser(client: Player, query: string) {
        // TODO: Implement this
        if (query === 'TheUnknown') {
            const setUserFoundOnFriendsListPacket = new SetUserFoundOnFriendsListPacket(new ByteArray());
            client.sendPacket(setUserFoundOnFriendsListPacket);
            return;
        }
        const setUserNotFoundOnFriendsListPacket = new SetUserNotFoundOnFriendsListPacket(new ByteArray());
        client.sendPacket(setUserNotFoundOnFriendsListPacket);
    }

    public handleOpenFriends(client: Player) {
        const setOpenFriendsListPacket = new SetOpenFriendsListPacket(new ByteArray());
        client.sendPacket(setOpenFriendsListPacket);
    }
}
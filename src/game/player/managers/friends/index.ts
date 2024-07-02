
import { Player } from "../..";

import { SendAcceptFriendRequestPacket } from "../../../../network/packets/send-accept-friend-request";
import { SendFindUserOnFriendsListPacket } from "../../../../network/packets/send-find-user-on-friends-list";
import { SendFriendRequestPacket } from "../../../../network/packets/send-friend-request";
import { SendOpenFriendsPacket } from "../../../../network/packets/send-open-friends";
import { SendRefuseAllFriendRequestsPacket } from "../../../../network/packets/send-refuse-all-friend-requests";
import { SendRefuseFriendRequestPacket } from "../../../../network/packets/send-refuse-friend-request";
import { SendRemoveFriendPacket } from "../../../../network/packets/send-remove-friend";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { ValidateFriendPacket } from "../../../../network/packets/validate-friend";
import { ValidateFriendRequestPacket } from "../../../../network/packets/validate-friend-request";

export class PlayerFriendsManager {
    constructor(
        private readonly player: Player
    ) { }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendOpenFriendsPacket) {
            this.player.getServer().getFriendsManager()
                .handleOpenFriends(this.player);
            return true;
        }

        if (packet instanceof SendFindUserOnFriendsListPacket) {
            this.player.getServer().getFriendsManager()
                .handleFindUser(this.player, packet.userId);
            return true;
        }

        if (packet instanceof SendFriendRequestPacket) {
            this.player.getServer().getFriendsManager()
                .handleAddFriend(this.player, packet.userId);
            return true;
        }

        if (packet instanceof SendRemoveFriendPacket) {
            this.player.getServer().getFriendsManager()
                .handleRemoveFriend(this.player, packet.userId);
            return true;
        }

        if (packet instanceof ValidateFriendPacket) {
            this.player.getServer().getFriendsManager()
                .handleValidateFriend(this.player, packet.userId);
            return true;
        }

        if (packet instanceof ValidateFriendRequestPacket) {
            this.player.getServer().getFriendsManager()
                .handleValidateFriendRequest(this.player, packet.user);
            return true;
        }

        if (packet instanceof SendAcceptFriendRequestPacket) {
            this.player.getServer().getFriendsManager()
                .handleAcceptFriendRequest(this.player, packet.user);
            return true;
        }

        if (packet instanceof SendRefuseAllFriendRequestsPacket) {
            this.player.getServer().getFriendsManager()
                .handleRefuseAllFriendRequests(this.player);
            return true;
        }

        if (packet instanceof SendRefuseFriendRequestPacket) {
            this.player.getServer().getFriendsManager()
                .handleRefuseFriendRequest(this.player, packet.userId);
            return true;
        }

        return false;
    }
}
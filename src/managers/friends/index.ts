import { Client } from "../../game/client";
import { SetFriendsDataPacket } from "../../network/packets/set-friends-data";
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
}
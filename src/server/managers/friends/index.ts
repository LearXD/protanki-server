import { Server } from "@/server";


export class FriendsManager {
    constructor(
        private readonly server: Server
    ) { }

    public getHost() {
        return 'learxd.dev';
    }


}
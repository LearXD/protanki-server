import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetAdvisedUsernames extends Packet {

    public usernames: string[] = [];

    constructor(bytes: ByteArray) {
        super(Protocol.SET_ADVISED_USERNAMES, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        if (bytes.readBoolean()) {
            return null
        }

        const size = bytes.readInt();
        this.usernames = new Array(size);

        for (let i = 0; i < size; i++) {
            this.usernames[i] = bytes.readString();
        }

        return {
            username: this.usernames
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeBoolean(this.usernames === null || this.usernames.length === 0);
        bytes.writeInt(this.usernames.length);
        this.usernames.forEach(username => bytes.writeString(username));

        return bytes;
    }
}
import { ByteArray } from "../utils/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface INew {
    imageUrl: string;
    date: string;
    text: string;
}

export class SetNewsPacket extends Packet {

    public news: INew[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_NEWS, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        const length = bytes.readInt();
        this.news = new Array(length)

        for (let i = 0; i < length; i++) {
            this.news[i] = {
                imageUrl: bytes.readString(),
                date: bytes.readString(),
                text: bytes.readString()
            }
        }

        return {
            news: this.news
        }
    }

    public encode() {
        const bytes = new ByteArray();
        bytes.writeInt(this.news.length);
        this.news.forEach(n => {
            bytes.writeString(n.imageUrl);
            bytes.writeString(n.date);
            bytes.writeString(n.text);
        })

        return bytes;
    }
}
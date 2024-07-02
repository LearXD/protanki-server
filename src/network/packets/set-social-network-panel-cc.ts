import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface ISocialNetworkParams {
    authorizationUrl: string;
    linkExists: boolean;
    snId: number;
}

export class SetSocialNetworkPanelCCPacket extends Packet {

    public passwordCreated: boolean;
    public socialNetworkParams: ISocialNetworkParams[]

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_SOCIAL_NETWORK_PANEL_CC, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.passwordCreated = bytes.readBoolean();
        const length = bytes.readInt();
        this.socialNetworkParams = new Array(length);

        for (let i = 0; i < length; i++) {
            this.socialNetworkParams[i] = {
                authorizationUrl: bytes.readString(),
                linkExists: bytes.readBoolean(),
                snId: bytes.readInt()
            }
        }

        return {
            passwordCreated: this.passwordCreated,
            socialNetworkParams: this.socialNetworkParams
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeBoolean(this.passwordCreated);
        bytes.writeInt(this.socialNetworkParams.length);

        for (let i = 0; i < this.socialNetworkParams.length; i++) {
            const socialNetworkParam = this.socialNetworkParams[i];
            bytes.writeString(socialNetworkParam.authorizationUrl);
            bytes.writeBoolean(socialNetworkParam.linkExists);
            bytes.writeInt(socialNetworkParam.snId);
        }

        return bytes;
    }
}
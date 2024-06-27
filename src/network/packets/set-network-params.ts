import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export interface SocialParam {
    authorizationUrl: string,
    snId: string,
}

export class SetNetworkParamsPacket extends Packet {

    public socialParams: SocialParam[] = []

    constructor(bytes: ByteArray) {
        super(Protocol.SET_NETWORK_PARAMS, bytes)
    }

    public decode() {

        const safeBytes = this.cloneBytes();

        var _loc2_ = safeBytes.readInt();

        var _loc4_ = 0;
        while (_loc4_ < _loc2_) {
            this.socialParams[_loc4_] = {
                authorizationUrl: safeBytes.readString(),
                snId: safeBytes.readString(),
            };

            _loc4_++;
        }

        return {
            socialParams: this.socialParams
        }
    }

    public encode() {
        const bytes = new ByteArray()
        bytes.writeInt(this.socialParams.length)

        for (const socialParam of this.socialParams) {
            bytes.writeString(socialParam.authorizationUrl)
            bytes.writeString(socialParam.snId)
        }

        return bytes
    }
}
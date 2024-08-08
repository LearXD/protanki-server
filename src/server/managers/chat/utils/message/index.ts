import { IMessage } from "../../../../../network/packets/set-chat-messages";
import { ChatUser } from "../user";

export class Message {
    constructor(
        public text: string,
        public source: ChatUser = null,
        public target: ChatUser = null,
        public system: boolean = false,
        public warning: boolean = false
    ) { }

    public toObject(): IMessage {
        return {
            sourceUserStatus: this.source && this.source.toObject(),
            system: this.system,
            targetUserStatus: this.target && this.target.toObject(),
            text: this.text,
            warning: this.warning
        }
    }
}
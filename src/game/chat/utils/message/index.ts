import { IMessage } from "../../../../network/packets/set-chat-messages";
import { User } from "../user";

export class Message {
    constructor(
        private text: string,
        private source: User = null,
        private target: User = null,
        private system: boolean = false,
        private warning: boolean = false
    ) { }

    public getSource() {
        return this.source;
    }

    public setSource(source: User) {
        this.source = source;
    }

    public isSystem() {
        return this.system;
    }

    public setSystem(system: boolean) {
        this.system = system;
    }

    public getTarget() {
        return this.target;
    }

    public setTarget(target: User) {
        this.target = target;
    }

    public getText() {
        return this.text;
    }

    public setText(text: string) {
        this.text = text;
    }

    public isWarning() {
        return this.warning;
    }

    public setWarning(warning: boolean) {
        this.warning = warning;
    }

    public toObject(): IMessage {
        return {
            sourceUserStatus: this.source ? this.source.toObject() : null,
            system: this.system,
            targetUserStatus: this.target ? this.target.toObject() : null,
            text: this.text,
            warning: this.warning
        }
    }
}
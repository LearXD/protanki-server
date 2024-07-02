import { ByteArray } from "../../utils/network/byte-array";
import { Protocol } from "../protocol";
import { Packet } from "./packet";

export class SetPremiumDataPacket extends Packet {

    public needShowNotificationCompletionPremium: boolean;
    public needShowWelcomeAlert: boolean;
    public reminderCompletionPremiumTime: number;
    public wasShowAlertForFirstPurchasePremium: boolean;
    public wasShowReminderCompletionPremium: boolean;

    public lifeTimeInSeconds: number;

    constructor(bytes?: ByteArray) {
        super(Protocol.SET_PREMIUM_DATA, bytes)
    }

    public decode() {
        const bytes = this.cloneBytes();

        this.needShowNotificationCompletionPremium = bytes.readBoolean();
        this.needShowWelcomeAlert = bytes.readBoolean();
        this.reminderCompletionPremiumTime = bytes.readInt();
        this.wasShowAlertForFirstPurchasePremium = bytes.readBoolean();
        this.wasShowReminderCompletionPremium = bytes.readBoolean();
        this.lifeTimeInSeconds = bytes.readInt();

        return {
            needShowNotificationCompletionPremium: this.needShowNotificationCompletionPremium,
            needShowWelcomeAlert: this.needShowWelcomeAlert,
            reminderCompletionPremiumTime: this.reminderCompletionPremiumTime,
            wasShowAlertForFirstPurchasePremium: this.wasShowAlertForFirstPurchasePremium,
            wasShowReminderCompletionPremium: this.wasShowReminderCompletionPremium,
            lifeTimeInSeconds: this.lifeTimeInSeconds
        }
    }

    public encode() {
        const bytes = new ByteArray();

        bytes.writeBoolean(this.needShowNotificationCompletionPremium);
        bytes.writeBoolean(this.needShowWelcomeAlert);
        bytes.writeInt(this.reminderCompletionPremiumTime);
        bytes.writeBoolean(this.wasShowAlertForFirstPurchasePremium);
        bytes.writeBoolean(this.wasShowReminderCompletionPremium);
        bytes.writeInt(this.lifeTimeInSeconds);

        return bytes;
    }
}
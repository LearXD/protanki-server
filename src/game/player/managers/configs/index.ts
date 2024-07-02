import { Player } from "../..";
import { SendOpenConfigPacket } from "../../../../network/packets/send-open-config";
import { SendRequestConfigDataPacket } from "../../../../network/packets/send-request-config-data";
import { SendShowDamageIndicatorPacket } from "../../../../network/packets/send-show-damage-indicator";
import { SendShowNotificationsPacket } from "../../../../network/packets/send-show-notifications";
import { SimplePacket } from "../../../../network/packets/simple-packet";

export class PlayerConfigsManager {
    constructor(
        private readonly player: Player
    ) { }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendRequestConfigDataPacket) {
            this.player.getServer().getUserDataManager()
                .handleSendConfigData(this.player);
            return true;
        }

        if (packet instanceof SendOpenConfigPacket) {
            this.player.getServer().getUserDataManager()
                .handleOpenConfig(this.player);
            return true;
        }

        if (packet instanceof SendShowDamageIndicatorPacket) {
            this.player.getServer().getUserDataManager()
                .handleSetShowDamageIndicator(this.player, packet.enabled);
            return true;
        }

        if (packet instanceof SendShowNotificationsPacket) {
            this.player.getServer().getUserDataManager()
                .handleSetShowNotifications(this.player, packet.enabled);
            return true;
        }

        return false;
    }
}
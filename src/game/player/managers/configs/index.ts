import { Packet } from "@/network/packets/packet";
import { Player } from "../..";
import { SendOpenConfigPacket } from "../../../../network/packets/send-open-config";
import { SendRequestConfigDataPacket } from "../../../../network/packets/send-request-config-data";
import { SendShowDamageIndicatorPacket } from "../../../../network/packets/send-show-damage-indicator";
import { SendShowNotificationsPacket } from "../../../../network/packets/send-show-notifications";

export class PlayerConfigsManager {
    constructor(
        private readonly player: Player
    ) { }

    public handlePacket(packet: Packet) {
        if (packet instanceof SendRequestConfigDataPacket) {
            this.player.server.userDataManager
                .handleSendConfigData(this.player);
            return true;
        }

        if (packet instanceof SendOpenConfigPacket) {
            this.player.server.userDataManager
                .handleOpenConfig(this.player);
            return true;
        }

        if (packet instanceof SendShowDamageIndicatorPacket) {
            this.player.server.userDataManager
                .handleSetShowDamageIndicator(this.player, packet.enabled);
            return true;
        }

        if (packet instanceof SendShowNotificationsPacket) {
            this.player.server.userDataManager
                .handleSetShowNotifications(this.player, packet.enabled);
            return true;
        }

        return false;
    }
}
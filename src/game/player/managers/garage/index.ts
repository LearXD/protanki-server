import { Player } from "../..";
import { SendEquipItemPacket } from "../../../../network/packets/send-equip-item";
import { SendOpenGaragePacket } from "../../../../network/packets/send-open-garage";
import { SimplePacket } from "../../../../network/packets/simple-packet";

export class PlayerGarageManager {
    constructor(
        private readonly player: Player
    ) { }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendOpenGaragePacket) {
            this.player.getServer().getGarageManager()
                .handleOpenGarage(this.player);
            return true
        }

        if (packet instanceof SendEquipItemPacket) {
            this.player.getServer().getGarageManager()
                .handleEquipItem(this.player, packet.item);
            return true
        }
        return false;
    }
}
import { Player } from "../..";
import { SendBuyGarageItemPacket } from "../../../../network/packets/send-buy-garage-item";
import { SendEquipItemPacket } from "../../../../network/packets/send-equip-item";
import { SendOpenGaragePacket } from "../../../../network/packets/send-open-garage";
import { SetEquipGarageItemPacket } from "../../../../network/packets/set-equip-garage-item";
import { SimplePacket } from "../../../../network/packets/simple-packet";

export class PlayerGarageManager {
    constructor(
        private readonly player: Player
    ) { }


    public handleEquipItem(client: Player, itemId: string) {
        if (this.player.getDataManager().equipItem(itemId)) {
            const setEquipGarageItemPacket = new SetEquipGarageItemPacket();
            setEquipGarageItemPacket.itemId = itemId;
            setEquipGarageItemPacket.equipped = true;
            client.sendPacket(setEquipGarageItemPacket)
        }
    }

    public handleBuyItem(client: Player, itemId: string, amount: number, price: number) {
        if (client.getDataManager().getCrystals() < price) {
            return;
        }

        client.getDataManager().decreaseCrystals(price);
        this.player.getDataManager().addItem(itemId);
    }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendOpenGaragePacket) {
            this.player.getServer().getGarageManager().handleOpenGarage(this.player);
            return true
        }

        if (packet instanceof SendEquipItemPacket) {
            this.player.getGarageManager().handleEquipItem(this.player, packet.item);
            return true
        }

        if (packet instanceof SendBuyGarageItemPacket) {
            this.player.getGarageManager().handleBuyItem(
                this.player, packet.item, packet.count, packet.price
            );
            return
        }

        return false;
    }
}
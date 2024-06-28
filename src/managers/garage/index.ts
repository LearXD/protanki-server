import { Client } from "../../game/client";
import { SetEquipGarageItemPacket } from "../../network/packets/set-equip-garage-item";
import { SetGarageItemsPropertiesPacket } from "../../network/packets/set-garage-items-properties";
import { SetRemoveGaragePacket } from "../../network/packets/set-remove-garage";
import { SetUserGarageItemsPacket } from "../../network/packets/set-user-garage-items";
import { Server } from "../../server";
import { LayoutState } from "../../utils/game/layout-state";
import { ByteArray } from "../../utils/network/byte-array";
import { ResourceType } from "../resources";

export class GarageManager {
    public constructor(
        private readonly server: Server
    ) { }

    public async handleOpenGarage(client: Client) {
        client.setLayoutState(LayoutState.GARAGE);

        await this.server
            .getResourcesManager()
            .sendResources(client, ResourceType.GARAGE);

        const items = this.server.getAssetsManager().getData('user-garage.json')
        const setUserGarageItemsPacket = new SetUserGarageItemsPacket(new ByteArray());
        setUserGarageItemsPacket.items = items;
        client.sendPacket(setUserGarageItemsPacket);

        this.sendEquippedItems(client);
        this.sendGarageItems(client);

        client.setSubLayoutState(LayoutState.GARAGE, LayoutState.GARAGE);
    }

    public sendEquippedItems(client: Client) {
        const setEquipGarageItemPacket = new SetEquipGarageItemPacket(new ByteArray());

        setEquipGarageItemPacket.itemId = 'hunter_m0'
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = 'smoky_m1'
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = 'green_m0'
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);
    }

    public sendGarageItems(client: Client) {
        // TODO: This have a logic for sending garage items
        const garage = this.server.getAssetsManager().getData('garage.json')
        const setGarageItemsPropertiesPacket = new SetGarageItemsPropertiesPacket(new ByteArray());
        setGarageItemsPropertiesPacket.items = garage;
        // setGarageItemsPropertiesPacket.items = {
        //     ...garage,
        //     delayMountArmorInSec: 0,
        //     delayMountWeaponInSec: 0,
        //     delayMountColorInSec: 0
        // };
        client.sendPacket(setGarageItemsPropertiesPacket);
    }

    public removeGarageScreen(client: Client) {
        const setRemoveGaragePacket = new SetRemoveGaragePacket(new ByteArray());
        client.sendPacket(setRemoveGaragePacket);
    }
}
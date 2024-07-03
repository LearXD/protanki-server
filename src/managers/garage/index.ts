import path from 'path';

import { Player } from "../../game/player";
import { SetEquipGarageItemPacket } from "../../network/packets/set-equip-garage-item";
import { SetGarageItemsPropertiesPacket } from "../../network/packets/set-garage-items-properties";
import { SetRemoveGaragePacket } from "../../network/packets/set-remove-garage";
import { SetUserGarageItemsPacket } from "../../network/packets/set-user-garage-items";
import { Server } from "../../server";
import { LayoutState } from "../../utils/game/layout-state";
import { ByteArray } from "../../utils/network/byte-array";
import { ResourceType } from "../resources";
import { Logger } from '../../utils/logger';
import { GarageItemType, IGarageItem } from './types';

export class GarageManager {

    public items: IGarageItem[] = [];

    static parseItemName(itemId: string) {
        const [name, level] = itemId.split('_m');
        return { name, level: parseInt(level) }
    }

    public constructor(
        private readonly server: Server
    ) {
        this.init();
    }

    public init() {
        Logger.info('Initializing garage items...');

        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'smoky.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'flamethrower.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'freeze.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'isis.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'ricochet.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'railgun.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'twins.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'shotgun.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'thunder.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'machinegun.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'shaft.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.TURRET, 'railgun-xt.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.HULL, 'hunter.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.HULL, 'wasp.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.HULL, 'hornet.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.HULL, 'viking.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.HULL, 'dictator.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.HULL, 'titan.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.HULL, 'mammoth.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.HULL, 'hornet-xt.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.PAINT, 'paintings.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.SUPPLY, 'supplies.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.SPECIAL, 'gifts.json'));
        this.addGarageItem(this.getGarageData(GarageItemType.SPECIAL, 'special.json'));

        this.addGarageItem(this.getGarageData(GarageItemType.KIT, 'kits.json'));

        Logger.info(`Initialized ${this.items.length} garage items`);
    }

    public addGarageItem(item: IGarageItem | IGarageItem[]) {
        if (Array.isArray(item)) {
            this.items.push(...item)
            return;
        }
        this.items.push(item);
    }

    public getGarageData(type: GarageItemType, file: string) {
        return this.server.getAssetsManager()
            .getData(path.join('garage', type, file));
    }

    public async handleOpenGarage(player: Player) {

        player.setLayoutState(LayoutState.GARAGE);

        await this.server.getResourcesManager()
            .sendResources(player, ResourceType.GARAGE);

        const userItems: IGarageItem[] = []
        const garageItems: IGarageItem[] = []

        const userSupplies = player.getDataManager().getSupplies();
        const playerGarageItems = player.getDataManager().getGarageItems();

        for (const item of this.items) {
            if (item.category === 'inventory') {
                if (Object.keys(userSupplies).includes(item.id)) {
                    const supply = {
                        ...item,
                        count: userSupplies[item.id]
                    }
                    userItems.push(supply);
                }
                continue;
            }

            const has = playerGarageItems.some((garageItem) => {
                return garageItem.name === item.id && (Number.isInteger(item.modificationID) ? garageItem.level === item.modificationID : true)
            })

            if (has) {
                userItems.push(item)
                continue;
            }

            garageItems.push(item)
        }

        this.sendUserGarageItems(player, userItems);

        this.sendEquippedItems(player)
        this.sendGarageItems(player, garageItems);

        player.setSubLayoutState(LayoutState.GARAGE, LayoutState.GARAGE);
    }

    public getItemCategory(itemId: string) {
        const parsed = GarageManager.parseItemName(itemId);
        const found = this.items.find((item) => {
            return item.id === parsed.name && (item.modificationID ? item.modificationID === parsed.level : true)
        })

        switch (found?.category) {
            case 'armor': return GarageItemType.HULL;
            case 'weapon': return GarageItemType.TURRET;
            case 'paint': return GarageItemType.PAINT;
            case 'inventory': return GarageItemType.SUPPLY;
            case 'kit': return GarageItemType.KIT;
            case 'special': return GarageItemType.SPECIAL;
        }

        return GarageItemType.UNKNOWN;
    }

    public sendEquippedItems(client: Player) {
        const setEquipGarageItemPacket = new SetEquipGarageItemPacket(new ByteArray());

        setEquipGarageItemPacket.itemId = client.getDataManager().getEquippedHull();
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = client.getDataManager().getEquippedTurret();
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = client.getDataManager().getEquippedPainting();
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);
    }

    public sendUserGarageItems(client: Player, items: IGarageItem[]) {
        const setUserGarageItemsPacket = new SetUserGarageItemsPacket(new ByteArray());
        setUserGarageItemsPacket.items = items;
        setUserGarageItemsPacket.garageBoxId = 170001;
        client.sendPacket(setUserGarageItemsPacket);
    }

    public sendGarageItems(client: Player, items: IGarageItem[]) {
        const setGarageItemsPropertiesPacket = new SetGarageItemsPropertiesPacket(new ByteArray());

        setGarageItemsPropertiesPacket.items = items
        setGarageItemsPropertiesPacket.delayMountArmorInSec = 1000;
        setGarageItemsPropertiesPacket.delayMountWeaponInSec = 1000;
        setGarageItemsPropertiesPacket.delayMountColorInSec = 1000;

        client.sendPacket(setGarageItemsPropertiesPacket);
    }

    public removeGarageScreen(client: Player) {
        const setRemoveGaragePacket = new SetRemoveGaragePacket(new ByteArray());
        client.sendPacket(setRemoveGaragePacket);
    }
}
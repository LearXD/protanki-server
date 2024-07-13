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
import { GarageItemCategory, GarageItemFolder, IGarageItem, IHullProperties, ITurretProperties, ITurretSfx } from './types';

export class GarageManager {

    public items: Map<string, IGarageItem> = new Map();

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

        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'smoky.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'flamethrower.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'freeze.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'isis.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'ricochet.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'railgun.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'twins.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'shotgun.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'thunder.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'machinegun.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'shaft.json'));
        this.addItems(this.getItemData(GarageItemFolder.TURRET, 'railgun-xt.json'));
        this.addItems(this.getItemData(GarageItemFolder.HULL, 'hunter.json'));
        this.addItems(this.getItemData(GarageItemFolder.HULL, 'wasp.json'));
        this.addItems(this.getItemData(GarageItemFolder.HULL, 'hornet.json'));
        this.addItems(this.getItemData(GarageItemFolder.HULL, 'viking.json'));
        this.addItems(this.getItemData(GarageItemFolder.HULL, 'dictator.json'));
        this.addItems(this.getItemData(GarageItemFolder.HULL, 'titan.json'));
        this.addItems(this.getItemData(GarageItemFolder.HULL, 'mammoth.json'));
        this.addItems(this.getItemData(GarageItemFolder.HULL, 'hornet-xt.json'));
        this.addItems(this.getItemData(GarageItemFolder.PAINT, 'paintings.json'));
        this.addItems(this.getItemData(GarageItemFolder.SUPPLY, 'supplies.json'));
        this.addItems(this.getItemData(GarageItemFolder.SPECIAL, 'gifts.json'));
        this.addItems(this.getItemData(GarageItemFolder.SPECIAL, 'special.json'));

        this.addItems(this.getItemData(GarageItemFolder.KIT, 'kits.json'));

        Logger.info(`Initialized ${this.items.size} garage items`);
    }

    public addItems(items: IGarageItem[]) {
        for (const item of items) {
            this.addItem(item);
        }
    }

    public addItem(item: IGarageItem) {
        this.items.set(`${item.id}_m${item.modificationID ?? 0}`, item);
    }

    public getItem(itemId: string) {
        return this.items.get(itemId);
    }

    public getTurretProperties(itemId: string): ITurretProperties {
        return this.getData(path.join('properties', 'turrets', itemId, 'properties.json'));
    }

    public getTurretSfx(itemId: string): ITurretSfx {
        return this.getData(path.join('properties', 'turrets', itemId, 'sfx.json'));
    }

    public getHullProperties(itemId: string): IHullProperties {
        return this.getData(path.join('properties', 'hulls', itemId, 'properties.json'));
    }

    public getItemProperties(itemId: string) {
        return this.getData(path.join('properties', itemId));
    }

    public getItemData(item: GarageItemFolder, file: string) {
        return this.getData(path.join('items', item, file));
    }

    public getData(_path: string) {
        return this.server.getAssetsManager()
            .getData(path.join('garage', _path));
    }

    public getItemCategory(itemId: string) {
        const item = this.items.get(itemId);

        switch (item?.category) {
            case 'armor': return GarageItemCategory.HULL;
            case 'weapon': return GarageItemCategory.TURRET;
            case 'paint': return GarageItemCategory.PAINT;
            case 'inventory': return GarageItemCategory.SUPPLY;
            case 'kit': return GarageItemCategory.KIT;
            case 'special': return GarageItemCategory.SPECIAL;
        }

        return GarageItemCategory.UNKNOWN;
    }

    public sendEquippedItems(client: Player) {
        const setEquipGarageItemPacket = new SetEquipGarageItemPacket(new ByteArray());

        setEquipGarageItemPacket.itemId = client.getGarageManager().getEquippedHull();
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = client.getGarageManager().getEquippedTurret();
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = client.getGarageManager().getEquippedPainting();
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
        setGarageItemsPropertiesPacket.delayMountArmorInSec = 0;
        setGarageItemsPropertiesPacket.delayMountWeaponInSec = 0;
        setGarageItemsPropertiesPacket.delayMountColorInSec = 0;

        client.sendPacket(setGarageItemsPropertiesPacket);
    }

    public removeGarageScreen(client: Player) {
        const setRemoveGaragePacket = new SetRemoveGaragePacket(new ByteArray());
        client.sendPacket(setRemoveGaragePacket);
    }

    public async handleOpenGarage(player: Player) {

        player.setLayoutState(LayoutState.GARAGE);

        await this.server.getResourcesManager()
            .sendResources(player, ResourceType.GARAGE);

        const userItems: IGarageItem[] = []
        const garageItems: IGarageItem[] = []

        const supplies = player.getGarageManager().getSupplies();

        const turrets = player.getGarageManager().getTurrets();
        const hulls = player.getGarageManager().getHulls();
        const paintings = player.getGarageManager().getPaintings();

        for (const item of this.items.values()) {
            const category = item.category;

            if (category === GarageItemCategory.SUPPLY) {
                const names = Object.keys(supplies);
                if (names.includes(item.id)) {
                    userItems.push({
                        ...item,
                        count: supplies[item.id]
                    });
                }
                continue;
            }

            if (category === GarageItemCategory.HULL) {
                const has = hulls.some((hull) => hull.name === item.id && hull.level === item.modificationID);
                if (has) {
                    userItems.push(item)
                    continue;
                }
            }

            if (category === GarageItemCategory.TURRET) {
                const has = turrets.some((turret) => turret.name === item.id && turret.level === item.modificationID);
                if (has) {
                    userItems.push(item)
                    continue;
                }
            }

            if (category === GarageItemCategory.PAINT) {
                const has = paintings.some((painting) => painting.name === item.id);
                if (has) {
                    userItems.push(item)
                    continue;
                }
            }

            garageItems.push(item)
        }

        this.sendUserGarageItems(player, userItems);

        this.sendEquippedItems(player)
        this.sendGarageItems(player, garageItems);

        player.setSubLayoutState(LayoutState.GARAGE, LayoutState.GARAGE);
    }
}
import path from 'path';

import { Server } from "../../server";
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

    public getItems() { return this.items }

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

}
import path from 'path';
import { GarageItemFolder, IGarageItem, IHullPhysics, ITurretPhysics, ITurretSfx } from './types';
import { Server } from '@/server';
import { Logger } from '@/utils/logger';
import { GarageItemUtils } from '@/game/player/managers/garage/utils/item';
import { ServerError } from '@/server/utils/error';
import { ITurretProperties, SetTurretsDataPacket } from '@/network/packets/set-turrets-data';
import { Player } from '@/game/player';

export class Garage {

    public turretsProperties: ITurretProperties[] = []
    public items: Map<string, IGarageItem> = new Map()

    public constructor(
        private readonly server: Server
    ) {
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

        Logger.info('Loading turret properties...');
        this.turretsProperties = this.getData('turrets.json');

        if (this.turretsProperties.length === 0) {
            throw new ServerError('Failed to load turret properties');
        }

        Logger.info(`Loaded ${this.turretsProperties.length} turret properties`);
    }

    // ASSETS
    public getData(_path: string) {
        return this.server.assets.getData(path.join('garage', _path));
    }

    public getItemData(item: GarageItemFolder, file: string) {
        return this.getData(path.join('items', item, file));
    }

    // GARAGE ITEMS
    public addItems(items: IGarageItem[]) {
        items.forEach(item => this.addItem(item));
    }

    public addItem(item: IGarageItem) {
        this.items.set(GarageItemUtils.serialize(item.id, item.modificationID), item);
    }

    // TURRET PHYSICS
    public getTurretPhysics(itemId: string): ITurretPhysics {
        return this.getData(path.join('physics', 'turrets', itemId, 'properties.json'));
    }

    public getTurretSfx(itemId: string): ITurretSfx {
        return this.getData(path.join('physics', 'turrets', itemId, 'sfx.json'));
    }

    public getHullPhysics(itemId: string): IHullPhysics {
        return this.getData(path.join('physics', 'hulls', itemId, 'properties.json'));
    }

    // TURRET PROPERTIES
    public getTurretProperties(itemId: string) {
        return this.turretsProperties.find(turret => turret.id === itemId);
    }

    public sendTurretsProperties(player: Player) {
        const setTurretsDataPacket = new SetTurretsDataPacket();
        setTurretsDataPacket.turrets = this.turretsProperties;
        player.sendPacket(setTurretsDataPacket);
    }
}
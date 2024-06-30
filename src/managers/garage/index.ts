import path from 'path';

import { Client } from "../../game/client";
import { SetEquipGarageItemPacket } from "../../network/packets/set-equip-garage-item";
import { SetGarageItemsPropertiesPacket } from "../../network/packets/set-garage-items-properties";
import { SetRemoveGaragePacket } from "../../network/packets/set-remove-garage";
import { SetUserGarageItemsPacket } from "../../network/packets/set-user-garage-items";
import { Server } from "../../server";
import { LayoutState } from "../../utils/game/layout-state";
import { ByteArray } from "../../utils/network/byte-array";
import { ResourceType } from "../resources";

export interface IKitItem {
    count: number
    id: string
}

export interface IKit {
    image: number
    discountInPercent: number
    kitItems: IKitItem[]
}

export interface IDiscount {
    percent: number
    timeLeftInSeconds: number
    timeToStartInSeconds: number
}

export interface IProperty {
    property: string
    value: string
    subproperties: IProperty[]
}

export interface IGarageItem {
    id: string
    name: string
    description: string
    isInventory: boolean
    index: number
    next_price: number
    next_rank: number
    type: number
    baseItemId: number
    previewResourceId: number
    rank: number
    category: string
    properts: IProperty
    discount: IDiscount
    grouped: boolean
    isForRent: boolean
    price: number
    remainingTimeInSec: number
    modificationID?: number
    object3ds?: number
    coloring?: number
    kit?: IKit
    count?: number
}

export enum GarageItemType {
    HULL = 'hulls',
    TURRET = 'turrets',
    PAINT = 'paintings',
    SPECIAL = 'specials',
    SUPPLY = 'supplies',
    KIT = 'kits'
}


export class GarageManager {

    public items: IGarageItem[] = [];

    public constructor(
        private readonly server: Server
    ) {
        this.init();
    }

    public init() {
        // TURRETS
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

        // HULLS
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
    }

    public addGarageItem(item: IGarageItem | IGarageItem[]) {
        if (Array.isArray(item)) {
            this.items.push(...item);
            return;
        }
        this.items.push(item);
    }

    public getGarageData(type: GarageItemType, file: string) {
        return this.server
            .getAssetsManager()
            .getData(path.join('garage', type, file));
    }

    public async handleOpenGarage(client: Client) {
        client.setLayoutState(LayoutState.GARAGE);

        await this.server
            .getResourcesManager()
            .sendResources(client, ResourceType.GARAGE);

        const userData = this.server.getUserDataManager()
            .getUserData(client)

        const userItems: IGarageItem[] = []
        const garageItems: IGarageItem[] = []

        const userTurrets = userData.getTurrets();
        const userHulls = userData.getHulls();
        const userPaintings = userData.getPaintings();
        const userSupplies = userData.getSupplies();

        for (const item of this.items) {

            if (item.category === 'weapon') {
                const has = userTurrets.some(
                    (turret) => turret.name === item.id && turret.level === item.modificationID
                )

                if (has) {
                    userItems.push(item);
                    continue;
                }
            }

            if (item.category === 'armor') {
                const has = userHulls.some(
                    (hull) => hull.name === item.id && hull.level === item.modificationID
                )

                if (has) {
                    userItems.push(item)
                    continue;
                }
            }

            if (item.category === 'paint') {
                const has = userPaintings.some(
                    (painting) => painting.name === item.id
                )

                if (has) {
                    userItems.push(item);
                    continue;
                }

            }

            if (item.category === 'inventory') {
                if (Object.keys(userSupplies).includes(item.id)) {
                    const supply = {
                        ...item,
                        count: userSupplies[item.id]
                    }
                    console.log(supply)
                    userItems.push(supply);
                }
                continue;
            }

            garageItems.push(item)
        }

        this.sendUserGarageItems(client, userItems);
        this.sendEquippedItems(client)
        this.sendGarageItems(client, garageItems);

        client.setSubLayoutState(LayoutState.GARAGE, LayoutState.GARAGE);
    }

    public handleEquipItem(client: Client, itemId: string) {
        const setEquipGarageItemPacket = new SetEquipGarageItemPacket(new ByteArray());
        setEquipGarageItemPacket.itemId = itemId;
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);
    }

    public sendEquippedItems(client: Client) {
        const userData = this.server
            .getUserDataManager()
            .getUserData(client);

        const setEquipGarageItemPacket = new SetEquipGarageItemPacket(new ByteArray());

        const equippedHull = userData.getHulls().find((hull) => hull.equipped);
        const equippedTurret = userData.getTurrets().find((turret) => turret.equipped);
        const equippedPainting = userData.getPaintings().find((painting) => painting.equipped);

        setEquipGarageItemPacket.itemId = `${equippedHull.name}_m${equippedHull.level}`;
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = `${equippedTurret.name}_m${equippedTurret.level}`;
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = `${equippedPainting.name}_m0`;
        setEquipGarageItemPacket.equipped = true;
        client.sendPacket(setEquipGarageItemPacket);
    }

    public sendUserGarageItems(client: Client, items: IGarageItem[]) {
        const setUserGarageItemsPacket = new SetUserGarageItemsPacket(new ByteArray());
        setUserGarageItemsPacket.items = items;
        setUserGarageItemsPacket.garageBoxId = 170001;
        client.sendPacket(setUserGarageItemsPacket);
    }

    public sendGarageItems(client: Client, items: IGarageItem[]) {
        const setGarageItemsPropertiesPacket = new SetGarageItemsPropertiesPacket(new ByteArray());

        setGarageItemsPropertiesPacket.items = items
        setGarageItemsPropertiesPacket.delayMountArmorInSec = 1000;
        setGarageItemsPropertiesPacket.delayMountWeaponInSec = 1000;
        setGarageItemsPropertiesPacket.delayMountColorInSec = 1000;

        client.sendPacket(setGarageItemsPropertiesPacket);
    }

    public removeGarageScreen(client: Client) {
        const setRemoveGaragePacket = new SetRemoveGaragePacket(new ByteArray());
        client.sendPacket(setRemoveGaragePacket);
    }
}
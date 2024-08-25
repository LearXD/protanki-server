import { GarageItemCategory, IGarageItem } from "../../../../server/managers/garage/types";
import { Player } from "../..";
import { SendBuyGarageItemPacket } from "../../../../network/packets/send-buy-garage-item";
import { SendBuyGarageKitPacket } from "../../../../network/packets/send-buy-garage-kit";
import { SendEquipItemPacket } from "../../../../network/packets/send-equip-item";
import { SendOpenGaragePacket } from "../../../../network/packets/send-open-garage";
import { SendPreviewPaintingPacket } from "../../../../network/packets/send-preview-painting";
import { SetEquipGarageItemPacket } from "../../../../network/packets/set-equip-garage-item";
import { SetGarageItemsPropertiesPacket } from "../../../../network/packets/set-garage-items-properties";
import { SetRemoveGaragePacket } from "../../../../network/packets/set-remove-garage";
import { SetSuppliesPacket } from "../../../../network/packets/set-supplies";
import { SetUseSupplyPacket } from "../../../../network/packets/set-use-supply";
import { SetUserGarageItemsPacket } from "../../../../network/packets/set-user-garage-items";
import { LayoutState } from "../../../../states/layout-state";
import { Supply, SupplyType } from "../../../../states/supply";
import { Logger } from "../../../../utils/logger";
import { IGarageHull, IGaragePainting, IGarageTurret } from "../../utils/data/types";
import { ResourceType } from "../../../../server/managers/resources/types";
import { GarageItemUtils } from "./utils/item";
import { ServerError } from "@/server/utils/error";
import { IHullResources, IPaintingResources, ITurretResources } from "./types";
import { Packet } from "@/network/packets/packet";

export class PlayerGarageManager {

    constructor(
        private readonly player: Player
    ) {
    }

    public getGarageItems() {
        return this.player.data.garage;
    }

    public getTurret(name: string) {
        return this.getTurrets().find(turret => turret.name === name)
    }

    public getTurrets() {
        return this.getGarageItems().turrets
    }

    public getHull(name: string) {
        return this.getHulls().find(hull => hull.name === name)
    }

    public getHulls() {
        return this.getGarageItems().hulls
    }

    public getPaintings() {
        return this.getGarageItems().paintings
    }

    public getSupplies() {
        return this.getGarageItems().supplies
    }

    public getSupplyCount(supply: SupplyType) {
        return this.getSupplies()[supply] ?? 0
    }

    public getEquippedTurret() {
        const turret = this.getTurrets().find(turret => turret.equipped);

        if (!turret) {
            throw new ServerError('No turret equipped', this.player.getUsername());
        }

        return `${turret.name}_m${turret.level}`;
    }

    public getEquippedHull() {
        const hull = this.getHulls().find(hull => hull.equipped);

        if (!hull) {
            throw new ServerError('No hull equipped', this.player.getUsername());
        }

        return `${hull.name}_m${hull.level}`;
    }

    public getEquippedPainting() {
        const painting = this.getPaintings().find(painting => painting.equipped);

        if (!painting) {
            throw new ServerError('No painting equipped', this.player.getUsername());
        }

        return `${painting.name}_m0`;
    }

    public upgradeItem(itemId: string, level: number) {

        if (level < 1 || level > 3) {
            Logger.warn(`Invalid upgrade level ${level} for item ${itemId} for player ${this.player.getUsername()}`);
            return false;
        }

        Logger.debug(`Upgrading item ${itemId} for player ${this.player.getUsername()}`);

        const item = this.player.server.garageManager.getItem(itemId);
        // const category = this.player.server.garageManager.getItemCategory(itemId);

        switch (item.category) {
            case GarageItemCategory.TURRET: {
                const turret = this.getTurret(item.id)
                if (turret) {
                    if (turret.level >= level) {
                        Logger.warn(`Invalid upgrade level ${level} for item ${itemId} for player ${this.player.getUsername()}`);
                        return false;
                    }
                    turret.level = level
                    return true;
                }
                break;
            }
            case GarageItemCategory.HULL: {
                const hull = this.getHull(item.id)
                if (hull) {
                    if (hull.level >= level) {
                        Logger.warn(`Invalid upgrade level ${level} for item ${itemId} for player ${this.player.getUsername()}`);
                        return false;
                    }
                    hull.level = level
                    return true;
                }
                break;
            }
        }
        return false;
    }

    public addItem(itemId: string, quantity: number = 1) {
        const item = this.player.server.garageManager.getItem(itemId);

        switch (item.category) {
            case GarageItemCategory.TURRET: {
                const inventory = this.getInventoryItem<IGarageTurret>(itemId);

                if (inventory) {
                    return this.upgradeItem(itemId, inventory.level + 1);
                }

                const turret = this.getTurret(item.id);
                turret.level = item.modificationID;

                break;
            }
            case GarageItemCategory.HULL: {
                const inventory = this.getInventoryItem<IGarageHull>(itemId);

                if (inventory) {
                    return this.upgradeItem(itemId, inventory.level + 1);
                }

                const hull = this.getHull(item.id);
                hull.level = item.modificationID;
                break;
            }
            case GarageItemCategory.SUPPLY: {
                this.getSupplies()[item.id] += quantity
                break;
            }
            case GarageItemCategory.PAINT:
                this.getPaintings().push({ name: item.id, equipped: false });
                break;

        }

        Logger.info(`Item ${itemId} (x${quantity}) added to player ${this.player.getUsername()}`);
    }

    public equipItem(name: string): string {

        const inventory = this.getInventoryItem<IGarageHull | IGarageTurret | IGaragePainting>(name);

        if (!inventory) {
            return null;
        }

        const item = this.player.server.garageManager.getItem(name);

        switch (item.category) {
            case GarageItemCategory.TURRET:
                this.getTurrets().forEach(
                    turret => { turret.equipped = turret.name == item.id && turret.level == (inventory as IGarageTurret).level }
                );
                break;
            case GarageItemCategory.HULL:
                this.getHulls().forEach(
                    hull => { hull.equipped = hull.name == item.id && hull.level == (inventory as IGarageHull).level }
                );
                break;
            case GarageItemCategory.PAINT:
                this.getPaintings().forEach(
                    painting => { painting.equipped = painting.name == item.id }
                );
                break;
        }

        return GarageItemUtils.serialize(inventory.name, 'level' in inventory ? inventory.level : 0);
    }

    public hasItem(name: string) {
        const item = this.player.server.garageManager.getItem(name);

        switch (item.category) {
            case GarageItemCategory.TURRET:
                return this.getTurrets()
                    .some(turret => turret.name == item.id && turret.level == item.modificationID);
            case GarageItemCategory.HULL:
                return this.getHulls()
                    .some(hull => hull.name == item.id && hull.level == item.modificationID);
            case GarageItemCategory.PAINT:
                return this.getPaintings()
                    .some(painting => painting.name == item.id)
        }

        return false
    }

    public getInventoryItem<R extends any>(name: string): R {
        const item = this.player.server.garageManager.getItem(name);

        switch (item.category) {
            case GarageItemCategory.TURRET:
                return this.getTurrets()
                    .find(turret => turret.name == item.id && turret.level >= 0) as R;
            case GarageItemCategory.HULL:
                return this.getHulls()
                    .find(hull => hull.name == item.id && hull.level >= 0) as R;
            case GarageItemCategory.PAINT:
                return this.getPaintings()
                    .find(painting => painting.name == item.id) as R;
        }

        return null
    }

    public getTurretResources(): ITurretResources {
        const turret = this.getEquippedTurret();

        const item = this.player.server.garageManager.getItem(turret);
        const physics = this.player.server.garageManager.getTurretPhysics(turret);
        const sfx = this.player.server.garageManager.getTurretSfx(turret);
        const properties = this.player.server.garageManager.getTurretProperties(turret);

        return { turret, sfx, physics, item, properties }
    }

    public getHullResources(): IHullResources {
        const hull = this.getEquippedHull();
        const item = this.player.server.garageManager.getItem(hull);
        const properties = this.player.server.garageManager.getHullPhysics(hull);

        if (!properties) {
            return null;
        }

        return { hull, item, physics: properties }
    }

    public getPaintingResources(): IPaintingResources {
        const painting = this.getEquippedPainting();
        const item = this.player.server.garageManager.getItem(painting);

        return { painting, item }
    }

    public closeGarage() {
        this.removeGarageScreen();

        if (
            this.player.battle && this.player.battle.isReArmorEnabled() &&
            this.player.tank.hasChangedEquipment() && this.player.tank.isAlive()
        ) {
            this.player.tank.scheduleDestroy()
        }
    }

    public removeGarageScreen() {
        const setRemoveGaragePacket = new SetRemoveGaragePacket();
        this.player.sendPacket(setRemoveGaragePacket);
    }

    public sendSupplies() {
        const setSuppliesPacket = new SetSuppliesPacket();
        setSuppliesPacket.supplies = [
            { count: this.getSupplyCount(Supply.HEALTH), id: Supply.HEALTH, itemEffectTime: 0, itemRestSec: 0, slotId: 1 },
            { count: this.getSupplyCount(Supply.ARMOR), id: Supply.ARMOR, itemEffectTime: 0, itemRestSec: 0, slotId: 2 },
            { count: this.getSupplyCount(Supply.DOUBLE_DAMAGE), id: Supply.DOUBLE_DAMAGE, itemEffectTime: 0, itemRestSec: 0, slotId: 3 },
            { count: this.getSupplyCount(Supply.N2O), id: Supply.N2O, itemEffectTime: 0, itemRestSec: 0, slotId: 4 },
            { count: this.getSupplyCount(Supply.MINE), id: Supply.MINE, itemEffectTime: 0, itemRestSec: 0, slotId: 5 }
        ]

        this.player.sendPacket(setSuppliesPacket);
    }

    public sendUseSupply(itemId: string, time: number, decrease: boolean) {
        const setUseSupplyPacket = new SetUseSupplyPacket();
        setUseSupplyPacket.itemId = itemId;
        setUseSupplyPacket.time = time;
        setUseSupplyPacket.decrease = decrease;
        this.player.sendPacket(setUseSupplyPacket);
    }

    public sendEquipItem(item: string) {
        const setEquipGarageItemPacket = new SetEquipGarageItemPacket();
        setEquipGarageItemPacket.itemId = item;
        setEquipGarageItemPacket.equipped = true;
        this.player.sendPacket(setEquipGarageItemPacket);
    }

    public sendEquippedItems() {
        this.sendEquipItem(this.getEquippedHull());
        this.sendEquipItem(this.getEquippedTurret());
        this.sendEquipItem(this.getEquippedPainting());
    }

    public sendUserGarageItems(items: IGarageItem[]) {
        const setUserGarageItemsPacket = new SetUserGarageItemsPacket();
        setUserGarageItemsPacket.items = items;
        setUserGarageItemsPacket.garageBoxId = 170001;
        this.player.sendPacket(setUserGarageItemsPacket);
    }

    public sendGarageItems(items: IGarageItem[]) {
        const setGarageItemsPropertiesPacket = new SetGarageItemsPropertiesPacket();

        setGarageItemsPropertiesPacket.items = items
        setGarageItemsPropertiesPacket.delayMountArmorInSec = 0;
        setGarageItemsPropertiesPacket.delayMountWeaponInSec = 0;
        setGarageItemsPropertiesPacket.delayMountColorInSec = 0;

        this.player.sendPacket(setGarageItemsPropertiesPacket);
    }

    public async sendOpenGarage() {

        this.player.setLayoutState(LayoutState.GARAGE);

        // await new Promise((resolve) => setTimeout(resolve, 2000));

        await this.player.server.resourcesManager.sendResources(this.player, ResourceType.GARAGE);

        const userItems: IGarageItem[] = []
        const garageItems: IGarageItem[] = []

        const supplies = this.player.garageManager.getSupplies();

        const turrets = this.player.garageManager.getTurrets();
        const hulls = this.player.garageManager.getHulls();
        const paintings = this.player.garageManager.getPaintings();

        for (const item of this.player.server.garageManager.items.values()) {
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

        if (this.player.data.hasDoubleCrystals()) {
            userItems.push({
                id: 'double_crystalls',
                name: 'Dobro de cristais',
                description: 'O nome deste cartão é auto-explicativo. Comprando cristais com dinheiro real você ganha o dobro deles do que o normal. Qualquer quantidade de cristais que você comprou será multiplicada por dois! Mas cuidado! Este cartão permanece ativo por apenas 24 horas. Certifique-se de usá-lo enquanto pode para aproveitar ao máximo suas compras!',
                isInventory: true,
                index: 8150,
                next_price: -1,
                next_rank: 1,
                type: 5,
                baseItemId: 948382,
                previewResourceId: 948382,
                rank: 1,
                category: GarageItemCategory.SPECIAL,
                properts: [],
                discount: {
                    percent: 0,
                    timeLeftInSeconds: -1721658919,
                    timeToStartInSeconds: -1721658919
                },
                grouped: false,
                isForRent: false,
                price: -1,
                remainingTimeInSec: Math.round(this.player.data.getDoubleCrystalsLeftTime() / 1000),
            })
        }

        this.sendUserGarageItems(userItems);

        this.sendEquippedItems()
        this.sendGarageItems(garageItems);

        this.player.setSubLayoutState(LayoutState.GARAGE);
    }

    public handleEquipItem(itemId: string) {
        const equipped = this.player.garageManager.equipItem(itemId);
        if (equipped) {
            const setEquipGarageItemPacket = new SetEquipGarageItemPacket();
            setEquipGarageItemPacket.itemId = equipped;
            setEquipGarageItemPacket.equipped = true;
            this.player.sendPacket(setEquipGarageItemPacket)
        }
    }

    public handleBuyKit(kitId: string, price: number) {
        // Logger.debug('handleBuyKit', kitId, price)
        if (this.player.data.crystals < price) {
            return false;
        }

        this.player.data.decreaseCrystals(price);
        const kit = this.player.server.garageManager.getItem(kitId);

        if (!kit) {
            return false;
        }

        for (const item of kit.kit.kitItems) {
            this.addItem(item.id, item.count);
        }

        return true;
    }

    public handleBuyItem(itemId: string, amount: number, price: number) {
        // Logger.debug('handleBuyItem', itemId, amount, price)

        if (this.player.data.crystals < price) {
            return false;
        }

        this.player.data.decreaseCrystals(price);
        this.addItem(itemId, amount);

        return true
    }

    public handlePacket(packet: Packet) {
        if (packet instanceof SendOpenGaragePacket) {
            if (this.player.battle) {
                if (this.player.getLayoutState() === LayoutState.BATTLE) {
                    this.sendOpenGarage();
                    return true;
                }

                if (this.player.getLayoutState() === LayoutState.GARAGE) {
                    this.player.setLayoutState(LayoutState.BATTLE);
                    this.player.setSubLayoutState(LayoutState.BATTLE);
                    return true;
                }

                if (this.player.getLayoutState() === LayoutState.BATTLE_SELECT) {
                    this.player.battlesManager.sendRemoveBattlesScreen();
                    this.sendOpenGarage();
                    return true;
                }
                return true;
            }
            this.sendOpenGarage();
            return true
        }

        if (packet instanceof SendEquipItemPacket) {
            this.player.garageManager.handleEquipItem(packet.item);
            return true
        }

        if (packet instanceof SendBuyGarageItemPacket) {
            this.player.garageManager.handleBuyItem(packet.item, packet.count, packet.price);
            return true;
        }

        if (packet instanceof SendBuyGarageKitPacket) {
            this.player.garageManager.handleBuyKit(packet.item, packet.price);
            return true;
        }

        if (packet instanceof SendPreviewPaintingPacket) {
            const item = this.player.server.garageManager.getItem(packet.item);
            if (item && item.category === GarageItemCategory.PAINT) {
                this.player.garageManager.sendEquipItem(packet.item);
            }
            return true;
        }

        return false;
    }
}
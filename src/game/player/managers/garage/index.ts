import { Player } from "../..";
import { GarageItemCategory, IGarageItem } from "../../../../managers/garage/types";
import { ResourceType } from "../../../../managers/resources";
import { SendBuyGarageItemPacket } from "../../../../network/packets/send-buy-garage-item";
import { SendBuyGarageKitPacket } from "../../../../network/packets/send-buy-garage-kit";
import { SendEquipItemPacket } from "../../../../network/packets/send-equip-item";
import { SendOpenGaragePacket } from "../../../../network/packets/send-open-garage";
import { SetEquipGarageItemPacket } from "../../../../network/packets/set-equip-garage-item";
import { SetGarageItemsPropertiesPacket } from "../../../../network/packets/set-garage-items-properties";
import { SetRemoveGaragePacket } from "../../../../network/packets/set-remove-garage";
import { SetSuppliesPacket } from "../../../../network/packets/set-supplies";
import { SetUserGarageItemsPacket } from "../../../../network/packets/set-user-garage-items";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { LayoutState } from "../../../../utils/game/layout-state";
import { Logger } from "../../../../utils/logger";
import { IGarageHull, IGarageTurret, IPlayerGarageData } from "./types";

export class PlayerGarageManager {

    private items: IPlayerGarageData

    constructor(
        private readonly player: Player
    ) {

        this.items = {
            paintings: [
                { name: 'green', equipped: false },
                { name: 'africa', equipped: true },
            ],
            turrets: [
                { name: 'flamethrower', level: -1, equipped: false },
                { name: 'freeze', level: -1, equipped: false },
                { name: 'isida', level: -1, equipped: false },
                { name: 'machinegun', level: -1, equipped: false },
                { name: 'railgun', level: 3, equipped: true },
                { name: 'railgun_xt', level: -1, equipped: false },
                { name: 'ricochet', level: -1, equipped: false },
                { name: 'shaft', level: -1, equipped: false },
                { name: 'shotgun', level: -1, equipped: false },
                { name: 'smoky', level: -1, equipped: false },
                { name: 'thunder', level: -1, equipped: false },
                { name: 'twins', level: -1, equipped: false },
            ],
            hulls: [
                { name: 'dictator', level: -1, equipped: false },
                { name: 'hornet', level: 3, equipped: true },
                { name: 'hornet_xt', level: -1, equipped: false },
                { name: 'hunter', level: -1, equipped: false },
                { name: 'mammoth', level: -1, equipped: false },
                { name: 'titan', level: -1, equipped: false },
                { name: 'viking', level: -1, equipped: false },
                { name: 'wasp', level: -1, equipped: false },
            ],
            supplies: {
                health: 100,
                armor: 100,
                double_damage: 100,
                n2o: 100,
                mine: 100
            }
        }
    }

    public getTurrets() { return this.items.turrets }
    public getHulls() { return this.items.hulls }
    public getPaintings() { return this.items.paintings }
    public getSupplies() { return this.items.supplies }

    public getEquippedTurret() {
        const turret = this.items.turrets
            .find(turret => turret.equipped);

        if (!turret) {
            throw new Error('No turret equipped');
        }
        return `${turret.name}_m${turret.level}`;
    }

    public getEquippedHull() {
        const hull = this.items.hulls
            .find(hull => hull.equipped);

        if (!hull) {
            throw new Error('No hull equipped');
        }
        return `${hull.name}_m${hull.level}`;
    }

    public getEquippedPainting() {
        const painting = this.items.paintings
            .find(painting => painting.equipped);

        if (!painting) {
            throw new Error('No painting equipped');
        }
        return `${painting.name}_m0`;
    }

    public upgradeItem(itemId: string, level: number) {

        if (level < 1 || level > 3) {
            Logger.warn(`Invalid upgrade level ${level} for item ${itemId} for player ${this.player.getUsername()}`);
            return false;
        }

        Logger.debug(`Upgrading item ${itemId} for player ${this.player.getUsername()}`);

        const item = this.player.getServer().getGarageManager().getItem(itemId);
        const category = this.player.getServer().getGarageManager().getItemCategory(itemId);

        switch (category) {
            case GarageItemCategory.TURRET:
                this.items.turrets.forEach(turret => {
                    if (turret.name == item.id) {
                        turret.level = level
                    }
                })
                break;
            case GarageItemCategory.HULL:
                this.items.hulls.forEach(hull => {
                    if (hull.name == item.id) {
                        hull.level = level
                    }
                })
                break;
        }
    }

    public addItem(itemId: string, quantity: number = 1) {
        const item = this.player.getServer().getGarageManager().getItem(itemId);

        switch (item.category) {
            case GarageItemCategory.TURRET: {
                const inventory = this.getInventoryItem<IGarageTurret>(itemId);

                if (inventory) {
                    return this.upgradeItem(itemId, inventory.level + 1);
                }

                this.items.turrets.forEach(turret => {
                    if (turret.name == item.id) {
                        turret.level = item.modificationID;
                    }
                })
                break;
            }
            case GarageItemCategory.HULL: {
                const inventory = this.getInventoryItem<IGarageHull>(itemId);

                if (inventory) {
                    return this.upgradeItem(itemId, inventory.level + 1);
                }

                this.items.hulls.forEach(hull => {
                    if (hull.name == item.id) {
                        hull.level = item.modificationID;
                    }
                })
                break;
            }
            case GarageItemCategory.SUPPLY: {
                this.items.supplies[item.id] += quantity
                break;
            }
            case GarageItemCategory.PAINT:
                this.items.paintings.push({ name: item.id, equipped: false });
                break;

        }

        Logger.info(`Item ${itemId} (x${quantity}) added to player ${this.player.getUsername()}`);
    }

    public equipItem(itemName: string) {
        if (this.getInventoryItem(itemName)) {
            const item = this.player.getServer().getGarageManager().getItem(itemName);

            switch (item.category) {
                case GarageItemCategory.TURRET:
                    this.items.turrets.forEach(
                        turret => { turret.equipped = turret.name == item.id && turret.level == item.modificationID }
                    );
                    break;
                case GarageItemCategory.HULL:
                    this.items.hulls.forEach(
                        hull => { hull.equipped = hull.name == item.id && hull.level == item.modificationID }
                    );
                    break;
                case GarageItemCategory.PAINT:
                    this.items.paintings.forEach(
                        painting => { painting.equipped = painting.name == item.id }
                    );
                    break;
            }
            return true
        }
        return false
    }



    public getInventoryItem<R extends any>(itemId: string): R {
        const item = this.player.getServer().getGarageManager().getItem(itemId);

        switch (item.category) {
            case GarageItemCategory.TURRET:
                return this.items.turrets
                    .find(turret => turret.name == item.id && turret.level == item.modificationID) as R;
            case GarageItemCategory.HULL:
                return this.items.hulls
                    .find(hull => hull.name == item.id && hull.level == item.modificationID) as R;
            case GarageItemCategory.PAINT:
                return this.items.paintings
                    .find(painting => painting.name == item.id) as R;
        }

        return null
    }

    public removeGarageScreen() {
        const setRemoveGaragePacket = new SetRemoveGaragePacket();
        this.player.sendPacket(setRemoveGaragePacket);
    }

    public sendSupplies(client: Player) {
        const setSuppliesPacket = new SetSuppliesPacket();
        setSuppliesPacket.supplies = [
            { count: this.items.supplies.health, id: 'health', itemEffectTime: 0, itemRestSec: 0, slotId: 1 },
            { count: this.items.supplies.armor, id: 'armor', itemEffectTime: 0, itemRestSec: 0, slotId: 2 },
            { count: this.items.supplies.double_damage, id: 'double_damage', itemEffectTime: 0, itemRestSec: 0, slotId: 3 },
            { count: this.items.supplies.n2o, id: 'n2o', itemEffectTime: 0, itemRestSec: 0, slotId: 4 },
            { count: this.items.supplies.mine, id: 'mine', itemEffectTime: 0, itemRestSec: 0, slotId: 5 }
        ]

        client.sendPacket(setSuppliesPacket);
    }

    public sendEquippedItems() {
        const setEquipGarageItemPacket = new SetEquipGarageItemPacket();

        setEquipGarageItemPacket.itemId = this.getEquippedHull();
        setEquipGarageItemPacket.equipped = true;
        this.player.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = this.getEquippedTurret();
        setEquipGarageItemPacket.equipped = true;
        this.player.sendPacket(setEquipGarageItemPacket);

        setEquipGarageItemPacket.itemId = this.getEquippedPainting();
        setEquipGarageItemPacket.equipped = true;
        this.player.sendPacket(setEquipGarageItemPacket);
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

        await new Promise((resolve) => setTimeout(resolve, 2000));

        await this.player.getServer().getResourcesManager().sendResources(this.player, ResourceType.GARAGE);

        const userItems: IGarageItem[] = []
        const garageItems: IGarageItem[] = []

        const supplies = this.player.getGarageManager().getSupplies();

        const turrets = this.player.getGarageManager().getTurrets();
        const hulls = this.player.getGarageManager().getHulls();
        const paintings = this.player.getGarageManager().getPaintings();

        for (const item of this.player.getServer().getGarageManager().getItems().values()) {
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

        this.sendUserGarageItems(userItems);

        this.sendEquippedItems()
        this.sendGarageItems(garageItems);

        this.player.setSubLayoutState(this.player.getBattle() ? LayoutState.BATTLE : LayoutState.GARAGE, LayoutState.GARAGE);
    }

    public handleEquipItem(itemId: string) {
        if (this.equipItem(itemId)) {
            const setEquipGarageItemPacket = new SetEquipGarageItemPacket();
            setEquipGarageItemPacket.itemId = itemId;
            setEquipGarageItemPacket.equipped = true;
            this.player.sendPacket(setEquipGarageItemPacket)
        }
    }

    public handleBuyKit(kitId: string, price: number) {
        if (this.player.getDataManager().getCrystals() < price) {
            return false;
        }

        this.player.getDataManager().decreaseCrystals(price);
        const kit = this.player.getServer().getGarageManager().getItem(kitId);

        if (!kit) {
            return false;
        }

        for (const item of kit.kit.kitItems) {
            this.addItem(item.id, item.count);
        }

        return true;
    }

    public handleBuyItem(itemId: string, amount: number, price: number) {
        if (this.player.getDataManager().getCrystals() < price) {
            return false;
        }

        this.player.getDataManager().decreaseCrystals(price);
        this.addItem(itemId, amount);

        return true
    }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendOpenGaragePacket) {
            const battle = this.player.getBattle();
            if (battle) {
                if (this.player.getLayoutState() === LayoutState.BATTLE) {
                    this.sendOpenGarage();
                    return true;
                }

                if (this.player.getLayoutState() === LayoutState.GARAGE) {
                    this.player.setLayoutState(LayoutState.BATTLE);
                    this.player.setSubLayoutState(LayoutState.BATTLE, LayoutState.BATTLE);
                    return true;
                }
                return true;
            }
            this.sendOpenGarage();
            return true
        }

        if (packet instanceof SendEquipItemPacket) {
            this.player.getGarageManager().handleEquipItem(packet.item);
            return true
        }

        if (packet instanceof SendBuyGarageItemPacket) {
            this.player.getGarageManager()
                .handleBuyItem(packet.item, packet.count, packet.price);
            return true;
        }

        if (packet instanceof SendBuyGarageKitPacket) {
            this.player.getGarageManager()
                .handleBuyKit(packet.item, packet.price);
            return true;
        }

        return false;
    }
}
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
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { LayoutState } from "../../../../states/layout-state";
import { Supply, SupplyType } from "../../../../states/supply";
import { Logger } from "../../../../utils/logger";
import { IGarageHull, IGarageTurret, IPlayerGarageData } from "../../utils/data/types";
import { ResourceType } from "../../../../server/managers/resources/types";

export class PlayerGarageManager {

    constructor(
        private readonly player: Player
    ) {
    }

    public getGarageItems() {
        return this.player.getData().getGarageData();
    }

    public getTurrets() {
        return this.getGarageItems().turrets
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
            throw new Error('No turret equipped');
        }
        return `${turret.name}_m${turret.level}`;
    }

    public getEquippedHull() {
        const hull = this.getHulls().find(hull => hull.equipped);

        if (!hull) {
            throw new Error('No hull equipped');
        }
        return `${hull.name}_m${hull.level}`;
    }

    public getEquippedPainting() {
        const painting = this.getPaintings().find(painting => painting.equipped);

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
                this.getTurrets().forEach(turret => {
                    if (turret.name == item.id) {
                        turret.level = level
                    }
                })
                break;
            case GarageItemCategory.HULL:
                this.getHulls().forEach(hull => {
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

                this.getTurrets().forEach(turret => {
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

                this.getHulls().forEach(hull => {
                    if (hull.name == item.id) {
                        hull.level = item.modificationID;
                    }
                })
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

    public equipItem(itemName: string) {
        if (this.getInventoryItem(itemName)) {
            const item = this.player.getServer().getGarageManager().getItem(itemName);

            switch (item.category) {
                case GarageItemCategory.TURRET:
                    this.getTurrets().forEach(
                        turret => { turret.equipped = turret.name == item.id && turret.level == item.modificationID }
                    );
                    break;
                case GarageItemCategory.HULL:
                    this.getHulls().forEach(
                        hull => { hull.equipped = hull.name == item.id && hull.level == item.modificationID }
                    );
                    break;
                case GarageItemCategory.PAINT:
                    this.getPaintings().forEach(
                        painting => { painting.equipped = painting.name == item.id }
                    );
                    break;
            }

            if (this.player.isInBattle()) {
                Logger.debug(`Player ${this.player.getUsername()} changed equipment`);
                this.player.getTank().changedEquipment = true;
            }

            return true
        }
        return false
    }



    public getInventoryItem<R extends any>(itemId: string): R {
        const item = this.player.getServer().getGarageManager().getItem(itemId);

        switch (item.category) {
            case GarageItemCategory.TURRET:
                return this.getTurrets()
                    .find(turret => turret.name == item.id && turret.level == item.modificationID) as R;
            case GarageItemCategory.HULL:
                return this.getHulls()
                    .find(hull => hull.name == item.id && hull.level == item.modificationID) as R;
            case GarageItemCategory.PAINT:
                return this.getPaintings()
                    .find(painting => painting.name == item.id) as R;
        }

        return null
    }

    public getTurretResources() {
        const turret = this.getEquippedTurret();

        const item = this.player.getServer().getGarageManager().getItem(turret);
        const properties = this.player.getServer().getGarageManager().getTurretProperties(turret);
        const sfx = this.player.getServer().getGarageManager().getTurretSfx(turret);

        if (!properties || !sfx) {
            return null;
        }

        return { turret, sfx, properties, item }
    }

    public getHullResources() {
        const hull = this.getEquippedHull();
        const item = this.player.getServer().getGarageManager().getItem(hull);
        const properties = this.player.getServer().getGarageManager().getHullProperties(hull);

        if (!properties) {
            return null;
        }

        return { hull, item, properties }
    }

    public getPaintingResources() {
        const painting = this.getEquippedPainting();
        const item = this.player.getServer().getGarageManager().getItem(painting);

        return { painting, item }
    }

    public closeGarage() {
        this.removeGarageScreen();

        const battle = this.player.getBattle();
        if (battle && this.player.tank.changedEquipment) {
            if (this.player.getTank().isAlive()) {
                this.player.getTank().scheduleSuicide()
            }
        }
    }

    public removeGarageScreen() {
        const setRemoveGaragePacket = new SetRemoveGaragePacket();
        this.player.sendPacket(setRemoveGaragePacket);
    }

    public sendSupplies(client: Player) {
        const setSuppliesPacket = new SetSuppliesPacket();
        setSuppliesPacket.supplies = [
            { count: this.getSupplyCount(Supply.HEALTH), id: Supply.HEALTH, itemEffectTime: 3000, itemRestSec: 3000, slotId: 1 },
            { count: this.getSupplyCount(Supply.ARMOR), id: Supply.ARMOR, itemEffectTime: 0, itemRestSec: 0, slotId: 2 },
            { count: this.getSupplyCount(Supply.DOUBLE_DAMAGE), id: Supply.DOUBLE_DAMAGE, itemEffectTime: 0, itemRestSec: 0, slotId: 3 },
            { count: this.getSupplyCount(Supply.N2O), id: Supply.N2O, itemEffectTime: 30, itemRestSec: 30, slotId: 4 },
            { count: this.getSupplyCount(Supply.MINE), id: Supply.MINE, itemEffectTime: 0, itemRestSec: 0, slotId: 5 }
        ]

        client.sendPacket(setSuppliesPacket);
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

        if (this.player.getData().hasDoubleCrystals()) {
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
                category: 'special',
                properts: [],
                discount: {
                    percent: 0,
                    timeLeftInSeconds: -1721658919,
                    timeToStartInSeconds: -1721658919
                },
                grouped: false,
                isForRent: false,
                price: -1,
                remainingTimeInSec: Math.round(this.player.getData().getDoubleCrystalsLeftTime() / 1000),
            })
        }

        this.sendUserGarageItems(userItems);

        this.sendEquippedItems()
        this.sendGarageItems(garageItems);

        this.player.setSubLayoutState(LayoutState.GARAGE);
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
        if (this.player.getData().getCrystals() < price) {
            return false;
        }

        this.player.getData().decreaseCrystals(price);
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
        if (this.player.getData().getCrystals() < price) {
            return false;
        }

        this.player.getData().decreaseCrystals(price);
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
                    this.player.setSubLayoutState(LayoutState.BATTLE);
                    return true;
                }

                if (this.player.getLayoutState() === LayoutState.BATTLE_SELECT) {
                    this.player.getBattlesManager().sendRemoveBattlesScreen();
                    this.sendOpenGarage();
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
            this.player.getGarageManager().handleBuyItem(packet.item, packet.count, packet.price);
            return true;
        }

        if (packet instanceof SendBuyGarageKitPacket) {
            this.player.getGarageManager().handleBuyKit(packet.item, packet.price);
            return true;
        }

        if (packet instanceof SendPreviewPaintingPacket) {
            const item = this.player.getServer().getGarageManager().getItem(packet.item);
            if (item && item.category === GarageItemCategory.PAINT) {
                this.player.getGarageManager().sendEquipItem(packet.item);
            }
            return true;
        }

        return false;
    }
}
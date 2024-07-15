import { Player } from "../..";
import { GarageItemCategory } from "../../../../managers/garage/types";
import { SendBuyGarageItemPacket } from "../../../../network/packets/send-buy-garage-item";
import { SendBuyGarageKitPacket } from "../../../../network/packets/send-buy-garage-kit";
import { SendEquipItemPacket } from "../../../../network/packets/send-equip-item";
import { SendOpenGaragePacket } from "../../../../network/packets/send-open-garage";
import { SetEquipGarageItemPacket } from "../../../../network/packets/set-equip-garage-item";
import { SetSuppliesPacket } from "../../../../network/packets/set-supplies";
import { SimplePacket } from "../../../../network/packets/simple-packet";
import { Logger } from "../../../../utils/logger";
import { IPlayerGarageData } from "./types";

export class PlayerGarageManager {

    private items: IPlayerGarageData

    constructor(
        private readonly player: Player
    ) {

        this.items = {
            paintings: [
                { name: 'green', equipped: false, level: 0 },
                { name: 'flora', equipped: true, level: 0 },
            ],
            turrets: [
                { name: 'flamethrower', level: 0, equipped: false },
                { name: 'freeze', level: -1, equipped: false },
                { name: 'isida', level: 0, equipped: false },
                { name: 'machinegun', level: -1, equipped: false },
                { name: 'railgun', level: 2, equipped: true },
                { name: 'railgun_xt', level: -1, equipped: false },
                { name: 'ricochet', level: 0, equipped: false },
                { name: 'shaft', level: -1, equipped: false },
                { name: 'shotgun', level: -1, equipped: false },
                { name: 'smoky', level: 0, equipped: false },
                { name: 'thunder', level: 0, equipped: false },
                { name: 'twins', level: -1, equipped: false },
            ],
            hulls: [
                { name: 'dictator', level: -1, equipped: false },
                { name: 'hornet', level: 1, equipped: true },
                { name: 'hornet_xt', level: -1, equipped: false },
                { name: 'hunter', level: 0, equipped: false },
                { name: 'mammoth', level: -1, equipped: false },
                { name: 'titan', level: -1, equipped: false },
                { name: 'viking', level: 0, equipped: false },
                { name: 'wasp', level: 0, equipped: false },
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

    public upgradeItem(itemId: string) {
        Logger.debug(`Upgrading item ${itemId} for player ${this.player.getUsername()}`);

        const item = this.player.getServer().getGarageManager().getItem(itemId);
        const category = this.player.getServer().getGarageManager().getItemCategory(itemId);

        switch (category) {
            case GarageItemCategory.TURRET:
                this.items.turrets.forEach(turret => {
                    if (turret.name == item.id) {
                        turret.level = item.modificationID + 1;
                    }
                })
                break;
            case GarageItemCategory.HULL:
                this.items.hulls.forEach(hull => {
                    if (hull.name == item.id) {
                        hull.level = item.modificationID + 1;
                    }
                })
                break;
        }
    }

    public addItem(itemId: string, quantity: number = 1) {
        Logger.debug(`Adding item ${itemId} to player ${this.player.getUsername()}`);

        const item = this.player.getServer().getGarageManager().getItem(itemId);

        const inventory = this.getInventoryItem(itemId);
        if (inventory) {
            if (inventory.level >= item.modificationID) {
                return this.upgradeItem(itemId);
            }
        }

        Logger.debug(`Item ${itemId} is from category ${item.category}`);

        switch (item.category) {
            case GarageItemCategory.TURRET:
                this.items.turrets.forEach(turret => {
                    if (turret.name == item.id) {
                        turret.level = item.modificationID;
                    }
                })
                break;
            case GarageItemCategory.HULL:
                this.items.hulls.forEach(hull => {
                    if (hull.name == item.id) {
                        hull.level = item.modificationID;
                    }
                })
                break;
            case GarageItemCategory.PAINT:
                this.items.paintings.push({ name: item.id, equipped: false, level: 0 });
                break;
        }

        Logger.info(`Item ${itemId} added to player ${this.player.getUsername()}`);
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

    public getInventoryItem(itemId: string) {
        const item = this.player.getServer().getGarageManager().getItem(itemId);
        const category = this.player.getServer().getGarageManager().getItemCategory(itemId);

        switch (category) {
            case GarageItemCategory.TURRET:
                return this.items.turrets.find(turret => turret.name == item.id && turret.level == item.modificationID);
            case GarageItemCategory.HULL:
                return this.items.hulls.find(hull => hull.name == item.id && hull.level == item.modificationID);
            case GarageItemCategory.PAINT:
                return this.items.paintings.find(painting => painting.name == item.id);
        }

        return null
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
        this.addItem(itemId);

        return true
    }

    public handlePacket(packet: SimplePacket) {
        if (packet instanceof SendOpenGaragePacket) {
            this.player.getServer().getGarageManager().handleOpenGarage(this.player);
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
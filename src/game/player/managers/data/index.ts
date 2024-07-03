import { Player } from "../..";
import { GarageManager } from "../../../../managers/garage";
import { GarageItemType } from "../../../../managers/garage/types";
import { Logger } from "../../../../utils/logger";

import { IGarageHull, IGaragePainting, IGarageTurret, IPlayerGarageData, IPlayerProfileData, IPremiumData } from "./types";

export class PlayerDataManager {

    private profile: IPlayerProfileData;
    private garage: IPlayerGarageData

    constructor(
        private readonly player: Player
    ) { }

    public load() {

        Logger.info(`Loading data for player ${this.player.getUsername()}`);

        if (this.player.getAuthManager().isAuthenticated()) {
            throw new Error('Trying to load data for an unauthenticated player');
        }

        this.profile = {
            crystals: 100000000,
            hasDoubleCrystal: false,
            durationCrystalAbonement: 48602763,
            rank: 30,
            score: 2000,
            premium: {
                notified: false,
                startedAt: Date.now(),
                endAt: Date.now()
            }
        }

        this.garage = {
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
                armor: 100,
                double_damage: 100,
                health: 100,
                mine: 100,
                n2o: 100
            }
        }
    }

    public upgradeItem(itemId: string) {
        Logger.debug(`Upgrading item ${itemId} for player ${this.player.getUsername()}`);
        const item = GarageManager.parseItemName(itemId);
        const category = this.player.getServer().getGarageManager().getItemCategory(itemId);
        Logger.debug(`Item ${itemId} is from category ${category}`);

        switch (category) {
            case GarageItemType.TURRET:
                console.log(item)
                this.garage.turrets = this.garage.turrets.map(turret => {
                    if (turret.name == item.name) {
                        console.log(turret)
                        return { name: turret.name, level: item.level + 1, equipped: turret.equipped }
                    }
                    return turret;
                })
                break;
            case GarageItemType.HULL:
                this.garage.hulls = this.garage.hulls.map(hull => {
                    if (hull.name == item.name) {
                        return { name: hull.name, level: item.level + 1, equipped: hull.equipped }
                    }
                    return hull;
                })
                break;
        }
    }

    public addItem(itemId: string) {
        Logger.debug(`Adding item ${itemId} to player ${this.player.getUsername()}`);

        const item = GarageManager.parseItemName(itemId);
        if (this.hasItem(itemId)) {
            return this.upgradeItem(itemId);
        }
        const category = this.player.getServer().getGarageManager().getItemCategory(itemId);
        Logger.debug(`Item ${itemId} is from category ${category}`);

        switch (category) {
            case GarageItemType.TURRET:
                this.garage.turrets = this.garage.turrets.map(turret => {
                    if (turret.name == item.name) {
                        return { name: turret.name, level: item.level, equipped: turret.equipped }
                    }
                    return turret;
                })
                break;
            case GarageItemType.HULL:
                this.garage.hulls = this.garage.hulls.map(hull => {
                    if (hull.name == item.name) {
                        return { name: hull.name, level: item.level, equipped: hull.equipped }
                    }
                    return hull;
                })
                break;
            case GarageItemType.PAINT:
                this.garage.paintings = this.garage.paintings.map(painting => {
                    if (painting.name == item.name) {
                        return { name: painting.name, level: 0, equipped: painting.equipped }
                    }
                    return painting;
                })
                break;
        }

        Logger.info(`Item ${itemId} added to player ${this.player.getUsername()}`);
    }

    public equipItem(itemName: string) {

        if (this.hasItem(itemName)) {
            const category = this.player.getServer().getGarageManager().getItemCategory(itemName);
            const item = GarageManager.parseItemName(itemName);

            switch (category) {
                case GarageItemType.TURRET:
                    this.getTurrets().forEach(turret => {
                        turret.equipped = turret.name == item.name && turret.level == item.level;
                    });
                    break;
                case GarageItemType.HULL:
                    this.getHulls().forEach(hull => {
                        hull.equipped = hull.name == item.name && hull.level == item.level;
                    });
                    break;
                case GarageItemType.PAINT:
                    this.getPaintings().forEach(painting => {
                        painting.equipped = painting.name == item.name
                    });
                    break;
            }
            return true
        }
        return false
    }

    public getEquippedTurret() {

        const turret = this.getTurrets()
            .find(turret => turret.equipped);

        if (!turret) {
            throw new Error('No turret equipped');
        }
        return `${turret.name}_m${turret.level}`;
    }

    public getEquippedHull() {
        const hull = this.getHulls()
            .find(hull => hull.equipped);

        if (!hull) {
            throw new Error('No hull equipped');
        }
        return `${hull.name}_m${hull.level}`;
    }

    public getEquippedPainting() {
        const painting = this.getPaintings()
            .find(painting => painting.equipped);

        if (!painting) {
            throw new Error('No painting equipped');
        }
        return `${painting.name}_m0`;
    }

    public hasItem(itemId: string) {
        const item = GarageManager.parseItemName(itemId);
        return this.getGarageItems()
            .find(({ name, level }) => name == item.name && level == item.level);
    }

    public getAuthData(username: string) {
        return { username: username, password: 'suasenha123' }
    }

    public getPremiumData(): IPremiumData {
        const data = this.profile.premium;

        const lifeTime = (data.endAt - data.startedAt) / 1000;
        const leftTime = (data.endAt - Date.now()) / 1000;

        return {
            enabled: leftTime > 0,
            showReminder: false,
            showWelcome: leftTime > 0 && !data.notified,
            reminderTime: Date.now(),
            leftTime: leftTime > 0 ? leftTime : -1,
            lifeTime: lifeTime
        }
    }

    public getTurrets() { return this.garage.turrets }
    public getHulls() { return this.garage.hulls }
    public getPaintings() { return this.garage.paintings }

    public getSupplies() { return this.garage.supplies }

    public getGarageItems(): IGarageTurret[] & IGarageHull[] & IGaragePainting[] {
        return Array.prototype.concat(this.getTurrets(), this.getHulls(), this.getPaintings());
    }

    public getCrystals() { return this.profile.crystals }
    public decreaseCrystals(amount: number) { this.profile.crystals -= amount }
    public increaseCrystals(amount: number) { this.profile.crystals += amount }
    public setCrystals(amount: number) { this.profile.crystals = amount }

    public getRank() { return this.profile.rank }
    public getScore() { return this.profile.score }
}
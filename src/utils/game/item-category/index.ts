export class ItemCategory {
    static readonly WEAPON = 'WEAPON';
    static readonly ARMOR = 'ARMOR';
    static readonly COLOR = 'COLOR';
    static readonly INVENTORY = 'INVENTORY';
    static readonly PLUGIN = 'PLUGIN';
    static readonly KIT = 'KIT';
    static readonly EMBLEM = 'EMBLEM';
    static readonly PRESET = 'PRESET';
    static readonly GIVEN_PRESET = 'GIVEN_PRESET';

    static readonly CATEGORIES = [
        ItemCategory.WEAPON,
        ItemCategory.ARMOR,
        ItemCategory.COLOR,
        ItemCategory.INVENTORY,
        ItemCategory.PLUGIN,
        ItemCategory.KIT,
        ItemCategory.EMBLEM,
        ItemCategory.PRESET,
        ItemCategory.GIVEN_PRESET
    ];
}

export type OnlyStringKeys<T> = T extends string ? T : never;
export type ItemCategoryType = OnlyStringKeys<typeof ItemCategory[keyof typeof ItemCategory]>;
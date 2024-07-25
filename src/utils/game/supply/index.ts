export class Supply {
    public static readonly HEALTH = "health"
    public static readonly DOUBLE_DAMAGE = "double_damage"
    public static readonly ARMOR = "armor"
    public static readonly N2O = "n2o"
    public static readonly MINE = "mine"
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type SupplyType = OnlyStringKeys<typeof Supply[keyof typeof Supply]>
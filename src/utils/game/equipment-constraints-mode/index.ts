export class EquipmentConstraintsMode {
    static readonly NONE = 'NONE';
    static readonly HORNET_RAILGUN = 'HORNET_RAILGUN';
    static readonly WASP_RAILGUN = 'WASP_RAILGUN';
    static readonly HORNET_WASP_RAILGUN = 'HORNET_WASP_RAILGUN';

    static readonly ALL = [
        EquipmentConstraintsMode.NONE,
        EquipmentConstraintsMode.HORNET_RAILGUN,
        EquipmentConstraintsMode.WASP_RAILGUN,
        EquipmentConstraintsMode.HORNET_WASP_RAILGUN,
    ];
}

export type OnlyStringKeys<T> = T extends string ? T : never;
export type EquipmentConstraintsModeType = OnlyStringKeys<typeof EquipmentConstraintsMode[keyof typeof EquipmentConstraintsMode]>;
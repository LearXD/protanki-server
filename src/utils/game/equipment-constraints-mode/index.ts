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

export type EquipmentConstraintsModes = 'NONE' | 'HORNET_RAILGUN' | 'WASP_RAILGUN' | 'HORNET_WASP_RAILGUN';
export enum BonusBoxes {
    GOLD = 'gold',
    HEALTH = 'health',
    ARMOR = 'armor',
    DAMAGE = 'damage',
    NITRO = 'nitro',
    CRYSTAL = 'crystal'
}

export interface IBonusesData {
    bonuses: IBonusBoxData[];
    cordResource: number;
    parachuteInnerResource: number;
    parachuteResource: number;
    pickupSoundResource: number;
}

export interface IBonusBoxData {
    lighting: {
        attenuationBegin: number;
        attenuationEnd: number;
        color: number;
        intensity: number;
    }
    id: string;
    resourceId: number;
    lifeTimeMs: number;
}
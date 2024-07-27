export class SuspiciousLevel {
    public static readonly NONE = 'NONE';
    public static readonly LOW = 'LOW';
    public static readonly HIGH = 'HIGH';

    public static readonly LEVELS = [
        SuspiciousLevel.NONE,
        SuspiciousLevel.LOW,
        SuspiciousLevel.HIGH
    ];
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type SuspiciousLevelType = OnlyStringKeys<typeof SuspiciousLevel[keyof typeof SuspiciousLevel]>
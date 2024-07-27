export class IsidaState {
    public static readonly OFF = 'OFF';
    public static readonly IDLE = 'IDLE';
    public static readonly HEALING = 'HEALING';
    public static readonly DAMAGING = 'DAMAGING';

    public static STATES = [
        IsidaState.OFF,
        IsidaState.IDLE,
        IsidaState.HEALING,
        IsidaState.DAMAGING
    ];
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type IsidaStateType = OnlyStringKeys<typeof IsidaState[keyof typeof IsidaState]>
export class IsidaState {
    public static OFF = 'OFF';
    public static IDLE = 'IDLE';
    public static HEALING = 'HEALING';
    public static DAMAGING = 'DAMAGING';

    public static STATES = [
        IsidaState.OFF,
        IsidaState.IDLE,
        IsidaState.HEALING,
        IsidaState.DAMAGING
    ];
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type IsidaStateType = OnlyStringKeys<typeof IsidaState[keyof typeof IsidaState]>
export class ControlPointState {
    static RED = 'RED';
    static BLUE = 'BLUE';
    static NEUTRAL = 'NEUTRAL';

    static STATES = [
        ControlPointState.RED,
        ControlPointState.BLUE,
        ControlPointState.NEUTRAL
    ];
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type ControlPointStateType = OnlyStringKeys<typeof ControlPointState[keyof typeof ControlPointState]>
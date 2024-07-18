export class LayoutState {
    static readonly BATTLE_SELECT = 'BATTLE_SELECT'
    static readonly GARAGE = 'GARAGE'
    static readonly PAYMENT = 'PAYMENT'
    static readonly BATTLE = 'BATTLE'
    static readonly RELOAD_SPACE = 'RELOAD_SPACE'

    static readonly STATES = [
        LayoutState.BATTLE_SELECT,
        LayoutState.GARAGE,
        LayoutState.PAYMENT,
        LayoutState.BATTLE,
        LayoutState.RELOAD_SPACE
    ]
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type LayoutStateType = OnlyStringKeys<typeof LayoutState[keyof typeof LayoutState]>
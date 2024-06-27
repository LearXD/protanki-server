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

export type LayoutStateType = 'BATTLE_SELECT' | 'GARAGE' | 'PAYMENT' | 'BATTLE' | 'RELOAD_SPACE'
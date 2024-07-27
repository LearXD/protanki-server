export class BattleMode {
    static readonly DM = 'DM'
    static readonly TDM = 'TDM'
    static readonly CTF = 'CTF'
    static readonly CP = 'CP'
    static readonly AS = 'AS'

    static readonly ALL = [
        BattleMode.DM,
        BattleMode.TDM,
        BattleMode.CTF,
        BattleMode.CP,
        BattleMode.AS
    ]
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type BattleModeType = OnlyStringKeys<typeof BattleMode[keyof typeof BattleMode]>
export class Achievement {
    static readonly FIRST_RANK_UP = 'FIRST_RANK_UP'
    static readonly FIRST_PURCHASE = 'FIRST_PURCHASE'
    static readonly SET_EMAIL = 'SET_EMAIL'
    static readonly FIGHT_FIRST_BATTLE = 'FIGHT_FIRST_BATTLE'
    static readonly FIRST_DONATE = 'FIRST_DONATE'

    static readonly ACHIEVEMENTS = [
        Achievement.FIRST_RANK_UP,
        Achievement.FIRST_PURCHASE,
        Achievement.SET_EMAIL,
        Achievement.FIGHT_FIRST_BATTLE,
        Achievement.FIRST_DONATE
    ]
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type AchievementType = OnlyStringKeys<typeof Achievement[keyof typeof Achievement]>
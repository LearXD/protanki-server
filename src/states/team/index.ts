export class Team {
    static readonly RED = 'RED';
    static readonly BLUE = 'BLUE';
    static readonly NONE = 'NONE';

    static readonly TEAMS = [
        Team.RED,
        Team.BLUE,
        Team.NONE
    ];
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type TeamType = OnlyStringKeys<typeof Team[keyof typeof Team]>;
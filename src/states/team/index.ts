export class Team {
    static readonly RED = 'red';
    static readonly BLUE = 'blue';
    static readonly NONE = 'none';
    static readonly SPECTATOR = 'spectator';

    static readonly TEAMS = [
        Team.RED,
        Team.BLUE,
        Team.NONE
    ];
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type TeamType = OnlyStringKeys<typeof Team[keyof typeof Team]>;
export class Theme {
    static readonly SUMMER = 'SUMMER';
    static readonly WINTER = 'WINTER';
    static readonly SPACE = 'SPACE';
    static readonly SUMMER_DAY = 'SUMMER_DAY';
    static readonly SUMMER_NIGHT = 'SUMMER_NIGHT';
    static readonly WINTER_DAY = 'WINTER_DAY';
    static readonly WINTER_NIGHT = 'WINTER_NIGHT';

    static readonly THEMES = [
        Theme.SUMMER,
        Theme.WINTER,
        Theme.SPACE,
        Theme.SUMMER_DAY,
        Theme.SUMMER_NIGHT,
        Theme.WINTER_DAY,
        Theme.WINTER_NIGHT
    ];
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type ThemeType = OnlyStringKeys<typeof Theme[keyof typeof Theme]>
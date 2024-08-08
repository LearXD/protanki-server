export class Rank {
    public static readonly RECRUIT = 1;
    public static readonly PRIVATE = 2;
    public static readonly GEFREITER = 3;
    public static readonly CORPORAL = 4;
    public static readonly MASTER_CORPORAL = 5;
    public static readonly SERGEANT = 6;
    public static readonly STAFF_SERGEANT = 7;
    public static readonly MASTER_SERGEANT = 8;
    public static readonly FIRST_SERGEANT = 9;
    public static readonly SERGEANT_MAJOR = 10;
    public static readonly WARRANT_OFFICER_1 = 11;
    public static readonly WARRANT_OFFICER_2 = 12;
    public static readonly WARRANT_OFFICER_3 = 13;
    public static readonly WARRANT_OFFICER_4 = 14;
    public static readonly WARRANT_OFFICER_5 = 15;
    public static readonly THIRD_LIEUTENANT = 16;
    public static readonly SECOND_LIEUTENANT = 17;
    public static readonly FIRST_LIEUTENANT = 18;
    public static readonly CAPTAIN = 19;
    public static readonly MAJOR = 20;
    public static readonly LIEUTENANT_COLONEL = 21;
    public static readonly COLONEL = 22;
    public static readonly BRIGADIER = 23;
    public static readonly MAJOR_GENERAL = 24;
    public static readonly LIEUTENANT_GENERAL = 25;
    public static readonly GENERAL = 26;
    public static readonly MARSHAL = 27;
    public static readonly FIELD_MARSHAL = 28;
    public static readonly COMMANDER = 29;
    public static readonly GENERALISSIMO = 30;
}

export type RankType = Extract<typeof Rank[keyof typeof Rank], number>;
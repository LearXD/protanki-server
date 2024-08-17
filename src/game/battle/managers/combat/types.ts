export interface IDamageModifiers {
    incarnation: number;
    distance?: number;
    time?: number
    critical?: boolean;
    enemy?: boolean;
    splash?: boolean;
    order?: number;
    count?: number;
}
export class GarageItemUtils {

    public static serialize(name: string, level: number = 0): string {
        return `${name}_m${level}`;
    }

    public static deserialize(serialized: string): { name: string, level: number } {
        const [name, level] = serialized.split('_m');
        return { name, level: parseInt(level) };
    }

}
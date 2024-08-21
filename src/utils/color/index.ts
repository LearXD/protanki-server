export class Color {
    public static fromDecimal(number: number) {
        const r = (number >> 16) & 255;
        const g = (number >> 8) & 255;
        const b = number & 255;
        return { r, g, b };
    }

    public static toDecimal(r: number, g: number, b: number) {
        return (r << 16) + (g << 8) + b;
    }
} 
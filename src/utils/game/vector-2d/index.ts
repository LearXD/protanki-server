export class Vector2d {
    constructor(
        public x: number,
        public y: number
    ) { }

    public distanceTo(vector: Vector2d) {
        return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }
}
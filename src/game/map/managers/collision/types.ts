export type ICollisionPlane = {
    width: number,
    length: number,
    position: { x: number, y: number, z: number },
    rotation: { x: number, y: number, z: number }
}

export type ICollisionBox = {
    size: { x: number, y: number, z: number },
    position: { x: number, y: number, z: number },
    rotation: { x: number, y: number, z: number }
}

export type ICollisionTriangle = {
    vertices: { x: number, y: number, z: number }[]
    position: { x: number, y: number, z: number }
    rotation: { x: number, y: number, z: number }
}

export type ICollisionObject = ICollisionPlane | ICollisionBox | ICollisionTriangle

export interface IMapCollisions {
    planes: ICollisionPlane[],
    boxes: ICollisionBox[],
    triangles: ICollisionTriangle[]
}
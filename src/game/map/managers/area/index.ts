import { Player } from "@/game/player";
import { IMapArea, MapAreaAction } from "../../types";
import { Vector3d } from "@/utils/vector-3d";
import { Logger } from "@/utils/logger";

export class MapAreaManager {

    public rangeX: { min: number, max: number } = { min: 0, max: 0 }
    public rangeY: { min: number, max: number } = { min: 0, max: 0 }
    public rangeZ: { min: number, max: number } = { min: 0, max: 0 }

    public constructor(
        public readonly areas: IMapArea[]
    ) {
        areas.forEach(area => {
            const { minX, minY: minZ, minZ: minY, maxX, maxY: maxZ, maxZ: maxY } = area
            this.rangeX.min = Math.min(this.rangeX.min, minX)
            this.rangeX.max = Math.max(this.rangeX.max, maxX)
            this.rangeY.min = Math.min(this.rangeY.min, minY)
            this.rangeY.max = Math.max(this.rangeY.max, maxY)
            this.rangeZ.min = Math.min(this.rangeZ.min, minZ)
            this.rangeZ.max = Math.max(this.rangeZ.max, maxZ)
        })
    }

    public checkCollisions(player: Player, position?: Vector3d) {

        if (!player.tank || !player.tank.isAlive()) {
            return;
        }

        if (!position) {
            position = player.tank.getPosition();
        }

        if (
            position.x < this.rangeX.min || position.x > this.rangeX.max ||
            position.y < this.rangeY.min || position.y > this.rangeY.max ||
            position.z < this.rangeZ.min || position.z > this.rangeZ.max
        ) {
            Logger.alert(`Player ${player.getName()} is out of map bounds`)
            player.tank.suicide();
            return;
        }

        for (const area of this.areas) {
            const { minX, minY: minZ, minZ: minY, maxX, maxY: maxZ, maxZ: maxY } = area // SWAP Y AND Z
            if (
                (position.x > minX && position.x < maxX) &&
                (position.y > minY && position.y < maxY) &&
                (position.z > minZ && position.z < maxZ)
            ) {

                if (area.action === MapAreaAction.KILL) {
                    Logger.alert(`Player ${player.getName()} entered on kill area`);
                    player.tank.suicide();
                }

                if (area.action === MapAreaAction.KICK) {
                    Logger.alert(`Player ${player.getName()} entered on kick area`);
                    player.close()
                }
            }
        }
    }
}
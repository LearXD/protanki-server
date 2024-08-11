import { Vector3d } from "@/utils/vector-3d";
import { ICollisionPlane } from "../../types";
import { Logger } from "@/utils/logger";

export class MapCollisionPlane {
    public constructor(
        public readonly data: ICollisionPlane
    ) { }

    public getPosition() {
        return Vector3d.fromInterface(this.data.position, false)
    }

    public getWidth() {
        return this.data.width
    }

    public getLength() {
        return this.data.length
    }

    public getRotation() {
        return Vector3d.fromInterface(this.data.rotation, false)
    }

    public rotationMatrixX(angle: number): number[][] {
        return [
            [1, 0, 0],
            [0, Math.cos(angle), -Math.sin(angle)],
            [0, Math.sin(angle), Math.cos(angle)]
        ];
    }

    public rotationMatrixZ(angle: number): number[][] {
        return [
            [Math.cos(angle), -Math.sin(angle), 0],
            [Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 1]
        ];
    }

    public multiplyMatrices(A: number[][], B: number[][]): number[][] {
        let result: number[][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = A[i][0] * B[0][j] +
                    A[i][1] * B[1][j] +
                    A[i][2] * B[2][j];
            }
        }
        return result;
    }

    // Função para aplicar a rotação a um vetor 3D
    public applyRotation(vector: Vector3d, rotationMatrix: number[][]): Vector3d {
        const x = vector.getX();
        const y = vector.getY();
        const z = vector.getZ();
        return new Vector3d(
            rotationMatrix[0][0] * x + rotationMatrix[0][1] * y + rotationMatrix[0][2] * z,
            rotationMatrix[1][0] * x + rotationMatrix[1][1] * y + rotationMatrix[1][2] * z,
            rotationMatrix[2][0] * x + rotationMatrix[2][1] * y + rotationMatrix[2][2] * z
        );
    }

    // Modifique o método isColliding para levar em conta a rotação
    public isColliding(position: Vector3d, ignoreY: boolean = false): boolean {
        // Obtém a rotação do objeto
        const rotation = this.getRotation();
        const angleX = rotation.getX();
        const angleZ = rotation.getZ();

        // Cria as matrizes de rotação
        const rotX = this.rotationMatrixX(angleX);
        const rotZ = this.rotationMatrixZ(angleZ);

        // Combina as matrizes de rotação
        const finalRotationMatrix = this.multiplyMatrices(rotZ, rotX);

        // Obtém a posição e dimensões do objeto
        const objPosition = this.getPosition();
        const halfWidth = this.getLength() / 2;
        const halfLength = this.getWidth() / 2;
        // const halfHeight = ignoreY ? 0 : this.getHeight() / 2;

        // Aplica a rotação à posição do objeto
        const rotatedPosition = this.applyRotation(objPosition, finalRotationMatrix);

        // Ajusta a posição fornecida
        const rotatedPositionToCheck = this.applyRotation(position, finalRotationMatrix);

        // Verifica a colisão
        const xCollision = rotatedPositionToCheck.getX() >= rotatedPosition.getX() - halfWidth &&
            rotatedPositionToCheck.getX() <= rotatedPosition.getX() + halfWidth;
        const zCollision = rotatedPositionToCheck.getZ() >= rotatedPosition.getZ() - halfLength &&
            rotatedPositionToCheck.getZ() <= rotatedPosition.getZ() + halfLength;
        // const yCollision = ignoreY || (rotatedPositionToCheck.getY() >= rotatedPosition.getY() - halfHeight &&
        //                                 rotatedPositionToCheck.getY() <= rotatedPosition.getY() + halfHeight);

        return xCollision && zCollision
    }
}
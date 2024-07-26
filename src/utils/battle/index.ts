import { v4 } from "uuid"

export class BattleUtils {
    public static generateBattleId() {
        return v4().substring(0, 8) + v4().substring(0, 8)
    }
}
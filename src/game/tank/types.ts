import { SupplyType } from "@/states/supply";

export interface ITankEffect {
    type: SupplyType
    startedAt: number
    duration: number
    level: number
    activeAfterDeath: boolean
}
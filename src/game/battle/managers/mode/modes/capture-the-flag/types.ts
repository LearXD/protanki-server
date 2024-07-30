import { TeamType } from "@/states/team";

export type CaptureTheFlagTeam = Extract<TeamType, 'RED' | 'BLUE'>

export enum FlagState {
    PLACED = 'PLACED',
    TAKEN = 'TAKEN',
    DROPPED = 'DROPPED',
}
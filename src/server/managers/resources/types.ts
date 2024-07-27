export enum ResourceType {
    LOBBY = 'lobby',
    AUTH = 'auth',
    GARAGE = 'garage',
}

export interface IResource {
    idhigh: string
    idlow: number
    versionhigh: string
    versionlow: number
    lazy: boolean
    alpha?: boolean
    type: number
    weight?: number
    height?: number
    numFrames?: number
    fps?: number
    fileNames?: string[]
}
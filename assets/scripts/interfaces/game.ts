import { TileType } from "../enums/TileType"

export interface IGameManager {
    maxTurnsCount: number,
    pointsGoal: number,
    
    points: number,
    turns: number
}

export interface ITileTypeFactoryPair {
    tileType: TileType,
    factory: IFactory<any, any>
}

export interface IFactory<I, T> {
    getInstance(input?: I): T
}
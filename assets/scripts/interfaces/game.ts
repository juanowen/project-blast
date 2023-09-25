import { Size } from "cc"
import { GameState } from "../enums/GameState"
import { GameValueType } from "../enums/GameValueType"
import { TileType } from "../enums/TileType"

export interface IGameSettings {
    playgroundSize: Size,
    playgroundPadding: IPaddingSettings,
    blockSize: Size,

    maxTurnsCount: number,
    pointsGoal: number,
    
    maxShuffleCount: number,
    minValidGroupSize: number,

    animationsDuration: number
}

export interface IPaddingSettings {
    left: number,
    top: number,
    right: number,
    bottom: number,
}

export interface IGameValuesDictionary {
    data: IGameValue[]
}

export interface IGameValue {
    type: GameValueType,
    value: string | number | boolean
}

export interface IGameManager {
    settings: IGameSettings,
    currentState: GameState
}

export interface ITileTypeFactoryPair {
    tileType: TileType,
    factory: IFactory<any, any>
}

export interface IFactory<I, T> {
    getInstance(input?: I): T
}
import { Enum, EventTarget, Vec2 } from "cc"
import { GameState } from "../enums/GameState"
import { TileType } from "../enums/TileType"
import { GameEvent } from "../GameManager"

export interface IGameSettings {
    playgroundSize: Vec2,

    maxTurnsCount: number,
    pointsGoal: number,
    
    maxShuffleCount: number,
    minValidGroupSize: number,

    animationsDuration: number
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
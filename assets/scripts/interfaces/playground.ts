import { _decorator } from 'cc';
import { ITile, ITileGroup } from './tile';
import { PlaygroundGroupsManager } from '../Playground/PlaygroundGroupsManager';
import { PlaygroundFiller } from '../Playground/PlaygroundFiller';
import { TileType } from '../enums/TileType';

export interface IPlayground {
    width: number,
    height: number,
    filler: PlaygroundFiller,
    tileMap: Map<string, ITile>

    addTile(tile: ITile, x: number, y: number): void
    deleteTile(tile: ITile): void,
    getTile(x: number, y: number): ITile, 
    clear(): void,
    refill(): void
}
export interface IShufflePlayground extends IPlayground {
    shuffler: IPlaygroundShuffler,

    shufflePlayground(): void
}
export interface IGroupPlayground extends IPlayground {
    groupsManager: PlaygroundGroupsManager,

    analyzeGroups(): void
}

export interface IPlaygroundFiller {
    tileGenerator: number,
    init(playground: IPlayground): void,
    fillPlayground(): void,
    generateTile(tileType: TileType): ITile
}
export interface IPlaygroundGroupsManager {
    minValidGroupSize: number,
    groups: Set<ITileGroup>,
    init(playground: IGroupPlayground): void,
}
export interface IPlaygroundShuffler {
    maxShuffleCount: number,
    init(playground: IShufflePlayground): void,
    shuffle(playground: IPlayground): boolean
}



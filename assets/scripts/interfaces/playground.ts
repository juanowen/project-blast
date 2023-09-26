import { _decorator } from 'cc';
import { ITile, ITileGenerator, ITileGroup } from './tile';
import { TileType } from '../enums/TileType';
import { IGameSettings } from './game';

export interface IPlayground {
    width: number,
    height: number,
    filler: IPlaygroundFiller,
    tileMap: Map<string, ITile>

    addTile(tile: ITile, x: number, y: number): void
    deleteTile(tile: ITile): void,
    getTile(x: number, y: number): ITile, 
    hasTile(tile: ITile): boolean, 
    clear(): void,
    refill(): void
}
export interface IShufflePlayground extends IPlayground {
    shuffler: IPlaygroundShuffler,

    shufflePlayground(): void
}
export interface IGroupPlayground extends IPlayground {
    groupsManager: IPlaygroundGroupsManager,

    analyzeGroups(): void
}

export interface IPlaygroundFiller {
    tileGenerator: ITileGenerator,
    init(playground: IPlayground): void,
    fillPlayground(): void,
    generateTile(tileType: TileType): ITile
}
export interface IPlaygroundGroupsManager {
    groups: Set<ITileGroup>,
    init(playground: IGroupPlayground, settings: IGameSettings): void,
    collapseGroup(startTile: ITile): void
}
export interface IPlaygroundShuffler {
    init(playground: IShufflePlayground): void,
    shuffle(playground: IPlayground): void
}



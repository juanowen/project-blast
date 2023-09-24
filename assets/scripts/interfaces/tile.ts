import { _decorator } from 'cc';
import { TileType } from '../enums/TileType';
import { ITileTypeFactoryPair } from './game';
import { IPlayground, IPlaygroundGroupsManager } from './playground';

export interface ITile {
    x: number,
    y: number,

    tileType: TileType,
    group: ITileGroup,

    id: string,
    type: string,

    points: number,

    init(scheme: ITileScheme): void,
    collapse(playground: IPlayground, multiplier?: number): void
}
export interface IBasicTile extends ITile {
    colorType: number
}

export interface ITileScheme {
    tileType: TileType,
    points: number
}
export interface IBasicTileScheme extends ITileScheme {
    colorType: number
}

export interface ITileGroup {
    tileSet: Set<ITile>,
    manager: IPlaygroundGroupsManager,

    length: number,

    add(tile: ITile): void,
    delete(tile: ITile) : void,
    concat(group: ITileGroup): void
}

export interface ITileGenerator {
    configs: ITileTypeFactoryPair[],

    generateTile(tileType: TileType): ITile
}


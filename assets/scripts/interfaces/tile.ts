import { Color, _decorator } from 'cc';
import { TileType } from '../enums/TileType';
import { IPlayground } from './playground';

export interface ITile {
    x: number,
    y: number,

    tileType: TileType,
    group: ITileGroup,

    name: string,
    type: string,

    points: number,

    init(scheme: ITileScheme): void,
    collapse(playground: IPlayground, multiplier?: number): void
}
export interface IColorTile extends ITile {
    colorType: number
}
export interface IBasicTile extends ITile {
}

export interface ITileScheme {
    tileType: TileType,
    points: number
}
export interface IColorTileScheme extends ITileScheme {
    colorType: number,
    renderColor: Color
}

export interface ITileGroup {
    tileSet: Set<ITile>,
    length: number,

    add(tile: ITile): void,
    delete(tile: ITile) : void
}

export interface ITileGenerator {
    configs: ITileGeneratorConfig[],

    generateTile(tileType: TileType, x: number, y: number): ITile
}
export interface ITileGeneratorConfig {
    tileType: TileType,
    factory: ITileFactory
}
export interface ITileFactory {
    generateTile(): ITile
}


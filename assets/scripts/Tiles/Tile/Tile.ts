import { GameValueType } from '../../enums/GameValueType';
import { TileType } from '../../enums/TileType';
import { GameValuesDictionary } from '../../GameValuesDictionary';
import { IPlayground } from '../../interfaces/playground';
import { ITileGroup, ITileScheme, ITile } from '../../interfaces/tile';

export class Tile implements ITile {
    public x: number = 0;
    public y: number = 0;

    public tileType: TileType = TileType.None;
    public group: ITileGroup = null;

    public points: number = 0;

    get id(): string {
        return `x${this.x}_y${this.y}`;
    }
    get type(): string {
        return `${TileType[this.tileType]}`;
    }

    init(scheme: ITileScheme) {
        this.tileType = scheme.tileType;
        this.points = scheme.points;
    }

    collapse (playground: IPlayground, multiplier: number = 1) {
        const points = Math.floor(this.points * multiplier);
        GameValuesDictionary.eventTarget.emit(
            GameValuesDictionary.EventType.IncrementValue, 
            GameValueType.Points,
            points
        );
    }
}


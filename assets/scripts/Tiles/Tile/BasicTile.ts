import { _decorator, Color } from 'cc';
import { TileType } from '../../enums/TileType';
import { IPlayground } from '../../interfaces/playground';
import { IColorTile, IColorTileScheme, ITileGroup } from '../../interfaces/tile';
import { Tile } from './Tile';

export class BasicTile extends Tile implements IColorTile {
    public x: number = 0;
    public y: number = 0;
    public tileType: TileType = TileType.None;
    public colorType: number = 0;
    public group: ITileGroup = null;

    get name(): string {
        return `x${this.x}_y${this.y}`;
    }
    get type(): string {
        return `${TileType[this.tileType]}_${this.colorType}`;
    }

    private _renderColor: Color = null;

    init(scheme: IColorTileScheme) {
        super.init(scheme);

        this.colorType = scheme.colorType;
        this._renderColor = scheme.renderColor;
    }
}


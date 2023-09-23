import { TileType } from '../../enums/TileType';
import { IBasicTile, IBasicTileScheme } from '../../interfaces/tile';
import { Tile } from './Tile';

export class BasicTile extends Tile implements IBasicTile {
    public colorType: number = 0;

    get type(): string {
        return `${TileType[this.tileType]}_${this.colorType}`;
    }

    init(scheme: IBasicTileScheme) {
        super.init(scheme);

        this.colorType = scheme.colorType;
    }
}


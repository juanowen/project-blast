import { _decorator, Component, Node } from 'cc';
import { BoosterType } from '../../enums/BoosterType';
import { TileType } from '../../enums/TileType';
import { IBoosterTile, IBoosterTileScheme } from '../../interfaces/tile';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('BoosterTile')
export class BoosterTile extends Tile implements IBoosterTile {
    public boosterType: BoosterType;

    get type(): string {
        return `${TileType[this.tileType]}_${this.boosterType}`;
    }

    init(scheme: IBoosterTileScheme) {
        super.init(scheme);

        this.boosterType = scheme.boosterType;
    }
}


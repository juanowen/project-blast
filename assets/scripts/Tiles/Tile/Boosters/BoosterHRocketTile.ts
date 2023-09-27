import { _decorator, Component, Node } from 'cc';
import { GameValueType } from '../../../enums/GameValueType';
import { GameValuesDictionary } from '../../../GameValuesDictionary';
import { IPlayground } from '../../../interfaces/playground';
import { BoosterTile } from '../BoosterTile';
const { ccclass, property } = _decorator;

@ccclass('BoosterHRocketTile')
export class BoosterHRocketTile extends BoosterTile {
    collapse(playground: IPlayground): void {
        super.collapse(playground);

        for(let x = 0; x < playground.width; ++x) {
            const tile = playground.getTile(x, this.y);
            if (tile && tile !== this) {
                tile.collapse(playground);
            }
        }
    }
}


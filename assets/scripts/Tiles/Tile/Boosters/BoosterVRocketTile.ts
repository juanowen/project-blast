import { _decorator, Component, Node } from 'cc';
import { GameValueType } from '../../../enums/GameValueType';
import { GameValuesDictionary } from '../../../GameValuesDictionary';
import { IPlayground } from '../../../interfaces/playground';
import { BoosterTile } from '../BoosterTile';
const { ccclass, property } = _decorator;

@ccclass('BoosterVRocketTile')
export class BoosterVRocketTile extends BoosterTile {
    collapse(playground: IPlayground): void {
        super.collapse(playground);

        for(let y = 0; y < playground.height; ++y) {
            const tile = playground.getTile(this.x, y);
            if (tile && tile !== this) {
                tile.collapse(playground);
            }
        }
    }
}


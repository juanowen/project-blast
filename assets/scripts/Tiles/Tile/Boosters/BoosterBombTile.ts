import { _decorator, Component, Node } from 'cc';
import { GameValueType } from '../../../enums/GameValueType';
import { GameValuesDictionary } from '../../../GameValuesDictionary';
import { IPlayground } from '../../../interfaces/playground';
import { BoosterTile } from '../BoosterTile';
const { ccclass, property } = _decorator;

@ccclass('BoosterBombTile')
export class BoosterBombTile extends BoosterTile {
    collapse(playground: IPlayground): void {
        super.collapse(playground);

        for(let x = this.x - 2; x <= this.x + 2; ++x) {
            for(let y = this.y - 2; y <= this.y + 2; ++y) {
                const tile = playground.getTile(x, y);
                if (tile && tile !== this) {
                    tile.collapse(playground);
                }
            }
        }
    }
}


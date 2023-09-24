import { _decorator, Component, Node } from 'cc';
import { IPlaygroundShuffler, IShufflePlayground } from '../interfaces/playground';
import { ITile } from '../interfaces/tile';
const { ccclass, property } = _decorator;

@ccclass('PlaygroundShuffler')
export class PlaygroundShuffler extends Component implements IPlaygroundShuffler {
    private _playground: IShufflePlayground = null;

    init(playground: IShufflePlayground) {
        this._playground = playground;
    }

    shuffle() {
        const tiles = [...this._playground.tileMap.values()];
        this._playground.clear();
        
        for (let x = 0; x < this._playground.width; ++x) {
            for (let y = 0; y < this._playground.height; ++y) {
                const index = Math.floor(Math.random() * tiles.length);
                this._playground.addTile(tiles[index], x, y);
                tiles.splice(index, 1);
            }
        }
    }
}


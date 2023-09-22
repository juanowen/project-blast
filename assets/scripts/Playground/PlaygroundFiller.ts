import { _decorator, Component, Node } from 'cc';
import { TileType } from '../enums/TileType';
import { IPlayground } from '../interfaces/playground';
import { ITile } from '../interfaces/tile';
import { TileGenerator } from '../Tiles/TileGenerator';
const { ccclass, property } = _decorator;

@ccclass('PlaygroundFiller')
export class PlaygroundFiller extends Component {
    @property({ type: TileGenerator })
    tileGenerator: TileGenerator = null;

    private _playground: IPlayground = null;

    init(playground: IPlayground) {
        this._playground = playground;
    }

    fillPlayground() {
        for (let x = 0; x < this._playground.width; ++x) {
            const emptyCells = [];

            for (let y = 0; y < this._playground.height; ++y) {
                const tile = this._playground.getTile(x, y);
                if (!tile) {
                    emptyCells.push(y);
                } else if (emptyCells.length) {
                    const newY = emptyCells[0];

                    this._playground.deleteTile(tile);
                    this._playground.addTile(tile, x, newY);

                    emptyCells.shift();
                    emptyCells.push(y);
                }
            }

            emptyCells.forEach((y: number) => {
                const tile = this.generateTile(TileType.Basic);
                this._playground.addTile(tile, x, y);
            });
        }
    }

    generateTile(tileType: TileType): ITile {
        return this.tileGenerator.generateTile(tileType);
    }
}


import { _decorator, Component, warn } from 'cc';
import { IGroupPlayground, IPlayground, IShufflePlayground } from '../interfaces/playground';
import { ITile } from '../interfaces/tile';
import { PlaygroundGroupsManager } from './PlaygroundGroupsManager';
import { PlaygroundShuffler } from './PlaygroundShuffler';
import { PlaygroundFiller } from './PlaygroundFiller';
const { ccclass, property } = _decorator;

@ccclass('Playground')
export class Playground extends Component implements IPlayground, IGroupPlayground, IShufflePlayground {
    @property
    width: number = 0;
    @property
    height: number = 0;
    @property({ type: PlaygroundFiller })
    filler: PlaygroundFiller = null;
    @property({ type: PlaygroundGroupsManager })
    groupsManager: PlaygroundGroupsManager = null;
    @property({ type: PlaygroundShuffler })
    shuffler: PlaygroundShuffler = null;

    get tileMap(): Map<string, ITile> {
        return this._tileMap;
    }
    public _tileMap: Map<string, ITile> = new Map();

    start() {
        if (this.filler) {
            this.filler.init(this);

            this.refill();
        } else {
            warn(`Playground's filler can't be empty!`);
        }

        if (this.groupsManager) {
            this.groupsManager.init(this);
            this.analyzeGroups();
        } else {
            warn(`Playground's groups manager can't be empty!`);
        }

        if (this.shuffler) {
            this.shuffler.init(this);
        } else {
            warn(`Playground's shuffler can't be empty!`);
        }

        window['debug'] = this
    }

    addTile(tile: ITile, x: number, y: number) {
        tile.x = x;
        tile.y = y;

        this._tileMap.set(tile.id, tile);
    }

    deleteTile(tile: ITile) {
        this._tileMap.delete(tile.id);
    }

    getTile(x: number, y: number): ITile {
        return this._tileMap.get(`x${x}_y${y}`);
    }

    hasTile(tile: ITile): boolean {
        return this._tileMap.has(tile.id);
    }

    clear() {
        this._tileMap.clear();
    }

    refill() {
        if (!this.filler) return;
        
        this.filler.fillPlayground();
    }

    analyzeGroups() {
        if (!this.groupsManager) return;

        this.groupsManager.fillGroups();
        if (!this.groupsManager.hasValidGroups) {
            this.shufflePlayground();
        }
    }

    shufflePlayground() {
        if (!this.shuffler) return;

        if (this.shuffler.shuffle()) {
            this.analyzeGroups();
        }
    }
}


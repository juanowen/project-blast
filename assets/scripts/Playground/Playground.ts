import { _decorator, Component, warn } from 'cc';
import { IGroupPlayground, IPlayground, IShufflePlayground } from '../interfaces/playground';
import { ITile } from '../interfaces/tile';
import { PlaygroundGroupsManager } from './PlaygroundGroupsManager';
import { PlaygroundShuffler } from './PlaygroundShuffler';
import { PlaygroundFiller } from './PlaygroundFiller';
import { GameManager } from '../GameManager';
import { IGameSettings } from '../interfaces/game';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('Playground')
@executionOrder(1000)
export class Playground extends Component implements IPlayground, IGroupPlayground, IShufflePlayground {
    public width: number = 0;
    public height: number = 0;

    @property({ type: PlaygroundFiller })
    filler: PlaygroundFiller = null;
    @property({ type: PlaygroundGroupsManager })
    groupsManager: PlaygroundGroupsManager = null;
    @property({ type: PlaygroundShuffler })
    shuffler: PlaygroundShuffler = null;

    get tileMap(): Map<string, ITile> {
        return this._tileMap;
    }
    private _tileMap: Map<string, ITile> = new Map();

    init(settings: IGameSettings) {
        this.width = settings.playgroundSize.width;
        this.height = settings.playgroundSize.height;

        if (this.filler) {
            this.filler.init(this);
        } else {
            warn(`Playground's filler can't be empty!`);
        }

        if (this.groupsManager) {
            this.groupsManager.init(this, settings);
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
    }

    shufflePlayground() {
        if (!this.shuffler) return;

        this.shuffler.shuffle();
    }
}


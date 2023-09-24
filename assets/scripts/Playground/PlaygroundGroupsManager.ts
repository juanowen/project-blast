import { Component, _decorator } from 'cc';
import { GameManager } from '../GameManager';
import { IGroupPlayground, IPlaygroundGroupsManager } from '../interfaces/playground';
import { ITile, ITileGroup, IBasicTile } from '../interfaces/tile';
import { TileGroup } from '../Tiles/TileGroup';
const { ccclass, property } = _decorator;

@ccclass('PlaygroundGroupsManager')
export class PlaygroundGroupsManager extends Component implements IPlaygroundGroupsManager {
    @property
    minValidGroupSize: number = 2;

    groups: Set<ITileGroup> = new Set();

    private _playground: IGroupPlayground = null;

    init(playground: IGroupPlayground) {
        this._playground = playground;
    }

    fillGroups() {
        this.groups.clear();
        this._playground.tileMap.forEach((tile: ITile) => { tile.group = null });

        this._playground.tileMap.forEach((tile: ITile) => {
            if (!(tile.group instanceof TileGroup) || !this.groups.has(tile.group)) {
                tile.group = new TileGroup(this);
                this.groups.add(tile.group);
            }
            tile.group.add(tile);

            if (tile.x < this._playground.width - 1) {
                const rightNeighbor: ITile = this._playground.tileMap.get(`x${tile.x + 1}_y${tile.y}`);
                if (rightNeighbor.type === tile.type) {
                    rightNeighbor.group = tile.group;
                }
            }
            if (tile.y < this._playground.height - 1) {
                const topNeighbor: ITile = this._playground.tileMap.get(`x${tile.x}_y${tile.y + 1}`);
                if (topNeighbor.type === tile.type) {
                    topNeighbor.group = tile.group;
                }
            }
        });
    }

    hasValidGroups(): boolean {
        return Array.from(this.groups).some(group => group.length >= this.minValidGroupSize);
    }

    collapseGroup(startTile: ITile) {
        if (startTile.group.length < this.minValidGroupSize) return;

        const group = startTile.group;
        const multiplier = 1 + (group.length - 1) * 0.15;
        group.tileSet.forEach((tile: ITile) => {
            tile.collapse(this._playground, multiplier);
            this._playground.deleteTile(tile);
        });
        
        GameManager.eventTarget.emit(GameManager.EventType.NextGameState);
    }
}


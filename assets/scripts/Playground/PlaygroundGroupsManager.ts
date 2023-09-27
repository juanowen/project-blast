import { Component, _decorator } from 'cc';
import { TileType } from '../enums/TileType';
import { GameManager } from '../GameManager';
import { IGameSettings } from '../interfaces/game';
import { IGroupPlayground, IPlaygroundGroupsManager } from '../interfaces/playground';
import { ITile, ITileGroup, IBasicTile } from '../interfaces/tile';
import { TileGroup } from '../Tiles/TileGroup';
const { ccclass, property } = _decorator;

@ccclass('PlaygroundGroupsManager')
export class PlaygroundGroupsManager extends Component implements IPlaygroundGroupsManager {
    groups: Set<ITileGroup> = new Set();

    private _minValidGroupSize: number = 2;
    private _playground: IGroupPlayground = null;

    init(playground: IGroupPlayground, settings: IGameSettings) {
        this._playground = playground;
        this._minValidGroupSize = settings.minValidGroupSize;
    }

    fillGroups() {
        this.groups.clear();
        this._playground.tileMap.forEach((tile: ITile) => { tile.group = null });

        const tiles = [...this._playground.tileMap.values()];
        tiles.sort((a, b) => (a.y * this._playground.width + a.x) - (b.y * this._playground.width + b.x));

        tiles.forEach((tile: ITile) => {
            let group = tile.group || new TileGroup(this);
            group.add(tile);

            if (tile.x < this._playground.width - 1) {
                const rightNeighbor: ITile = this._playground.getTile(tile.x + 1, tile.y);
                this._analyzeNeighbor(tile, rightNeighbor);
            }
            if (tile.y < this._playground.height - 1) {
                const topNeighbor: ITile = this._playground.getTile(tile.x, tile.y + 1);
                this._analyzeNeighbor(tile, topNeighbor);
            }
            
            this.groups.add(group);
        });
    }

    hasValidGroups(): boolean {
        return Array.from(this.groups).some(group => group.length >= this._minValidGroupSize)
            || [...this._playground.tileMap.values()].some(tile => tile.tileType === TileType.Booster);
    }

    collapseGroup(startTile: ITile) {
        if (startTile.group.length < this._minValidGroupSize 
            && startTile.tileType !== TileType.Booster) return;

        const group = startTile.group;
        const multiplier = 1 + (group.length - 1) * 0.15;
        
        this._playground.filler.upgradeTile(startTile, TileType.Booster);
        
        group.tileSet.forEach((tile: ITile) => {
            tile.collapse(this._playground, multiplier);
        });
        
        GameManager.eventTarget.emit(GameManager.EventType.NextGameState);
    }

    private _analyzeNeighbor(tile: ITile, neighbor: ITile) {
        if (neighbor.type === tile.type) {
            if (neighbor.group === null) {
                tile.group.add(neighbor);
            } else if (neighbor.group !== tile.group) {
                tile.group.concat(neighbor.group);
                this.groups.delete(neighbor.group);
            }
        }
    }
}


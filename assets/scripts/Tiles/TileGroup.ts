import { _decorator, Component, Node } from 'cc';
import { IPlaygroundGroupsManager } from '../interfaces/playground';
import { ITile, ITileGroup } from '../interfaces/tile';

export class TileGroup implements ITileGroup {
    public tileSet: Set<ITile> = new Set();
    public manager: IPlaygroundGroupsManager = null;

    constructor(manager: IPlaygroundGroupsManager) {
        this.manager = manager;
    }

    get length(): number {
        return this.tileSet.size;
    }

    add(tile: ITile) {
        this.tileSet.add(tile);
    }

    delete(tile: ITile) {
        this.tileSet.delete(tile);
    }
}


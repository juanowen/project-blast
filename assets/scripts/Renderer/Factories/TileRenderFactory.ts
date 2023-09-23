import { _decorator, Component, instantiate, Prefab } from 'cc';
import { IFactory } from '../../interfaces/game';
import { ITileRender } from '../../interfaces/render';
import { ITile } from '../../interfaces/tile';
import { TileRender } from '../TileRender';
const { ccclass, property } = _decorator;

@ccclass('TileRenderFactory')
export class TileRenderFactory extends Component implements IFactory<ITile, ITileRender> {
    @property({ type: Prefab })
    renderPrefab: Prefab = null;

    getInstance(tile: ITile): TileRender {
        if (!this.renderPrefab) return null;

        const renderNode = instantiate(this.renderPrefab);
        const render = renderNode.getComponent(TileRender);

        // render.x = tile.x;
        // render.y = tile.y;
        // render.tileType = tile.tileType;
        render.model = tile;

        return render;
    }
}


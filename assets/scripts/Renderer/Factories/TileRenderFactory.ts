import { _decorator, Component, Prefab, Node } from 'cc';
import { ITile } from '../../interfaces/tile';
import { TileRender } from '../TileRender';
import { RenderFactory } from './RenderFactory';
const { ccclass, property } = _decorator;

@ccclass('TileRenderFactory')
export class TileRenderFactory extends RenderFactory {
    _prepareRender(renderNode: Node, tile: ITile): TileRender {
        const render = renderNode.getComponent(TileRender);
        render.model = tile;

        return render;
    }
}


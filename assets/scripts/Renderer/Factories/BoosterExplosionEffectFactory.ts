import { _decorator, size, Node } from 'cc';
import { EffectRender } from '../Effects/EffectRender';
import { TileRender } from '../TileRender';
import { EffectRenderFactory } from './EffectRenderFactory';
const { ccclass, property } = _decorator;

@ccclass('BoosterExplosionEffectFactory')
export class BoosterExplosionEffectFactory extends EffectRenderFactory {
    _prepareRender(renderNode: Node, emitData: TileRender): EffectRender {
        const render = super._prepareRender(renderNode, emitData);

        const dimension = emitData.getWorldSize().width / 20;
        render.size = size(dimension, dimension);
        
        return render;
    }
}


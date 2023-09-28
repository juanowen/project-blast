import { _decorator, Component, Node, size } from 'cc';
import { GameSettings } from '../../GameSettings';
import { PoolManager } from '../../Pool/PoolManager';
import { EffectRender } from '../Effects/EffectRender';
import { TileRender } from '../TileRender';
import { EffectRenderFactory } from './EffectRenderFactory';
const { ccclass, property } = _decorator;

@ccclass('TileExplosionEffectFactory')
export class TileExplosionEffectFactory extends EffectRenderFactory {
    _prepareRender(renderNode: Node, emitData: TileRender): EffectRender {
        const render = super._prepareRender(renderNode, emitData);

        const dimension = emitData.getWorldSize().width / 20;

        render.color = emitData.color;
        render.size = size(dimension, dimension);
        
        return render;
    }

    onBroadcastSettings(settings: GameSettings) {
        PoolManager.eventTarget.emit(
            PoolManager.EventType.CreatePoolFor, 
            this.renderPrefab, 
            settings.playgroundSize.width * settings.playgroundSize.height
        );
    }
}


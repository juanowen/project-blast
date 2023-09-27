import { _decorator, Component, Prefab, Node } from 'cc';
import { EffectRender } from '../Effects/EffectRender';
import { RenderFactory } from './RenderFactory';
const { ccclass, property } = _decorator;

@ccclass('EffectRenderFactory')
export class EffectRenderFactory extends RenderFactory {
    _prepareRender(renderNode: Node, emitData?: any): EffectRender {
        const render = renderNode.getComponent(EffectRender);

        return render;
    }
}


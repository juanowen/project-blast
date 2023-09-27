import { _decorator, Component, Enum, EventTarget, Vec3 } from 'cc';
import { EffectType } from '../../enums/EffectType';
import { ITypeFactoryPair } from '../../interfaces/game';
import { EffectRenderFactory } from '../Factories/EffectRenderFactory';
import { EffectRender } from './EffectRender';
const { ccclass, property } = _decorator;

const effectManagerEventTarget: EventTarget = new EventTarget();
enum EffectManagerEventType {
    SpawnEffect
}

@ccclass('EffectsGeneratorConfig')
class EffectsGeneratorConfig implements ITypeFactoryPair {
    @property({ type: Enum(EffectType) })
    type: EffectType = EffectType.None;
    @property({ type: EffectRenderFactory })
    factory: EffectRenderFactory = null;
}

@ccclass('EffectManager')
export class EffectManager extends Component {

    public static eventTarget: EventTarget = effectManagerEventTarget;
    public static EventType: typeof EffectManagerEventType = EffectManagerEventType;

    @property({ type: [EffectsGeneratorConfig] })
    configs: EffectsGeneratorConfig[] = [];

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        effectManagerEventTarget[func](EffectManagerEventType.SpawnEffect, this.onSpawnEffect, this);
    }

    _generateRender(effectType: EffectType, emitData?: any): EffectRender {
        const config = this.configs.find(config => config.type === effectType);
        if (config) {
            return config.factory.getInstance(emitData);
        }

        return null;
    }

    onSpawnEffect(effectType: EffectType, position: Vec3, emitInfo?: any) {
        const render = this._generateRender(effectType, emitInfo);

        if (render) {
            render.node.setParent(this.node);
            render.node.setWorldPosition(position);
        }
    }
}


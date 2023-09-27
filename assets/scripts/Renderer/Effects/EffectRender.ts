import { _decorator, Component, Node, ParticleSystem2D, Color, Size, warn } from 'cc';
import { IRender } from '../../interfaces/render';
import { PoolManager } from '../../Pool/PoolManager';
import { PoolObject } from '../../Pool/PoolObject';
const { ccclass, property } = _decorator;

@ccclass('EffectRender')
export class EffectRender extends PoolObject implements IRender {
    @property({ type: ParticleSystem2D })
    particleSystem: ParticleSystem2D = null;

    set color(value: Color) {
        if (this.particleSystem) {
            this.particleSystem.color = value;
            this.particleSystem.startColor = value;
            this.particleSystem.endColor = value;
        }
    }

    set size(value: Size) {
        if (this.particleSystem) {
            this.particleSystem.startSize = value.width;
        }
    }

    unuse() {
        this.color = Color.WHITE;
        this.size = Size.ZERO;
    }

    onLoad() {
        if (!this.particleSystem) {
            warn(`EffectRender's particle system can't be empty!`);
            this.node.destroy();
        }

        this.particleSystem.autoRemoveOnFinish = false;
        this.particleSystem.resetSystem();

        this.particleSystem._finishedSimulation = () => {
            this.particleSystem.resetSystem();

            PoolManager.eventTarget.emit(PoolManager.EventType.ReturnToPool, this.node);
        }
    }
}


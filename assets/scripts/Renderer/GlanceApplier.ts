import { _decorator, Component, Node, Material, Sprite, warn, EffectAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GlanceApplier')
export class GlanceApplier extends Component {
    @property({ type: Material })
    glanceMaterial: Material = null;
    @property({ type: Sprite })
    targetSprite: Sprite = null;
    
    onLoad() {
        if (!this.glanceMaterial) {
            warn(`GlanceApplier's glance material can't be empty!`);
            return;
        }

        if (!this.targetSprite) {
            warn(`GlanceApplier's target sprite can't be empty!`);
            return;
        }

        const mat = new Material();
        mat.copy(this.glanceMaterial);
        mat.setProperty('start_shift', Math.random() * 10);
        this.targetSprite.customMaterial = mat;
    }
}


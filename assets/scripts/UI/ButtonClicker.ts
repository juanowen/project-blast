import { _decorator, Component, warn, UITransform, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonClicker')
export class ButtonClicker extends Component {
    @property({ type: UITransform })
    buttonTransform: UITransform = null;
    @property({ type: UITransform })
    labelTransform: UITransform = null;

    private _originalButtonAnchors: Vec2 = null;
    private _originalLabelAnchors: Vec2 = null;
    
    onLoad() {
        if (!this.buttonTransform) {
            warn(`ButtonClicker's button transform can't be empty!`);
            this.enabled = false;
        }
    }

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        this.node[func](Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node[func](Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart() {
        this._originalButtonAnchors = this.buttonTransform.anchorPoint.clone();
        this.buttonTransform.setAnchorPoint(this.buttonTransform.anchorX, this.buttonTransform.anchorY + 0.1);
        if (this.labelTransform) {
            this._originalLabelAnchors = this.labelTransform.anchorPoint.clone();
            this.labelTransform.setAnchorPoint(this.labelTransform.anchorX, this.labelTransform.anchorY + 0.2);
        }
    }

    onTouchEnd() {
        this.buttonTransform.setAnchorPoint(this._originalButtonAnchors);
        if (this.labelTransform) {
            this.labelTransform.setAnchorPoint(this._originalLabelAnchors);
        }
    }
}


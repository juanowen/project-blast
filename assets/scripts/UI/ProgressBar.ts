import { _decorator, Component, Node, warn, UITransform, Label } from 'cc';
import { GameManager } from '../GameManager';
import { IGameSettings } from '../interfaces/game';
const { ccclass, property } = _decorator;

@ccclass('ProgressBar')
export class ProgressBar extends Component {
    @property({ type: UITransform })
    fillerTransform: UITransform = null;
    @property({ type: Label })
    label: Label = null;
    @property
    labelTemplate: string = '';

    private _maxValue: number = 0;
    private _currentValue: number = 0;
    private _transform: UITransform = null;

    onLoad() {
        this._transform = this.getComponent(UITransform);

        if (!this.fillerTransform) {
            warn(`ProgressBar's filler node can't be empty!`);
            this.enabled = false;
        } else {
            this.onSizeChanged();
        }

        if (!this.label) {
            warn(`ProgressBar's label node can't be empty!`);
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

        GameManager.eventTarget[func](GameManager.EventType.GameInitialized, this.onGameInitialized, this)
        this.node[func](Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
    }

    _updateLabelString() {
        let resultString = this.labelTemplate;
        resultString = resultString.replace('#currentValue', this._currentValue.toString());
        resultString = resultString.replace('#maxValue', this._maxValue.toString());
        resultString = resultString.replace('#currentPercents', Math.floor(this._currentValue / this._maxValue) + '%');

        this.label.string = resultString;
    }

    onGameInitialized(settings: IGameSettings) {
        this._maxValue = settings.pointsGoal;
        this._updateLabelString();
    }

    onSizeChanged() {
        this.fillerTransform.setContentSize(
            this._transform.width * (this._currentValue / this._maxValue),
            this._transform.height
        );
    }
}


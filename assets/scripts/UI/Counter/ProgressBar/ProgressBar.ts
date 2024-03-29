import { _decorator, Component, Node, warn, UITransform, Label, Tween, tween, Size, size, v3, director, Director } from 'cc';
import { GameSettingsEventTarget, GameSettingsEventType } from '../../../GameSettings';
import { GameValuesDictionary } from '../../../GameValuesDictionary';
import { IGameSettings, IGameValue } from '../../../interfaces/game';
import { IProgressBarView } from '../../../interfaces/ui';
import { Counter } from '../Counter';
const { ccclass, property } = _decorator;

@ccclass('ProgressBar')
export class ProgressBar extends Counter implements IProgressBarView {
    @property 
    maxValuePropName: string = '';
    @property({ type: UITransform })
    fillerTransform: UITransform = null;
    @property
    labelTemplate: string = '';

    get maxValue(): number {
        return this._maxValue;
    }
    get currentRatio(): number {
        let ratio = this.currentValue / this._maxValue;
        ratio = Math.min(1, ratio);
        ratio = Math.max(0, ratio);

        return ratio;
    }

    private _maxValue: number = 0;
    private _transform: UITransform = null;
    private _fillerTween: Tween<Size> = null;

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

    _handleSubscriptions(isOn: boolean) {
        super._handleSubscriptions(isOn);

        const func = isOn ? 'on' : 'off';

        GameSettingsEventTarget[func](
            GameSettingsEventType.BroadcastSettings, 
            this.onBroadcastSettings, 
            this
        );
        this.node[func](Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
    }

    _updateLabelString() {
        let resultString = this.labelTemplate;
        resultString = resultString.replace('#currentValue', this.currentValue.toString());
        resultString = resultString.replace('#maxValue', this._maxValue.toString());
        resultString = resultString.replace('#currentPercents', this.currentRatio * 100 + '%');

        this.label.string = resultString;
    }

    _getFillerContentSize(): Size {
        return size(
            this._transform.width * this.currentRatio,
            this._transform.height
        );
    }

    _redrawFiller() {
        this.fillerTransform.setContentSize(this._getFillerContentSize());
        this.fillerTransform.node.setScale(1, 1);
    }

    _animateFiller() {
        const currentSize = this.fillerTransform.contentSize.clone();

        this._fillerTween && this._fillerTween.stop();
        this._fillerTween = tween(currentSize)
            .to(
                .5, 
                this._getFillerContentSize(),
                {
                    easing: 'backOut',
                    onUpdate: (target: Size, ratio: number) => {
                        this.fillerTransform.setContentSize(target);
                        const scale = v3(1, 1 + Math.sin(ratio * Math.PI) * 0.1);
                        this.fillerTransform.node.setScale(scale);
                    }
                })
            .start();
    }

    onBroadcastSettings(settings: IGameSettings) {
        this._maxValue = settings.hasOwnProperty(this.maxValuePropName) ? settings[this.maxValuePropName] : 0;

        this._updateLabelString();
    }

    onSizeChanged() {
        this._fillerTween && this._fillerTween.stop();
        this._redrawFiller();
    }
    
    onGameValuesChanged(data: IGameValue[]) {
        const value = GameValuesDictionary.getValueFromData(this.targetValueType, data) as number;
        this.currentValue = value || 0;

        this._animateFiller();
        this._updateLabelString();
    }

    onBeforeSceneLoadingEvent() {
        this._fillerTween && this._fillerTween.stop();
        this._redrawFiller();

        super.onBeforeSceneLoadingEvent();
    }
}


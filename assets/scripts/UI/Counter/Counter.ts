import { _decorator, Component, Node, Label, Tween, tween, warn,  } from 'cc';
import { GameManager } from '../../GameManager';
import { GameValuesDictionary } from '../../GameValuesDictionary';
import { IGameSettings, IGameValue } from '../../interfaces/game';
import { ICounterView } from '../../interfaces/ui';
const { ccclass, property } = _decorator;

interface CounterObject {
    value: number
}

@ccclass('Counter')
export class Counter extends Component implements ICounterView {
    @property({ type: Label })
    label: Label = null;
    
    get currentValue(): number {
        return this._currentValue;
    }
    set currentValue(value: number) {
        this._currentValue = value;
    }

    private _currentValue: number = 0;
    private _animTween: Tween<CounterObject> = null;

    onLoad() {
        if (!this.label) {
            warn(`Counter's label node can't be empty!`);
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

        GameValuesDictionary.eventTarget[func](
            GameValuesDictionary.EventType.ValuesChanged,
            this.onGameValuesChanged,
            this
        );
    }

    _updateLabelString() {
        let resultString = this._currentValue.toString();

        this.label.string = resultString;
    }

    _animateLabelString() {
        const counterObject: CounterObject = {
            value: +this.label.string
        };

        this._animTween && this._animTween.stop();
        this._animTween = tween(counterObject)
            .to(
                .5, 
                { value: this._currentValue },
                {
                    onUpdate: (target: CounterObject, ratio: number) => {
                        this.label.string = Math.floor(target.value).toString();
                    }
                })
            .start();
    }
    
    onGameValuesChanged(data: IGameValue[]) {
        this._animateLabelString();
    }
}


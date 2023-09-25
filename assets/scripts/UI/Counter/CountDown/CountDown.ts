import { _decorator, Component, Node } from 'cc';
import { GameManager } from '../../../GameManager';
import { IGameSettings } from '../../../interfaces/game';
import { ICountDownView } from '../../../interfaces/ui';
import { Counter } from '../Counter';
const { ccclass, property } = _decorator;

@ccclass('CountDown')
export class CountDown extends Counter implements ICountDownView {
    get maxValue(): number {
        return this._maxValue;
    }
    set maxValue(value: number) {
        this._maxValue = value;
    }
    
    private _maxValue: number = 0;

    _handleSubscriptions(isOn: boolean) {
        super._handleSubscriptions(isOn);

        const func = isOn ? 'on' : 'off';

        GameManager.eventTarget[func](GameManager.EventType.GameInitialized, this.onGameInitialized, this);
    }
    
    onGameInitialized(settings: IGameSettings) {
        this._updateLabelString();
    }
}


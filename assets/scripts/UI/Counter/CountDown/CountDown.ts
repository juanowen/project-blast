import { _decorator } from 'cc';
import { GameSettingsEventTarget, GameSettingsEventType } from '../../../GameSettings';
import { GameValuesDictionary } from '../../../GameValuesDictionary';
import { IGameSettings, IGameValue } from '../../../interfaces/game';
import { ICountDownView } from '../../../interfaces/ui';
import { Counter } from '../Counter';
const { ccclass, property } = _decorator;

@ccclass('CountDown')
export class CountDown extends Counter implements ICountDownView {
    @property 
    maxValuePropName: string = '';

    get maxValue(): number {
        return this._maxValue;
    }
    
    private _maxValue: number = 0;

    _handleSubscriptions(isOn: boolean) {
        super._handleSubscriptions(isOn);

        const func = isOn ? 'on' : 'off';

        GameSettingsEventTarget[func](
            GameSettingsEventType.BroadcastSettings, 
            this.onBroadcastSettings, 
            this
        );
    }
    
    onGameValuesChanged(data: IGameValue[]) {
        const value = GameValuesDictionary.getValueFromData(this.targetValueType, data) as number;
        this.currentValue = this.maxValue - (value || 0);

        this._animateLabelString();
    }
    
    onBroadcastSettings(settings: IGameSettings) {
        this._maxValue = settings.hasOwnProperty(this.maxValuePropName) ? settings[this.maxValuePropName] : 0;
        this.currentValue = this._maxValue;

        this._updateLabelString();
    }
}


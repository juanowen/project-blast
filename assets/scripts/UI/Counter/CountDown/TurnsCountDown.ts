import { _decorator, Component, Node } from 'cc';
import { GameValueType } from '../../../enums/GameValueType';
import { GameValuesDictionary } from '../../../GameValuesDictionary';
import { IGameSettings, IGameValue } from '../../../interfaces/game';
import { CountDown } from './CountDown';
const { ccclass, property } = _decorator;

@ccclass('TurnsCountDown')
export class TurnsCountDown extends CountDown {
    onGameInitialized(settings: IGameSettings) {
        this.maxValue = settings.maxTurnsCount;
        this.currentValue = this.maxValue;

        super.onGameInitialized(settings);
    }
    
    onGameValuesChanged(data: IGameValue[]) {
        const turns = GameValuesDictionary.getValue(GameValueType.Turns, data) as number;
        this.currentValue = this.maxValue - (turns || 0);

        super.onGameValuesChanged(data);
    }
}


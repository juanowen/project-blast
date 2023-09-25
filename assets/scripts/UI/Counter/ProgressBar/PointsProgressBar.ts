import { _decorator, Component, Node } from 'cc';
import { GameValueType } from '../../../enums/GameValueType';
import { GameValuesDictionary } from '../../../GameValuesDictionary';
import { IGameSettings, IGameValue } from '../../../interfaces/game';
import { ProgressBar } from './ProgressBar';
const { ccclass, property } = _decorator;

@ccclass('PointsProgressBar')
export class PointsProgressBar extends ProgressBar {
    onGameInitialized(settings: IGameSettings) {
        this.maxValue = settings.pointsGoal;

        super.onGameInitialized(settings);
    }
    
    onGameValuesChanged(data: IGameValue[]) {
        const points = GameValuesDictionary.getValueFromData(GameValueType.Points, data) as number;
        this.currentValue = points || 0;

        super.onGameValuesChanged(data);
    }
}


import { _decorator, Component, Node } from 'cc';
import { GameValueType } from '../../enums/GameValueType';
import { GameValuesDictionary } from '../../GameValuesDictionary';
import { IGameValue } from '../../interfaces/game';
import { Counter } from './Counter';
const { ccclass, property } = _decorator;

@ccclass('PointsCounter')
export class PointsCounter extends Counter {
    onGameValuesChanged(data: IGameValue[]) {
        const points = GameValuesDictionary.getValueFromData(GameValueType.Points, data) as number;
        this.currentValue = points || 0;

        super.onGameValuesChanged(data);
    }
}


import { _decorator, Component, Vec2, v2 } from 'cc';
import { IGameSettings } from './interfaces/game';
const { ccclass, property } = _decorator;

@ccclass('GameSettings')
export class GameSettings extends Component implements IGameSettings {
    @property
    playgroundSize: Vec2 = v2(5, 6);
    @property
    maxTurnsCount: number = 10;
    @property
    pointsGoal: number = 500;
    @property
    maxShuffleCount: number = 3;
    @property
    minValidGroupSize: number = 2;
    @property
    animationsDuration: number = 0.35;
}


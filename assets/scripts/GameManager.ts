import { _decorator, Component, Node, EventTarget } from 'cc';
import { GameState } from './enums/GameState';
import { IGameManager } from './interfaces/game';
const { ccclass, property } = _decorator;

const gameEventTarget = new EventTarget();
enum GameEvent {
    ChangeGameState,
    PointsGained,
    TurnEnded,
};

@ccclass('GameManager')
export class GameManager extends Component implements IGameManager {
    @property
    maxTurnsCount: number = 10;
    @property
    pointsGoal: number = 1000;

    public points: number = 0;
    public turns: number = 0;

    private _currentState: GameState = GameState.Initialization;

    public static eventTarget: EventTarget = gameEventTarget;
    public static EventType: typeof GameEvent = GameEvent;

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.ChangeGameState, this.onChangeGameState, this);
        gameEventTarget[func](GameEvent.PointsGained, this.onPointsGained, this);
        gameEventTarget[func](GameEvent.TurnEnded, this.onTurnEnded, this);
    }

    onChangeGameState(gameState: GameState) {
        switch(gameState) {

        }

        this._currentState = gameState;
    }

    onPointsGained(points: number) {
        this.points += points;

        console.log(this.points);
        

        if (this.points >= this.pointsGoal) {
            this.onChangeGameState(GameState.Win);
        }
    }

    onTurnEnded() {
        if (++this.turns === this.maxTurnsCount) {
            this.onChangeGameState(GameState.Lose);
        }
    }
}


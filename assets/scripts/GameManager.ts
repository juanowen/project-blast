import { _decorator, Component, warn, EventTarget } from 'cc';
import { GameState } from './enums/GameState';
import { IGameManager } from './interfaces/game';
import { Playground } from './Playground/Playground';
import { PlaygroundRenderer } from './Renderer/PlaygroundRenderer';
const { ccclass, property } = _decorator;

const gameEventTarget = new EventTarget();
enum GameEvent {
    GameStateChanged,
    NextGameState,
    PointsGained
};

@ccclass('GameManager')
export class GameManager extends Component implements IGameManager {
    @property({ type: Playground })
    playgroundManager: Playground = null;
    @property({ type: PlaygroundRenderer })
    playgroundRenderer: PlaygroundRenderer = null;
    @property
    maxTurnsCount: number = 10;
    @property
    pointsGoal: number = 1000;

    public points: number = 0;
    public turns: number = 0;

    set currentState(value: GameState) {
        this._currentState = value;

        gameEventTarget.emit(GameEvent.GameStateChanged, this._currentState);
        this.onCurrentStateChanged();
    }
    private _currentState: GameState = GameState.Initialization;

    public static eventTarget: EventTarget = gameEventTarget;
    public static EventType: typeof GameEvent = GameEvent;

    start() {
        if (!this.playgroundManager) {
            warn(`GameManager's playground manager can't be empty!`);
            this.enabled = false;
        }

        if (!this.playgroundManager) {
            warn(`GameManager's playground renderer can't be empty!`);
            this.enabled = false;
        }

        window['debug'] = this
    }

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.NextGameState, this.onNextGameState, this);
        gameEventTarget[func](GameEvent.PointsGained, this.onPointsGained, this);
    }

    onCurrentStateChanged() {
        switch(this._currentState) {
            case GameState.Filling: 
                this.playgroundManager.refill();
                this.playgroundRenderer.redraw();
                break;
            case GameState.Analysis: 
                this.playgroundManager.analyzeGroups();
                this.onNextGameState();
                break;
            case GameState.Shuffling: 
                this.playgroundManager.shufflePlayground();
                this.playgroundRenderer.redraw();
                break;
            case GameState.InputProcessing: 
                this.playgroundRenderer.redraw();
                
                if (++this.turns === this.maxTurnsCount) {
                    this.currentState = GameState.Lose;
                }
                break;
        }
    }

    onNextGameState() {
        switch(this._currentState) {
            case GameState.Initialization: 
                this.currentState = GameState.Filling;
                break;
            case GameState.Filling: 
                this.currentState = GameState.Analysis;
                break;
            case GameState.Shuffling: 
                this.currentState = GameState.Analysis;
                break;
            case GameState.Analysis: 
                if (!this.playgroundManager.groupsManager.hasValidGroups()) {
                    this.currentState = GameState.Shuffling;
                } else {
                    this.currentState = GameState.InputPending;
                }
                break;
            case GameState.InputPending: 
                this.currentState = GameState.InputProcessing;
                break;
            case GameState.InputProcessing: 
                this.currentState = GameState.Filling;
                break;
        }
    }

    onPointsGained(points: number) {
        this.points += points;

        console.log(this.points);
        

        if (this.points >= this.pointsGoal) {
            this.currentState = GameState.Win;
        }
    }
}


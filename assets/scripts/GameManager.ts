import { _decorator, Component, warn, EventTarget } from 'cc';
import { GameState } from './enums/GameState';
import { GameSettings } from './GameSettings';
import { IGameManager, IGameSettings } from './interfaces/game';
import { Playground } from './Playground/Playground';
import { PlaygroundRenderer } from './Renderer/PlaygroundRenderer';
const { ccclass, property } = _decorator;

const gameEventTarget = new EventTarget();
export enum GameEvent {
    GameStateChanged,
    NextGameState,
    PointsGained
};

@ccclass('GameManager')
export class GameManager extends Component implements IGameManager {

    public static eventTarget: EventTarget = gameEventTarget;
    public static EventType: typeof GameEvent = GameEvent;

    @property({ type: GameSettings })
    settings: GameSettings = null;
    @property({ type: Playground })
    playgroundManager: Playground = null;
    @property({ type: PlaygroundRenderer })
    playgroundRenderer: PlaygroundRenderer = null;

    private _points: number = 0;
    private _turns: number = 0;
    private _shuffleCount: number = 0;

    set currentState(value: GameState) {
        this._currentState = value;

        gameEventTarget.emit(GameEvent.GameStateChanged, this._currentState);
        this.onCurrentStateChanged();
    }
    private _currentState: GameState = GameState.Initialization;

    start() {
        if (!this.settings) {
            warn(`GameManager's game settings can't be empty!`);
            this.enabled = false;
        }

        if (!this.playgroundRenderer) {
            warn(`GameManager's playground renderer can't be empty!`);
            this.enabled = false;
        }

        if (!this.playgroundManager) {
            warn(`GameManager's playground manager can't be empty!`);
            this.enabled = false;
        } else {
            this.playgroundManager.init(this.settings);
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
                this._shuffleCount++;
                this.playgroundManager.shufflePlayground();
                this.playgroundRenderer.redraw();
                break;
            case GameState.InputProcessing: 
                this.playgroundRenderer.redraw();
                
                if (++this._turns === this.settings.maxTurnsCount) {
                    this.currentState = GameState.Lose;
                }
                break;
            case GameState.Win: 
                break;
            case GameState.Lose: 
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
                if (this._shuffleCount <= this.settings.maxShuffleCount) {
                    this.currentState = GameState.Analysis;
                } else {
                    this.currentState = GameState.Lose;
                }
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
        this._points += points;

        console.log(this._points);
        
        if (this._points >= this.settings.pointsGoal) {
            this.currentState = GameState.Win;
        }
    }
}


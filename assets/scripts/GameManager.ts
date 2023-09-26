import { _decorator, Component, warn, EventTarget, director } from 'cc';
import { GameState } from './enums/GameState';
import { GameValueType } from './enums/GameValueType';
import { GameSettings } from './GameSettings';
import { GameValuesDictionary } from './GameValuesDictionary';
import { IGameManager, IGameSettings, IGameValue } from './interfaces/game';
import { Playground } from './Playground/Playground';
import { PlaygroundRenderer } from './Renderer/PlaygroundRenderer';
const { ccclass, property } = _decorator;

const gameEventTarget = new EventTarget();
export enum GameEvent {
    GameInitialized,
    GameStateChanged,
    NextGameState
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
        } else {
            this.playgroundRenderer.init(this.settings);
        }

        if (!this.playgroundManager) {
            warn(`GameManager's playground manager can't be empty!`);
            this.enabled = false;
        } else {
            this.playgroundManager.init(this.settings);
        }

        gameEventTarget.emit(GameEvent.GameInitialized, this.settings);
        this.onNextGameState();
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
    }

    onCurrentStateChanged() {
        switch(this._currentState) {
            case GameState.Filling: 
                this.playgroundManager.refill();
                this.playgroundRenderer.redraw();
                break;
            case GameState.Analysis: 
                this.playgroundManager.analyzeGroups();
                this._checkGameOver();
                this.onNextGameState();
                break;
            case GameState.Shuffling: 
                GameValuesDictionary.eventTarget.emit(
                    GameValuesDictionary.EventType.IncrementValue, 
                    GameValueType.ShuffleCount
                );
                this.playgroundManager.shufflePlayground();
                this.playgroundRenderer.redraw();
                break;
            case GameState.InputProcessing: 
                this.playgroundRenderer.redraw();
                break;
            case GameState.Win: 
                this.playgroundRenderer.redraw();
                director.loadScene('FinalScene');
                break;
            case GameState.Lose: 
                this.playgroundRenderer.redraw();

                GameValuesDictionary.eventTarget.emit(
                    GameValuesDictionary.EventType.UpdateValue,
                    GameValueType.PlayerLost,
                    true
                );
                
                director.loadScene('FinalScene');
                break;
        }
    }

    onNextGameState() {
        switch(this._currentState) {
            case GameState.Initialization: 
                this.currentState = GameState.Filling;
                break;
            case GameState.Filling: 
            case GameState.Shuffling: 
                // this.playgroundRenderer.reorderSiblings();
                // this.currentState = GameState.Analysis;
                // break;
                this.playgroundRenderer.reorderSiblings();
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
                GameValuesDictionary.eventTarget.emit(
                    GameValuesDictionary.EventType.IncrementValue, 
                    GameValueType.Turns
                );
                this.currentState = GameState.InputProcessing;
                break;
            case GameState.InputProcessing: 
                this.playgroundRenderer.reorderSiblings();
                this.currentState = GameState.Filling;
                break;
        }
    }

    _checkGameOver() {
        const turns = GameValuesDictionary.getValue(GameValueType.Turns);
        const points = GameValuesDictionary.getValue(GameValueType.Points);
        const shuffleCount = GameValuesDictionary.getValue(GameValueType.ShuffleCount);

        if (points >= this.settings.pointsGoal && turns <= this.settings.maxTurnsCount) {
            this.currentState = GameState.Win;
            return;
        }
        if (shuffleCount > this.settings.maxShuffleCount) {
            this.currentState = GameState.Lose;
            GameValuesDictionary.eventTarget.emit(
                GameValuesDictionary.EventType.UpdateValue,
                GameValueType.LossReason,
                'No more available moves'
            );
            return;
        }
        if (turns === this.settings.maxTurnsCount && points < this.settings.pointsGoal) {
            this.currentState = GameState.Lose;
            GameValuesDictionary.eventTarget.emit(
                GameValuesDictionary.EventType.UpdateValue,
                GameValueType.LossReason,
                'Not enough points scored'
            );
            return;
        }
    }
}


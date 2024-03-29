import { _decorator, Component, Size, size, game, EventTarget } from 'cc';
import { IGameSettings, IPaddingSettings } from './interfaces/game';
const { ccclass, property } = _decorator;

export const GameSettingsEventTarget: EventTarget = new EventTarget();
export enum GameSettingsEventType {
    BroadcastSettings
}

@ccclass('PaddingSettings')
class PaddingSettings implements IPaddingSettings {
    @property
    left: number = 5;
    @property
    top: number = 26;
    @property
    right: number = 5;
    @property
    bottom: number = 5;
}

@ccclass('GameSettings')
export class GameSettings extends Component implements IGameSettings {
    @property
    playgroundSize: Size = size(5, 6);
    @property({ type: PaddingSettings })
    playgroundPadding: PaddingSettings = new PaddingSettings();
    @property
    blockSize: Size = size(171, 171);
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
    @property
    tileTypesCount: number = 5;

    onLoad() {
		game.addPersistRootNode(this.node);
    }

    onEnable() {
        if (this.playgroundSize.height > this.playgroundSize.width) {
            const height = this.playgroundSize.height;
            this.playgroundSize.height = this.playgroundSize.width;
            this.playgroundSize.width = height;
        }

        GameSettingsEventTarget.emit(GameSettingsEventType.BroadcastSettings, this);
    }
}


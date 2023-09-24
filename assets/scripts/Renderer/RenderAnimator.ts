import { _decorator, Component } from 'cc';
import { GameManager } from '../GameManager';
import { IGameSettings } from '../interfaces/game';
import { IRenderAnimator, } from '../interfaces/render';
const { ccclass, property } = _decorator;

@ccclass('RenderAnimator')
export class RenderAnimator extends Component implements IRenderAnimator {
    private _animationQueue: Map<string, Function> = new Map();
    private _animationsDuration: number = 0.35;

    init(settings: IGameSettings) {
        this._animationsDuration = settings.animationsDuration;
    }

    addToAnimationQueue(component: Component, func: Function) {
        const animId = `${component.uuid}_${func.name}`;
        this._animationQueue.set(
            animId,
            () => {
                func(this._animationsDuration, () => {
                    this._checkIfReady(animId);
                })
            }
        );
    }

    processQueues() {
        this._animationQueue.forEach((func: Function) => {
            func();
        });
    }

    private _checkIfReady(animId: string) {
        this._animationQueue.delete(animId);
        if (this._animationQueue.size === 0) {
            GameManager.eventTarget.emit(GameManager.EventType.NextGameState);
        }
    }
}


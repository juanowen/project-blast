import { _decorator, Component } from 'cc';
import { IRenderAnimator, } from '../interfaces/render';
const { ccclass, property } = _decorator;

@ccclass('RenderAnimator')
export class RenderAnimator extends Component implements IRenderAnimator {
    private _animationQueue: Map<string, Function> = new Map();

    addToAnimationQueue(component: Component, func: Function) {
        const animId = `${component.uuid}_${func.name}`;
        this._animationQueue.set(
            animId,
            () => {
                func(() => {
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
            console.log('Animation ended');
        }
    }
}


import { _decorator, Component, Node, EventTarget, Tween, Size, tween, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

interface ChangingValue {
    value: number
}

const cameraShakerEventTarget: EventTarget = new EventTarget();
enum CameraShakerEventType {
    StartShake,
    StopShake,
    ShakeOnce
}

@ccclass('CameraShaker')
export class CameraShaker extends Component {

    public static eventTarget: EventTarget = cameraShakerEventTarget;
    public static EventType: typeof CameraShakerEventType = CameraShakerEventType;

    @property
    shakeSize: Size = new Size(0, 0);
    @property
    shakeFrequency: Vec2 = new Vec2(0, 0);
    @property({ type: Node })
    cameraNode: Node = null;

    private _shakeAmplitude: number = 0;
    private _isShaking: boolean = false;
    private _shakeTime: number = 0;
    private _tween: Tween<ChangingValue> = null;

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    update(deltaTime: number) {
        if (this._isShaking) {
            this._shakeTime += deltaTime;

            const xOffset = this._shakeAmplitude * Math.sin(Math.PI * this._shakeTime * this.shakeFrequency.x) * this.shakeSize.width;
            const yOffset = this._shakeAmplitude * Math.sin(Math.PI * this._shakeTime * this.shakeFrequency.y) * this.shakeSize.height;

            this.cameraNode.setPosition(xOffset, yOffset);
        }
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        cameraShakerEventTarget[func](CameraShakerEventType.StartShake, this.onStartShake, this);
        cameraShakerEventTarget[func](CameraShakerEventType.StopShake, this.onStopShake, this);
        cameraShakerEventTarget[func](CameraShakerEventType.ShakeOnce, this.onShakeOnce, this);
    }

    onStartShake() {
        this.unscheduleAllCallbacks();
        this._tween && this._tween.stop();

        const amplitude: ChangingValue = {
            value: this._shakeAmplitude
        };

        this._tween = tween(amplitude)
            .to(0.25, { value: 1 }, {
                onStart: () => {
                    this._isShaking = true;
                    this._shakeTime = 0;
                },
                onUpdate: (target: ChangingValue) => {
                    this._shakeAmplitude = target.value;
                }
            })
            .start();
    }

    onStopShake() {
        this.unscheduleAllCallbacks();
        this._tween && this._tween.stop();

        const amplitude: ChangingValue = {
            value: this._shakeAmplitude
        };

        this._tween = tween(amplitude)
            .to(0.25, { value: 0 }, {
                onUpdate: (target: ChangingValue) => {
                    this._shakeAmplitude = target.value;
                },
                onComplete: () => {
                    this._isShaking = false;
                }
            })
            .start();
    }

    onShakeOnce(duration: number) {
        this.onStartShake();
        this.scheduleOnce(() => {
            this.onStopShake();
        }, duration);
    }
}


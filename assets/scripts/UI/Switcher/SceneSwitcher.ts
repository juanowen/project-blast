import { _decorator, Component, Node, director, Director, UIOpacity, Tween, tween, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

const sceneSwitcherEventTarget = new EventTarget();
enum SceneSwitcherEventType {
    SwitchScene
}

@ccclass('SceneSwitcher')
export class SceneSwitcher extends Component {

    public static eventTarget: EventTarget = sceneSwitcherEventTarget;
    public static EventType: typeof SceneSwitcherEventType = SceneSwitcherEventType;

    @property
    hideDelay: number = 1;
    @property
    hideDuration: number = 0.75;
    @property
    showDuration: number = 0.35;

    private _uiOpacity: UIOpacity = null;
    private _opacityTween: Tween<UIOpacity> = null;

    onLoad() {
        this._uiOpacity = this.getComponent(UIOpacity) || this.addComponent(UIOpacity);
        this._uiOpacity.opacity = 255;
    }

    onEnable() {
        this._handleResizeEvents(true);
    }

    onDisable() {
        this._handleResizeEvents(false);
    }

    _handleResizeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        director[func](Director.EVENT_AFTER_SCENE_LAUNCH, this.onAfterSceneLaunch, this);
        sceneSwitcherEventTarget[func](
            SceneSwitcherEventType.SwitchScene,
            this.onSwitchScene,
            this
        );
    }

    onAfterSceneLaunch() {
        this._opacityTween && this._opacityTween.stop();
        this._opacityTween = tween(this._uiOpacity)
            .delay(this.hideDelay)
            .to(this.hideDuration, { opacity: 0 })
            .start();
    }

    onSwitchScene(sceneName: string) {
        this._opacityTween && this._opacityTween.stop();
        this._opacityTween = tween(this._uiOpacity)
            .to(this.showDuration, { opacity: 255 }, {
                onComplete: () => {
                    director.loadScene(sceneName);
                }
            })
            .start();
    }
}


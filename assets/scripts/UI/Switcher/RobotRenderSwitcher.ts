import { _decorator, Component, warn, Animation, AnimationClip } from 'cc';
import { GameValueType } from '../../enums/GameValueType';
import { GameValuesDictionary } from '../../GameValuesDictionary';
import { IGameValue } from '../../interfaces/game';
const { ccclass, property } = _decorator;

@ccclass('RobotRenderSwitcher')
export class RobotRenderSwitcher extends Component {
    @property({ type: Animation })
    animation: Animation = null;
    @property({ type: AnimationClip })
    winnerClip: AnimationClip = null;
    @property({ type: AnimationClip })
    loserClip: AnimationClip = null;

    onLoad() {
        if (!this.animation) {
            warn(`RobotRenderSwitcher's animation can't be empty!`);
            this.enabled = false;
        } else {
            this.animation.clips[0] = this.winnerClip;
            this.animation.clips[1] = this.loserClip;
        }
    }

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        GameValuesDictionary.eventTarget[func](
            GameValuesDictionary.EventType.ValuesChanged,
            this.onGameValuesChanged,
            this
        );
    }

    onGameValuesChanged(data: IGameValue[]) {
        const playerLost = GameValuesDictionary.getValueFromData(GameValueType.PlayerLost, data) as boolean;
        if (playerLost) {
            this.loserClip && this.animation.play(this.loserClip.name);
        } else {
            this.winnerClip && this.animation.play(this.winnerClip.name);
        }
    }
}


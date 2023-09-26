import { _decorator, Component, warn, Sprite, SpriteFrame } from 'cc';
import { GameValueType } from '../enums/GameValueType';
import { GameValuesDictionary } from '../GameValuesDictionary';
import { IGameValue } from '../interfaces/game';
const { ccclass, property } = _decorator;

@ccclass('RobotRenderSwitcher')
export class RobotRenderSwitcher extends Component {
    @property({ type: Sprite })
    renderSprite: Sprite = null;
    @property({ type: SpriteFrame })
    winnerFrame: SpriteFrame = null;
    @property({ type: SpriteFrame })
    loserFrame: SpriteFrame = null;

    onLoad() {
        if (!this.renderSprite) {
            warn(`RobotRenderSwitcher's render sprite can't be empty!`);
            this.enabled = false;
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
        this.renderSprite.spriteFrame = playerLost ? this.loserFrame : this.winnerFrame;
    }
}


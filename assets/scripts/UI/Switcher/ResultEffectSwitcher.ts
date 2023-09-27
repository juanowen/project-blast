import { _decorator, Component, Node } from 'cc';
import { GameValueType } from '../../enums/GameValueType';
import { GameValuesDictionary } from '../../GameValuesDictionary';
import { IGameValue } from '../../interfaces/game';
const { ccclass, property } = _decorator;

@ccclass('ResultEffectSwitcher')
export class ResultEffectSwitcher extends Component {
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
        this.node.active = !playerLost;
    }
}


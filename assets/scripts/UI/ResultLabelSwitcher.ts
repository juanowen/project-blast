import { _decorator, Component, warn, Label } from 'cc';
import { GameValueType } from '../enums/GameValueType';
import { GameValuesDictionary } from '../GameValuesDictionary';
import { IGameValue } from '../interfaces/game';
const { ccclass, property } = _decorator;

@ccclass('ResultLabelSwitcher')
export class ResultLabelSwitcher extends Component {
    @property({ type: Label })
    label: Label = null;
    @property
    winnerText: string = '';
    @property
    loserText: string = '';

    onLoad() {
        if (!this.label) {
            warn(`ResultLabelSwitcher's label can't be empty!`);
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
        this.label.string = (playerLost ? this.loserText : this.winnerText).toUpperCase();
    }
}


import { _decorator, Component, warn, Label } from 'cc';
import { GameValueType } from '../../enums/GameValueType';
import { GameValuesDictionary } from '../../GameValuesDictionary';
import { IGameValue } from '../../interfaces/game';
const { ccclass, property } = _decorator;

@ccclass('InfoLabelSwitcher')
export class InfoLabelSwitcher extends Component {
    @property({ type: Label })
    label: Label = null;

    onLoad() {
        if (!this.label) {
            warn(`InfoLabelSwitcher's label can't be empty!`);
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
        const lossReason = GameValuesDictionary.getValueFromData(GameValueType.LossReason, data) as string;
        this.label.string = lossReason ? lossReason.toUpperCase() : '';
    }
}


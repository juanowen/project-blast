import { _decorator, Component, Node, Label, warn } from 'cc';
import { GameSettings, GameSettingsEventTarget, GameSettingsEventType } from '../GameSettings';
const { ccclass, property } = _decorator;

@ccclass('SettingsEditBox')
export class SettingsEditBox extends Component {
    @property({ type: Label })
    valueLabel: Label = null;
    @property
    propertyName: string = '';
    @property
    stepValue: number = 1;
    @property
    minValue: number = 0;
    @property
    maxValue: number = 1; 

    private _settings: GameSettings = null;
    private _value: number = 0;

    start() {
        this.propertyName = this.propertyName.trim();
        
        if (!this.valueLabel) {
            warn(`SettingsEditBox's value label can't be empty!`);
            this.enabled = false;
        }
        
        if (this.propertyName.length === 0) {
            warn(`SettingsEditBox's property name can't be empty!`);
            this.enabled = false;
        } else if (this._settings) {
            const value = this._getSettingsValue(); 
            if (value === null) {
                warn(`Game settings doesn't have property with name "${this.propertyName}"!`);
                this.enabled = false;
            }

            if (typeof value !== 'number') {
                warn(`Game settings with name "${this.propertyName}" isn't a number!`);
                this.enabled = false;
            } else {
                this._value = value;
            }
        }
        
        this._updateLabelValue(false);
    }
    
    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        GameSettingsEventTarget[func](
            GameSettingsEventType.BroadcastSettings,
            this.onBroadcastSettings,
            this
        );
    }

    _getSettingsValue() {
        const pathArray = this.propertyName.split('.');
        let result = this._settings;
        pathArray.forEach(pathPart => {
            if (!result.hasOwnProperty(pathPart.trim())) return null;
            result = result[pathPart.trim()];
        });

        return result;
    }

    _setSettingsValue() {
        const pathArray = this.propertyName.split('.');
        let property = this._settings;

        let i = 0;
        for (i; i < pathArray.length - 1; ++i) {
            property = property[pathArray[i].trim()];
        }
        
        property[pathArray[i].trim()] = this._value;
    }

    _updateLabelValue(withRecord: boolean = true) {
        if (this._value % 1 !== 0) {
            this._value = Math.round(this._value * 100) / 100;
        }
        withRecord && this._setSettingsValue();
        this.valueLabel.string = this._value.toString().replace('.', ',');
    }

    incrementValue() {
        this._value = Math.min(this.maxValue, this._value + this.stepValue);
        this._updateLabelValue();
    }

    decrementValue() {
        this._value = Math.max(this.minValue, this._value - this.stepValue);
        this._updateLabelValue();
    }

    onBroadcastSettings(settings: GameSettings) {
        this._settings = settings;
    }
}


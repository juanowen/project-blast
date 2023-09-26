import { _decorator, Component, Node, Label, warn } from 'cc';
import { GameSettings } from '../GameSettings';
const { ccclass, property } = _decorator;

@ccclass('SettingsEditBox')
export class SettingsEditBox extends Component {
    @property({ type: GameSettings })
    settings: GameSettings = null;
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

    private _value: number = 0;

    onLoad() {
        this.propertyName = this.propertyName.trim();

        if (!this.settings) {
            warn(`SettingsEditBox's settings can't be empty!`);
            this.enabled = false;
        }
        
        if (!this.valueLabel) {
            warn(`SettingsEditBox's value label can't be empty!`);
            this.enabled = false;
        }
        
        if (this.propertyName.length === 0) {
            warn(`SettingsEditBox's property name can't be empty!`);
            this.enabled = false;
        } else if (this.settings) {
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
    }

    start() {
        this._updateLabelValue(false);
    }

    _getSettingsValue() {
        const pathArray = this.propertyName.split('.');
        let result = this.settings;
        pathArray.forEach(pathPart => {
            if (!result.hasOwnProperty(pathPart.trim())) return null;
            result = result[pathPart.trim()];
        });

        return result;
    }

    _setSettingsValue() {
        const pathArray = this.propertyName.split('.');
        let property = this.settings;

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
}


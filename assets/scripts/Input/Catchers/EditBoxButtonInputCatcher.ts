import { _decorator } from 'cc';
import { SettingsEditBox } from '../../UI/SettingsEditBox';
import { InputCatcher } from './InputCatcher';
const { ccclass, property } = _decorator;

@ccclass('EditBoxButtonInputCatcher')
export class EditBoxButtonInputCatcher extends InputCatcher {
    @property({ type: SettingsEditBox, override: true })
    helperComponent: SettingsEditBox = null;
}


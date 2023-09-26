import { _decorator, EventTouch, director } from 'cc';
import { IInputCommand } from '../../interfaces/input';
import { SettingsEditBox } from '../../UI/SettingsEditBox';
import { InputCommand } from './InputCommand';
const { ccclass, property } = _decorator;

@ccclass('IncrementButtonInputCommand')
export class IncrementButtonInputCommand extends InputCommand implements IInputCommand {
    onTouchEnd(event: EventTouch, editBox: SettingsEditBox) {
        editBox.incrementValue();
    }
}


import { _decorator, EventTouch, director } from 'cc';
import { IInputCommand } from '../../interfaces/input';
import { SettingsEditBox } from '../../UI/SettingsEditBox';
import { InputCommand } from './InputCommand';
const { ccclass, property } = _decorator;

@ccclass('DecrementButtonInputCommand')
export class DecrementButtonInputCommand extends InputCommand implements IInputCommand {
    onTouchEnd(event: EventTouch, editBox: SettingsEditBox) {
        editBox.decrementValue();
    }
}


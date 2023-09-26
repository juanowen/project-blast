import { _decorator, EventTouch, director } from 'cc';
import { IInputCommand } from '../../interfaces/input';
import { SceneSwitcher } from '../../UI/SceneSwitcher';
import { InputCommand } from './InputCommand';
const { ccclass, property } = _decorator;

@ccclass('SettingsButtonInputCommand')
export class SettingsButtonInputCommand extends InputCommand implements IInputCommand {
    onTouchEnd(event: EventTouch) {
        SceneSwitcher.eventTarget.emit(SceneSwitcher.EventType.SwitchScene, 'SettingsScene');
    }
}


import { _decorator, EventTouch, director } from 'cc';
import { IInputCommand } from '../../interfaces/input';
import { SceneSwitcher } from '../../UI/Switcher/SceneSwitcher';
import { InputCommand } from './InputCommand';
const { ccclass, property } = _decorator;

@ccclass('RestartButtonInputCommand')
export class RestartButtonInputCommand extends InputCommand implements IInputCommand {
    onTouchEnd(event: EventTouch) {
        SceneSwitcher.eventTarget.emit(SceneSwitcher.EventType.SwitchScene, 'StartScene');
    }
}


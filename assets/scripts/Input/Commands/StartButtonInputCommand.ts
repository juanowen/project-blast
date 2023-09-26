import { _decorator, EventTouch, director } from 'cc';
import { GameValueType } from '../../enums/GameValueType';
import { GameValuesDictionary } from '../../GameValuesDictionary';
import { IInputCommand } from '../../interfaces/input';
import { SceneSwitcher } from '../../UI/SceneSwitcher';
import { InputCommand } from './InputCommand';
const { ccclass, property } = _decorator;

@ccclass('StartButtonInputCommand')
export class StartButtonInputCommand extends InputCommand implements IInputCommand {
    onTouchEnd(event: EventTouch) {
        
        GameValuesDictionary.eventTarget.emit(
            GameValuesDictionary.EventType.UpdateValue,
            GameValueType.LossReason,
            ''
        );
        GameValuesDictionary.eventTarget.emit(
            GameValuesDictionary.EventType.UpdateValue,
            GameValueType.PlayerLost,
            false
        );
        GameValuesDictionary.eventTarget.emit(
            GameValuesDictionary.EventType.UpdateValue,
            GameValueType.Turns,
            0
        );
        GameValuesDictionary.eventTarget.emit(
            GameValuesDictionary.EventType.UpdateValue,
            GameValueType.Points,
            0
        );

        SceneSwitcher.eventTarget.emit(SceneSwitcher.EventType.SwitchScene, 'GamePlayScene');
    }
}


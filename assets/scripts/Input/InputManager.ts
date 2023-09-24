import { _decorator, Component, NodeEventType, Enum, EventTarget, EventTouch } from 'cc';
import { InputTarget } from '../enums/InputTarget';
import { IInputCommand, IInputManager, IInputTargetCommandPair } from '../interfaces/input';
import { InputCommand } from './Commands/InputCommand';
const { ccclass, property } = _decorator;

const inputEventTarget = new EventTarget();
enum InputEvent {
    Input,
};

@ccclass('InputTargetCommandPair')
class InputTargetCommandPair implements IInputTargetCommandPair {
    @property({ type: Enum(InputTarget)})
    inputTarget: InputTarget = InputTarget.None;
    @property({ type: InputCommand })
    command: IInputCommand = null;
}

@ccclass('InputManager')
export class InputManager extends Component implements IInputManager {
    @property({ type: [InputTargetCommandPair] })
    commands: InputTargetCommandPair[] = [];

    public static eventTarget: EventTarget = inputEventTarget;
    public static EventType: typeof InputEvent = InputEvent;

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        inputEventTarget[func](InputEvent.Input, this.onInput, this);
    }

    onInput(eventType: NodeEventType, inputTarget: InputTarget, event: EventTouch, emitter: Component) {
        const pair = this.commands.find((pair) => pair.inputTarget === inputTarget && pair.command);
        if (pair) {
            const command = pair.command;
            switch(eventType) {
                case NodeEventType.TOUCH_START:
                    command.onTouchStart instanceof Function && command.onTouchStart(event, emitter);
                    break;
                case NodeEventType.TOUCH_MOVE:
                    command.onTouchMove instanceof Function && command.onTouchMove(event, emitter);
                    break;
                case NodeEventType.TOUCH_END:
                    command.onTouchEnd instanceof Function && command.onTouchEnd(event, emitter);
                    break;
                case NodeEventType.TOUCH_CANCEL:
                    command.onTouchCancel instanceof Function && command.onTouchCancel(event, emitter);
                    break;
            }
        }
    }
}


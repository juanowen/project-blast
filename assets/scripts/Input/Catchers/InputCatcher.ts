import { _decorator, Component, Node, NodeEventType, Enum, EventTouch } from 'cc';
import { InputTarget } from '../../enums/InputTarget';
import { InputManager } from '../InputManager';
const { ccclass, property } = _decorator;

@ccclass('InputCatcher')
export class InputCatcher extends Component {
    @property({ type: Enum(InputTarget) })
    target: InputTarget = InputTarget.None;
    @property({ type: Component })
    helperComponent: Component = null;

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        this.node[func](Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node[func](Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node[func](Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node[func](Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    _processTouch(eventType: NodeEventType, event: EventTouch) {
        InputManager.eventTarget.emit(
            InputManager.EventType.Input,
            eventType,
            this.target,
            event,
            this.helperComponent
        );
    }

    onTouchStart(event: EventTouch) {
        this._processTouch(NodeEventType.TOUCH_START, event);
    }

    onTouchMove(event: EventTouch) {
        this._processTouch(NodeEventType.TOUCH_MOVE, event);
    }

    onTouchEnd(event: EventTouch) {
        this._processTouch(NodeEventType.TOUCH_END, event);
    }

    onTouchCancel(event: EventTouch) {
        this._processTouch(NodeEventType.TOUCH_CANCEL, event);
    }
}


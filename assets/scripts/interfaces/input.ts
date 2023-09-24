import { Component, EventTouch, NodeEventType } from "cc"
import { InputTarget } from "../enums/InputTarget"

export interface IInputManager {
    commands: IInputTargetCommandPair[],

    onInput(eventType: NodeEventType, inputTarget: InputTarget, event: EventTouch, emitter: Component): void
}
export interface IInputCatcher {
    onTouchStart(): void,
    onTouchMove(): void,
    onTouchEnd(): void,
    onTouchCancel(): void
}
export interface IInputCommand {
    onTouchStart?(event: EventTouch, emitter?: Component): void,
    onTouchMove?(event: EventTouch, emitter?: Component): void,
    onTouchEnd?(event: EventTouch, emitter?: Component): void,
    onTouchCancel?(event: EventTouch, emitter?: Component): void
}
export interface IInputTargetCommandPair {
    inputTarget: InputTarget,
    command: IInputCommand
}
import { Component, Label, UITransform } from "cc";
import { IGameSettings, IGameValue } from "./game";

export interface ICounterView {
    label: Label,
    currentValue: number,

    onGameValuesChanged(data: IGameValue[]): void,
    onBeforeSceneLoadingEvent(): void
}

export interface ICountDownView extends ICounterView {
    maxValue: number,

    onBroadcastSettings(settings: IGameSettings): void
}

export interface IProgressBarView extends ICounterView {
    fillerTransform: UITransform,
    maxValue: number,

    onBroadcastSettings(settings: IGameSettings): void
}

export interface IPropertyEditBox {
    valueLabel: Label,
    propertyName: string,
    
    _getPropertyValue(): void,
    _setPropertyValue(): void,

    onBroadcastSettings(settings: IGameSettings): void
}

export interface INumberEditBox extends IPropertyEditBox {
    stepValue: number,
    minValue: number,
    maxValue: number,

    incrementValue(): void,
    decrementValue(): void
}
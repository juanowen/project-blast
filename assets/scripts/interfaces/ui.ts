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

    onGameInitialized(settings: IGameSettings): void
}

export interface IProgressBarView extends ICounterView {
    fillerTransform: UITransform,
    maxValue: number,

    onGameInitialized(settings: IGameSettings): void
}
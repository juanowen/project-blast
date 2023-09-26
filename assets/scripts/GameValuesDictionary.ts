import { _decorator, Component, EventTarget, Enum, warn, game } from 'cc';
import { GameValueType } from './enums/GameValueType';
import { IGameValue, IGameValuesDictionary } from './interfaces/game';
const { ccclass, property } = _decorator;

enum GameValueDataType {
    String,
    Number,
    Boolean
}

@ccclass('GameValue') 
class GameValue implements IGameValue {
    @property({ type: Enum(GameValueType) })
    type: GameValueType = GameValueType.None;
    @property({ type: Enum(GameValueDataType) })
    get dataType(): GameValueDataType {
        return this._dataType;
    }
    set dataType(value: GameValueDataType) {
        this._dataType = value;
        switch(this._dataType) {
            case GameValueDataType.String: 
                this._value = '';
                break;
            case GameValueDataType.Number: 
                this._value = 0;
                break;
            case GameValueDataType.Boolean: 
                this._value = false;
                break;
        }
    }
    @property({
        visible: function(this: GameValue) { return this.dataType === GameValueDataType.String }
    })
    get stringValue(): string {
        return this._value as string;
    }
    set stringValue(value: string) {
        this._value = value;
    }
    @property({
        visible: function(this: GameValue) { return this.dataType === GameValueDataType.Number }
    })
    get numberValue(): number {
        return this._value as number;
    }
    set numberValue(value: number) {
        this._value = value;
    }
    @property({
        visible: function(this: GameValue) { return this.dataType === GameValueDataType.Boolean }
    })
    get booleanValue(): boolean {
        return this._value as boolean;
    }
    set booleanValue(value: boolean) {
        this._value = value;
    }

    get value(): string | number | boolean {
        return this._value;
    }
    set value(value: string | number | boolean) {
        this._value = value;
    }

    @property
    private _dataType: GameValueDataType = GameValueDataType.String;
    @property
    private _value: string | number | boolean = '';
}

const gameValuesDictionaryTarget = new EventTarget();
export enum GameValuesDictionaryEvent {
    GetValue,
    UpdateValue,
    IncrementValue,
    DecrementValue,
    ValuesChanged
};

@ccclass('GameValuesDictionary')
export class GameValuesDictionary extends Component implements IGameValuesDictionary {

    public static eventTarget: EventTarget = gameValuesDictionaryTarget;
    public static EventType: typeof GameValuesDictionaryEvent = GameValuesDictionaryEvent;

    @property({ type: [GameValue] })
    data: GameValue[] = [];

    onLoad() {
		game.addPersistRootNode(this.node);
    }

    onEnable() {
        this._handleSubscriptions(true);
        this._broadcastChanges();
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameValuesDictionaryTarget[func](GameValuesDictionaryEvent.GetValue, this.onGetValue, this);
        gameValuesDictionaryTarget[func](GameValuesDictionaryEvent.UpdateValue, this.onUpdateValue, this);
        gameValuesDictionaryTarget[func](GameValuesDictionaryEvent.IncrementValue, this.onIncrementValue, this);
        gameValuesDictionaryTarget[func](GameValuesDictionaryEvent.DecrementValue, this.onDecrementValue, this);
    }

    onGetValue(type: GameValueType, callback: Function) {
        const targetData = this.data.find(dataSet => dataSet.type === type);
        if (targetData) callback(targetData.value);
        else callback(null);
    }

    onUpdateValue(type: GameValueType, value: string | number | boolean) {
        const targetData = this.data.find(dataSet => dataSet.type === type);
        if (targetData) {
            const targetDataType = typeof targetData.value;
            if (targetDataType === typeof value) {
                targetData.value = value;
                this._broadcastChanges();
            } else {
                warn(`Cant't update game value ${GameValueType[type]}. It has another data type [${targetDataType}].`);
            }
        }
    }

    onIncrementValue(type: GameValueType, incrementSize: number = 1) {
        const targetData = this.data.find(dataSet => dataSet.type === type);
        if (targetData) {
            const targetDataType = typeof targetData.value;
            if (targetDataType === 'number') {
                targetData.value = +targetData.value + incrementSize;
                this._broadcastChanges();
            } else {
                warn(`Cant't increment game value ${GameValueType[type]}. It isn't number [${targetDataType}].`);
            }
        }
    }

    onDecrementValue(type: GameValueType, decrementSize: number = 1) {
        const targetData = this.data.find(dataSet => dataSet.type === type);
        if (targetData) {
            const targetDataType = typeof targetData.value;
            if (targetDataType === 'number') {
                targetData.value = +targetData.value - decrementSize;
                this._broadcastChanges();
            } else {
                warn(`Cant't increment game value ${GameValueType[type]}. It isn't number [${targetDataType}].`);
            }
        }
    }

    private _broadcastChanges() {
        gameValuesDictionaryTarget.emit(GameValuesDictionaryEvent.ValuesChanged, this.data);
    }

    public static getValueFromData(type: GameValueType, data: IGameValue[]): string | number | boolean | null {
        const targetData = data.find(dataSet => dataSet.type === type);
        if (targetData) {
            return targetData.value;
        } else {
            return null;
        }
    }

    public static getValue(type: GameValueType): string | number | boolean {
        let result = null;
        gameValuesDictionaryTarget.emit(
            GameValuesDictionaryEvent.GetValue, 
            type, 
            (value: string | number | boolean) => {
                result = value;
            }
        );

        return result;
    }
}


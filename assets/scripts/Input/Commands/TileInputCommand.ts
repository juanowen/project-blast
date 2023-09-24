import { _decorator, EventTouch } from 'cc';
import { GameState } from '../../enums/GameState';
import { GameManager } from '../../GameManager';
import { IInputCommand } from '../../interfaces/input';
import { TileRender } from '../../Renderer/TileRender';
import { InputCommand } from './InputCommand';
const { ccclass, property } = _decorator;

@ccclass('TileInputCommand')
export class TileInputCommand extends InputCommand implements IInputCommand {
    private _isActive: boolean = false;

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        GameManager.eventTarget[func](GameManager.EventType.GameStateChanged, this.onGameStateChanged, this);
    }

    onGameStateChanged(gameState: GameState) {
        this._isActive = (gameState === GameState.InputPending);
    }

    onTouchStart(event: EventTouch, tileRender: TileRender) {
        if (this._isActive) {
            const tile = tileRender.model;
            tile.group.manager.collapseGroup(tile);
        }
    }
}


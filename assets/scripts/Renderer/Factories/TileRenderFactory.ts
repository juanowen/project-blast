import { _decorator, Component, Prefab, Node } from 'cc';
import { GameSettings, GameSettingsEventTarget, GameSettingsEventType } from '../../GameSettings';
import { IFactory } from '../../interfaces/game';
import { ITileRender } from '../../interfaces/render';
import { ITile } from '../../interfaces/tile';
import { PoolManager } from '../../Pool/PoolManager';
import { TileRender } from '../TileRender';
const { ccclass, property } = _decorator;

@ccclass('TileRenderFactory')
export class TileRenderFactory extends Component implements IFactory<ITile, ITileRender> {
    @property({ type: Prefab })
    renderPrefab: Prefab = null;

    getInstance(tile: ITile): TileRender {
        if (!this.renderPrefab) return null;

        PoolManager.eventTarget.emit(PoolManager.EventType.GetFromPool, this.renderPrefab, (renderNode: Node) => {
            const render = renderNode.getComponent(TileRender);

            render.model = tile;
    
            return render;
        });
    }

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        GameSettingsEventTarget[func](
            GameSettingsEventType.BroadcastSettings,
            this.onBroadcastSettings,
            this
        );
    }

    onBroadcastSettings(settings: GameSettings) {
        PoolManager.eventTarget.emit(
            PoolManager.EventType.CreatePoolFor, 
            this.renderPrefab
        );
    }
}


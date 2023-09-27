import { _decorator, Component, Node, Prefab } from 'cc';
import { GameSettings, GameSettingsEventTarget, GameSettingsEventType } from '../../GameSettings';
import { IFactory } from '../../interfaces/game';
import { IRender } from '../../interfaces/render';
import { PoolManager } from '../../Pool/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('RenderFactory')
export class RenderFactory extends Component implements IFactory<any, IRender> {
    @property({ type: Prefab })
    renderPrefab: Prefab = null;

    getInstance(input?: any): any {
        if (!this.renderPrefab) return null;

        let render = null;
        PoolManager.eventTarget.emit(
            PoolManager.EventType.GetFromPool, 
            this.renderPrefab, 
            (renderNode: Node) => {
                render = this._prepareRender(renderNode, input);
            }
        );
        
        return render;
    }

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        if (!this.renderPrefab) return;

        const func = isOn ? 'on' : 'off';

        GameSettingsEventTarget[func](
            GameSettingsEventType.BroadcastSettings,
            this.onBroadcastSettings,
            this
        );
    }

    _prepareRender(renderNode: Node, input?: any): IRender {
        return null;
    }

    onBroadcastSettings(settings: GameSettings) {
        PoolManager.eventTarget.emit(
            PoolManager.EventType.CreatePoolFor, 
            this.renderPrefab
        );
    }
}


import { _decorator, warn } from 'cc';
import { BasicTileDictionary } from '../../Dictionaries/BasicTileDictionary';
import { GameSettings } from '../../GameSettings';
import { IBasicTileRenderConfig } from '../../interfaces/render';
import { IBasicTile, ITile } from '../../interfaces/tile';
import { PoolManager } from '../../Pool/PoolManager';
import { TileRender } from '../TileRender';
import { TileRenderFactory } from './TileRenderFactory';
const { ccclass, property } = _decorator;

@ccclass('BasicTileRenderFactory')
export class BasicTileRenderFactory extends TileRenderFactory {
    @property({ type: BasicTileDictionary })
    dictionary: BasicTileDictionary = null; 

    getInstance(tile: IBasicTile): TileRender {
        const render = super.getInstance(tile);

        if (!this.dictionary) {
            warn(`BasicTileRenderFactory's dictionary can't be empty!`);
            return render;
        }

        if (render) {
            const config: IBasicTileRenderConfig = this.dictionary.getConfig(tile.colorType);
            if (config) {
                render.color = config.tileColor;
                render.spriteFrame = config.tileSprite;
            }
        }

        return render;
    }

    onBroadcastSettings(settings: GameSettings) {
        PoolManager.eventTarget.emit(
            PoolManager.EventType.CreatePoolFor, 
            this.renderPrefab, 
            settings.playgroundSize.width * settings.playgroundSize.height
        );
    }
}


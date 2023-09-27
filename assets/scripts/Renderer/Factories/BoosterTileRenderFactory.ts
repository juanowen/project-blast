import { _decorator, Node, warn } from 'cc';
import { BoosterTileDictionary } from '../../Dictionaries/BoosterTileDictionary';
import { IBoosterTileRenderConfig, IRender } from '../../interfaces/render';
import { IBoosterTile } from '../../interfaces/tile';
import { PoolManager } from '../../Pool/PoolManager';
import { TileRender } from '../TileRender';
import { TileRenderFactory } from './TileRenderFactory';
const { ccclass, property } = _decorator;

@ccclass('BoosterTileRenderFactory')
export class BoosterTileRenderFactory extends TileRenderFactory {
    @property({ visible: false, override: true })
    renderPrefab = null;
    @property({ type: BoosterTileDictionary })
    dictionary: BoosterTileDictionary = null; 

    getInstance(tile: IBoosterTile): TileRender {
        let render = null;

        if (!this.dictionary) {
            warn(`BoosterTileRenderFactory's dictionary can't be empty!`);
            return render;
        }

        const config: IBoosterTileRenderConfig = this.dictionary.getConfig(tile.boosterType);
        if (config) {
            PoolManager.eventTarget.emit(PoolManager.EventType.GetFromPool, config.prefab, (renderNode: Node) => {
                render = this._prepareRender(renderNode);
                render.model = tile;
            });
        }

        return render;
    }

    _prepareRender(renderNode: Node): TileRender {
        return renderNode.getComponent(TileRender);
    }
}


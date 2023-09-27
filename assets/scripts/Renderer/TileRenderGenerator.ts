import { _decorator, Component, Enum, Node } from 'cc';
import { TileType } from '../enums/TileType';
import { ITypeFactoryPair } from '../interfaces/game';
import { ITileRender, ITileRenderGenerator } from '../interfaces/render';
import { ITile } from '../interfaces/tile';
import { TileRenderFactory } from './Factories/TileRenderFactory';
const { ccclass, property } = _decorator;

@ccclass('TileRenderGeneratorConfig')
class TileRenderGeneratorConfig implements ITypeFactoryPair {
    @property({ type: Enum(TileType) })
    type: TileType = TileType.None;
    @property({ type: TileRenderFactory })
    factory: TileRenderFactory = null;
}

@ccclass('TileRenderGenerator')
export class TileRenderGenerator extends Component implements ITileRenderGenerator {
    @property({ type: [TileRenderGeneratorConfig] })
    configs: TileRenderGeneratorConfig[] = [];

    generateRender(tile: ITile): ITileRender {
        const config = this.configs.find(config => config.type === tile.tileType);
        if (config) {
            return config.factory.getInstance(tile);
        }

        return null;
    }
}


import { _decorator, Component, Node, Enum } from 'cc';
import { TileType } from '../enums/TileType';
import { ITypeFactoryPair } from '../interfaces/game';
import { ITileGenerator } from '../interfaces/tile';
import { TileFactory } from './Factories/TileFactory';
const { ccclass, property } = _decorator;

@ccclass('TileGeneratorConfig')
class TileGeneratorConfig implements ITypeFactoryPair {
    @property({ type: Enum(TileType) })
    type: TileType = TileType.None;
    @property({ type: TileFactory })
    factory: TileFactory = null;
}

@ccclass('TileGenerator')
export class TileGenerator extends Component implements ITileGenerator {
    @property({ type: [TileGeneratorConfig] })
    configs: TileGeneratorConfig[] = [];

    generateTile(tileType: TileType, initInfo?: any) {
        const config = this.configs.find(config => config.type === tileType);
        if (config) {
            return config.factory.getInstance(initInfo);
        }

        return null;
    }
}


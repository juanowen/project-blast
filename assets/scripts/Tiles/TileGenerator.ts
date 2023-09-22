import { _decorator, Component, Node, Enum } from 'cc';
import { TileType } from '../enums/TileType';
import { ITileGenerator, ITileGeneratorConfig } from '../interfaces/tile';
import { TileFactory } from './Fabric/TileFactory';
const { ccclass, property } = _decorator;

@ccclass('FactoryConfig')
class GeneratorConfig implements ITileGeneratorConfig {
    @property({ type: Enum(TileType) })
    tileType: TileType = TileType.None;
    @property({ type: TileFactory })
    factory: TileFactory = null;
}

@ccclass('TileGenerator')
export class TileGenerator extends Component implements ITileGenerator {
    @property({ type: [GeneratorConfig] })
    configs: GeneratorConfig[] = [];

    generateTile(tileType: TileType) {
        const config = this.configs.find(config => config.tileType === tileType);
        if (config) {
            return config.factory.generateTile();
        }

        return null;
    }
}


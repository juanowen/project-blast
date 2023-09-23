import { _decorator, Component, Node, Enum } from 'cc';
import { TileType } from '../enums/TileType';
import { ITileTypeFactoryPair } from '../interfaces/game';
import { ITileGenerator } from '../interfaces/tile';
import { TileFactory } from './Factories/TileFactory';
const { ccclass, property } = _decorator;

@ccclass('TileGeneratorConfig')
class TileGeneratorConfig implements ITileTypeFactoryPair {
    @property({ type: Enum(TileType) })
    tileType: TileType = TileType.None;
    @property({ type: TileFactory })
    factory: TileFactory = null;
}

@ccclass('TileGenerator')
export class TileGenerator extends Component implements ITileGenerator {
    @property({ type: [TileGeneratorConfig] })
    configs: TileGeneratorConfig[] = [];

    generateTile(tileType: TileType) {
        const config = this.configs.find(config => config.tileType === tileType);
        if (config) {
            return config.factory.getInstance();
        }

        return null;
    }
}


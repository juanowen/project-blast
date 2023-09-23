import { _decorator, Component, Color, SpriteFrame } from 'cc';
import { IBasicTileRenderConfig } from '../interfaces/render';
const { ccclass, property } = _decorator;

@ccclass('BasicTileConfig')
export class BasicTileConfig {
    @property
    tileColor: Color = new Color(255, 255, 255);
    @property
    weight: number = 1;
}

@ccclass('BasicTileDictionary')
export class BasicTileDictionary extends Component {
    @property({ type: SpriteFrame })
    tileSprite: SpriteFrame = null;
    @property({ type: [BasicTileConfig] })
    configs: BasicTileConfig[] = [];

    getConfig(index: number): IBasicTileRenderConfig {
        if (this.configs.length <= index) return null;

        return {
            tileColor: this.configs[index].tileColor,
            tileSprite: this.tileSprite
        };
    }
}


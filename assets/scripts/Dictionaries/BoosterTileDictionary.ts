import { _decorator, Component, Node, Enum, Prefab } from 'cc';
import { BoosterType } from '../enums/BoosterType';
import { IBoosterTileRenderConfig } from '../interfaces/render';
const { ccclass, property } = _decorator;

@ccclass('BoosterTileConfig')
export class BoosterTileConfig {
    @property({ type: Enum(BoosterType) })
    boosterType: BoosterType = BoosterType.None;
    @property
    minGroupLength: number = 1;
    @property({ type: Prefab })
    prefab: Prefab = null;
}

@ccclass('BoosterTileDictionary')
export class BoosterTileDictionary extends Component {
    @property({ type: [BoosterTileConfig] })
    configs: BoosterTileConfig[] = [];

    getConfig(boosterType: BoosterType): IBoosterTileRenderConfig {
        const config = this.configs.find(config => config.boosterType === boosterType);
        if (!config) return null;

        return {
            prefab: config.prefab
        };
    }
}


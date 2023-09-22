import { _decorator, Color, Component } from 'cc';
import { IColorTileScheme, ITile } from '../../interfaces/tile';
import { TileType } from '../../enums/TileType';
import { BasicTile } from '../Tile/BasicTile';
import { TileFactory } from './TileFactory';
const { ccclass, property } = _decorator;

@ccclass('BasicTileConfig')
class BasicTileConfig {
    @property
    tileColor: Color = new Color(255, 255, 255);
    @property
    weight: number = 1;

    public weightLimit: number = 0;
}

@ccclass('BasicTileFactory')
export class BasicTileFactory extends TileFactory {
    @property({ type: [BasicTileConfig] })
    configs: BasicTileConfig[] = []; 

    private _fullWeight: number = 0;

    onLoad() {
        this.configs.forEach(config => {
            config.weightLimit = this._fullWeight;
            this._fullWeight += config.weight;
        });

        this.configs.sort((a, b) => b.weightLimit - a.weightLimit);
    }

    generateTile(): ITile {
        let tile = null;

        const rndWeight = Math.random() * this._fullWeight;
        const config = this.configs.find(config => config.weightLimit < rndWeight);

        if (config) {
            tile = new BasicTile();

            const colorType = this.configs.indexOf(config);
            const scheme: IColorTileScheme = {
                tileType: TileType.Basic, 
                points: this.tilePoints,
                colorType, 
                renderColor: config.tileColor
            };

            tile.init(scheme);
        }

        return tile;
    }
}


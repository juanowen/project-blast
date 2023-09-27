import { _decorator, Component, Node, warn } from 'cc';
import { BoosterTileConfig, BoosterTileDictionary } from '../../Dictionaries/BoosterTileDictionary';
import { BoosterType } from '../../enums/BoosterType';
import { TileType } from '../../enums/TileType';
import { IBoosterTileScheme, ITile } from '../../interfaces/tile';
import { BoosterBombTile } from '../Tile/Boosters/BoosterBombTile';
import { BoosterHRocketTile } from '../Tile/Boosters/BoosterHRocketTile';
import { BoosterVRocketTile } from '../Tile/Boosters/BoosterVRocketTile';
import { BoosterTile } from '../Tile/BoosterTile';
import { TileFactory } from './TileFactory';
const { ccclass, property } = _decorator;

interface ConfigGroupLengthPair {
    groupLength: number,
    config: BoosterTileConfig
}

@ccclass('BoosterTileFactory')
export class BoosterTileFactory extends TileFactory {
    @property({ type: BoosterTileDictionary })
    dictionary: BoosterTileDictionary = null; 
    
    private _pairs: ConfigGroupLengthPair[] = [];

    onLoad() {
        if (!this.dictionary) {
            warn(`BoosterTileFactory's dictionary can't be empty!`);
            this.enabled = false;
            return;
        }

        this._generatePairs();
    }

    _generatePairs() {
        this._pairs = [];

        this.dictionary.configs.forEach(config => {
            this._pairs.push({ groupLength: config.minGroupLength, config });
        });

        this._pairs.sort((a, b) => b.groupLength - a.groupLength);
    }

    getInstance(initData: ITile): BoosterTile {
        let tile = null;

        const pair = this._pairs.find(pair => pair.groupLength <= initData.group.length);

        if (pair) {
            const boosterType = pair.config.boosterType;
            switch(boosterType) {
                case BoosterType.HorizontalRocket: 
                    tile = new BoosterHRocketTile();
                    break;
                case BoosterType.VerticalRocket:
                    tile = new BoosterVRocketTile();
                    break;
                case BoosterType.Bomb:
                    tile = new BoosterBombTile();
                    break;

            }

            const scheme: IBoosterTileScheme = {
                tileType: TileType.Booster, 
                points: this.tilePoints,
                boosterType
            };

            tile.init(scheme);
        }

        return tile;
    }
}


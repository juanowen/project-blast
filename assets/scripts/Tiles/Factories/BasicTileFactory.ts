import { _decorator, warn } from 'cc';
import { IBasicTileScheme, ITile } from '../../interfaces/tile';
import { TileType } from '../../enums/TileType';
import { BasicTile } from '../Tile/BasicTile';
import { TileFactory } from './TileFactory';
import { BasicTileConfig, BasicTileDictionary } from '../../Dictionaries/BasicTileDictionary';
import { IGameSettings } from '../../interfaces/game';
import { GameSettingsEventTarget, GameSettingsEventType } from '../../GameSettings';
const { ccclass, property } = _decorator;

interface ConfigWeightPair {
    weightLimit: number,
    config: BasicTileConfig
}

@ccclass('BasicTileFactory')
export class BasicTileFactory extends TileFactory {
    @property({ type: BasicTileDictionary })
    dictionary: BasicTileDictionary = null; 

    private _pairs: ConfigWeightPair[] = [];
    private _fullWeight: number = 0;

    onLoad() {
        if (!this.dictionary) {
            warn(`BasicTileFactory's dictionary can't be empty!`);
            this.enabled = false;
            return;
        }
    }

    onEnable() {
        this._handleSubscriptions(true);
    }

    onDisable() {
        this._handleSubscriptions(false);
    }

    _handleSubscriptions(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        GameSettingsEventTarget[func](
            GameSettingsEventType.BroadcastSettings, 
            this.onBroadcastSettings, 
            this
        );
    }

    _generatePairs() {
        this._pairs = [];
        this._fullWeight = 0;

        this.dictionary.configs.forEach(config => {
            this._pairs.push({ weightLimit: this._fullWeight, config });
            this._fullWeight += config.weight;
        });

        this._pairs.sort((a, b) => b.weightLimit - a.weightLimit);
    }

    getInstance(): BasicTile {
        let tile = null;

        const rndWeight = Math.random() * this._fullWeight;
        const pair = this._pairs.find(pair => pair.weightLimit < rndWeight);

        if (pair) {
            tile = new BasicTile();

            const colorType = this.dictionary.configs.indexOf(pair.config);
            const scheme: IBasicTileScheme = {
                tileType: TileType.Basic, 
                points: this.tilePoints,
                colorType
            };

            tile.init(scheme);
        }

        return tile;
    }

    onBroadcastSettings(settings: IGameSettings) {
        this.dictionary.configs.splice(settings.tileTypesCount);
        this._generatePairs();
    }
}


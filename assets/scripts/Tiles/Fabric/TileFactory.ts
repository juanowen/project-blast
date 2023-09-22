import { _decorator, Component, Node } from 'cc';
import { ITileFactory, ITile } from '../../interfaces/tile';
const { ccclass, property } = _decorator;

@ccclass('TileFactory')
export class TileFactory extends Component implements ITileFactory {
    @property
    tilePoints: number = 10;
    
    generateTile(): ITile {
        return null;
    }
}


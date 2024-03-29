import { _decorator, Component, Node } from 'cc';
import { IFactory } from '../../interfaces/game';
import { ITile } from '../../interfaces/tile';
const { ccclass, property } = _decorator;

@ccclass('TileFactory')
export class TileFactory extends Component implements IFactory<null, ITile> {
    @property
    tilePoints: number = 10;
    
    getInstance(initInfo?: any): ITile {
        return null;
    }
}


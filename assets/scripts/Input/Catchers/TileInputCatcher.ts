import { _decorator } from 'cc';
import { TileRender } from '../../Renderer/TileRender';
import { InputCatcher } from './InputCatcher';
const { ccclass, property } = _decorator;

@ccclass('TileInputCatcher')
export class TileInputCatcher extends InputCatcher {
    @property({ type: TileRender, override: true })
    helperComponent: TileRender = null;
}


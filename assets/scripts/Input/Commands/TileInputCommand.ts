import { _decorator, EventTouch } from 'cc';
import { IInputCommand } from '../../interfaces/input';
import { TileRender } from '../../Renderer/TileRender';
import { InputCommand } from './InputCommand';
const { ccclass, property } = _decorator;

@ccclass('TileInputCommand')
export class TileInputCommand extends InputCommand implements IInputCommand {
    onTouchStart(event: EventTouch, tileRender: TileRender) {
        console.log(tileRender.model.x, tileRender.model.y, tileRender.model.group.length);
    }
}


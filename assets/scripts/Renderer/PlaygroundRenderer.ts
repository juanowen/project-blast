import { _decorator, Component, Node, warn, v3, v2 } from 'cc';
import { IPlaygroundRenderer, ITileRender } from '../interfaces/render';
import { ITile } from '../interfaces/tile';
import { Playground } from '../Playground/Playground';
import { RenderAnimator } from './RenderAnimator';
import { TileRender } from './TileRender';
import { TileRenderGenerator } from './TileRenderGenerator';
const { ccclass, property } = _decorator;

@ccclass('PlaygroundRenderer')
export class PlaygroundRenderer extends Component implements IPlaygroundRenderer {
    @property({ type: Node })
    renderNode: Node = null;
    @property({ type: Playground })
    playground: Playground = null;
    @property({ type: RenderAnimator })
    animator: RenderAnimator = null;
    @property({ type: TileRenderGenerator })
    generator: TileRenderGenerator = null;

    private _prevRenderMap: Map<ITile, ITileRender> = new Map();

    onLoad() {
        if (!this.renderNode) {
            warn(`PlaygroundRenderer's render node can't be empty`);
            this.enabled = false;
            return;
        }
    }

    redraw() {
        const newRenderMap: Map<ITile, ITileRender> = new Map();

        for (let x = 0; x < this.playground.width; ++x) {
            for (let y = 0; y < this.playground.height; ++y) {
                const tile = this.playground.getTile(x, y);
                if (tile) {
                    let render = this._prevRenderMap.get(tile);
                    if (!render) {
                        render = this.generator.generateRender(tile);
                        render.lastPosition = v2(tile.x, tile.y + this.playground.height);

                        this._locateRender(render);
                        this.animator.addToAnimationQueue(render as TileRender, render.appear.bind(render));
                    } 

                    if (!render.lastLocalPosition.equals(render.localPosition)) {
                        this.animator.addToAnimationQueue(render as TileRender, render.move.bind(render));
                    }

                    newRenderMap.set(tile, render);
                    this._prevRenderMap.delete(tile);
                }
            }
        }

        this._prevRenderMap.forEach(render => {
            this.animator.addToAnimationQueue(render as TileRender, render.remove.bind(render));
        });
        this._prevRenderMap = newRenderMap;

        this.animator.processQueues();
    }

    private _locateRender(render: ITileRender) {
        render.node.setParent(this.renderNode);
        render.node.setPosition(render.localPosition);
    }
}


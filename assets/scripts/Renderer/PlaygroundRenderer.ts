import { _decorator, Component, Node, warn, v3, v2, UITransform } from 'cc';
import { IGameSettings } from '../interfaces/game';
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
    backNode: Node = null;
    @property({ type: Node })
    renderNode: Node = null;
    @property({ type: Playground })
    playground: Playground = null;
    @property({ type: RenderAnimator })
    animator: RenderAnimator = null;
    @property({ type: TileRenderGenerator })
    generator: TileRenderGenerator = null;

    private _prevRenderMap: Map<ITile, ITileRender> = new Map();
    private _settings: IGameSettings = null;

    init(settings: IGameSettings) {
        this._settings = settings;

        if (!this.backNode) {
            warn(`PlaygroundRenderer's back node can't be empty`);
            this.enabled = false;
        } else {
            const transform = this.backNode.getComponent(UITransform);
            transform && transform.setContentSize(
                settings.playgroundSize.width * settings.blockSize.width + settings.playgroundPadding.left + settings.playgroundPadding.right,
                settings.playgroundSize.height * settings.blockSize.height + settings.playgroundPadding.top + settings.playgroundPadding.bottom
            );
            this.backNode.setPosition(-settings.playgroundPadding.left, -settings.playgroundPadding.bottom);
        }

        if (!this.renderNode) {
            warn(`PlaygroundRenderer's render node can't be empty`);
            this.enabled = false;
        } else {
            const transform = this.renderNode.getComponent(UITransform);
            transform && transform.setContentSize(
                settings.playgroundSize.width * settings.blockSize.width,
                settings.playgroundSize.height * settings.blockSize.height + settings.playgroundPadding.top
            );
            
            const selfTransform = this.node.getComponent(UITransform);
            selfTransform.setContentSize(transform.contentSize);
        }
        
        if (!this.playground) {
            warn(`PlaygroundRenderer's playground can't be empty`);
            this.enabled = false;
        }

        if (!this.animator) {
            warn(`PlaygroundRenderer's animator can't be empty`);
            this.enabled = false;
        } else {
            this.animator.init(settings);
        }

        if (!this.generator) {
            warn(`PlaygroundRenderer's generator can't be empty`);
            this.enabled = false;
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
                        render.lastPosition = v2(tile.x, tile.y + this.playground.height / 2);
                        render.size = this._settings.blockSize;

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

    reorderSiblings() {
        [...this._prevRenderMap.values()].forEach(render => {
            render.node.setSiblingIndex(render.localPosition.y);
        });
    }

    private _locateRender(render: ITileRender) {
        render.node.setParent(this.renderNode);
        render.node.setPosition(render.localPosition);
    }
}


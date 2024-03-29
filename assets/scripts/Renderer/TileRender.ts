import { _decorator, Color, Node, SpriteFrame, Sprite, warn, tween, Vec3, Vec2, Tween, UITransform, v3, v2, Size, Enum } from 'cc';
import { EffectType } from '../enums/EffectType';
import { ITileRender } from '../interfaces/render';
import { ITile } from '../interfaces/tile';
import { PoolManager } from '../Pool/PoolManager';
import { PoolObject } from '../Pool/PoolObject';
import { EffectManager } from './Effects/EffectManager';
const { ccclass, property } = _decorator;

@ccclass('TileRender')
export class TileRender extends PoolObject implements ITileRender {
    @property({ type: Sprite })
    renderSprite: Sprite = null;
    @property({ type: Enum(EffectType) })
    collapseEffect: EffectType = EffectType.None;

    public model: ITile = null;
    public lastPosition: Vec2 = Vec2.ZERO;
    set size(value: Size) {
        this._size = value;
        this._transform && this._transform.setContentSize(value.x, value.y);
    }

    get id(): string {
        return this.model.id;
    }
    get localPosition(): Vec3 {
        return this._getLocalCoords(this.model.x, this.model.y);
    }
    get lastLocalPosition(): Vec3 {
        return this._getLocalCoords(this.lastPosition.x, this.lastPosition.y);
    }
    
    get color(): Color {
        return this.renderSprite.color;
    }
    set color(value: Color) {
        if (this.renderSprite) {
            this.renderSprite.color = value;
        }
    }
    
    set spriteFrame(value: SpriteFrame) {
        if (this.renderSprite) {
            this.renderSprite.spriteFrame = value;
        }
    }
    
    private _size: Size = Size.ZERO;
    private _scaleTween: Tween<Node> = null;
    private _moveTween: Tween<Node> = null;
    private _transform: UITransform = null;

    onLoad() {
        if (!this.renderSprite) {
            warn(`TileRender's render sprite can't be empty!`);
            this.enabled = false;
            return;
        }

        this._transform = this.node.getComponent(UITransform);
    }

    unuse() {
        this.color = Color.WHITE;
        this.renderSprite.node.scale = Vec3.ZERO;
    }

    appear(duration: number, callback: Function) {
        this._scaleTween && this._scaleTween.stop();
        this._scaleTween = tween(this.renderSprite.node)
            .to(duration, { scale: Vec3.ONE }, {
                easing: 'backOut',
                onComplete: () => {
                    callback();
                }
            })
            .start();
    }

    remove(duration: number, callback: Function) {
        this.node.setSiblingIndex(1000);

        this._spawnCollapseEffect();

        this._scaleTween && this._scaleTween.stop();
        this._scaleTween = tween(this.renderSprite.node)
            .to(duration, { scale: Vec3.ZERO }, {
                easing: 'backIn',
                onComplete: () => {
                    PoolManager.eventTarget.emit(PoolManager.EventType.ReturnToPool, this.node);
                    callback();
                }
            })
            .start();
    }

    move(duration: number, callback: Function) {
        this.node.setPosition(this.lastLocalPosition);

        this._moveTween && this._moveTween.stop();
        this._moveTween = tween(this.node)
            .to(duration, { position: this.localPosition }, {
                easing: 'backOut',
                onComplete: () => {
                    callback();
                }
            })
            .start();
            
        this.lastPosition = v2(this.model.x, this.model.y);
    }

    private _getLocalCoords(x: number, y: number): Vec3 {
        return v3(x * this._transform.width, y * this._transform.height);
    }

    private _spawnCollapseEffect() {
        if (this.collapseEffect !== EffectType.None) {
            EffectManager.eventTarget.emit(
                EffectManager.EventType.SpawnEffect, 
                this.collapseEffect, 
                this.getWorldCenter(),
                this
            );
        }
    }

    getWorldCenter(): Vec3 {
        const size = this._transform.contentSize;
        const scale = this.node.worldScale;
        const position = this.node.worldPosition;
        const anchor = this._transform.anchorPoint;

        return v3(
            position.x + size.width * (0.5 - anchor.x) * scale.x,
            position.y + size.height * (0.5 - anchor.y) * scale.y
        );
    }

    getWorldSize(): Size {
        const size = this._transform.contentSize;
        const scale = this.node.worldScale;

        return new Size(
            size.width * scale.x,
            size.height * scale.y
        );
    }

    setFirstPosition(position: Vec2) {
        this.lastPosition = position;
    }
}


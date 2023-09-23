import { Color, Component, Node, SpriteFrame, Vec2, Vec3 } from "cc";
import { ITileTypeFactoryPair } from "./game";
import { IPlayground } from "./playground";
import { ITile } from "./tile";

export interface IRender {
    node: Node,
    color: Color,
    
    appear(callback: Function): void,
    remove(callback: Function): void,
}
export interface ITileRender extends IRender {
    model: ITile,
    spriteFrame: SpriteFrame,

    lastPosition: Vec2,
    localPosition: Vec3,
    lastLocalPosition: Vec3,

    move(callback: Function): void,
}

export interface IPlaygroundRenderer {
    playground: IPlayground,
    animator: IRenderAnimator,
    generator: ITileRenderGenerator
}

export interface IRenderAnimator {
    addToAnimationQueue(component: Component, func: Function): void,
    processQueues(): void
}

export interface ITileRenderGenerator {
    configs: ITileTypeFactoryPair[],

    generateRender(tile: ITile): ITileRender
}

export interface IBasicTileRenderConfig {
    tileColor: Color,
    tileSprite: SpriteFrame
}
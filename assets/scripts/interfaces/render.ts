import { Color, Component, Node, Size, SpriteFrame, Vec2, Vec3 } from "cc";
import { IGameSettings, ITileTypeFactoryPair } from "./game";
import { IPlayground } from "./playground";
import { ITile } from "./tile";

export interface IRender {
    node: Node,
    color: Color,
    size: Size,
    
    appear(duration: number, callback: Function): void,
    remove(duration: number, callback: Function): void,
}
export interface ITileRender extends IRender {
    model: ITile,
    spriteFrame: SpriteFrame,

    lastPosition: Vec2,
    localPosition: Vec3,
    lastLocalPosition: Vec3,

    move(duration: number, callback: Function): void,
}

export interface IPlaygroundRenderer {
    renderNode: Node,
    playground: IPlayground,
    animator: IRenderAnimator,
    generator: ITileRenderGenerator,

    init(settings: IGameSettings): void,
    redraw(): void,
    reorderSiblings(): void
}

export interface IRenderAnimator {
    init(settings: IGameSettings): void,
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
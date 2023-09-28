import { Color, Component, Node, Prefab, Size, SpriteFrame, Vec2, Vec3 } from "cc";
import { IGameSettings, ITypeFactoryPair } from "./game";
import { IPlayground } from "./playground";
import { ITile } from "./tile";

export interface IRender {
    node: Node,
    color: Color,
    size: Size,
}
export interface ITileRender extends IRender {
    model: ITile,
    spriteFrame: SpriteFrame,

    lastPosition: Vec2,
    localPosition: Vec3,
    lastLocalPosition: Vec3,

    appear(duration: number, callback: Function): void,
    remove(duration: number, callback: Function): void,
    move(duration: number, callback: Function): void,

    setFirstPosition(position: Vec2): void
}

export interface IPlaygroundRenderer {
    renderNode: Node,
    playground: IPlayground,
    animator: IRenderAnimator,
    generator: IRenderGenerator,

    init(settings: IGameSettings): void,
    redraw(): void,
    reorderSiblings(): void
}

export interface IRenderAnimator {
    init(settings: IGameSettings): void,
    addToAnimationQueue(component: Component, funcName: string, context: IRender): void,
    processQueues(): void
}

export interface IRenderGenerator {
    configs: ITypeFactoryPair[],

    generateRender(tile: ITile): ITileRender
}

export interface IBasicTileRenderConfig {
    tileColor: Color,
    tileSprite: SpriteFrame
}

export interface IBoosterTileRenderConfig {
    prefab: Prefab
}
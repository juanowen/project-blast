import { _decorator, Component, Node, Prefab, NodePool, instantiate, EventTarget, warn } from 'cc';
import { PoolObject } from './PoolObject';
const { ccclass, property } = _decorator;

const poolManagerEventTarget: EventTarget = new EventTarget();
enum PoolManagerEventType {
    GetFromPool,
    ReturnToPool,
    CreatePoolFor,
}

@ccclass('PoolManagerConfig')
class PoolManagerConfig {
    @property({ type: Prefab })
    prefab: Prefab = null;
    @property
    predefinedCount: number = 0;
}

@ccclass('PoolManager')
export class PoolManager extends Component {

    public static eventTarget: EventTarget = poolManagerEventTarget;
    public static EventType: typeof PoolManagerEventType = PoolManagerEventType;

    @property({ type: [PoolManagerConfig] })
    configs: PoolManagerConfig[] = [];

    private _poolMap: Map<Prefab, NodePool> = new Map();

    onLoad() {
        this.configs.forEach(config => {
            this._createPool(config.prefab, config.predefinedCount);
        });
    }

    onEnable() {
        this._handleResizeEvents(true);
    }

    onDisable() {
        this._handleResizeEvents(false);
    }

    _handleResizeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        poolManagerEventTarget[func](PoolManagerEventType.GetFromPool, this.onGetFromPool, this);
        poolManagerEventTarget[func](PoolManagerEventType.ReturnToPool, this.onReturnToPool, this);
        poolManagerEventTarget[func](PoolManagerEventType.CreatePoolFor, this.onCreatePoolFor, this);
    }

    _createPool(prefab: Prefab, predefinedCount: number = 0) {
        if (!prefab.data.getComponent(PoolObject)) {
            warn(`Can't create pool for ${prefab.name} prefab. It doesn't have PoolObject component on root node.`);
            return;
        }

        const pool = new NodePool(PoolObject);
        this._poolMap.set(prefab, pool);

        for(let i = 0; i < predefinedCount; ++i) {
            pool.put(instantiate(prefab));
        }
    }

    onGetFromPool(prefab: Prefab, callback: Function) {
        const pool = this._poolMap.get(prefab);
        if (pool && pool.size()) {
            callback(pool.get());
        } else {
            callback(instantiate(prefab));
        }
    }

    onReturnToPool(node: Node) {
        // @ts-ignore
        const prefabInfo = node._prefab;
        if (prefabInfo) {
            const prefab = prefabInfo.asset;
            const pool = this._poolMap.get(prefab);
            if (pool) {
                pool.put(node);
                node.removeFromParent();
                return;
            }
        }

        node.destroy();
    }

    onCreatePoolFor(prefab: Prefab, predefinedCount: number = 0) {
        const pool = this._poolMap.get(prefab);
        if (pool) {
            for (let i = 0; i < predefinedCount - pool.size(); ++i) {
                pool.put(instantiate(prefab));
            }
        } else {
            this._createPool(prefab, predefinedCount);
        }
    }
}


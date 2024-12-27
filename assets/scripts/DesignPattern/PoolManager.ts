import { ObjectPool } from "./ObjectPool";

export class PoolManager {
    private static instance: PoolManager;
    private pools: Map<string, ObjectPool<any>> = new Map();

    private constructor() { }

    static getInstance(): PoolManager {
        if (!PoolManager.instance) {
            PoolManager.instance = new PoolManager();
        }
        return PoolManager.instance;
    }

    getPool<T>(key: string, preloadCount: number = 0, createFunc: () => T, resetFunc: (obj: T) => void): ObjectPool<T> {
        if (!this.pools.has(key)) {
            this.pools.set(key, new ObjectPool<T>(createFunc, resetFunc));
            this.pools.get(key).preload(preloadCount);
        }
        return this.pools.get(key) as ObjectPool<T>;
    }

    public releaseObject<T>(key: string, obj: T): void {
        const pool = this.pools.get(key);
        if (pool) {
            pool.release(obj);
        } else {
        }
    }
}
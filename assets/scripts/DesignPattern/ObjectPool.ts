export class ObjectPool<T> {
    private pool: T[] = [];
    private createFunc: () => T;
    private resetFunc: (obj: T) => void;
    private maxSize: number;

    constructor(createFunc: () => T, resetFunc: (obj: T) => void, maxSize: number = Infinity) {
        this.createFunc = createFunc;
        this.resetFunc = resetFunc;
        this.maxSize = maxSize;
    }

    public acquire(): T {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        } else {
            return this.createFunc();
        }
    }

    public release(obj: T): void {
        this.resetFunc(obj);
        this.pool.push(obj);
    }

    public preload(count: number): void {
        const toCreate = Math.min(count, this.maxSize - this.pool.length);
        for (let i = 0; i < toCreate; i++) {
            this.pool.push(this.createFunc());
        }
    }

    public get size(): number {
        return this.pool.length;
    }
}
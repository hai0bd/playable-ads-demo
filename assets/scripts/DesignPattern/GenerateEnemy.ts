import { _decorator, Component, instantiate, Node, Prefab, RigidBody2D, Vec3 } from 'cc';
import { GenerateElements } from '../DesignPattern/GenerateElement';
import { PoolManager } from '../DesignPattern/PoolManager';
import { ObjectPool } from '../DesignPattern/ObjectPool';
import { Enemy } from '../Object/Character/Enemy';
const { ccclass, property } = _decorator;

@ccclass('GenerateEnemy')
export class GenerateEnemy extends  GenerateElements{
    enemyPool: EnemyPool;
    listEnemy: Node[] = [];
    player: Node;

    constructor(prefab: Prefab, enemyParent: Node, player: Node) {
        super(prefab, enemyParent);
        this.enemyPool = new EnemyPool(prefab);
        this.player = player
    }

    generateEnemy(amount: number) {
        for (let i = 0; i < amount; i++) {
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        const enemy = this.enemyPool.acquireEnemy();
        enemy.setPosition(this.randomPosition());
        enemy.getComponent(Enemy).player = this.player;
        this.parent.addChild(enemy);
        this.listEnemy.push(enemy);
    }

    clearEnemies() {
        const length = this.listEnemy.length;
        for (let i = 0; i < length; i++) {
            const enemy = this.listEnemy.pop();
            if (enemy) {
                this.enemyPool.releaseEnemy(enemy);
            }
        }
        this.listEnemy = [];
    }

    private randomPosition(): Vec3 {
        const minRadius = 300;
        const maxRadius = 600;
        const radius = Math.random() * (maxRadius - minRadius) + minRadius;
        const angle = Math.random() * 2 * Math.PI;
        const offsetX = radius * Math.cos(angle);
        const offsetY = radius * Math.sin(angle);
        const playerPosition = this.player.getPosition();
        
        return new Vec3(playerPosition.x + offsetX, playerPosition.y + offsetY);
    }
}

export class EnemyPool {
    pool: ObjectPool<Node>;

    constructor(enemyPrefab: Prefab) {
        this.pool = PoolManager.getInstance().getPool(
            enemyPrefab.name,
            20,
            () => {
                const enemy = instantiate(enemyPrefab);
                return enemy;
            },
            (enemy: Node) => {
                enemy.removeFromParent();
                enemy.active = false;
            }
        );
    }

    acquireEnemy(): Node {
        const enemy = this.pool.acquire();
        enemy.active = true;
        return enemy;
    }

    releaseEnemy(enemy: Node) {
        this.pool.release(enemy);
    }
}



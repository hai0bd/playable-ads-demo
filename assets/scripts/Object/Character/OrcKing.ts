import { _decorator, Animation, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('OrcKing')
export class OrcKing extends Enemy {
    @property(Prefab)
    coinPrefab: Prefab = null;

    attack(): void {
        super.attack();
        this.canMove = false;
    }

    affterAttack(): void {
        super.affterAttack();
        this.scheduleOnce(() => {
            this.canMove = true;
        }, 3);
    }

    die(): void {
        super.die();
        this.scheduleOnce(() => { this.spawnCoin(); }, 0);
    }

    spawnCoin() {
        const coin = instantiate(this.coinPrefab);
        coin.setPosition(this.node.getPosition());
        director.getScene().getChildByName('GamePlay').addChild(coin);
    }
}



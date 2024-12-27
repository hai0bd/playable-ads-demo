import { _decorator, Animation, CCFloat, CCInteger, CCString, Collider2D, Component, Contact2DType, director, instantiate, IPhysics2DContact, Node, physics, Prefab, RigidBody2D, tween, Vec2, Vec3 } from 'cc';
import { Character } from './Character';
import { ColliderTag, GameStatus } from '../../Enum';
import { PoolManager } from '../../DesignPattern/PoolManager';
import { Weapon } from '../Weapon/Weapon';
import { GameManager } from '../../GameManager';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Character {
    @property(RigidBody2D)
    rigidbody: RigidBody2D = null;

    @property(Prefab)
    expPrefab: Prefab = null;

    @property()
    type: string = '';

    @property(CCInteger)
    speed: number = 0;

    @property(CCInteger)
    scoreOfEnemy: number = 1;

    @property(CCFloat)
    damage: number = 1;

    @property(Node)
    player: Node = null;

    maxHealth: number = 0;
    isAttacking: boolean = false;
    hasHit: boolean = false;

    protected canMove: boolean = true;

    start() {
        super.start();
        this.maxHealth = this.health;
    }

    update(deltaTime: number) {
        if (GameManager.instance.gameStatus != GameStatus.Playing) return;
        if (!this.player || !this.canMove) return;

        const pos = this.node.getPosition();
        const playerPos = this.player.getPosition();
        const targetPos = new Vec2(playerPos.x - Math.random() * 100, playerPos.y - Math.random() * 100);
        const direction = new Vec3(targetPos.x - pos.x, targetPos.y - pos.y).normalize();
        const movement = direction.multiplyScalar(this.speed * deltaTime);

        if (direction.x >= 0.3) this.anim.node.setScale(new Vec3(2, 2, 1));
        else if (direction.x < -0.3) this.anim.node.setScale(new Vec3(-2, 2, 1));

        this.node.setPosition(pos.add(movement));
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
        if (otherCollider.tag == ColliderTag.Player) {
            this.attack();
        }
        else if (otherCollider.tag == ColliderTag.Player_Weapon) {
            const damage = otherCollider.node.getComponent(Weapon).damage;
            this.onHit(damage);
        }
    }

    attack() {
        if (this.isAttacking) return;

        this.isAttacking = true;
        this.hasHit = false;
        this.changeAnim(this.type + 'Attack');
        this.anim.once(Animation.EventType.FINISHED, this.affterAttack, this);
        this.scheduleOnce(() => { this.weapon.active = true; }, 0)
    }

    affterAttack() {
        this.changeAnim(this.type + 'Move');
        this.scheduleOnce(() => {
            this.weapon.active = false;
            this.isAttacking = false;
        }, 0.4);
    }

    die(): void {
        GameManager.instance.addScore(this.scoreOfEnemy);
        this.scheduleOnce(() => {
            this.spawnExp();
            this.reset();
            PoolManager.getInstance().releaseObject(this.node.name, this.node);
        }, 0.1);
    }
    reset(){
        this.health = this.maxHealth;
    }
    spawnExp() {
        const exp = instantiate(this.expPrefab);
        exp.setPosition(this.node.getPosition());
        director.getScene().getChildByName('GamePlay').addChild(exp);
    }
}



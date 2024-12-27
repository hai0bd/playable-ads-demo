import { _decorator, CCInteger, CircleCollider2D, Collider2D, Component, Contact2DType, director, ERigidBody2DType, EventTouch, game, Input, input, instantiate, IPhysics2DContact, misc, Node, Prefab, RigidBody2D, sp, SystemEventType, tween, UITransform, Vec2, Vec3 } from 'cc';
import { Character } from './Character';
import { Enemy } from './Enemy';
import { instance, JoystickDataType, SpeedType } from 'db://assets/joystick/assets/scripts/Joystick';
import { ColliderTag, GameStatus } from '../../Enum';
import { GameManager } from '../../GameManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Character {
    @property(UITransform)
    healthBar: UITransform = null;

    @property(Collider2D)
    attackArea: CircleCollider2D = null;

    @property(Prefab)
    haloPrefab: Prefab = null;

    @property({ type: CCInteger })
    stopSpeed: number = 0;

    @property({ type: CCInteger })
    normalSpeed: number = 100;

    @property({ type: CCInteger })
    fastSpeed: number = 200;

    private speedType: SpeedType = SpeedType.STOP;
    private moveDir: Vec3 = new Vec3(0, 0, 0);
    private moveSpeed: number = 0;
    private maxHealth: number = 0;
    private canShoot: boolean = true;

    start() {
        super.start();
        this.maxHealth = this.health;
        this.attackArea.on(Contact2DType.BEGIN_CONTACT, this.onAttackArea, this);

        instance.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        instance.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        instance.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart() { }

    onTouchMove(event: EventTouch, data: JoystickDataType) {
        this.speedType = data.speedType;
        this.moveDir = data.moveVec;

        this.onSetMoveSpeed(this.speedType);
    }

    onTouchEnd(event: EventTouch, data: JoystickDataType) {
        this.speedType = data.speedType;

        this.onSetMoveSpeed(this.speedType);
    }

    onSetMoveSpeed(speedType: SpeedType) {
        switch (speedType) {
            case SpeedType.STOP:
                this.moveSpeed = this.stopSpeed;
                break;
            case SpeedType.NORMAL:
                this.moveSpeed = this.normalSpeed;
                break;
            case SpeedType.FAST:
                this.moveSpeed = this.fastSpeed;
                break;
            default:
                break;
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
        if (otherCollider.tag == ColliderTag.Enemy_Weapon) {
            const other = otherCollider.node.parent.parent;
            const enemy = other.getComponent(Enemy)
            if (!enemy.hasHit) {
                enemy.hasHit = true;
                this.onHit(enemy.damage);
            }
        }
        else if (otherCollider.tag == ColliderTag.Exp) {
            GameManager.instance.pickExp();
            this.scheduleOnce(() => { otherCollider.node.destroy(); }, 0);
        }
        else if (otherCollider.tag == ColliderTag.Coin) {
            GameManager.instance.pickCoin();
            this.scheduleOnce(() => { otherCollider.node.destroy(); }, 0);
        }
    }
    onAttackArea(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
        if (otherCollider.tag == ColliderTag.Enemy) {
            if (this.canShoot) {
                this.canShoot = false;
                this.scheduleOnce(() => { this.canShoot = true; }, 5);
                this.scheduleOnce(() => { this.shoot(otherCollider.node); })
            }
        }
    }

    shoot(target: Node) {
        const halo = instantiate(this.haloPrefab);
        halo.setPosition(this.node.getPosition());
        director.getScene().getChildByName('GamePlay').addChild(halo);

        const targetPos = target.getPosition();
        const playerPos = this.node.getPosition();
        const direction = new Vec2(targetPos.x - playerPos.x, targetPos.y - playerPos.y);
        const distance = direction.length();
        const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);

        halo.angle = angle;
        tween(halo)
            .to(distance / 300, { position: targetPos })
            .call(() => { halo.destroy(); })
            .start();
    }

    move(deltaTime: number) {
        if (this.moveDir.x > 0) this.anim.node.setScale(new Vec3(-2, 2, 1));
        else this.anim.node.setScale(2, 2, 1);

        const oldPos = this.node.getPosition();
        const newPos = oldPos.add(this.moveDir.clone().multiplyScalar(this.moveSpeed * deltaTime));
        this.node.setPosition(newPos);
        this.changeAnim('playerMove');
    }

    update(deltaTime: number): void {
        if (GameManager.instance.gameStatus != GameStatus.Playing) {
            this.endGame();
            return;
        }
        if (this.speedType !== SpeedType.STOP) {
            this.move(deltaTime);
        }
    }
    onHit(damage: number): void {
        super.onHit(damage);
        const healthPercent = this.health / this.maxHealth;
        this.healthBar.width = Math.max(21.5 * healthPercent, 0);
    }

    die(): void {
        this.endGame();

        this.scheduleOnce(() => {
            this.changeAnim('playerDie');
            GameManager.instance.onLose();
            this.weapon.active = false;
            this.enabled = false;
        }, 0);
    }

    endGame() {
        instance.off(SystemEventType.TOUCH_START);
        instance.off(SystemEventType.TOUCH_MOVE);
        instance.off(SystemEventType.TOUCH_END);
        this.collider.off(Contact2DType.BEGIN_CONTACT);
        this.attackArea.off(Contact2DType.BEGIN_CONTACT);
    }
}



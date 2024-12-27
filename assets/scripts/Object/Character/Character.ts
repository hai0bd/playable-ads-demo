import { _decorator, Animation, CCInteger, CircleCollider2D, Collider, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Character')
export class Character extends Component {
    @property(Animation)
    anim: Animation = null;

    @property(UIOpacity)
    opacity: UIOpacity = null;

    @property(Collider2D)
    collider: CircleCollider2D = null;

    @property(CCInteger)
    health: number = 1;

    @property(Node)
    weapon: Node = null;

    private currentAnim: string = '';

    start() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) { }

    onHit(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.die();
        }

        this.startBlinking();

    }

    startBlinking() {
        const startTime = Date.now();
        tween(this.opacity)
            .to(0.05, { opacity: 50 })
            .to(0.05, { opacity: 255 })
            .union()
            .repeat(3)
            .start();
    }

    die() { }

    changeAnim(name: string) {
        if (this.currentAnim !== name) {
            this.currentAnim = name;
            this.anim.play(name);
        }
    }
}



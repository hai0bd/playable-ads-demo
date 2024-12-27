import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Tween } from 'cc';
import { Weapon } from './Weapon';
import { ColliderTag } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass('Halo')
export class Halo extends Weapon {
    @property(Collider2D)
    collider: Collider2D = null;

    start() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, (otherCollider: Collider2D, selfCollider: Collider2D, contact: IPhysics2DContact) => {
            if (otherCollider.tag == ColliderTag.Enemy) {
                Tween.stopAllByTarget(this.node);
                this.node.destroy()
            }
        })
    }
}



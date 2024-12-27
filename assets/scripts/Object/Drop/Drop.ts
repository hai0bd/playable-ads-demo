import { _decorator, CCFloat, CCInteger, CircleCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, tween, UIOpacity, Vec3 } from 'cc';
import { GameManager } from '../../GameManager';
const { ccclass, property } = _decorator;

@ccclass('Drop')
export class Drop extends Component {
    @property(UIOpacity)
    opacity: UIOpacity = null;
    
    @property(CircleCollider2D)
    collider: CircleCollider2D = null;

    @property(CCFloat)
    distanceX: number = 50;

    @property(CCInteger)
    distanceY: number = 5;

    start() {
        this.drop();
    }

    drop() {
        const startPos = this.node.getPosition();
        const endPos = new Vec3(startPos.x + this.distanceX + Math.random() * 10, startPos.y - Math.random() * 10);
        const midPos = new Vec3((startPos.x + endPos.x) / 2, (startPos.y + endPos.y) / 2);
        const distance = Vec3.distance(midPos, endPos) / 2;
        const radian = Math.PI / 2;
        const controlPoint = new Vec3(
            midPos.x + distance * Math.cos(radian),
            midPos.y + distance * Math.sin(radian) * this.distanceY
        );

        tween(this.node)
            .to(0.3, {}, {
                onUpdate: (target: Node, ratio: number) => {
                    const t = ratio;
                    const currentPos = new Vec3();
                    this.quadraticBezier(
                        currentPos,
                        startPos,
                        controlPoint,
                        endPos,
                        t
                    );
                    target.setPosition(currentPos);

                    const opacity = Math.min(255, Math.floor(255 * t));
                    this.opacity.opacity = opacity;
                }
            })
            .call(() => {
                this.collider.enabled = true;
            })
            .start();
    }
    
    private quadraticBezier(out: Vec3, a: Vec3, b: Vec3, c: Vec3, t: number) {
        const tt = 1 - t;
        out.x = tt * tt * a.x + 2 * t * tt * b.x + t * t * c.x;
        out.y = tt * tt * a.y + 2 * t * tt * b.y + t * t * c.y;
        out.z = tt * tt * a.z + 2 * t * tt * b.z + t * t * c.z;
        return out;
    }

}



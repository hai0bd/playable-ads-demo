import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollowInfinite')
export class CameraFollowInfinite extends Component {
    @property(Node)
    player: Node | null = null; 

    @property(Vec3)
    offset: Vec3 = new Vec3(0, 0, 0);

    private _tempPosition: Vec3 = new Vec3();

    update(deltaTime: number) {
        if (this.player) {
            this.player.getWorldPosition(this._tempPosition);
            this._tempPosition.add(this.offset);

            Vec3.lerp(this.node.worldPosition, this.node.worldPosition, this._tempPosition, 0.1);
            this.node.setWorldPosition(this.node.worldPosition);
        }
    }
}




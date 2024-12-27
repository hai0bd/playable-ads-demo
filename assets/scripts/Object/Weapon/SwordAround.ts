import { _decorator, CCInteger, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SwordAround')
export class SwordAround extends Component {
    start() {
        this.rotateAround();
    }

    rotateAround(){
        tween(this.node)
            .by(1.5, { angle: 360 })
            .repeatForever()
            .start();
    }
}



import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {
    @property([Node])
    private backgrounds: Node[] = []; 
    @property(UITransform)
    transform: UITransform = null;

    @property(Node)
    private player: Node = null;

    private BG_WIDTH = 1920;
    private BG_HEIGHT = 1080;

    start() {
        this.BG_HEIGHT = this.transform.height;
        this.BG_WIDTH = this.transform.width;

        this.backgrounds[0].setPosition(0, 0);
        this.backgrounds[1].setPosition(this.BG_WIDTH, 0);
        this.backgrounds[2].setPosition(0, -this.BG_HEIGHT);
        this.backgrounds[3].setPosition(this.BG_WIDTH, -this.BG_HEIGHT);
    }

    update() {
        const playerPos = this.player.getPosition();

        this.backgrounds.forEach(bg => {
            const diffX = bg.position.x - playerPos.x;
            const diffY = bg.position.y - playerPos.y;

            let newX = bg.position.x;
            let newY = bg.position.y;

            if (Math.abs(diffX) > this.BG_WIDTH * 0.5) {
                newX = bg.position.x + (diffX < 0 ? this.BG_WIDTH * 2 : -this.BG_WIDTH * 2);
            }

            if (Math.abs(diffY) > this.BG_HEIGHT * 0.5) {
                newY = bg.position.y + (diffY < 0 ? this.BG_HEIGHT * 2 : -this.BG_HEIGHT * 2);
            }

            if (newX !== bg.position.x || newY !== bg.position.y) {
                bg.setPosition(newX, newY);
            }
        });
    }
}

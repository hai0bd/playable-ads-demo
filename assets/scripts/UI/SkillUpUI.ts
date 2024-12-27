import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkillUpUI')
export class SkillUpUI extends Component {
    @property(Label)
    titleBG: Label = null;

    @property(Sprite)
    icon: Sprite = null;

    init(title: string, icon: SpriteFrame) {
        this.titleBG.string = title;
        this.icon.spriteFrame = icon;

        this.scheduleOnce(() => {this.moveUp();}, 0.3)
    }

    moveUp() {
        const pos = this.node.getPosition();

        tween(this.node)
            .to(0.5, { position: new Vec3(pos.x, 0) }, { easing: 'backOut' })
            .start();
    }
}



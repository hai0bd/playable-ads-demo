import { _decorator, Button, Color, Component, Label, Node, Sprite, tween } from 'cc';
import { GameManager } from '../GameManager';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('LoseUI')
export class LoseUI extends Component {
    @property(Label)
    coin: Label = null;

    @property(Label)
    score: Label = null;

    start() {
        this.coin.string = GameManager.instance.coin.toString();
        this.score.string = GameManager.instance.score.toString();
        this.node.on(Node.EventType.TOUCH_START, () => {
            UIManager.instance.directStore();
        })
    }
}



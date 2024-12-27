import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    private static _instance: UIManager;

    public static get instance(): UIManager {
        if (!this._instance) {
            this._instance = new UIManager;
        }
        return this._instance;
    }

    @property(UITransform)
    expBar: UITransform = null;

    @property(Node)
    listDeactive: Node[] = [];

    @property(Node)
    lose: Node = null;

    @property(Node)
    levelUp: Node = null;

    @property(Label)
    labelCoin: Label = null;

    @property(Label)
    labelScore: Label = null;

    private maxExpWidth: number = 277;

    onLoad() {
        if (!UIManager._instance) {
            UIManager._instance = this;
        } else {
            this.destroy();
        }
    }

    updateExp(exp: number, maxExp: number) {
        const percent = exp / maxExp;
        this.expBar.width = this.maxExpWidth * Math.min(percent, 1);
    }

    updateCoin(coin: number) {
        this.labelCoin.string = coin.toString();
    }

    updateScore(score: number) {
        this.labelScore.string = score.toString();
    }

    onLose() {
        this.deactiveNode();
        this.lose.active = true;
    }

    onWin() {
        this.levelUp.active = true;
    }

    directStore(){
        const userAgent = navigator.userAgent || navigator.vendor;
        const androidLink = GameManager.instance.androidLink;
        const iosAppID = GameManager.instance.iosAppID;

        if (/android/i.test(userAgent)) {
            window.location.href = androidLink;
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            const appStoreLink = `itms-apps://itunes.apple.com/app/id${iosAppID}`;
            window.location.href = appStoreLink;
        } else if (this.isWebView(userAgent)) {
            alert("Please open this link in a browser to install the app.");
        } else {
            window.location.href = androidLink;
        }
    }

    isWebView(userAgent: string): boolean {
        return /FBAV|FBAN|FB_IAB|Instagram|TikTok/i.test(userAgent);
    }

    deactiveNode(){
        for (let i = 0; i < this.listDeactive.length; i++) {
            this.listDeactive[i].active = false;
        }
    }

}



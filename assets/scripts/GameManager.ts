import { _decorator, CCInteger, Component, Node, profiler } from 'cc';
import { GameStatus } from './Enum';
import { UIManager } from './UI/UIManager';
import { EnemySpawner } from './Object/Character/EnemySpawner';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;
    public static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager;
        }
        return this._instance;
    }

    @property(CCInteger)
    maxExp: number = 1;

    @property(EnemySpawner)
    spawner: EnemySpawner = null;

    @property()
    androidLink: string = '';

    @property()
    iosAppID: string = '';

    gameStatus: GameStatus = GameStatus.Playing;
    exp: number = 0;
    coin: number = 0;
    score: number = 0;

    onLoad() {
        if (!GameManager._instance) {
            GameManager._instance = this;
        } else {
            this.destroy();
        }
    }

    pickExp(){
        this.exp++;
        UIManager.instance.updateExp(this.exp, this.maxExp);
        if(this.exp >= this.maxExp){
            this.onWin();
        }
    }

    pickCoin(){
        this.coin++;
        UIManager.instance.updateCoin(this.coin);
    }

    addScore(score: number){
        this.score += score;
        UIManager.instance.updateScore(this.score);
    }
    
    onWin(){
        this.gameStatus = GameStatus.Win;
        this.spawner.enabled = false;
        UIManager.instance.onWin();
    }

    onLose(){
        this.gameStatus = GameStatus.Lose;
        this.spawner.enabled = false;
        UIManager.instance.onLose();
    }
    
}



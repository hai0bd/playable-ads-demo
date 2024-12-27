import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Player } from './Player';
import { GenerateEnemy } from '../../DesignPattern/GenerateEnemy';
const { ccclass, property } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
    @property(Prefab)
    stoneGolemPrefab: Prefab = null;

    @property(Prefab)
    orcKingPrefab: Prefab = null;

    @property(Node)
    player: Node;

    genStoneGolem: GenerateEnemy;
    genOrcKing: GenerateEnemy;

    start() {
        this.genStoneGolem = new GenerateEnemy(this.stoneGolemPrefab, this.node, this.player);
        this.genOrcKing = new GenerateEnemy(this.orcKingPrefab, this.node, this.player);

        this.genStoneGolem.generateEnemy(5);
        this.genOrcKing.generateEnemy(3);

        this.schedule(() => {
            this.genStoneGolem.generateEnemy(2);
        }, 30);
        this.schedule(() => {
            this.genOrcKing.generateEnemy(1);
        }, 40);
    }
}
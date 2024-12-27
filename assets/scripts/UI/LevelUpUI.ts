import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Skill } from '../Skill';
import { SkillUpUI } from './SkillUpUI';
import { GameManager } from '../GameManager';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('LevelUpUI')
export class LevelUpUI extends Component {
    @property(Skill)
    listSkill: Skill[] = [];

    @property(Prefab)
    skillUpPrefab: Prefab = null;

    start() {
        this.createSkillUp();
    }

    createSkillUp() {
        for (let i = 0; i < 3; i++) {
            const skillUp = instantiate(this.skillUpPrefab);
            const skillUpUI = skillUp.getComponent(SkillUpUI);
            this.node.addChild(skillUp);
            this.scheduleOnce(() => {
                skillUpUI.init(this.listSkill[i].title, this.listSkill[i].icon);
            }, i / 3);
        }

        this.node.on(Node.EventType.TOUCH_START, () => {
            UIManager.instance.directStore();
        })
    }
}



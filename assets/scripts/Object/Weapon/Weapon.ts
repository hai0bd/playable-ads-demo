import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Weapon')
export class Weapon extends Component {
    @property(CCInteger)
    damage: number = 1;
}



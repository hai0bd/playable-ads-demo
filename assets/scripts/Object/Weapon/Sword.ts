import { _decorator, Component, Node } from 'cc';
import { Weapon } from './Weapon';
const { ccclass, property } = _decorator;

@ccclass('Sword')
export class Sword extends Weapon {
}
import { _decorator, SpriteFrame } from "cc";

const { ccclass, property } = _decorator;

@ccclass('Skill')
export class Skill{
    @property()
    title: string = '';
    @property(SpriteFrame)
    icon: SpriteFrame = null;
}
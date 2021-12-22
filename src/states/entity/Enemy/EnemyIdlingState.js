import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveNumber } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Timer from "../../../../lib/Timer.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";

export default class EnemyIdlingState extends State {
    constructor(enemy) {
        super();

        this.timer = new Timer();
        this.enemy = enemy;
        this.animation = new Animation([0, 1, 2, 3], 0.2);
    }

    enter() {
		this.enemy.canMove = true;
        this.enemy.isInvincible = false;

        this.enemy.sprites = this.enemy.walkingSprites;
        this.enemy.currentAnimation = this.animation;
        
        this.timer.addTask(() => { }, 1, getRandomPositiveNumber(0.5, 1), () => {
            this.enemy.changeState(EnemyStateName.Walking);
        })
    }

    update(dt) {
        this.timer.update(dt);
    }
}
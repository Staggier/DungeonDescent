import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";

export default class EnemyIdlingState extends State {
    constructor(enemy) {
        super();

        this.enemy = enemy;
        this.animation = new Animation([0, 1, 2, 3], 0.2);
    }

    enter() {
        this.enemy.sprites = this.enemy.walkingSprites;
        this.enemy.currentAnimation = this.animation;
    }

    update(dt) {
        // AI handling
    }
}
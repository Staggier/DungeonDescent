import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";

export default class LeverAwaitingState extends State {
    constructor(lever) {
        super();

        this.lever = lever;
        this.animation = new Animation([0], 1);
    }

    enter() {
        this.lever.currentAnimation = this.animation;
        this.lever.sprites = this.lever.awaitingSprites;
    }

    update(dt) {
        if (this.lever.wasConsumed) {
            
        }
    }
}
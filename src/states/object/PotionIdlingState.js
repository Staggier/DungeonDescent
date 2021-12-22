import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
export default class PotionIdlingState extends State {
    constructor(potion) {
        super();

        this.potion = potion;
        this.animation = [
            new Animation([0], 1),
            new Animation([1], 1),
            new Animation([2], 1),
            new Animation([3], 1)
        ];
    }

    enter() {
        this.potion.currentAnimation = this.animation[this.potion.color];
        this.potion.sprites = this.potion.idlingSprites;
    }

    update(dt) {
        if (this.potion.wasConsumed) {
            this.potion.cleanUp = true;
        }
    }
}
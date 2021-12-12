import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";

export default class ChestOpeningState extends State {
    constructor(chest) {
        super();

        this.chest = chest;
        this.animation = new Animation([0, 1, 2], 0.3, 1);
    }

    enter() {
        this.chest.currentAnimation = this.animation;
        this.chest.sprites = this.chest.openingSprites;
    }

    update(dt) {
        if (this.chest.currentAnimation.isDone()) {
            this.chest.revealItem();
        }
    }
}
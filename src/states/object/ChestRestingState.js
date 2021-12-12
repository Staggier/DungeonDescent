import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";

export default class ChestRestingState extends State {
    constructor(chest) {
        super();

        this.chest = chest;
        this.animation = new Animation([0], 1);
    }

    enter() {
        this.chest.currentAnimation = this.animation;
        this.chest.sprites = this.chest.restingSprites;
    }
}
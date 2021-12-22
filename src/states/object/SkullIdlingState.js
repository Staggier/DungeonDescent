import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";

export default class SkullIdlingState extends State {
    constructor(skull) {
        super();

        this.skull = skull;
        this.animation = new Animation([0], 1);
    }

    enter() {
        this.skull.currentAnimation = this.animation;
        this.skull.sprites = this.skull.idlingSprites;
    }
}
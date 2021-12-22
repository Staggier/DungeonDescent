import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";

export default class HeartIdlingState extends State {
    constructor(heart) {
        super();

        this.heart = heart;
        this.animation = new Animation([0], 1);
    }

    enter() {
        this.heart.currentAnimation = this.animation;
        this.heart.sprites = this.heart.idlingSprites;
    }
}
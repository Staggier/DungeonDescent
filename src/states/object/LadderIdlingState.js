import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";

export default class LadderIdlingState extends State {
    constructor(ladder) {
        super();

        this.ladder = ladder;
        this.animation = new Animation([0], 1);
    }

    enter() {
        this.ladder.currentAnimation = this.animation;
        this.ladder.sprites = this.ladder.idlingSprites;
    }
}
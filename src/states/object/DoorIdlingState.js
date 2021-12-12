import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";

export default class DoorIdlingState extends State {
    constructor(door) {
        super();

        this.door = door;
        this.animation = new Animation([0], 1);
    }

    enter() {
        this.door.currentAnimation = this.animation;
        this.door.sprites = this.door.idlingSprites;
    }
}
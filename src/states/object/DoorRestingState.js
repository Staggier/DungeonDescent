import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import { CANVAS_SCALE, context } from "../../globals.js";
import Door from "../../objects/Door.js";

export default class DoorRestingState extends State {
    constructor(door) {
        super();

        this.animation = new Animation([0], 1);
        this.door = door;
    }

    enter() {
        this.door.currentAnimation = this.animation;
    }

    render() {
        context.save();
        context.translate(this.door.position.x + Door.CLOSED_WIDTH / 2, this.door.position.y + Door.CLOSED_HEIGHT / 2);
        context.scale(CANVAS_SCALE, CANVAS_SCALE);

        switch(this.door.faceDirection) {
            case Direction.Down:
                context.rotate(0);
                break;
            case Direction.Up:
                context.rotate(180 * Math.PI/180);
                break;
            case Direction.Right:
                context.rotate(-90 * Math.PI/180);
                break;
            case Direction.Left:
                context.rotate(90 * Math.PI/180);
                break; 
        }

        context.fillRect(-Door.OPENED_WIDTH/2, -(Door.OPENED_HEIGHT - 10)/2, 30, 27, "black");
        this.door.restingSprites[0].render(-Door.OPENED_WIDTH/2, -Door.OPENED_HEIGHT/2);
        context.restore();
    }
}
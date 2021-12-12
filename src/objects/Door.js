import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Timer from "../../lib/Timer.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { CANVAS_HEIGHT, CANVAS_SCALE, CANVAS_WIDTH, context, images, ROOM_OFFSET } from "../globals.js";
import DoorIdlingState from "../states/object/DoorIdlingState.js";
import DoorRestingState from "../states/object/DoorRestingState.js";
import GameObject from "./GameObject.js";

export default class Door extends GameObject {

    static CLOSED_WIDTH = 64;
    static CLOSED_HEIGHT = 32;
    static OPENED_WIDTH = 32;
    static OPENED_HEIGHT = 32;
    static NUM_SPRITES = 2;

    constructor(dimensions, position, direction) {
        super(dimensions, position);

        this.faceDirection = direction;
        this.idlingSprites = Door.generateClosedSprite();
        this.restingSprites = Door.generateOpenedSprite();
        this.sprites = this.idlingSprites;

        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.DoorIdling, new DoorIdlingState(this));
        this.stateMachine.add(ObjectStateName.DoorResting, new DoorRestingState(this));
        this.stateMachine.change(ObjectStateName.DoorIdling);

        this.isClosed = true;
    }

    static generateClosedSprite() {
        const sprites = []

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            16,
            220,
            Door.CLOSED_WIDTH,
            Door.CLOSED_HEIGHT
        ));
        
        return sprites;
    }

    static generateOpenedSprite() {
        const sprites = []

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            80,
            220,
            Door.OPENED_WIDTH,
            Door.OPENED_HEIGHT
        ));
        
        return sprites;
    }

    render() {
        context.save();
        context.translate(this.position.x + Door.CLOSED_WIDTH / 2, this.position.y + Door.CLOSED_HEIGHT / 2);
        context.scale(CANVAS_SCALE, CANVAS_SCALE);

        switch(this.faceDirection) {
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

        this.sprites[0].render(-Door.CLOSED_WIDTH/2, -Door.CLOSED_HEIGHT/2);
        context.restore();

        this.stateMachine.render();
    }

    static generateNorthDoor() {
        return new Door(new Vector(Door.CLOSED_WIDTH, Door.CLOSED_HEIGHT), new Vector(CANVAS_WIDTH / 2 + 73, 32), Direction.Down);
    }

    static generateSouthDoor() {
        return new Door(new Vector(Door.CLOSED_WIDTH, Door.CLOSED_HEIGHT), new Vector(CANVAS_WIDTH / 2 + 73, 560), Direction.Up);
    }

    static generateEastDoor() {
        return new Door(new Vector(Door.CLOSED_WIDTH, Door.CLOSED_HEIGHT), new Vector(ROOM_OFFSET - 32, CANVAS_HEIGHT / 2), Direction.Right);
    }

    static generateWestDoor() {
        return new Door(new Vector(Door.CLOSED_WIDTH, Door.CLOSED_HEIGHT), new Vector(CANVAS_WIDTH - 80, CANVAS_HEIGHT / 2), Direction.Left);
    }

    
}
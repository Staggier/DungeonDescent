import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { CANVAS_HEIGHT, CANVAS_SCALE, CANVAS_WIDTH, context, images, ROOM_OFFSET, TILE_SIZE } from "../globals.js";
import DoorIdlingState from "../states/object/DoorIdlingState.js";
import DoorRestingState from "../states/object/DoorRestingState.js";
import GameObject from "./GameObject.js";

export default class Door extends GameObject {

    static CLOSED_WIDTH = 64;
    static CLOSED_HEIGHT = 32;
    static OPENED_WIDTH = 32;
    static OPENED_HEIGHT = 32;
    static NUM_SPRITES = 2;

    static NORTH_DOOR_X = CANVAS_WIDTH / 2 + 73;
    static NORTH_DOOR_Y = 32;

    static SOUTH_DOOR_X = CANVAS_WIDTH / 2 + 73;
    static SOUTH_DOOR_Y = 560;

    static EAST_DOOR_X = ROOM_OFFSET - 32;
    static EAST_DOOR_Y = CANVAS_HEIGHT / 2;

    static WEST_DOOR_X = CANVAS_WIDTH - 80;
    static WEST_DOOR_Y = CANVAS_HEIGHT / 2;

    constructor(dimensions, position, direction) {
        super(dimensions, position);

        switch (direction) {
            case Direction.Down:
                this.hitbox.set(this.position.x + 30, this.position.y + 1, TILE_SIZE - 35, TILE_SIZE);
                break;
            case Direction.Left:
                this.hitbox.set(this.position.x - 15, this.position.y + 10, TILE_SIZE + 14, TILE_SIZE - 40);
                break;
            case Direction.Right:
                this.hitbox.set(this.position.x + 19, this.position.y + 5, TILE_SIZE + 14, TILE_SIZE - 40);
                break;
            case Direction.Up:
                this.hitbox.set(this.position.x + 25, this.position.y - 30, TILE_SIZE - 35, TILE_SIZE);
                break;
        }

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
        return new Door(new Vector(Door.CLOSED_WIDTH, Door.CLOSED_HEIGHT), new Vector(Door.NORTH_DOOR_X, Door.NORTH_DOOR_Y), Direction.Down);
    }

    static generateSouthDoor() {
        return new Door(new Vector(Door.CLOSED_WIDTH, Door.CLOSED_HEIGHT), new Vector(Door.SOUTH_DOOR_X, Door.SOUTH_DOOR_Y), Direction.Up);
    }

    static generateWestDoor() {
        return new Door(new Vector(Door.CLOSED_WIDTH, Door.CLOSED_HEIGHT), new Vector(Door.EAST_DOOR_X, Door.EAST_DOOR_Y), Direction.Right);
    }

    static generateEastDoor() {
        return new Door(new Vector(Door.CLOSED_WIDTH, Door.CLOSED_HEIGHT), new Vector(Door.WEST_DOOR_X, Door.WEST_DOOR_Y), Direction.Left);
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
}
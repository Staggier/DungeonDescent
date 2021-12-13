import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { images } from "../globals.js";
import HeartIdlingState from "../states/object/HeardIdlingState.js";
import LadderIdlingState from "../states/object/LadderIdlingState.js";
import GameObject from "./GameObject.js";
import Tile from "./Tile.js";

export default class Heart extends GameObject {
    static WIDTH = 16;
    static HEIGHT = 16;
    static NUM_SPRITES = 3;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.HeartIdling, new HeartIdlingState(this));
        this.stateMachine.change(ObjectStateName.HeartIdling);

        this.currentAnimation = new Animation([0], 1);
        this.idlingSprites = Heart.generateSprites();
        this.sprites = this.idlingSprites;
        this.isSolid = false;
    }

    static generateSprites() {
        const sprites = [];

        for (let i = 0; i < this.NUM_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                288 + (Heart.WIDTH * i),
                256,
                Tile.SIZE,
                Tile.SIZE
            ));
        }

        return sprites;
    }
}
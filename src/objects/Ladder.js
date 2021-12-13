import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { images } from "../globals.js";
import LadderIdlingState from "../states/object/LadderIdlingState.js";
import LeverActivatingState from "../states/object/LeverActivatingState.js";
import LeverAwaitingState from "../states/object/LeverAwaitingState.js";
import GameObject from "./GameObject.js";
import Tile from "./Tile.js";

export default class Ladder extends GameObject {
    static WIDTH = 16;
    static HEIGHT = 16;
    static NUM_SPRITES = 1;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.LadderIdling, new LadderIdlingState(this));
        this.stateMachine.change(ObjectStateName.LadderIdling);

        this.currentAnimation = new Animation([0], 1);
        this.idlingSprites = Ladder.generateLadderTile();
        this.sprites = this.idlingSprites;
        this.isSolid = false;
    }

    static generateLadderTile() {
        const sprites = [];

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            47,
            95,
            Tile.SIZE,
            Tile.SIZE
        ));

        return sprites;
    }
}
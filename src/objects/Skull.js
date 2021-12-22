import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import GameEntity from "../entities/GameEntity.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { images } from "../globals.js";
import SkullIdlingState from "../states/object/SkullIdlingState.js";
import Tile from "./Tile.js";

export default class Skull extends GameEntity {
    static WIDTH = Tile.SIZE;
    static HEIGHT = Tile.SIZE;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.SkullIdling, new SkullIdlingState(this));
        this.stateMachine.change(ObjectStateName.SkullIdling);

        this.idlingSprites = Skull.generateSprites();
        this.sprites = this.idlingSprites;
    }

    static generateSprites() {
        const sprites = [];

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            287,
            320,
            Tile.SIZE,
            Tile.SIZE
        ));

        return sprites;
    }
}
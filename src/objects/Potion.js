import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import ImageName from "../enums/ImageName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { images } from "../globals.js";
import PotionIdlingState from "../states/object/PotionIdlingState.js";
import GameObject from "./GameObject.js";

export default class Potion extends GameObject {
    static WIDTH = 16;
    static HEIGHT = 16;
    static NUM_SPRITES = 3;

    constructor(dimensions, position, color) {
        super(dimensions, position);

        this.color = color;
        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.PotionIdling, new PotionIdlingState(this));
        this.stateMachine.change(ObjectStateName.PotionIdling);

        this.idlingSprites = Potion.generateSprites();
        this.sprites = this.idlingSprites;
    }

    update(dt) {
        super.update(dt);

        if (this.wasConsumed) {
            this.cleanUp = true;
        }
    }

    static generateSprites() {
        const sprites = [];

        for (let i = 0; i < Potion.NUM_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                307 + (Potion.WIDTH * i),
                223,
                Potion.WIDTH,
                Potion.HEIGHT
            ));
        }

        return sprites;
    }
}
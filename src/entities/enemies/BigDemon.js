import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images } from "../../globals.js";
import Enemy from "./Enemy.js";

export default class BigDemon extends Enemy {
    constructor(dimensions, position) {
        super(dimensions, position);

        this.idlingSprites = BigDemon.generateIdlingSprites();
        this.walkingSprites = BigDemon.generateWalkingSprites();

        this.sprites = this.idlingSprites;
    }

    static generateIdlingSprites() {
        const sprites = []

        for (let i = 0; i < Enemy.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                19 + (Enemy.LARGE_WIDTH * i),
                364,
                Enemy.LARGE_WIDTH,
                Enemy.LARGE_HEIGHT
            ));
        }

        return sprites;
    }

    static generateWalkingSprites() {
        const sprites = [];

        for (let i = 0; i < Enemy.NUM_WALKING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                146 + (Enemy.LARGE_WIDTH * i),
                364,
                Enemy.LARGE_WIDTH,
                Enemy.LARGE_HEIGHT
            ));
        }

        return sprites;
    }
}
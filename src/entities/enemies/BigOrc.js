import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images } from "../../globals.js";
import Enemy from "./Enemy.js";

export default class BigOrc extends Enemy {
    constructor(dimensions, position) {
        super(dimensions, position);

        this.idlingSprites = BigOrc.generateIdlingSprites();
        this.walkingSprites = BigOrc.generateWalkingSprites();

        this.sprites = this.idlingSprites;
    }

    static generateIdlingSprites() {
        const sprites = []

        for (let i = 0; i < Enemy.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                21 + (Enemy.LARGE_WIDTH * i),
                316,
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
                149 + (Enemy.LARGE_WIDTH * i),
                316,
                Enemy.LARGE_WIDTH,
                Enemy.LARGE_HEIGHT
            ));
        }

        return sprites;
    }
}
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images } from "../../globals.js";
import Enemy from "./Enemy.js";

export default class SmallDemon extends Enemy {
    constructor(dimensions, position) {
        super(dimensions, position);

        this.idlingSprites = SmallDemon.generateIdlingSprites();
        this.walkingSprites = SmallDemon.generateWalkingSprites();

        this.sprites = this.idlingSprites;
    }

    static generateIdlingSprites() {
        const sprites = []

        for (let i = 0; i < Enemy.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                371 + (Enemy.SMALL_WIDTH * i),
                328,
                Enemy.SMALL_WIDTH,
                Enemy.SMALL_HEIGHT
            ));
        }

        return sprites;
    }

    static generateWalkingSprites() {
        const sprites = [];

        for (let i = 0; i < Enemy.NUM_WALKING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                433 + (Enemy.SMALL_WIDTH * i),
                328,
                Enemy.SMALL_WIDTH,
                Enemy.SMALL_HEIGHT
            ));
        }

        return sprites;
    }
}
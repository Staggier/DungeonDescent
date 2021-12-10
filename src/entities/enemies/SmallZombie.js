import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images } from "../../globals.js";
import Enemy from "./Enemy.js";

export default class SmallZombie extends Enemy {
    constructor(dimensions, position) {
        super(dimensions, position);

        this.idlingSprites = SmallZombie.generateIdlingSprites();
        this.walkingSprites = this.idlingSprites;

        this.sprites = this.idlingSprites;
    }

    static generateIdlingSprites() {
        const sprites = []

        for (let i = 0; i < Enemy.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                370 + (Enemy.SMALL_WIDTH * i),
                136,
                Enemy.SMALL_WIDTH,
                Enemy.SMALL_HEIGHT
            ));
        }

        return sprites;
    }
}
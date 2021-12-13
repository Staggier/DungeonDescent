import Sprite from "../../../lib/Sprite.js";
import Direction from "../../enums/Direction.js";
import ImageName from "../../enums/ImageName.js";
import { CANVAS_SCALE, images } from "../../globals.js";
import Enemy from "./Enemy.js";

export default class BigDemon extends Enemy {
    constructor(dimensions, position) {
        super(dimensions, position);

        this.idlingSprites = BigDemon.generateIdlingSprites();
        this.walkingSprites = BigDemon.generateWalkingSprites();

        this.health = 2;
        this.sprites = this.idlingSprites;
    }

        update(dt) {
        super.update(dt);

        if (this.faceDirection == Direction.Right) {
            this.hitbox.set(this.position.x + 16, this.position.y + 33, Enemy.LARGE_WIDTH * CANVAS_SCALE - 50, Enemy.SMALL_HEIGHT * CANVAS_SCALE - 5);
        }
        else {
            this.hitbox.set(this.position.x + 30, this.position.y + 33, Enemy.LARGE_WIDTH * CANVAS_SCALE - 42, Enemy.SMALL_HEIGHT * CANVAS_SCALE - 5);
        }
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
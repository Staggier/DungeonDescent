import Sprite from "../../../lib/Sprite.js";
import Direction from "../../enums/Direction.js";
import ImageName from "../../enums/ImageName.js";
import { CANVAS_SCALE, images } from "../../globals.js";
import Enemy from "./Enemy.js";

export default class BigZombie extends Enemy {
    constructor(dimensions, position) {
        super(dimensions, position);

        this.idlingSprites = BigZombie.generateIdlingSprites();
        this.walkingSprites = BigZombie.generateWalkingSprites();

        this.health = 3;
        this.sprites = this.idlingSprites;
    }

    update(dt) {
        super.update(dt);

        if (this.faceDirection == Direction.Right) {
            this.hitbox.set(this.position.x + 5, this.position.y + 43, Enemy.LARGE_WIDTH * CANVAS_SCALE - 40, Enemy.SMALL_HEIGHT * CANVAS_SCALE - 14);
        }
        else {
            this.hitbox.set(this.position.x + 36, this.position.y + 43, Enemy.LARGE_WIDTH * CANVAS_SCALE - 42, Enemy.SMALL_HEIGHT * CANVAS_SCALE - 14);
        }
    }

    static generateIdlingSprites() {
        const sprites = []

        for (let i = 0; i < Enemy.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                21 + (Enemy.LARGE_WIDTH * i),
                268,
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
                268,
                Enemy.LARGE_WIDTH,
                Enemy.LARGE_HEIGHT
            ));
        }

        return sprites;
    }
}
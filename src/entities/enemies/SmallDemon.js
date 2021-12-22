import Sprite from "../../../lib/Sprite.js";
import Direction from "../../enums/Direction.js";
import ImageName from "../../enums/ImageName.js";
import { CANVAS_SCALE, images } from "../../globals.js";
import Enemy from "./Enemy.js";

export default class SmallDemon extends Enemy {
    constructor(dimensions, position) {
        super(dimensions, position);

        this.idlingSprites = SmallDemon.generateIdlingSprites();
        this.walkingSprites = SmallDemon.generateWalkingSprites();

        this.health = 3;
        this.sprites = this.idlingSprites;
    }

    update(dt) {
        super.update(dt);

        if (this.faceDirection == Direction.Right) {
            this.hitbox.set(this.position.x + 9, this.position.y + 25, Enemy.SMALL_WIDTH * CANVAS_SCALE - 21, Enemy.SMALL_HEIGHT * CANVAS_SCALE - 35);
        }
        else {
            this.hitbox.set(this.position.x + 11, this.position.y + 25, Enemy.SMALL_WIDTH * CANVAS_SCALE - 21, Enemy.SMALL_HEIGHT * CANVAS_SCALE - 35);
        }
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
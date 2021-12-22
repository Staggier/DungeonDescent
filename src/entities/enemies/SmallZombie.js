import Sprite from "../../../lib/Sprite.js";
import Direction from "../../enums/Direction.js";
import ImageName from "../../enums/ImageName.js";
import { CANVAS_SCALE, images } from "../../globals.js";
import Enemy from "./Enemy.js";

export default class SmallZombie extends Enemy {
    constructor(dimensions, position) {
        super(dimensions, position);

        this.idlingSprites = SmallZombie.generateIdlingSprites();
        this.walkingSprites = this.idlingSprites;

        this.health = 1;
        this.sprites = this.idlingSprites;
    }

    update(dt) {
        super.update(dt);

        if (this.faceDirection == Direction.Right) {
            this.hitbox.set(this.position.x + 8, this.position.y + 35, Enemy.SMALL_WIDTH * CANVAS_SCALE - 25, Enemy.SMALL_HEIGHT * CANVAS_SCALE - 40);
        }
        else {
            this.hitbox.set(this.position.x + 18, this.position.y + 35, Enemy.SMALL_WIDTH * CANVAS_SCALE - 25, Enemy.SMALL_HEIGHT * CANVAS_SCALE - 40);
        }
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
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { images, TILE_SIZE } from "../../globals.js";
import Player from "./Player.js";

export default class Lizard extends Player {

    static NAME = "Lizard";
    static HEALTH = 5.0;
    static SPEED = TILE_SIZE * 5;
    static STRENGTH = 1.0;
    static LUCK = 1.0;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.name = Lizard.NAME;
        this.health = Lizard.HEALTH;
        this.speed = Lizard.SPEED;
        this.strength = Lizard.STRENGTH;
        this.luck = Lizard.LUCK;
        this.knockback = (2 + this.strength) * TILE_SIZE;

        this.idlingSprites = Lizard.generateIdlingSprites();
        this.walkingSprites = Lizard.generateWalkingSprites();
        this.attackingSprites = Lizard.generateAttackingSprites();

        this.sprites = this.idlingSprites;
    }

    static generateIdlingSprites() {
        const sprites = []

        for (let i = 0; i < Player.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                128 + (Player.WIDTH * i),
                196,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateWalkingSprites() {
        const sprites = [];

        for (let i = 0; i < Player.NUM_WALKING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                192 + (Player.WIDTH * i),
                196,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateAttackingSprites() {
        const sprites = Lizard.generateWalkingSprites();

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            256,
            196,
            Player.WIDTH,
            Player.HEIGHT
        ));
            
        return sprites;
    }
}
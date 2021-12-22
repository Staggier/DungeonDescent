import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { CANVAS_SCALE, images, TILE_SIZE } from "../../globals.js";
import Tile from "../../objects/Tile.js";
import Player from "./Player.js";

export default class Knight extends Player {

    static NAME = "Knight";
    static HEALTH = 4.0;
    static SPEED = Tile.SIZE * CANVAS_SCALE * 3;
    static STRENGTH = 2.0;
    static LUCK = 1.0;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.name = Knight.NAME;
        this.health = Knight.HEALTH;
        this.speed = Knight.SPEED;
        this.strength = Knight.STRENGTH;
        this.luck = Knight.LUCK;
        this.knockback = (2 + this.strength) * TILE_SIZE;

        this.idlingSprites = Knight.generateIdlingSprites();
        this.walkingSprites = Knight.generateWalkingSprites();
        this.attackingSprites = Knight.generateAttackingSprites();

        this.sprites = this.idlingSprites;
    }

    static generateIdlingSprites() {
        const sprites = [];

        for (let i = 0; i < Player.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                128 + (Player.WIDTH * i),
                68,
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
                67,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateAttackingSprites() {
        const sprites = Knight.generateWalkingSprites();

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            256,
            67,
            Player.WIDTH,
            Player.HEIGHT
        ));
            
        return sprites;
    }

}
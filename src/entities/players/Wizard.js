import Hitbox from "../../../lib/Hitbox.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { CANVAS_SCALE, images } from "../../globals.js";
import Tile from "../../objects/Tile.js";
import Player from "./Player.js";

export default class Wizard extends Player {

    static SPEED = Tile.SIZE * CANVAS_SCALE * 4;
    static STRENGTH = 1.0;
    static LUCK = 2.0;

    constructor(dimensions, position) {
        super(dimensions, position);

        this.speed = Wizard.SPEED;
        this.strength = Wizard.STRENGTH;
        this.luck = Wizard.LUCK;

        this.idlingSprites = Wizard.generateIdlingSprites();
        this.walkingSprites = Wizard.generateWalkingSprites();
        this.attackingSprites = Wizard.generateAttackingSprites();

        this.sprites = this.idlingSprites;
    }

    static generateIdlingSprites() {
        const sprites = [];

        for (let i = 0; i < Player.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                128 + (Player.WIDTH * i),
                132,
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
                132,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateAttackingSprites() {
        const sprites = Wizard.generateWalkingSprites();

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            256,
            132,
            Player.WIDTH,
            Player.HEIGHT
        ));
            
        return sprites;
    }
}
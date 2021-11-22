import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_SCALE, context, images } from "../globals.js";


export default class Tile {
    static SIZE = 16;
    static NUM_WALL_SPRITES = 3;
    static NUM_BROKEN_WALL_SPRITES = 2;

    constructor(position, dimensions, sprite) {
        this.position = position;
        this.dimensions = dimensions;
        this.sprite = sprite;
    }

    render() {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.scale(CANVAS_SCALE * 2, CANVAS_SCALE * 2);

        this.sprite.render(0, 0);
        context.restore();
    }

    static generateWallSprites() {
        const sprites = [];

        for (let i = 0; i < Tile.NUM_WALL_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                16 + (Tile.SIZE * i),
                12,
                Tile.SIZE,
                Tile.SIZE
            ));
        }

        return sprites;
    }
}
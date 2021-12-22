import Sprite from "../../lib/Sprite.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_SCALE, context, images, TILE_SIZE } from "../globals.js";

export default class Tile {
    static SIZE = 16;
    static NUM_WALL_SPRITES = 3;
    static NUM_WALL_CORNER_SPRITES = 2;
    static NUM_FLOOR_SPRITES = 3;

    constructor(position, dimensions, sprite, direction = Direction.Down) {
        this.position = position;
        this.dimensions = dimensions;
        this.sprite = sprite;
        this.faceDirection = direction;
    }

    render() {
        context.save();

        context.translate(this.position.x + TILE_SIZE / 2, this.position.y + TILE_SIZE / 2);

        switch(this.faceDirection) {
            case Direction.Down:
                context.rotate(0);
                break;
            case Direction.Up:
                context.rotate(180 * Math.PI/180);
                break;
            case Direction.Right:
                context.rotate(-90 * Math.PI/180);
                break;
            case Direction.Left:
                context.rotate(90 * Math.PI/180);
                break; 
        }
        
        context.scale(CANVAS_SCALE, CANVAS_SCALE);
        
        this.sprite.render(-Tile.SIZE/2, -Tile.SIZE/2);
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
    
    static generateWallCornerSprites() {
        const sprites = [];

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            32,
            124,
            Tile.SIZE / 2,
            Tile.SIZE
        ));

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            56,
            124,
            Tile.SIZE / 2,
            Tile.SIZE
        ));

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            32,
            145,
            Tile.SIZE / 2,
            Tile.SIZE
        ));

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            56,
            145,
            Tile.SIZE / 2,
            Tile.SIZE
        ));

        return sprites;
    }

    static generateFloorSprites() {
        const sprites = [];

        for (let i = 0; i < Tile.NUM_FLOOR_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                16 + (Tile.SIZE * i),
                64,
                Tile.SIZE,
                Tile.SIZE
            ));
        }

        return sprites;
    }

    static generateBorderTiles() {
        const sprites = [];

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            80,
            128,
            5,
            12
        ));

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            85,
            140,
            10,
            4
        ));
        
        return sprites;
    }
}
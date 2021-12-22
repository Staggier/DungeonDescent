import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Vector from "../../lib/Vector.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE, CANVAS_SCALE } from "../globals.js";
import Tile from "../objects/Tile.js";

export default class UserInterface {
    /**
     * Get background tiles to be used during non play states.
     * @returns An array of an array of Tiles.
     */
    static getBackgroundTiles() {
		const tiles = [];

		let sprites = Tile.generateFloorSprites();

		for (let i = 0; i < CANVAS_HEIGHT / TILE_SIZE; i++) {
			tiles.push([]);
			for (let j = 0; j < CANVAS_WIDTH / TILE_SIZE; j++) {
				tiles[i].push(new Tile(
					new Vector(j * TILE_SIZE, i * TILE_SIZE),
					new Vector(Tile.SIZE, Tile.SIZE),
					sprites[getRandomPositiveInteger(0, Tile.NUM_FLOOR_SPRITES - 1)]
				));
			}
		}

		return tiles;
	}
    
    /**
     * Get border tiles to be used during play state.
     * @returns An array of an array of Tiles.
     */
    static getStatsBorderTiles() {
		const tiles = [];

        let sprites = Tile.generateBorderTiles();

        for (let i = 0; i < 10; i++) {
            tiles.push(new Tile(
                new Vector(TILE_SIZE - 25 + (i * 10 * CANVAS_SCALE), TILE_SIZE),
                new Vector(Tile.SIZE, Tile.SIZE),
                sprites[1]
            ));

            tiles.push(new Tile(
                new Vector(TILE_SIZE - 25 + (i * 10 * CANVAS_SCALE), TILE_SIZE * 11 + 36),
                new Vector(Tile.SIZE, Tile.SIZE),
                sprites[1]
            ));
        }

        for (let i = 0; i < 14; i++) {
            tiles.push(new Tile(
                new Vector(TILE_SIZE - 25, TILE_SIZE + (12 * i * CANVAS_SCALE)),
                new Vector(Tile.SIZE, Tile.SIZE),
                sprites[0]
            ));

            tiles.push(new Tile(
                new Vector(TILE_SIZE * 6 + 30, TILE_SIZE + (12 * i * CANVAS_SCALE)),
                new Vector(Tile.SIZE, Tile.SIZE),
                sprites[0]
            ));
        }

        tiles.push(new Tile(
            new Vector(TILE_SIZE - 25, TILE_SIZE + (12 * 14 * CANVAS_SCALE) - 12),
            new Vector(Tile.SIZE, Tile.SIZE),
            sprites[0]
        ));
        
        tiles.push(new Tile(
            new Vector(TILE_SIZE * 6 + 30, TILE_SIZE + (12 * 14 * CANVAS_SCALE) - 12),
            new Vector(Tile.SIZE, Tile.SIZE),
            sprites[0]
        ));

        return tiles;
	}


}
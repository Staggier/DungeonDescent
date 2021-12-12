import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Vector from "../../lib/Vector.js";
import Enemy from "../entities/enemies/Enemy.js";
import EnemyFactory from "../entities/enemies/EnemyFactory.js";
import Direction from "../enums/Direction.js";
import EnemyType from "../enums/EnemyType.js";
import { CANVAS_HEIGHT, CANVAS_SCALE, CANVAS_WIDTH, ROOM_OFFSET } from "../globals.js";
import Tile from "./Tile.js";

export default class Room {

    static WIDTH = CANVAS_WIDTH - ROOM_OFFSET;
    static HEIGHT = CANVAS_HEIGHT;

    static LEFT_EDGE = ROOM_OFFSET + (Tile.SIZE * CANVAS_SCALE);
    static RIGHT_EDGE = CANVAS_WIDTH - (Tile.SIZE * CANVAS_SCALE);
    static TOP_EDGE = Tile.SIZE * CANVAS_SCALE;
    static BOTTOM_EDGE = CANVAS_HEIGHT - (Tile.SIZE * CANVAS_SCALE);

    constructor(player, doors, enemyType, isBossRoom = false) {
        this.player = player;
        this.enemyType = enemyType;
        this.enemies = isBossRoom ? this.genereateBossEnemy() : this.generateEnemies();
        
        this.doors = doors;
        this.tiles = this.generateTiles();
        this.objects = [];
        
        this.visited = false;
        this.cleared = false;
        this.isBossRoom = isBossRoom;
    }

    update(dt) {
        this.player.update(dt);
        this.enemies.forEach(enemy => enemy.update(dt));
        this.doors.forEach(door => door.update(dt));

        if (!this.cleared && this.enemies.length == 0) {
            this.cleared = true;
        } 
    }

    render() {
        this.tiles.forEach(tiles => tiles.forEach(tile => tile.render()));
        this.getRenderOrder([this.player, ...this.enemies, ...this.doors]).forEach(entity => entity.render());
    }

    getRenderOrder(entities) {
        return entities.sort((a, b) => {
            const bottomA = a.hitbox.position.y + a.hitbox.dimensions.y;
            const bottomB = b.hitbox.position.y + b.hitbox.dimensions.y;
            let order = 0;
    
            if (a.renderPriority < b.renderPriority) {
                order = -1;
            }
            else if (a.renderPriority > b.renderPriority) {
                order = 1;
            }
            else if (bottomA < bottomB) {
                order = -1;
            }
            else {
                order = 1;
            }
    
            return order;
        });
    }

    generateEnemies() {
        const enemies = [];

        let numEnemies = getRandomPositiveInteger(3, 5);

        for (let i = 0; i < numEnemies; i++) {
            enemies.push(EnemyFactory.createInstance(
                this.enemyType, 
                new Vector(Enemy.SMALL_WIDTH, Enemy.SMALL_HEIGHT), 
                new Vector(getRandomPositiveInteger(ROOM_OFFSET + Enemy.SMALL_WIDTH + (Tile.SIZE * CANVAS_SCALE), CANVAS_WIDTH - Enemy.SMALL_WIDTH - (Tile.SIZE * CANVAS_SCALE)), getRandomPositiveInteger(0 + Enemy.SMALL_HEIGHT + (Tile.SIZE * CANVAS_SCALE), CANVAS_HEIGHT - Enemy.SMALL_HEIGHT - (Tile.SIZE * CANVAS_SCALE)))
            ));
        }

        return enemies;
    }

    generateBossEnemy() {
        const enemy = [];

        enemy.push(EnemyFactory.createInstance(
                this.enemyType,
                new Vector(Enemy.LARGE_WIDTH, Enemy.LARGE_HEIGHT),
                new Vector(getRandomPositiveInteger(ROOM_OFFSET + Enemy.LARGE_WIDTH + (Tile.SIZE * CANVAS_SCALE), CANVAS_WIDTH - Enemy.LARGE_WIDTH - (Tile.SIZE * CANVAS_SCALE)), getRandomPositiveInteger(0 + Enemy.LARGE_HEIGHT + (Tile.SIZE * CANVAS_SCALE), CANVAS_HEIGHT - Enemy.LARGE_HEIGHT - (Tile.SIZE * CANVAS_SCALE)))
            )
        );

        return enemy;
    }

    generateTiles() {
        const tiles = [];

        let tileSize = Tile.SIZE * CANVAS_SCALE;
        let numRows = Math.floor((CANVAS_HEIGHT - (tileSize * 2))  / tileSize);
        let numCols = Math.floor((CANVAS_WIDTH - ROOM_OFFSET - tileSize) / tileSize);

        let wallSprites = Tile.generateWallSprites();
        let wallCornerSprites = Tile.generateWallCornerSprites();
        let floorSprites = Tile.generateFloorSprites();

        for (let i = 0; i < numRows; i++) {
            tiles.push([]);
            for (let j = 0; j < numCols; j++) {
                tiles[i].push(new Tile(
                    new Vector(j * tileSize + ROOM_OFFSET, i * tileSize + tileSize),
                    new Vector(Tile.SIZE, Tile.SIZE),
                    i == 0 || i == numRows - 1 || j == 0 || j == numCols - 1 ? wallSprites[getRandomPositiveInteger(0, 2)] : floorSprites[getRandomPositiveInteger(0, 2)],
                    i == 0 ? Direction.Down : i == numRows - 1 ? Direction.Up : j == 0 ? Direction.Right : j == numCols - 1 ? Direction.Left : Direction.Down
                ));
            }
        }

        tiles[numRows - 1].push(new Tile(
            new Vector(ROOM_OFFSET, tileSize),
            new Vector(Tile.SIZE / 2, Tile.SIZE / 2),
            wallCornerSprites[0]
        ));

        tiles[numRows - 1].push(new Tile(
            new Vector((numCols - 1) * tileSize + ROOM_OFFSET + 24, tileSize),
            new Vector(Tile.SIZE / 2, Tile.SIZE / 2),
            wallCornerSprites[1],
        ));

        tiles[numRows - 1].push(new Tile(
            new Vector(ROOM_OFFSET, CANVAS_HEIGHT - (tileSize * 2)),
            new Vector(Tile.SIZE / 2, Tile.SIZE / 2),
            wallCornerSprites[2]
        ));

        tiles[numRows - 1].push(new Tile(
            new Vector((numCols - 1) * tileSize + ROOM_OFFSET + 24, CANVAS_HEIGHT - (tileSize * 2)),
            new Vector(Tile.SIZE / 2, Tile.SIZE / 2),
            wallCornerSprites[3],
        ));

        return tiles;
    }
}
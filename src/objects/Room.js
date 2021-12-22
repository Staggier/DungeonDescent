import { didSucceedPercentChance, getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Vector from "../../lib/Vector.js";
import Enemy from "../entities/enemies/Enemy.js";
import EnemyFactory from "../entities/enemies/EnemyFactory.js";
import GameEntity from "../entities/GameEntity.js";
import Player from "../entities/players/Player.js";
import Direction from "../enums/Direction.js";
import EnemyStateName from "../enums/EnemyStateName.js";
import EnemyType from "../enums/EnemyType.js";
import GameStateName from "../enums/GameStateName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import PotionColor from "../enums/PotionColor.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_SCALE, CANVAS_WIDTH, ROOM_OFFSET, sounds, stateMachine, TILE_SIZE, timer } from "../globals.js";
import Chest from "./Chest.js";
import Coin from "./Coin.js";
import Ladder from "./Ladder.js";
import Lever from "./Lever.js";
import Potion from "./Potion.js";
import Tile from "./Tile.js";

export default class Room {

    static WIDTH = CANVAS_WIDTH - ROOM_OFFSET;
    static HEIGHT = CANVAS_HEIGHT;

    // Boundaries for the wall tiles.
    static LEFT_EDGE = ROOM_OFFSET + TILE_SIZE;
    static RIGHT_EDGE = CANVAS_WIDTH - (TILE_SIZE * 2) + Tile.SIZE;
    static TOP_EDGE = TILE_SIZE;
    static BOTTOM_EDGE = CANVAS_HEIGHT - (TILE_SIZE * 3);

    constructor(player, doors, enemyType, isBossRoom = false) {
        this.player = player;
        this.enemyType = enemyType;
        this.enemies = isBossRoom ? this.generateBossEnemy() : this.generateEnemies();

        this.doors = doors;
        this.tiles = this.generateTiles();
        this.objects = [];
        
        this.isBossRoom = isBossRoom;
        this.isLocked = isBossRoom;
        this.isCleared = false;
        this.wasCleared = false;
        this.wasVisited = false;

        // Rooms connected to current room.
        this.northRoom = null;
        this.southRoom = null;
        this.eastRoom = null;
        this.westRoom = null;
    }

    update(dt) {
        this.player.update(dt);
        this.enemies.forEach(enemy => enemy.update(dt));
        this.doors.forEach(door => door.update(dt));
        this.objects.forEach(object => object.update(dt));

        if (!this.isCleared && this.enemies.length == 0) {
            this.isCleared = true;
            this.updateDoors();
        } 

        this.updateEnemies();
        this.updateObjects();

        this.cleanUpEnemies();
    }

    updateEnemies() {
        this.enemies.forEach(enemy => {
            if (!enemy.isInvincible && enemy.hitbox.didCollide(this.player.kickHitbox)) {
                let damage = Player.DAMAGE * this.player.strength;

                if (enemy.health - damage <= 0) {
                    enemy.isDead = true;

                    this.lastEnemyPosition = enemy.position;
                    this.player.score += this.isBossRoom ? Enemy.LARGE_ENEMY_SCORE : Enemy.SMALL_ENEMY_SCORE;

                    // Potentially spawn chest if there are no enemies remaining.
                    if (this.enemies.length == 1) {
                        this.chestChance();
                    }

                    // Add ladder to Boss room if there are no enemies remaining.
                    if (this.isBossRoom) {
                        this.addLadder();
                    }

                    this.potionChance();
                }
                else {
                    // Set direction to -1 if enemy is to the left of the player else set to 1.
                    let direction = this.player.position.x > enemy.position.x ? -1 : 1;
                    enemy.stateMachine.change(EnemyStateName.Hurting, { knockback: this.player.knockback, direction: direction, damage: damage });
                }
 
            }
            else if (!this.player.isInvincible && enemy.hitbox.didCollide(this.player.hitbox)) {
                let damage = 0;

                switch (this.enemyType) {
                    case EnemyType.SmallDemon:
                    case EnemyType.SmallOrc:
                    case EnemyType.SmallZombie:
                        damage = Enemy.SMALL_ENEMY_DAMAGE;
                        break;
                    default:
                        damage = Enemy.LARGE_ENEMY_DAMAGE;
                        break;
                }

                if (this.player.health - damage <= 0) {
                    stateMachine.change(GameStateName.GameOver, { backgroundTiles: stateMachine.states.play.backgroundTiles, player: this.player, enemy: enemy, bossDeath: this.isBossRoom });
                }
                else {
                    this.player.stateMachine.change(PlayerStateName.Hurting, { enemy: enemy, damage: damage });
                }
            }
        });
    }

    updateObjects() {
        this.objects.forEach(object => {
            if (object.hitbox.didCollide(this.player.hitbox)) {
                object.onCollision(this.player);
            }

            if (object instanceof Chest && object.hitbox.didCollide(this.player.kickHitbox)) {
                if (!object.wasConsumed) {
                    object.changeState(ObjectStateName.ChestOpening);
                }
                else {
                    if (!object.item.wasConsumed) {
                        if (object.item instanceof Coin) {
                            this.player.score += 15;
                        }
                        else {
                            switch(object.item.color) {
                                case PotionColor.Red:
                                    this.player.health += 1;
                                    break;
                                case PotionColor.Blue:
                                    this.player.strength += 1;
                                    this.player.knockback = (2 + this.strength) * TILE_SIZE;
                                    break;
                                case PotionColor.Green:
                                    this.player.luck += 1;
                                    break;
                                case PotionColor.Yellow:
                                    this.player.speed += TILE_SIZE;
                                    break;
                            }
                        }
                        object.item.wasConsumed = true; 
                    }
                }
            }
            else if (object instanceof Lever && object.hitbox.didCollide(this.player.kickHitbox)) {
                this.updateDoors();
                if (!object.isActivated && this.player.faceDirection == Direction.Right) {
                    object.changeState(ObjectStateName.LeverResting);
                }
                else if (object.isActivated && this.player.faceDirection == Direction.Left) {
                    object.changeState(ObjectStateName.LeverIdling);
                }
            }
            else if (object instanceof Potion && !object.wasConsumed && object.isColliding(this.player)) {
                this.player.health += 1;
                object.wasConsumed = true;
            }
        });
    }

    render() {
        this.tiles.forEach(tiles => tiles.forEach(tile => tile.render()));
        this.getRenderOrder([
            this.player, 
            ...this.enemies, 
            ...this.doors, 
            ...this.objects
        ]).forEach(entity => entity.render());
    }

    /**
     * Reorders all entities in the current room for rendering.
     * @param {Array<GameEntity>} entities 
     * @returns An array of entities.
     */
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

    /**
     * Removes dead enemies from the current room.
     */
    cleanUpEnemies() {
		this.enemies = this.enemies.filter((entity) => !entity.isDead);
	}

    /**
     * Spawns a chest in the current room by chance or if the current room is a boss room.
     */
    chestChance() {
        let position = new Vector(
            getRandomPositiveInteger(Room.LEFT_EDGE, Room.RIGHT_EDGE - TILE_SIZE),
            getRandomPositiveInteger(Room.TOP_EDGE + TILE_SIZE, Room.BOTTOM_EDGE)
        );

        if (this.isBossRoom) {
            let colors = [PotionColor.Red, PotionColor.Blue, PotionColor.Green, PotionColor.Yellow];
            this.objects.push(new Chest(new Vector(Chest.WIDTH, Chest.HEIGHT), position, new Potion(new Vector(Potion.WIDTH, Potion.HEIGHT), new Vector(position.x + ((Chest.WIDTH + 3) / 2), position.y), colors[getRandomPositiveInteger(0, 3)])))
        }
        else {
            for (let i = 0; i < this.player.luck; i++) {
                position = new Vector(
                    getRandomPositiveInteger(Room.LEFT_EDGE, Room.RIGHT_EDGE - TILE_SIZE),
                    getRandomPositiveInteger(Room.TOP_EDGE + TILE_SIZE, Room.BOTTOM_EDGE)
                );

                if (didSucceedPercentChance(0.45)) {
                    this.objects.push(new Chest(new Vector(Chest.WIDTH, Chest.HEIGHT), position, new Coin(new Vector(Coin.WIDTH, Coin.HEIGHT), new Vector(position.x + ((Chest.WIDTH + 13) / 2), position.y))))
                }
            }
        }
    }

    /**
     * Adds a ladder to the current room.
     */

    addLadder() {
        this.objects.push(new Ladder(
            new Vector(Ladder.WIDTH, Ladder.HEIGHT),
            new Vector(CANVAS_WIDTH - (Tile.SIZE * 3 * CANVAS_SCALE), Tile.SIZE * 2 * CANVAS_SCALE)
        ));
    }

    /**
     * Potentially adds a health potion to the current room.
     */

    potionChance() {
        for (let i = 0; i < this.player.luck; i++) {
            let position = new Vector(
                getRandomPositiveInteger(Room.LEFT_EDGE, Room.RIGHT_EDGE - TILE_SIZE),
                getRandomPositiveInteger(Room.TOP_EDGE + TILE_SIZE, Room.BOTTOM_EDGE)
            );

            if (didSucceedPercentChance(0.45)) {
                this.objects.push(new Potion(
                    new Vector(Potion.WIDTH, Potion.HEIGHT),
                    new Vector(position.x, position.y),
                    PotionColor.Red
                ));
            }
        }
    }

    /**
     * Retrieves the enemies for the given room based on the enemy type.
     */
    generateEnemies() {
        const enemies = [];

        if (this.enemyType != "") {

            let numEnemies = getRandomPositiveInteger(3, 7);

            for (let i = 0; i < numEnemies; i++) {
                enemies.push(EnemyFactory.createInstance(
                    this.enemyType, 
                    new Vector(Enemy.SMALL_WIDTH, Enemy.SMALL_HEIGHT), 
                    new Vector(getRandomPositiveInteger(Room.LEFT_EDGE, Room.RIGHT_EDGE - Enemy.SMALL_WIDTH), getRandomPositiveInteger(Room.TOP_EDGE - Enemy.SMALL_HEIGHT, Room.BOTTOM_EDGE))
                ));
            }
        }

        return enemies;
    }

    /**
     * Retrieves the Boss enemy for the given room based on the enemy type.
     */
    generateBossEnemy() {
        const enemy = [];

        enemy.push(EnemyFactory.createInstance(
            this.enemyType,
            new Vector(Enemy.LARGE_WIDTH, Enemy.LARGE_HEIGHT),
            new Vector(ROOM_OFFSET + (860/2) - 10, CANVAS_HEIGHT / 2 - 70)
        ));

        return enemy;
    }

    /**
     * Generates the necessary tiles for the current room.
     * @returns An array of floor and wall tiles.
     */
    generateTiles() {
        const tiles = [];

        let numRows = Math.floor((CANVAS_HEIGHT - (TILE_SIZE * 2)) / TILE_SIZE);
        let numCols = Math.floor((CANVAS_WIDTH - ROOM_OFFSET - TILE_SIZE) / TILE_SIZE);

        let wallSprites = Tile.generateWallSprites();
        let wallCornerSprites = Tile.generateWallCornerSprites();
        let floorSprites = Tile.generateFloorSprites();

        for (let i = 0; i < numRows; i++) {
            tiles.push([]);
            for (let j = 0; j < numCols; j++) {
                tiles[i].push(new Tile(
                    new Vector(j * TILE_SIZE + ROOM_OFFSET, i * TILE_SIZE + TILE_SIZE),
                    new Vector(Tile.SIZE, Tile.SIZE),
                    i == 0 || i == numRows - 1 || j == 0 || j == numCols - 1 ? wallSprites[getRandomPositiveInteger(0, 2)] : floorSprites[getRandomPositiveInteger(0, 2)],
                    i == 0 ? Direction.Down : i == numRows - 1 ? Direction.Up : j == 0 ? Direction.Right : j == numCols - 1 ? Direction.Left : Direction.Down
                ));
            }
        }

        // Add 'corner' sprites for a smoother look.

        tiles[numRows - 1].push(new Tile(
            new Vector(ROOM_OFFSET, TILE_SIZE),
            new Vector(Tile.SIZE / 2, Tile.SIZE / 2),
            wallCornerSprites[0]
        ));

        tiles[numRows - 1].push(new Tile(
            new Vector((numCols - 1) * TILE_SIZE + ROOM_OFFSET + 24, TILE_SIZE),
            new Vector(Tile.SIZE / 2, Tile.SIZE / 2),
            wallCornerSprites[1],
        ));

        tiles[numRows - 1].push(new Tile(
            new Vector(ROOM_OFFSET, CANVAS_HEIGHT - (TILE_SIZE * 2)),
            new Vector(Tile.SIZE / 2, Tile.SIZE / 2),
            wallCornerSprites[2]
        ));

        tiles[numRows - 1].push(new Tile(
            new Vector((numCols - 1) * TILE_SIZE + ROOM_OFFSET + 24, CANVAS_HEIGHT - (TILE_SIZE * 2)),
            new Vector(Tile.SIZE / 2, Tile.SIZE / 2),
            wallCornerSprites[3],
        ));

        return tiles;
    }

    /**
     * Connects a given room to the current room based on a given direction.
     * @param {Room} room 
     * @param {Number} direction 
     */
    addRoom(room, direction) {
        switch (direction) {
            case Direction.Up:
                this.northRoom = room;
                break;
            case Direction.Down:
                this.southRoom = room;
                break;
            case Direction.Left:
                this.eastRoom = room;
                break;
            case Direction.Right:
                this.westRoom = room;
                break;
        }
    }

    /**
     * Opens/closes all unlocked/locked doors inside the current room.
     */
    updateDoors() {
        let opened = 0;

        this.doors.forEach(door => {
            switch (door.faceDirection) {
                case Direction.Down:
                    if (this.northRoom) {
                        door.changeState(this.northRoom.isLocked || !this.isCleared ? ObjectStateName.DoorIdling : ObjectStateName.DoorResting);
                        opened += this.northRoom.isLocked ? 0 : 1;
                    }
                    break;
                case Direction.Left:
                    if (this.westRoom) {
                        door.changeState(this.westRoom.isLocked || !this.isCleared ? ObjectStateName.DoorIdling : ObjectStateName.DoorResting);
                        opened += this.westRoom.isLocked ? 0 : 1;
                    }
                    break;
                case Direction.Right:
                    if (this.eastRoom) {
                        door.changeState(this.eastRoom.isLocked || !this.isCleared ? ObjectStateName.DoorIdling : ObjectStateName.DoorResting);
                        opened += this.eastRoom.isLocked ? 0 : 1;
                    }
                    break;
                case Direction.Up:
                    if (this.southRoom) {
                        door.changeState(this.southRoom.isLocked || !this.isCleared ? ObjectStateName.DoorIdling : ObjectStateName.DoorResting);
                        opened += this.southRoom.isLocked ? 0 : 1;
                    }
                    break;
            }
        });

        if (opened > 0) {
            sounds.play(SoundName.Door);
        }
    }
}
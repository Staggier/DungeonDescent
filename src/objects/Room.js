import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Timer from "../../lib/Timer.js";
import Vector from "../../lib/Vector.js";
import Enemy from "../entities/enemies/Enemy.js";
import EnemyFactory from "../entities/enemies/EnemyFactory.js";
import Player from "../entities/players/Player.js";
import Direction from "../enums/Direction.js";
import EnemyType from "../enums/EnemyType.js";
import GameStateName from "../enums/GameStateName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import PotionColor from "../enums/PotionColor.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_SCALE, CANVAS_WIDTH, keys, ROOM_OFFSET, sounds, stateMachine, timer } from "../globals.js";
import Chest from "./Chest.js";
import Coin from "./Coin.js";
import Ladder from "./Ladder.js";
import Lever from "./Lever.js";
import Potion from "./Potion.js";
import Tile from "./Tile.js";

export default class Room {

    static WIDTH = CANVAS_WIDTH - ROOM_OFFSET;
    static HEIGHT = CANVAS_HEIGHT;

    static LEFT_EDGE = ROOM_OFFSET + (Tile.SIZE * CANVAS_SCALE);
    static RIGHT_EDGE = CANVAS_WIDTH - (Tile.SIZE * 2 * CANVAS_SCALE) + 15;
    static TOP_EDGE = Tile.SIZE * CANVAS_SCALE;
    static BOTTOM_EDGE = CANVAS_HEIGHT - (Tile.SIZE * 3 * CANVAS_SCALE);

    constructor(player, doors, enemyType, isBossRoom = false) {
        this.player = player;
        this.enemyType = enemyType;
        this.enemies = isBossRoom ? this.generateBossEnemy() : this.generateEnemies();

        this.timer = new Timer();

        this.doors = doors;
        this.tiles = this.generateTiles();
        this.objects = [];
        
        this.doorsOpened = false;
        this.visited = false;
        this.cleared = false;
        this.wasCleared = false;
        this.isBossRoom = isBossRoom;
        this.isLocked = isBossRoom;

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
        this.timer.update(dt);

        if (!this.cleared && this.enemies.length == 0) {
            sounds.get(SoundName.Door).play();
            this.cleared = true;
        } 

        if (this.cleared) {
            this.openDoors();
        }

        this.updateEnemies();
        this.updateObjects();

        this.cleanUpEnemies();
    }

    updateEnemies() {
        this.enemies.forEach(enemy => {
            if (!enemy.isInvincible && enemy.hitbox.didCollide(this.player.kickHitbox)) {

                sounds.get(SoundName.HitEnemy).play();

                enemy.isInvincible = true;
                enemy.canMove = false;

                enemy.health -= Player.DAMAGE * this.player.strength;

                if (enemy.health <= 0) {
                    enemy.isDead = true;

                    this.lastEnemyPosition = enemy.position;
                    this.player.score += this.isBossRoom ? Enemy.LARGE_ENEMY_SCORE : Enemy.SMALL_ENEMY_SCORE;

                    if (this.enemies.length == 1) {
                        this.checkLuck(enemy.position);
                    }

                    if (this.isBossRoom) {
                        this.addLadder();
                    }
                }

                let val = this.player.position.x > enemy.position.x ? -1 : 1;

                timer.tween(enemy.position, ["x"], [enemy.position.x + (val * Tile.SIZE * CANVAS_SCALE)], 0.2, () => {
                    enemy.isInvincible = false;
                    enemy.canMove = true;  
                });   
            }
            else if (!this.player.isInvincible && enemy.hitbox.didCollide(this.player.hitbox)) {
                
                sounds.get(SoundName.HitPlayer).play();

                switch (this.enemyType) {
                    case EnemyType.SmallDemon:
                        this.player.health -= Enemy.SMALL_ENEMY_DAMAGE;
                        break;
                    case EnemyType.SmallOrc:
                        this.player.health -= Enemy.SMALL_ENEMY_DAMAGE;
                        break;
                    case EnemyType.SmallZombie:
                        this.player.health -= Enemy.SMALL_ENEMY_DAMAGE;
                        break;
                    default:
                        this.player.health -= Enemy.LARGE_ENEMY_DAMAGE;
                        break;
                }

                if (this.player.health <= 0) {
                    stateMachine.change(GameStateName.GameOver, { backgroundTiles: stateMachine.states.play.backgroundTiles, player: this.player, enemy: enemy});
                }
                else {
                    this.player.canMove = false;
                    this.player.isInvincible = true;

                    switch (enemy.direction) {
                        case Direction.Up:
                            timer.tween(this.player.position, ["y"], [this.player.position.y + (-Tile.SIZE * CANVAS_SCALE)], 0.5, () => {
                                this.player.isInvincible = false;
                                this.player.canMove = true;  
                            });
                            break;
                        case Direction.Down:
                            timer.tween(this.player.position, ["y"], [this.player.position.y + (Tile.SIZE * CANVAS_SCALE)], 0.5, () => {
                                this.player.isInvincible = false;
                                this.player.canMove = true;  
                            });
                            break;
                        case Direction.Left:
                            timer.tween(this.player.position, ["x"], [this.player.position.x + (-Tile.SIZE * CANVAS_SCALE)], 0.5, () => {
                                this.player.isInvincible = false;
                                this.player.canMove = true;  
                            });
                            break;
                        case Direction.Right:
                            timer.tween(this.player.position, ["x"], [this.player.position.x + (Tile.SIZE * CANVAS_SCALE)], 0.5, () => {
                                this.player.isInvincible = false;
                                this.player.canMove = true;  
                            });
                            break;
                    }
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
                            this.player.score += 15 * this.player.luck;
                        }
                        else {
                            switch(object.item.color) {
                                case PotionColor.Blue:
                                    this.player.strength += 0.5;
                                    break;
                                case PotionColor.Green:
                                    this.player.luck += 1;
                                    break;
                                case PotionColor.Yellow:
                                    this.player.speed += 1;
                                    break;
                            }
                        }
                        object.item.wasConsumed = true; 
                    }
                }
            }
            else if (object instanceof Lever && object.hitbox.didCollide(this.player.kickHitbox)) {
                if (!object.on && this.player.faceDirection == Direction.Right) {
                    object.changeState(ObjectStateName.LeverActivating);
                }
                else if (object.on && this.player.faceDirection == Direction.Left) {
                    object.changeState(ObjectStateName.LeverAwaiting);
                }
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

    cleanUpEnemies() {
		this.enemies = this.enemies.filter((entity) => !entity.isDead);
	}

    checkLuck(spawnLocation) {
        let position = new Vector(spawnLocation.x, spawnLocation.y);

        if (this.isBossRoom) {
            let colors = [PotionColor.Blue, PotionColor.Green, PotionColor.Yellow];
            this.objects.push(new Chest(new Vector(Chest.WIDTH, Chest.HEIGHT), position, new Potion(new Vector(Potion.WIDTH, Potion.HEIGHT), new Vector(position.x + ((Chest.WIDTH + 3) / 2), position.y), colors[getRandomPositiveInteger(0, 2)])))
        }
        else {
            for (let i = 0; i < this.player.luck; i++) {
                if(getRandomPositiveInteger(0, 9) <= 4) {
                    this.objects.push(new Chest(new Vector(Chest.WIDTH, Chest.HEIGHT), position, new Coin(new Vector(Coin.WIDTH, Coin.HEIGHT), new Vector(position.x + ((Chest.WIDTH + 13) / 2), position.y))))
                }
            }
        }
    }

    addLadder() {
        this.objects.push(new Ladder(new Vector(Ladder.WIDTH, Ladder.HEIGHT), new Vector(CANVAS_WIDTH - (Tile.SIZE * 3 * CANVAS_SCALE), Tile.SIZE * 2 * CANVAS_SCALE)))
    }

    generateEnemies() {
        const enemies = [];

        if (this.enemyType != "") {

            let numEnemies = getRandomPositiveInteger(2, 5);

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

    generateBossEnemy() {
        const enemy = [];

        enemy.push(EnemyFactory.createInstance(
            this.enemyType,
            new Vector(Enemy.LARGE_WIDTH, Enemy.LARGE_HEIGHT),
            new Vector(ROOM_OFFSET + (860/2) - 10, CANVAS_HEIGHT / 2 - 70)
        ));

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

    closeDoors() {
        this.doors.forEach(door => door.changeState(ObjectStateName.DoorIdling));
    }

    openDoors() {

        this.doors.forEach(door => {
            switch (door.faceDirection) {
                case Direction.Down:
                    if (this.northRoom && !this.northRoom.isLocked) {
                        door.changeState(ObjectStateName.DoorResting);
                    }
                    break;
                default:
                    door.changeState(ObjectStateName.DoorResting);
                    break;
            }
        });
    }
}
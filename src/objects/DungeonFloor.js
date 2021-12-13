import Timer from "../../lib/Timer.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import EnemyType from "../enums/EnemyType.js";
import GameStateName from "../enums/GameStateName.js";
import { CANVAS_SCALE, ROOM_OFFSET, stateMachine, timer } from "../globals.js";
import Door from "./Door.js";
import Ladder from "./Ladder.js";
import Lever from "./Lever.js";
import Room from "./Room.js";
import Tile from "./Tile.js";

export default class DungeonFloor {
    constructor(baseRoom, bossRoom, numRooms, floorNumber) {
        this.baseRoom = baseRoom;
        this.currentRoom = baseRoom;
        this.bossRoom = bossRoom;
        this.roomsToClear = numRooms;
        this.lever = null;
        this.floorNumber = floorNumber + 1;
    }

    update(dt) {
        
        if (this.currentRoom.cleared && !this.currentRoom.wasCleared) {
            this.roomsToClear -= 1;
            this.currentRoom.wasCleared = true;

            if (this.roomsToClear == 1) {
                this.lever = new Lever(new Vector(Lever.WIDTH, Lever.HEIGHT), new Vector(Tile.SIZE * 2 * CANVAS_SCALE + ROOM_OFFSET, Tile.SIZE * 2 * CANVAS_SCALE));
                this.currentRoom.objects.push(this.lever);
            }
        }

        this.currentRoom.objects.forEach(object => {
            if (object instanceof Ladder && object.hitbox.didCollide(this.currentRoom.player.hitbox)) {
                this.changeFloor();
            }
        });

        this.currentRoom.update(dt);

        this.currentRoom.doors.forEach(door => {
            if (!door.isClosed && this.currentRoom.player.hitbox.didCollide(door.hitbox)) {
                this.changeRoom(door.faceDirection);
            }
        });

        if (this.lever && this.lever.on) {
            this.bossRoom.isLocked = false;
        }
    }

    render() {
        this.currentRoom.render();
    }

    changeFloor() {
        switch (this.floorNumber) {
            case 2:
                let secondFloor = DungeonFloor.getSecondFloor(this.currentRoom.player);

                this.lever = null;
                this.bossRoom = secondFloor.bossRoom;
                this.currentRoom = secondFloor.currentRoom;
                this.roomsToClear = secondFloor.roomsToClear;
                this.floorNumber = secondFloor.floorNumber;
                break;
            case 3:
                let thirdFloor = DungeonFloor.getThirdFloor(this.currentRoom.player);

                this.lever = null;
                this.bossRoom = thirdFloor.bossRoom;
                this.currentRoom = thirdFloor.currentRoom;
                this.roomsToClear = thirdFloor.roomsToClear;
                this.floorNumber = thirdFloor.floorNumber;
                break;
            case 4:
                stateMachine.change(GameStateName.Victory, {
                    backgroundTiles: stateMachine.backgroundTiles, 
                    player: this.currentRoom.player
                });
                break;
        }

    }

    changeRoom(direction) {
        this.currentRoom.player.canMove = false;

        switch (direction) {
            case Direction.Down:
                timer.tween(this.currentRoom.player.position, ["y"], [this.currentRoom.player.position.y - (Tile.SIZE * CANVAS_SCALE)], 1.0, () => {
                    this.currentRoom = this.currentRoom.northRoom;
                    this.currentRoom.player.position = new Vector(Door.SOUTH_DOOR_X, Door.SOUTH_DOOR_Y - (Tile.SIZE * 3 * CANVAS_SCALE));
                    timer.clear(); 
                    this.currentRoom.player.canMove = true;
                });
                break;
            case Direction.Up:
                timer.tween(this.currentRoom.player.position, ["y"], [this.currentRoom.player.position.y + (Tile.SIZE * CANVAS_SCALE)], 1.0, () => {
                    this.currentRoom = this.currentRoom.southRoom;
                    this.currentRoom.player.position = new Vector(Door.NORTH_DOOR_X, Door.NORTH_DOOR_Y - 10 + (Tile.SIZE * CANVAS_SCALE));
                    timer.clear(); 
                    this.currentRoom.player.canMove = true;
                });

                break;
            case Direction.Right:
                timer.tween(this.currentRoom.player.position, ["x"], [this.currentRoom.player.position.x - (Tile.SIZE * CANVAS_SCALE)], 1.0, () => {
                    this.currentRoom = this.currentRoom.eastRoom;
                    this.currentRoom.player.position = new Vector(Door.WEST_DOOR_X - (Tile.SIZE * CANVAS_SCALE) - 10, Door.WEST_DOOR_Y - (Tile.SIZE * CANVAS_SCALE));
                    timer.clear();
                    this.currentRoom.player.canMove = true;
                });
                break;
            case Direction.Left:
                timer.tween(this.currentRoom.player.position, ["x"], [this.currentRoom.player.position.x + (Tile.SIZE * CANVAS_SCALE)], 1.0, () => {
                    this.currentRoom = this.currentRoom.westRoom;
                    this.currentRoom.player.position = new Vector(Door.EAST_DOOR_X + (Tile.SIZE * 2 * CANVAS_SCALE), Door.EAST_DOOR_Y - (Tile.SIZE * CANVAS_SCALE));
                    timer.clear();
                    this.currentRoom.player.canMove = true;
                });
                break;
        }
        return;
    }

    static getFirstFloor(player) {

        let numRooms = 3;
        let room = new Room(
            player,
            [Door.generateNorthDoor(), Door.generateWestDoor()],
            ""
        );

        let roomWest = new Room(
            player,
            [Door.generateEastDoor()],
            EnemyType.SmallOrc
        );

        let roomNorth = new Room(
            player,
            [Door.generateSouthDoor()],
            EnemyType.BigOrc,
            true
        );

        room.addRoom(roomWest, Direction.Right);
        room.addRoom(roomNorth, Direction.Up);

        roomWest.addRoom(room, Direction.Left);
        roomNorth.addRoom(room, Direction.Down);

        return new DungeonFloor(room, roomNorth, numRooms, 1);
    }

    static getSecondFloor(player) {
        let numRooms = 4;
        let room = new Room(
            player,
            [Door.generateNorthDoor(), Door.generateEastDoor(), Door.generateWestDoor()],
            ""
        )

        let roomWest = new Room(
            player,
            [Door.generateEastDoor()],
            EnemyType.SmallZombie
        );

        let roomNorth = new Room(
            player,
            [Door.generateSouthDoor()],
            EnemyType.BigZombie,
            true
        );

        let roomEast = new Room(
            player,
            [Door.generateWestDoor()],
            EnemyType.SmallZombie
        );

        room.addRoom(roomEast, Direction.Left);
        room.addRoom(roomWest, Direction.Right);
        room.addRoom(roomNorth, Direction.Up);

        roomEast.addRoom(room, Direction.Right);
        roomWest.addRoom(room, Direction.Left);
        roomNorth.addRoom(room, Direction.Up);

        return new DungeonFloor(room, roomNorth, numRooms, 2);
    }

    static getThirdFloor(player) {
        let numRooms = 5;
        let room = new Room(
            player,
            [Door.generateNorthDoor(), Door.generateEastDoor(), Door.generateWestDoor(), Door.generateSouthDoor()],
            ""
        );

        let roomWest = new Room(
            player,
            [Door.generateEastDoor()],
            EnemyType.SmallDemon
        );

        let roomNorth = new Room(
            player,
            [Door.generateSouthDoor()],
            EnemyType.BigDemon,
            true
        );

        let roomEast = new Room(
            player,
            [Door.generateWestDoor()],
            EnemyType.SmallDemon
        );

        let roomSouth = new Room(
            player,
            [Door.generateNorthDoor()],
            EnemyType.SmallDemon
        );

        room.addRoom(roomEast, Direction.Left);
        room.addRoom(roomWest, Direction.Right);
        room.addRoom(roomNorth, Direction.Up);
        room.addRoom(roomSouth, Direction.Down);

        roomEast.addRoom(room, Direction.Right);
        roomWest.addRoom(room, Direction.Left);
        roomNorth.addRoom(room, Direction.Down);
        roomSouth.addRoom(room, Direction.Up);

        return new DungeonFloor(room, roomNorth, numRooms, 3);
    }
}
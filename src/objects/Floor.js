import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import EnemyType from "../enums/EnemyType.js";
import FloorNumber from "../enums/FloorNumber.js";
import GameStateName from "../enums/GameStateName.js";
import ObjectStateName from "../enums/ObjectStateName.js";
import { CANVAS_WIDTH, context, ROOM_OFFSET, stateMachine, TILE_SIZE } from "../globals.js";
import RoomChangingState from "../states/object/RoomChangingState.js";
import RoomIdlingState from "../states/object/RoomIdlingState.js";
import Door from "./Door.js";
import Ladder from "./Ladder.js";
import Lever from "./Lever.js";
import Room from "./Room.js";

export default class Floor {
    constructor(player, currentRoom, bossRoom, rooms, floorNumber) {
        this.player = player;
        this.currentRoom = currentRoom;
        this.bossRoom = bossRoom;
        this.rooms = rooms;
        this.numRooms = rooms.length;
        this.floorNumber = floorNumber;
        this.lever = null;
        this.ladder = null;

        this.stateMachine = new StateMachine();
        this.stateMachine.add(ObjectStateName.RoomIdling, new RoomIdlingState(player, this));
        this.stateMachine.add(ObjectStateName.RoomChanging, new RoomChangingState(player, this));
        this.stateMachine.change(ObjectStateName.RoomIdling);
    }

    update(dt) {
        console.log(this.currentRoom.enemies)
        this.stateMachine.update(dt);
        this.currentRoom.update(dt);

        if (this.lever == null && this.isCleared()) {
            this.lever = new Lever(new Vector(Lever.WIDTH, Lever.HEIGHT), new Vector(TILE_SIZE * 2 + ROOM_OFFSET, TILE_SIZE * 2), this.bossRoom);
            this.currentRoom.objects.push(this.lever);
        }

        if (this.ladder == null && this.bossRoom.isCleared) {
            this.ladder = new Ladder(new Vector(Ladder.WIDTH, Ladder.HEIGHT), new Vector(CANVAS_WIDTH - (TILE_SIZE * 3), TILE_SIZE * 2));
            this.currentRoom.objects.push(this.ladder);
        }
    }

    render() {
        this.currentRoom.render();
    }

    /**
     * Checks if the floor has been cleared of enemies.
     * @returns The boolean result.
     */
    isCleared() {
        let clearedCount = 0;

        for (let i = 0; i < this.numRooms; i++) {
            if (this.rooms[i].isCleared) {
                clearedCount += 1;
            }
        }

        return clearedCount == this.numRooms - 1;
    }

    /**
     * Creates and returns a Floor based on the floor number.
     * @param {Number} floorNumber 
     * @param {Player} player 
     * @returns A floor, or null when victory is reached.
     */
    static getFloor(floorNumber, player) {
        switch (floorNumber) {
            case FloorNumber.First:
                return Floor.getFirstFloor(player);
            case FloorNumber.Second:
                return Floor.getSecondFloor(player);
            case FloorNumber.Third:
                return Floor.getThirdFloor(player);
            default:
                stateMachine.change(GameStateName.Victory, {
                    backgroundTiles: stateMachine.currentState.backgroundTiles, 
                    player: player
                });
                return null;
        }
    }

    /**
     * Creates and returns the first floor.
     * @param {Player} player 
     * @returns A floor object representing the first floor.
     */
    static getFirstFloor(player) {
        let floorNumber = 1;

        let room = new Room(
            player,
            [Door.generateNorthDoor(), Door.generateEastDoor(), Door.generateSouthDoor()],
            ""
        );

        let roomEast = new Room(
            player,
            [Door.generateWestDoor()],
            EnemyType.SmallZombie
        );

        let roomSouth = new Room(
            player,
            [Door.generateNorthDoor()],
            EnemyType.SmallZombie
        )

        let roomNorth = new Room(
            player,
            [Door.generateSouthDoor()],
            EnemyType.BigZombie,
            true
        );

        room.addRoom(roomEast, Direction.Right);
        room.addRoom(roomNorth, Direction.Up);
        room.addRoom(roomSouth, Direction.Down);

        roomEast.addRoom(room, Direction.Left);
        roomNorth.addRoom(room, Direction.Down);
        roomSouth.addRoom(room, Direction.Up);

        let rooms = [room, roomNorth, roomEast, roomSouth];

        return new Floor(player, room, roomNorth, rooms, floorNumber);
    }

    /**
     * Creates and returns the second floor.
     * @param {Player} player 
     * @returns A floor object representing the second floor.
     */
    static getSecondFloor(player) {
        let floorNumber = 2;

        let room = new Room(
            player,
            [Door.generateEastDoor(), Door.generateWestDoor()],
            ""
        )

        let roomWest = new Room(
            player,
            [Door.generateEastDoor(), Door.generateNorthDoor()],
            EnemyType.SmallOrc
        );

        let roomNorth = new Room(
            player,
            [Door.generateSouthDoor()],
            EnemyType.BigOrc,
            true
        );

        let otherRoomNorth = new Room(
            player,
            [Door.generateSouthDoor()],
            EnemyType.SmallOrc,
        );

        let roomEast = new Room(
            player,
            [Door.generateWestDoor(), Door.generateNorthDoor()],
            EnemyType.SmallOrc
        );

        room.addRoom(roomEast, Direction.Right);
        room.addRoom(roomWest, Direction.Left);

        roomEast.addRoom(room, Direction.Left);
        roomEast.addRoom(otherRoomNorth, Direction.Up);

        roomWest.addRoom(room, Direction.Right);
        roomWest.addRoom(roomNorth, Direction.Up);

        roomNorth.addRoom(roomWest, Direction.Down);
        otherRoomNorth.addRoom(roomEast, Direction.Down);

        let rooms = [room, roomNorth, roomEast, roomWest, otherRoomNorth];

        return new Floor(player, room, roomNorth, rooms, floorNumber);
    }

    /**
     * Creates and returns the third floor.
     * @param {Player} player 
     * @returns A floor object representing the third floor.
     */
    static getThirdFloor(player) {
        let floorNumber = 3;

        let room = new Room(
            player,
            [Door.generateWestDoor(), Door.generateSouthDoor()],
            ""
        );

        let roomWest = new Room(
            player,
            [Door.generateEastDoor(), Door.generateNorthDoor()],
            EnemyType.SmallDemon
        );

        let roomSouth = new Room(
            player,
            [Door.generateNorthDoor(), Door.generateEastDoor()],
            EnemyType.SmallDemon
        )

        let bossRoomSouth = new Room(
            player,
            [Door.generateNorthDoor()],
            EnemyType.BigDemon,
            true
        );

        let roomEast = new Room(
            player,
            [Door.generateWestDoor(), Door.generateSouthDoor()],
            EnemyType.SmallDemon
        );

        let roomNorth = new Room(
            player,
            [Door.generateSouthDoor()],
            EnemyType.SmallDemon
        );

        room.addRoom(roomWest, Direction.Left);
        room.addRoom(roomSouth, Direction.Down);

        roomWest.addRoom(room, Direction.Right);
        roomWest.addRoom(roomNorth, Direction.Up);

        roomNorth.addRoom(roomWest, Direction.Down);

        roomSouth.addRoom(room, Direction.Up);
        roomSouth.addRoom(roomEast, Direction.Right);

        roomEast.addRoom(roomSouth, Direction.Left);
        roomEast.addRoom(bossRoomSouth, Direction.Down);

        let rooms = [room, roomNorth, roomEast, roomWest, roomSouth, bossRoomSouth];

        return new Floor(player, room, bossRoomSouth, rooms, floorNumber);
    }
}
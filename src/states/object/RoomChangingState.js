import State from "../../../lib/State.js";
import Timer from "../../../lib/Timer.js";
import Vector from "../../../lib/Vector.js";
import Direction from "../../enums/Direction.js";
import ObjectStateName from "../../enums/ObjectStateName.js";
import { TILE_SIZE } from "../../globals.js";
import Door from "../../objects/Door.js";

export default class RoomChangingState extends State {
    constructor(player, floor) {
        super();

        this.timer = new Timer();
        this.player = player;
        this.floor = floor;
    }

    enter(params) {
        this.player.canMove = false;

        switch (params.direction) {
            case Direction.Down:
                this.timer.tween(this.player.position, ["y"], [this.player.position.y - TILE_SIZE], 1.0, () => {
                    this.floor.currentRoom = this.floor.currentRoom.northRoom;
                    this.player.position = new Vector(Door.SOUTH_DOOR_X, Door.SOUTH_DOOR_Y - (TILE_SIZE * 3));
                    this.player.canMove = true;
                    this.floor.stateMachine.change(ObjectStateName.RoomIdling);
                    this.floor.currentRoom.updateDoors();
                    this.timer.clear();
                });
                break;
            case Direction.Up:
                this.timer.tween(this.player.position, ["y"], [this.player.position.y + TILE_SIZE], 1.0, () => {
                    this.floor.currentRoom = this.floor.currentRoom.southRoom;
                    this.player.position = new Vector(Door.NORTH_DOOR_X, Door.NORTH_DOOR_Y - 10 + TILE_SIZE); 
                    this.player.canMove = true;
                    this.floor.stateMachine.change(ObjectStateName.RoomIdling);
                    this.floor.currentRoom.updateDoors();
                    this.timer.clear();
                });

                break;
            case Direction.Right:
                this.timer.tween(this.player.position, ["x"], [this.player.position.x - TILE_SIZE], 1.0, () => {
                    this.floor.currentRoom = this.floor.currentRoom.eastRoom;
                    this.player.position = new Vector(Door.WEST_DOOR_X - TILE_SIZE - 10, Door.WEST_DOOR_Y - TILE_SIZE);
                    this.player.canMove = true;
                    this.floor.stateMachine.change(ObjectStateName.RoomIdling);
                    this.floor.currentRoom.updateDoors();
                    this.timer.clear();
                });
                break;
            case Direction.Left:
                this.timer.tween(this.player.position, ["x"], [this.player.position.x + TILE_SIZE], 1.0, () => {
                    this.floor.currentRoom = this.floor.currentRoom.westRoom;
                    this.player.position = new Vector(Door.EAST_DOOR_X + (TILE_SIZE * 2) - 20, Door.EAST_DOOR_Y - TILE_SIZE);
                    this.player.canMove = true;
                    this.floor.stateMachine.change(ObjectStateName.RoomIdling);
                    this.floor.currentRoom.updateDoors();
                    this.timer.clear();
                });
                break;
        }
        return;
    }

    update(dt) {
        this.timer.update(dt);
    }
}
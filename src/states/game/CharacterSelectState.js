import State from "../../../lib/State.js";
import Player from "../../entities/players/Player.js";
import EnemyType from "../../enums/EnemyType.js";
import GameStateName from "../../enums/GameStateName.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { keys, stateMachine } from "../../globals.js";
import Door from "../../objects/Door.js";
import DungeonFloor from "../../objects/DungeonFloor.js";
import Room from "../../objects/Room.js";

export default class CharacterSelectState extends State {
    constructor() {
        super();
    }

    enter(params) { 
        this.backgroundTiles = params.backgroundTiles;
        this.characters = params.characters;
        this.charLength = this.characters.length;
        this.index = 0;
        this.choice = this.characters[this.index];
        this.choice.stateMachine.change(PlayerStateName.Walking);
    }

    update(dt) {
        if (keys.Enter) {
            keys.Enter = false;
            this.choice.canMove = true;
            
            stateMachine.change(GameStateName.Play, {
                player: this.choice,
                dungeonFloor: DungeonFloor.getFirstFloor(this.choice),
                backgroundTiles: this.backgroundTiles
            });
        }

        if (keys.d) {
            keys.d = false;

            this.choice.stateMachine.change(PlayerStateName.Idling);
            this.index = (this.index + 1) % this.charLength;
            this.choice = this.characters[this.index];
            this.choice.stateMachine.change(PlayerStateName.Walking);
        }
        else if (keys.a) {
            keys.a = false;

            this.choice.stateMachine.change(PlayerStateName.Idling);
            this.index -= this.index == -0 ? -this.charLength + 1: 1;
            this.choice = this.characters[this.index];
            this.choice.stateMachine.change(PlayerStateName.Walking);
        }      

        this.characters.forEach(character => character.update(dt));
    }

    render() {
        this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));
        this.characters.forEach(character => character.render());
    }
}
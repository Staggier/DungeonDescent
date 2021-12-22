import State from "../../../lib/State.js";
import GameStateName from "../../enums/GameStateName.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { CANVAS_WIDTH, context, keys, stateMachine, TILE_SIZE } from "../../globals.js";
import Dungeon from "../../objects/Dungeon.js";

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
                dungeon: new Dungeon(this.choice),
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
        this.renderCharacterStats();
    }

    renderCharacterStats() {
        context.save();

        context.fillStyle = "white";
        context.font = "35px WarPriest";
        context.textAlign = "center";

        context.fillText(`Name: ${ this.choice.name}`, CANVAS_WIDTH / 2, TILE_SIZE * 8, 500);
        context.fillText(`Health: ${ this.choice.health}`, CANVAS_WIDTH / 2, TILE_SIZE * 9, 500);
        context.fillText(`Strength: ${ this.choice.strength}`, CANVAS_WIDTH / 2, TILE_SIZE * 10, 500);
        context.fillText(`Luck: ${ this.choice.luck}`, CANVAS_WIDTH / 2, TILE_SIZE * 11, 500);
        context.fillText(`Speed: ${ this.choice.speed / TILE_SIZE }`, CANVAS_WIDTH / 2, TILE_SIZE * 12, 500);

        context.restore();
    }
}
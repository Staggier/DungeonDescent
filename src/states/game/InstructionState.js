import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import GameStateName from "../../enums/GameStateName.js";
import ObjectStateName from "../../enums/ObjectStateName.js";
import { keys, context, stateMachine, TILE_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_SCALE } from "../../globals.js";
import Chest from "../../objects/Chest.js";
import Coin from "../../objects/Coin.js";

export default class InstructionState extends State {
    constructor() {
        super();
    }

    enter(params) {
        this.backgroundTiles = params.backgroundTiles;
        this.characters = params.characters;

        let position1 = new Vector(TILE_SIZE, CANVAS_HEIGHT - (TILE_SIZE * 4));
        let position2 = new Vector(CANVAS_WIDTH - (TILE_SIZE * 4), CANVAS_HEIGHT - (TILE_SIZE * 4));

        this.chests = [
            new Chest(
                new Vector(Chest.WIDTH, Chest.HEIGHT),
                position1,
                new Coin(new Vector(Coin.WIDTH, Coin.HEIGHT), new Vector(position1.x + ((Chest.WIDTH + 13) / 2), position1.y))
            ),
            new Chest(
                new Vector(Chest.WIDTH, Chest.HEIGHT),
                position2,
                new Coin(new Vector(Coin.WIDTH, Coin.HEIGHT), new Vector(position2.x + ((Chest.WIDTH + 13) / 2), position2.y))
            )
        ];

        this.coins = [
            new Coin(
                new Vector(Coin.WIDTH, Coin.HEIGHT),
                new Vector(position1.x + 50, position1.y - 200),
            ),
            new Coin(
                new Vector(Coin.WIDTH, Coin.HEIGHT),
                new Vector(position2.x + 50, position2.y - 200)
            )
        ];

        this.chests.forEach(chest => chest.changeState(ObjectStateName.ChestResting));
    }

    update(dt) {
        if (keys.Enter) {
            keys.Enter = false;
            stateMachine.change(GameStateName.CharacterSelect, { backgroundTiles: this.backgroundTiles, characters: this.characters });
        }

        this.chests.forEach(chest => chest.update(dt));
        this.coins.forEach(coin => coin.update(dt));
    }

    render() {
        this.backgroundTiles.forEach(tiles => tiles.forEach(tile => tile.render()));
        this.renderInstructions();
        this.renderItems(this.chests);
        this.renderItems(this.coins);
    }

    renderInstructions() {
        context.save();

        context.fillStyle = "white";
        context.font = "35px WarPriest";
        context.textAlign = "center";

        context.fillText("Welcome to Dungeon Descent!", CANVAS_WIDTH / 2, TILE_SIZE - 10)
        context.fillText("Use the WASD keys to move.", CANVAS_WIDTH / 2, TILE_SIZE * 2 + 15);
        context.fillText("Use the Enter key to attack enemies", CANVAS_WIDTH / 2, TILE_SIZE * 3 + 15);
        context.fillText("or to interact with items.", CANVAS_WIDTH / 2, TILE_SIZE * 4 + 15);

        context.fillText("Character stat info:", CANVAS_WIDTH / 2, TILE_SIZE * 6);
        context.fillText("Strength influences damage and knockback.", CANVAS_WIDTH / 2, TILE_SIZE * 8);
        context.fillText("Luck influences the amount of loot.", CANVAS_WIDTH / 2, TILE_SIZE * 10);

        context.fillText("Press Enter to continue...", CANVAS_WIDTH / 2, CANVAS_HEIGHT - TILE_SIZE);

        context.restore();
    }

    renderItems(item) {
        context.save();

        context.translate(item[0].position.x, item[0].position.y);        
        context.scale(CANVAS_SCALE * 3, CANVAS_SCALE * 3);

        item[0].sprites[item[0].currentAnimation.getCurrentFrame()].render(0, 0);

        context.restore();

        context.save();

        context.translate(item[1].position.x, item[1].position.y);        
        context.scale(CANVAS_SCALE * 3, CANVAS_SCALE * 3);

        item[1].sprites[item[1].currentAnimation.getCurrentFrame()].render(0, 0);

        context.restore();
    }
}
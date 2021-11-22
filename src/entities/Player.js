import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import ImageName from "../enums/ImageName.js";
import PlayerType from "../enums/PlayerSpriteType.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import { images } from "../globals.js";
import PlayerIdlingState from "../states/entity/Player/PlayerIdlingState.js";
import PlayerWalkingState from "../states/entity/Player/PlayerWalkingState.js";
import GameEntity from "./GameEntity.js";

export default class Player extends GameEntity {

    static NUM_IDLING_SPRITES = 4;
    static NUM_WALKING_SPRITES = 4;
    static NUM_HITTING_SPRITES = 5;

    static WIDTH = 16;
    static HEIGHT = 28;

    constructor(dimensions, position, choice = PlayerType.Lizard) {
        super(dimensions, position);

        this.stateMachine = new StateMachine();
        this.stateMachine.add(PlayerStateName.Idling, new PlayerIdlingState(this));
        this.stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));

        this.changeState(PlayerStateName.Idling);

        const {
            idlingSprites,
            walkingSprites,
            attackingSprites
        } = Player.generateSprites(choice);

        this.idlingSprites = idlingSprites;
        this.walkingSprites = walkingSprites;
        this.attackingSprites = attackingSprites;

        this.sprites = this.idlingSprites;

        this.luck = choice == PlayerType.Wizard ? 2.0 : 1.0;
        this.strength = choice == PlayerType.Knight ? 2.0 : 1.0;
        this.speed = choice == PlayerType.Lizard ? 4.5 : 3.0;
    }

    static generateLizardIdlingSprites() {
        const sprites = []

        for (let i = 0; i < Player.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                128 + (Player.WIDTH * i),
                196,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateLizardWalkingSprites() {
        const sprites = [];

        for (let i = 0; i < Player.NUM_WALKING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                192 + (Player.WIDTH * i),
                196,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateLizardAttackingSprites() {
        const sprites = Player.generateLizardWalkingSprites();

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            256,
            196,
            Player.WIDTH,
            Player.HEIGHT
        ));
            
        return sprites;
    }

    static generateKnightIdlingSprites() {
        const sprites = [];

        for (let i = 0; i < Player.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                128 + (Player.WIDTH * i),
                68,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateKnightWalkingSprites() {
        const sprites = [];

        for (let i = 0; i < Player.NUM_WALKING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                192 + (Player.WIDTH * i),
                67,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateKnightAttackingSprites() {
        const sprites = Player.generateKnightWalkingSprites();

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            256,
            67,
            Player.WIDTH,
            Player.HEIGHT
        ));
            
        return sprites;
    }

    static generateWizardIdlingSprites() {
        const sprites = [];

        for (let i = 0; i < Player.NUM_IDLING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                128 + (Player.WIDTH * i),
                132,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateWizardWalkingSprites() {
        const sprites = [];

        for (let i = 0; i < Player.NUM_WALKING_SPRITES; i++) {
            sprites.push(new Sprite(
                images.get(ImageName.SpriteSheet),
                192 + (Player.WIDTH * i),
                132,
                Player.WIDTH,
                Player.HEIGHT
            ));
        }

        return sprites;
    }

    static generateWizardAttackingSprites() {
        const sprites = Player.generateWizardWalkingSprites();

        sprites.push(new Sprite(
            images.get(ImageName.SpriteSheet),
            256,
            132,
            Player.WIDTH,
            Player.HEIGHT
        ));
            
        return sprites;
    }

    static generateSprites(choice) {
        const sprites = { }

        switch (choice) {
            case PlayerType.Knight:
                sprites.idlingSprites = Player.generateKnightIdlingSprites();
                sprites.walkingSprites = Player.generateKnightWalkingSprites();
                sprites.attackingSprites = Player.generateKnightAttackingSprites();
                break;

            case PlayerType.Wizard:
                sprites.idlingSprites = Player.generateWizardIdlingSprites();
                sprites.walkingSprites = Player.generateWizardWalkingSprites();
                sprites.attackingSprites = Player.generateWizardAttackingSprites();
                break;

            default:
                sprites.idlingSprites = Player.generateLizardIdlingSprites();
                sprites.walkingSprites = Player.generateLizardWalkingSprites();
                sprites.attackingSprites = Player.generateLizardAttackingSprites();
                break;
        }
        
        return sprites;
    }
}
import PlayerType from "../../enums/PlayerType.js";
import Knight from "./Knight.js";
import Lizard from "./Lizard.js";
import Wizard from "./Wizard.js";

export default class PlayerFactory {
    static createInstance(type, dimensions, position) {
        switch (type) {
            case PlayerType.Lizard:
                return new Lizard(dimensions, position);
            case PlayerType.Knight:
                return new Knight(dimensions, position);
            case PlayerType.Wizard:
                return new Wizard(dimensions, position);
        }
    }
}
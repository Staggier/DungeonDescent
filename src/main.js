/**
 * Game Name: Dungeon Descent
 *
 * Author: Jordan McIntyre
 *
 * Brief description:
 *
 * Asset sources: 
 * art: https://0x72.itch.io/dungeontileset-ii
 * 
 * music: Adventure by Alexander Nakarada | https://www.serpentsoundstudios.com
 * Music promoted by https://www.chosic.com/free-music/all/
 * Attribution 4.0 International (CC BY 4.0)
 * https://creativecommons.org/licenses/by/4.0/
 
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import { canvas, context, fonts, images, keys, sounds, stateMachine, } from "./globals.js";
import PlayState from "./states/game/PlayState.js";
import GameOverState from "./states/game/GameOverState.js";
import VictoryState from "./states/game/VictoryState.js";
import TitleScreenState from "./states/game/TitleScreenState.js";
import CharacterSelectState from "./states/game/CharacterSelectState.js";
import HighscoreState from "./states/game/HighscoreState.js";
import EnterHighscoreState from "./states/game/EnterHighscoreState.js";
import InstructionState from "./states/game/InstructionState.js";

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
	// @ts-ignore
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Add all the states to the state machine.
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
stateMachine.add(GameStateName.GameOver, new GameOverState());
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.Play, new PlayState());
stateMachine.add(GameStateName.CharacterSelect, new CharacterSelectState());
stateMachine.add(GameStateName.HighscoreState, new HighscoreState());
stateMachine.add(GameStateName.EnterHighscore, new EnterHighscoreState());
stateMachine.add(GameStateName.Instructions, new InstructionState());

stateMachine.change(GameStateName.TitleScreen);

// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

context.imageSmoothingEnabled = false;

const game = new Game(stateMachine, context, canvas.width, canvas.height);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();

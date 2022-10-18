import Sprite from "./classes/Sprite.js";
import Monster from "./classes/Monster.js";
import {
  battleBackgroundImage,
  backgroundImage,
  foregroundImage,
  playerImageDown,
  playerImageLeft,
  playerImageRight,
  playerImageUp,
} from "./images.js";
import { offset } from "./helpers.js";
import { monsters } from "./data/monsters.js";

const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;
//--------------------------------------------------------------

export const background = new Sprite({
  position: offset,
  image: backgroundImage,
});

export const foreground = new Sprite({
  position: offset,
  image: foregroundImage,
});

export const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

//player spriteSheet image constants
//width: 192
//height: 68
export const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - (68 / 2 - 16),
  },
  image: {
    src: "assets/imgs/character/playerDown.png",
  },
  frames: { max: 4, hold: 15 },
  sprites: {
    up: playerImageUp,
    down: playerImageDown,
    left: playerImageLeft,
    right: playerImageRight,
  },
});

//--------------------------------------------------------------
//monsters
export let draggle = new Monster(monsters.Draggle);
export let emby = new Monster(monsters.Emby);

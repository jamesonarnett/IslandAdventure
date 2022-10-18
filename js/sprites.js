import Sprite from "./classes/Sprite.js";
import {
  battleBackgroundImage,
  backgroundImage,
  foregroundImage,
} from "./images.js";
import { offset } from "./helpers.js";
import { monsters } from "./data/monsters.js";

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

//--------------------------------------------------------------
//monsters
export const draggle = new Sprite(monsters.Draggle);
export const emby = new Sprite(monsters.Emby);

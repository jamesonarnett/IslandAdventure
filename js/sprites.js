import Sprite from "./classes/Sprite.js";
import {
  draggleImage,
  embyImage,
  battleBackgroundImage,
  backgroundImage,
  foregroundImage,
  emberImage,
} from "./images.js";
import { offset } from "./helpers.js";

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
export const draggle = new Sprite({
  name: "Draggle",
  position: {
    x: 800,
    y: 100,
  },
  image: draggleImage,
  frames: { max: 4, hold: 50 },
  animate: true,
  isEnemy: true,
});

export const emby = new Sprite({
  name: "Emby",
  position: {
    x: 325,
    y: 400,
  },
  image: embyImage,
  frames: { max: 4, hold: 50 },
  animate: true,
});

// --------------------------------------------------------------
// Attacks
// export const ember = new Sprite({
//   position: {
//     x: this.position.x,
//     y: this.position.y,
//   },
//   image: emberImage,
//   frames: {
//     max: 4,
//     hold: 10,
//   },
//   animate: true,
// });

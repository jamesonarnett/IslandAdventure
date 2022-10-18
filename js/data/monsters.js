import { attacks } from "./attacks.js";

export const monsters = {
  Emby: {
    name: "Emby",
    position: {
      x: 325,
      y: 400,
    },
    image: {
      src: "./assets/imgs/monsters/embySprite.png",
    },
    frames: { max: 4, hold: 50 },
    animate: true,
    attacks: [attacks.Tackle, attacks.Ember],
  },
  Draggle: {
    name: "Draggle",
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: "./assets/imgs/monsters/draggleSprite.png",
    },
    frames: { max: 4, hold: 50 },
    animate: true,
    isEnemy: true,
    attacks: [attacks.Tackle, attacks.Ember],
  },
};

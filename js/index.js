import Sprite from "./classes/Sprite.js";
import Boundary from "./classes/Boundary.js";
import { keys, offset } from "./gameObjects.js";
import { collisions } from "./collisions.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const image = new Image();
image.src = "assets/imgs/pelletTown.png";

const playerImage = new Image();
playerImage.src = "assets/imgs/character/playerDown.png";

canvas.width = 1024;
canvas.height = 576;

//--------------------------------------------------------------
const player = new Sprite({
  position: {
    x: canvas.width / 2 - playerImage.width / 4 / 2,
    y: canvas.height / 2 - (playerImage.height / 2 - 16),
  },
  velocity: {
    x: 1,
    y: 1,
  },
  image: playerImage,
  frames: { max: 4 },
});

const background = new Sprite({
  position: offset,
  velocity: {
    x: 1,
    y: 1,
  },
  image: image,
});

//--------------------------------------------------------------
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

const boundaries = [];
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y,
        })
      );
    }
  });
});

const moveables = [background, ...boundaries];

const rectangularCollision = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
};

//--------------------------------------------------------------
const animate = () => {
  requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  player.draw();

  let isPlayerColliding = false;
  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        isPlayerColliding = true;
        break;
      }
    }
    if (!isPlayerColliding) {
      moveables.forEach((moveable) => {
        moveable.position.y += 3;
      });
    }
  }
  if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        isPlayerColliding = true;
        break;
      }
    }
    if (!isPlayerColliding) {
      moveables.forEach((moveable) => {
        moveable.position.y -= 3;
      });
    }
  }
  if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        isPlayerColliding = true;
        break;
      }
    }
    if (!isPlayerColliding) {
      moveables.forEach((moveable) => {
        moveable.position.x += 3;
      });
    }
  }
  if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        isPlayerColliding = true;
        break;
      }
    }
    if (!isPlayerColliding) {
      moveables.forEach((moveable) => {
        moveable.position.x -= 3;
      });
    }
  }
};

animate();

//--------------------------------------------------------------
let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

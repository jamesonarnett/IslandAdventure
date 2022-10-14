import Sprite from "./classes/Sprite.js";
import Boundary from "./classes/Boundary.js";
import { keys, offset } from "./gameObjects.js";
import { collisions } from "./collisions.js";
import { battleZonesData } from "./battleZones.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = "assets/imgs/pelletTown.png";

const foregroundImage = new Image();
foregroundImage.src = "assets/imgs/foregroundObject.png";

const playerImageDown = new Image();
playerImageDown.src = "assets/imgs/character/playerDown.png";

const playerImageUp = new Image();
playerImageUp.src = "assets/imgs/character/playerUp.png";

const playerImageLeft = new Image();
playerImageLeft.src = "assets/imgs/character/playerLeft.png";

const playerImageRight = new Image();
playerImageRight.src = "assets/imgs/character/playerRight.png";

canvas.width = 1024;
canvas.height = 576;

//--------------------------------------------------------------

//sprite image constants below
//width: 192
//height: 68
const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - (68 / 2 - 16),
  },
  velocity: {
    x: 1,
    y: 1,
  },
  image: playerImageDown,
  frames: { max: 4 },
  sprites: {
    up: playerImageUp,
    down: playerImageDown,
    left: playerImageLeft,
    right: playerImageRight,
  },
});

const background = new Sprite({
  position: offset,
  velocity: {
    x: 1,
    y: 1,
  },
  image: backgroundImage,
});

const foreground = new Sprite({
  position: offset,
  velocity: {
    x: 1,
    y: 1,
  },
  image: foregroundImage,
});

//--------------------------------------------------------------
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70));
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

const battleZones = [];
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      battleZones.push(
        new Boundary({
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y,
        })
      );
    }
  });
});

const moveables = [background, ...boundaries, ...battleZones];

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
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      //prettier-ignore
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          ////
          Math.max(player.position.x, battleZone.position.x)) 
          *
          ////
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          ////
          Math.max(player.position.y, battleZone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        console.log("battleZone");
        break;
      }
    }
  }

  let isPlayerColliding = false;
  player.moving = false;

  if (keys.w.pressed && lastKey === "w") {
    player.moving = true;
    player.image = player.sprites.up;

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
    player.moving = true;
    player.image = player.sprites.down;

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
    player.moving = true;
    player.image = player.sprites.left;

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
    player.moving = true;
    player.image = player.sprites.right;

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

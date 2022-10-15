import Sprite from "./classes/Sprite.js";
import Boundary from "./classes/Boundary.js";
import { keys, offset, battle, rectangularCollision } from "./helpers.js";
import { collisions } from "./data/collisions.js";
import { battleZonesData } from "./data/battleZones.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

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

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "assets/imgs/battleBackground.png";

//--------------------------------------------------------------

//sprite image constants
//width: 192
//height: 68
const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - (68 / 2 - 16),
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
  image: backgroundImage,
});

const foreground = new Sprite({
  position: offset,
  image: foregroundImage,
});

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
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

//--------------------------------------------------------------
const animate = () => {
  const animationId = requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  //check movement here ensures stopping on battle activation
  let isPlayerColliding = false;
  player.moving = false;

  //battle activation
  if (battle.initiated) return;
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
        battle.initiated = true;

        //deactivate old animation loop - OG game scene
        window.cancelAnimationFrame(animationId);

        //gsap = animation library
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.3,
          onComplete: () => {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.3,
              onComplete: () => {
                //activate new animation loop - battle scene
                animateBattle();

                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.3,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  const animateBattle = () => {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    console.log("animateBattle");
  };

  //player movement
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

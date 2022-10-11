import Sprite from "./classes/Sprite.js";
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

const player = new Sprite({
  position: {
    x: canvas.width / 2 - playerImage.width / 4 / 2,
    y: canvas.height / 2 - playerImage.height / 2,
  },
  image: playerImage,
  frames: { max: 4 },
});

const background = new Sprite({
  position: offset,
  image: image,
});

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor(position) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
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

const testBoundary = new Boundary({ x: 400, y: 400 });

const moveables = [background, testBoundary];
//--------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  background.draw();
  // boundaries.forEach((boundary) => boundary.draw());
  testBoundary.draw();
  player.draw();

  // if (player.position.x + player.width > canvas.width) {
  // }

  if (keys.w.pressed && lastKey === "w") {
    moveables.forEach((moveable) => {
      moveable.position.y += 3;
    });
  } else if (keys.s.pressed && lastKey === "s") {
    moveables.forEach((moveable) => {
      moveable.position.y -= 3;
    });
  } else if (keys.a.pressed && lastKey === "a") {
    moveables.forEach((moveable) => {
      moveable.position.x += 3;
    });
  } else if (keys.d.pressed && lastKey === "d") {
    moveables.forEach((moveable) => {
      moveable.position.x -= 3;
    });
  }
}

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

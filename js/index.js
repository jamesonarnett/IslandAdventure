import Sprite from "./classes/Sprite.js";
import { keys } from "./gameObjects.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const image = new Image();
image.src = "assets/imgs/pelletTown.png";

const playerImage = new Image();
playerImage.src = "assets/imgs/character/playerDown.png";

canvas.width = 1024;
canvas.height = 576;
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: { x: -735, y: -600 },
  image: image,
});

//--------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  background.draw();

  c.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  );

  if (keys.w.pressed && lastKey === "w") {
    background.position.y += 3;
  } else if (keys.s.pressed && lastKey === "s") {
    background.position.y -= 3;
  } else if (keys.a.pressed && lastKey === "a") {
    background.position.x += 3;
  } else if (keys.d.pressed && lastKey === "d") {
    background.position.x -= 3;
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

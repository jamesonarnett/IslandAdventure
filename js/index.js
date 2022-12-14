import { background, foreground, player } from "./sprites.js";
import { keys, battle, rectangularCollision } from "./helpers.js";
import { boundaries, battleZones } from "./boundaries.js";
import { animateBattle, initBattle } from "./battleScene.js";
import { audio } from "./data/audio.js";
import { lastKey } from "./listeners.js";

const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;
const moveables = [background, ...boundaries, ...battleZones];

//--------------------------------------------------------------
export const animate = () => {
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
  player.animate = false;

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
        audio.Map.stop();
        audio.initBattle.play();
        audio.Battle.play();

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
                gsap.set("#isBattleActive", {
                  visibility: "visible",
                  duration: 0.3,
                });
                initBattle();
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

  //player movement
  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
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
    player.animate = true;
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
    player.animate = true;
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
    player.animate = true;
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

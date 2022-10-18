import { battleBackground } from "./sprites.js";
import { battle } from "./helpers.js";
import { animate } from "./index.js";
import { attacks } from "./data/attacks.js";
import Monster from "./classes/Monster.js";
import { monsters } from "./data/monsters.js";
import { audio } from "./data/audio.js";

const canvas = document.querySelector("canvas");

canvas.width = 1024;
canvas.height = 576;

let renderedSprites;
let battleId;
let queue;
let draggle;
let emby;

export const initBattle = () => {
  battle.initiated = true;
  emby = new Monster(monsters.Emby);
  draggle = new Monster(monsters.Draggle);
  renderedSprites = [emby, draggle];
  queue = [];

  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#attacksBox").replaceChildren();

  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerText = attack.name;
    document.querySelector("#attacksBox").append(button);
  });

  //--------------------------------------------------------------
  // attack && dialog button listeners
  // adds attack queue
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];

      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });

      if (draggle.health <= 0.5) {
        queue.push(() => {
          draggle.faint();
        });

        //fade back to black exiting battle
        //continue to animate
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              exitBattle();
            },
          });
        });

        return;
      }
      //enemy attack
      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites,
        });
      });

      if (emby.health <= 0.5) {
        queue.push(() => {
          emby.faint();
        });
        //fade back to black exiting battle
        //continue to animate
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              exitBattle();
            },
          });
        });

        return;
      }
    });

    button.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attackType").innerHTML = selectedAttack.type;
      document.querySelector("#attackType").style.color = selectedAttack.color;
    });
  });
};

const exitBattle = () => {
  document.querySelector("#isBattleActive").style.visibility = "hidden";
  battle.initiated = false;
  gsap.to("#overlappingDiv", {
    opacity: 0,
  });
  gsap.to("#dialogBox", {
    display: "none",
  });
  audio.Battle.stop();
  audio.Map.play();
};

export const animateBattle = () => {
  battleId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });

  if (!battle.initiated) {
    window.cancelAnimationFrame(battleId);
    animate();
  }
};

document.querySelector("#dialogBox").addEventListener("click", (e) => {
  if (queue.length >= 1) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = "none";
  }
});

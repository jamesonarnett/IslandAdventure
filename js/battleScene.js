import { draggle, emby, battleBackground } from "./sprites.js";
import { battle } from "./helpers.js";
import { animate } from "./index.js";
import { attacks } from "./data/attacks.js";

const renderedSprites = [draggle, emby];
//needs to be refactored to add additional attack options
// && scalability
const button = document.createElement("button");
button.innerText = "Tackle";
document.querySelector("#attacksBox").append(button);

export const animateBattle = () => {
  const battleId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });

  if (!battle.initiated) {
    window.cancelAnimationFrame(battleId);
    animate();
  }
};
//--------------------------------------------------------------
// attack && dialog button listeners
// adds attack queue
const queue = [];
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];

    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    });

    queue.push(() => {
      draggle.attack({
        attack: attacks["Tackle"],
        recipient: emby,
        renderedSprites,
      });
    });
  });
});

document.querySelector("#dialogBox").addEventListener("click", (e) => {
  if (queue.length >= 1) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = "none";
  }

  if (emby.health <= 0 || draggle.health <= 0) {
    gsap.to("#isBattleActive", {
      visibility: "hidden",
      duration: 0.3,
    });
    gsap.to("#dialogBox", {
      display: "none",
    });
    battle.initiated = false;
    draggle.health = 100;
  }
});

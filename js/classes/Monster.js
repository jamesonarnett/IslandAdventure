import Sprite from "./Sprite.js";

export default class Monster extends Sprite {
  constructor({
    name,
    isEnemy = false,
    position,
    image,
    frames = { max: 1, hold: 15 },
    sprites = [],
    animate = false,
    rotation = 0,
    attacks,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
    });
    this.health = 100;
    this.name = name;
    this.isEnemy = isEnemy;
    this.attacks = attacks;
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogBox").style.display = "block";
    document.querySelector(
      "#dialogBox"
    ).innerHTML = `${this.name} used ${attack.name}!`;

    this.health -= attack.damage;

    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthBar";

    let rotation = 1;
    if (this.isEnemy) rotation = -2.3;

    switch (attack.name) {
      case "Tackle":
        const timeline = gsap.timeline();

        let moveDistance = 20;
        if (this.isEnemy) moveDistance = -20;

        timeline
          .to(this.position, {
            x: this.position.x - moveDistance,
            duration: 0.3,
          })
          .to(this.position, {
            x: this.position.x + moveDistance * 2,
            duration: 0.05,
            onComplete: () => {
              gsap.to(healthBar, {
                width: this.health + "%",
              });

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 3,
                duration: 0.08,
              });

              gsap.to(recipient, {
                opacity: 0,
                yoyo: true,
                repeat: 3,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
            duration: 0.5,
          });
        break;
      case "Ember":
        const emberImage = new Image();
        emberImage.src = "assets/imgs/attacks/ember.png";
        const ember = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: emberImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation,
        });
        renderedSprites.splice(1, 0, ember);

        gsap.to(ember.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            gsap.to(healthBar, {
              width: this.health + "%",
            });

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 3,
              duration: 0.08,
            });

            gsap.to(recipient, {
              opacity: 0,
              yoyo: true,
              repeat: 3,
              duration: 0.08,
            });

            renderedSprites.splice(1, 1);
          },
        });
        break;
    }
  }
}

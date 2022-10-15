// import { emberImage } from "../images.js";
// import { ember } from "../sprites.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

export default class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 15 },
    sprites = [],
    animate = false,
    isEnemy = false,
  }) {
    this.position = position;
    this.image = image;
    this.animate = animate;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.sprites = sprites;

    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    c.restore();

    if (!this.animate) return;
    if (this.frames.max > 1) {
      this.frames.elapsed++;
      if (this.frames.elapsed % this.frames.hold === 0) {
        this.frames.val < this.frames.max - 1
          ? this.frames.val++
          : (this.frames.val = 0);
      }
    }
  }

  attack({ attack, recipient, renderedSprites }) {
    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthBar";

    this.health -= attack.damage;

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
        emberImage.src = "../assets/imgs/attacks/ember.png";
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
        });
        renderedSprites.push(ember);

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

            renderedSprites.pop();
          },
        });
        break;
    }
  }
}

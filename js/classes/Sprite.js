const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

export default class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 15 },
    sprites = [],
    animate = false,
    rotation = 0,
  }) {
    this.position = position;
    this.image = image;
    this.animate = animate;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
    c.save();

    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

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
}

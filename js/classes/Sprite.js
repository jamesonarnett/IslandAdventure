const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

export default class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 15 },
    sprites = [],
    animate = false,
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.sprites = sprites;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };

    this.animate = animate;
  }

  draw() {
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

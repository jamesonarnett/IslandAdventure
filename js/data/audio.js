export const audio = {
  Map: new Howl({
    src: ["./assets/audio/map.wav"],
    html5: true,
    volume: 0.2,
  }),
  initBattle: new Howl({
    src: ["./assets/audio/initBattle.wav"],
    html5: true,
    volume: 0.1,
  }),
  Battle: new Howl({
    src: ["./assets/audio/battle.mp3"],
    html5: true,
    volume: 0.2,
  }),
  initEmber: new Howl({
    src: ["./assets/audio/initEmber.wav"],
    html5: true,
    volume: 0.2,
  }),
  EmberHit: new Howl({
    src: ["./assets/audio/emberHit.wav"],
    html5: true,
    volume: 0.2,
  }),
  TackleHit: new Howl({
    src: ["./assets/audio/tackleHit.wav"],
    html5: true,
    volume: 0.2,
  }),
  Victory: new Howl({
    src: ["./assets/audio/victory.wav"],
    html5: true,
    volume: 0.2,
  }),
};

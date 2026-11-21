// Taman Senja: bootstrap and the game loop. One job: wire the canvas, the
// world, the renderer, the input and the sound together, run the frames, and
// route every click and key to the right action. With ?shot= in the URL it
// stages one screenshot scene and paints a single frame instead.
import { VIEW_W, VIEW_H } from './config.js';
import { World, SCREEN_TITLE, SCREEN_PLAY, SCREEN_LEVEL_DONE, SCREEN_WIN, SCREEN_OVER } from './world.js';
import { render, HINT_BUTTON, START_BUTTON, NEXT_BUTTON, AGAIN_BUTTON } from './render.js';
import { Input } from './input.js';
import { Sound } from './audio.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW_W;
canvas.height = VIEW_H;

const world = new World();
const sound = new Sound();
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

function inside(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function pressStart() {
  world.startGame();
  sound.ensure();
  sound.click();
}

function pressNext() {
  world.nextLevel();
  sound.click();
}

function pressAgain() {
  world.startGame();
  sound.click();
}

function checkAt(sx, sy) {
  const result = world.clickAt(sx, sy);
  if (result === 'found') {
    sound.found();
    if (world.screen === SCREEN_WIN) sound.win();
    else if (world.screen === SCREEN_LEVEL_DONE) sound.levelDone();
  } else if (result === 'wrong') {
    sound.wrong();
  }
}

const input = new Input(canvas, {
  onPointer(x, y) {
    sound.ensure();
    if (world.screen === SCREEN_TITLE) {
      if (inside(START_BUTTON, x, y)) pressStart();
      return;
    }
    if (world.screen === SCREEN_LEVEL_DONE) {
      if (inside(NEXT_BUTTON, x, y)) pressNext();
      return;
    }
    if (world.screen === SCREEN_WIN || world.screen === SCREEN_OVER) {
      if (inside(AGAIN_BUTTON, x, y)) pressAgain();
      return;
    }
    if (world.screen !== SCREEN_PLAY) return;
    if (inside(HINT_BUTTON, x, y)) {
      if (world.useHint()) sound.hint();
      return;
    }
    const panel = input.panelAt(x, y);
    if (panel) checkAt(panel.sx, panel.sy);
  },
  onReticle(sx, sy) {
    if (world.screen === SCREEN_TITLE) {
      pressStart();
      return;
    }
    if (world.screen === SCREEN_LEVEL_DONE) {
      pressNext();
      return;
    }
    if (world.screen === SCREEN_WIN || world.screen === SCREEN_OVER) {
      pressAgain();
      return;
    }
    if (world.screen === SCREEN_PLAY) checkAt(sx, sy);
  },
  onHint() {
    if (world.screen === SCREEN_PLAY && world.useHint()) sound.hint();
  },
  onNext() {
    if (world.screen === SCREEN_LEVEL_DONE) pressNext();
  },
  onRestart() {
    pressAgain();
  },
  onMute() {
    sound.muted = !sound.muted;
    world.muted = sound.muted;
  },
});

const startedAt = performance.now();
if (shot) {
  // Screenshot mode: one deterministic frame, no timer, no loop.
  stageShot(shot, world);
  render(ctx, world, input, 0);
  window.__shotReady = true;
} else {
  let last = startedAt;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    world.tick(dt);
    render(ctx, world, input, (now - startedAt) / 1000);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

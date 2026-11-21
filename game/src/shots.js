// Taman Senja: the staged scenes behind ?shot=start|play|end. Each one sets
// the real world to a real state — the title screen, a mid-level hunt with
// four differences already found (markers on, four still unfound, counter
// showing 4 left), and the win screen — and the renderer paints it exactly
// as a player would see it. No fake pixels: the frame is the game itself.
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_WIN } from './world.js';

/**
 * Set `world` to the named scene and return nothing; the caller renders one
 * frame. Unknown names stage the title screen.
 */
export function stageShot(name, world) {
  world.resetAll();
  if (name === 'play') {
    world.screen = SCREEN_PLAY;
    world.timeLeft = 73;
    world.score = 400;
    // Four finds spread across the picture: sun, cat, window, butterfly.
    for (const id of [1, 4, 5, 8]) world.found.add(id);
    world.totalFound = 4;
    world.lastFound = { diffId: 8 };
    world.popLeft = 0;
    return;
  }
  if (name === 'end') {
    world.level = 2;
    world.resetLevel();
    world.screen = SCREEN_WIN;
    world.score = 2840;
    world.totalFound = 24;
    for (const diff of world.diffs) world.found.add(diff.id);
    return;
  }
  world.screen = SCREEN_TITLE;
}

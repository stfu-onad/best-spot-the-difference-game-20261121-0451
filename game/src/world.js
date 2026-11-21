// Taman Senja: the game state. One job: the rules — levels, finds, the timer,
// hints and the score — with no drawing and no input handling in it.
import {
  LEVELS,
  POINTS_FIND,
  POINTS_HINT_COST,
  POINTS_WRONG,
  TIME_BONUS_PER_SECOND,
  HINTS_PER_LEVEL,
  HINT_SECONDS,
  WRONG_FLASH_SECONDS,
  FOUND_POP_SECONDS,
} from './config.js';
import { SCENES } from './scene.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_DONE = 'leveldone';
export const SCREEN_WIN = 'win';
export const SCREEN_OVER = 'over';

export class World {
  constructor() {
    this.resetAll();
  }

  resetAll() {
    this.screen = SCREEN_TITLE;
    this.level = 0;
    this.score = 0;
    this.totalFound = 0;
    this.levelBonus = 0;
    this.resetLevel();
  }

  resetLevel() {
    const level = LEVELS[this.level];
    this.timeLeft = level.time;
    this.found = new Set();
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hint = null; // { diffId, left }
    this.wrong = null; // { x, y, side, left }
    this.lastFound = null; // { diffId, left }
    this.popLeft = 0;
    this.wrongClicks = 0;
    this.muted = this.muted ?? false;
  }

  get diffs() {
    return SCENES[this.level].diffs;
  }

  get remaining() {
    return this.diffs.length - this.found.size;
  }

  get levelName() {
    return LEVELS[this.level].name;
  }

  startGame() {
    this.resetAll();
    this.screen = SCREEN_PLAY;
  }

  startLevel() {
    this.resetLevel();
    this.screen = SCREEN_PLAY;
  }

  /** Advance the timer; call once a frame with seconds elapsed. */
  tick(dt) {
    if (this.screen !== SCREEN_PLAY) return;
    this.timeLeft -= dt;
    if (this.hint) {
      this.hint.left -= dt;
      if (this.hint.left <= 0) this.hint = null;
    }
    if (this.wrong) {
      this.wrong.left -= dt;
      if (this.wrong.left <= 0) this.wrong = null;
    }
    if (this.popLeft > 0) this.popLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = SCREEN_OVER;
    }
  }

  /**
   * A click at scene coordinates (x, y) on either panel. Returns 'found',
   * 'already', or 'wrong'. A find scores on both panels at once: the marker
   * is drawn on the left and the right picture.
   */
  clickAt(x, y) {
    if (this.screen !== SCREEN_PLAY) return 'idle';
    const hit = (diff) => {
      const dx = x - diff.x;
      const dy = y - diff.y;
      return dx * dx + dy * dy <= diff.r * diff.r;
    };
    // Unfound differences first: a click on an overlap must still find the
    // one that is still hidden, even when it also touches a found marker.
    for (const diff of this.diffs) {
      if (this.found.has(diff.id) || !hit(diff)) continue;
      this.found.add(diff.id);
      this.totalFound += 1;
      this.score += POINTS_FIND;
      this.lastFound = { diffId: diff.id };
      this.popLeft = FOUND_POP_SECONDS;
      if (this.hint && this.hint.diffId === diff.id) this.hint = null;
      if (this.found.size === this.diffs.length) this.completeLevel();
      return 'found';
    }
    for (const diff of this.diffs) {
      if (hit(diff)) return 'already';
    }
    this.wrong = { x, y, left: WRONG_FLASH_SECONDS };
    this.wrongClicks += 1;
    this.score = Math.max(0, this.score - POINTS_WRONG);
    return 'wrong';
  }

  /** Spend a hint: reveal one difference that is still unfound. */
  useHint() {
    if (this.screen !== SCREEN_PLAY) return null;
    if (this.hintsLeft <= 0 || this.hint) return null;
    const open = this.diffs.filter((d) => !this.found.has(d.id));
    if (open.length === 0) return null;
    const diff = open[Math.floor(Math.random() * open.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - POINTS_HINT_COST);
    this.hint = { diffId: diff.id, left: HINT_SECONDS };
    return diff;
  }

  completeLevel() {
    this.levelBonus = Math.round(this.timeLeft) * TIME_BONUS_PER_SECOND;
    this.score += this.levelBonus;
    if (this.level + 1 >= LEVELS.length) {
      this.screen = SCREEN_WIN;
    } else {
      this.screen = SCREEN_LEVEL_DONE;
    }
  }

  nextLevel() {
    if (this.screen !== SCREEN_LEVEL_DONE) return;
    this.level += 1;
    this.startLevel();
  }
}

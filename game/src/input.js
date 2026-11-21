// Taman Senja: mouse and keyboard input. One job: turn pointer and key
// events into game actions, and keep the keyboard reticle (a crosshair the
// arrow keys move across both panels, Enter to check) in one place.
import { VIEW_W, VIEW_H, PANEL_W, PANEL_H, PANEL_Y, LEFT_X, RIGHT_X } from './config.js';

export class Input {
  constructor(canvas, hooks) {
    this.canvas = canvas;
    this.hooks = hooks;
    this.reticle = { x: PANEL_W / 2, y: PANEL_H / 2, visible: false };
    this.mouse = { x: 0, y: 0, inside: false };
    canvas.addEventListener('pointermove', (e) => this.onMove(e));
    canvas.addEventListener('pointerdown', (e) => this.onDown(e));
    window.addEventListener('keydown', (e) => this.onKey(e));
  }

  /** Convert a pointer event to logical canvas coordinates. */
  toLogical(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * VIEW_W,
      y: ((e.clientY - rect.top) / rect.height) * VIEW_H,
    };
  }

  /** Which panel, if any, holds logical point (x, y); also scene coords. */
  panelAt(x, y) {
    if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
    if (x >= LEFT_X && x <= LEFT_X + PANEL_W) return { side: 'L', sx: x - LEFT_X, sy: y - PANEL_Y };
    if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) return { side: 'R', sx: x - RIGHT_X, sy: y - PANEL_Y };
    return null;
  }

  onMove(e) {
    const p = this.toLogical(e);
    this.mouse = { x: p.x, y: p.y, inside: true };
  }

  onDown(e) {
    const p = this.toLogical(e);
    this.hooks.onPointer(p.x, p.y);
  }

  onKey(e) {
    const step = e.shiftKey ? 6 : 18;
    const r = this.reticle;
    switch (e.key) {
      case 'ArrowLeft':
        r.x = Math.max(0, r.x - step);
        r.visible = true;
        e.preventDefault();
        break;
      case 'ArrowRight':
        r.x = Math.min(PANEL_W, r.x + step);
        r.visible = true;
        e.preventDefault();
        break;
      case 'ArrowUp':
        r.y = Math.max(0, r.y - step);
        r.visible = true;
        e.preventDefault();
        break;
      case 'ArrowDown':
        r.y = Math.min(PANEL_H, r.y + step);
        r.visible = true;
        e.preventDefault();
        break;
      case 'Enter':
      case ' ':
        r.visible = true;
        this.hooks.onReticle(r.x, r.y);
        e.preventDefault();
        break;
      case 'h':
      case 'H':
        this.hooks.onHint();
        break;
      case 'n':
      case 'N':
        this.hooks.onNext();
        break;
      case 'r':
      case 'R':
        this.hooks.onRestart();
        break;
      case 'm':
      case 'M':
        this.hooks.onMute();
        break;
      default:
        break;
    }
  }
}

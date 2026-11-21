// Taman Senja: the three scenes, drawn entirely in code. Every picture is a
// base scene that is identical on both panels, plus eight differences: small
// elements whose draw function paints one version on the left panel and
// another on the right. Nothing here loads a file; every pixel is procedural.
import { PANEL_W, PANEL_H } from './config.js';
import { mulberry32, range } from './random.js';

/* ---- tiny drawing helpers (panel-local coordinates) ---- */
function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}
function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}
function star(ctx, x, y, r, fill, points = 5) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}
function cloud(ctx, x, y, s, fill = 'rgba(255,244,230,0.92)') {
  ellipse(ctx, x, y, 34 * s, 15 * s, fill);
  ellipse(ctx, x - 22 * s, y + 5 * s, 22 * s, 11 * s, fill);
  ellipse(ctx, x + 24 * s, y + 5 * s, 24 * s, 12 * s, fill);
}
function bird(ctx, x, y, stroke = '#2c2340') {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9, y);
  ctx.quadraticCurveTo(x - 4, y - 7, x, y);
  ctx.quadraticCurveTo(x + 4, y - 7, x + 9, y);
  ctx.stroke();
}
function flower(ctx, x, y, petal, centre = '#ffd94d') {
  for (let i = 0; i < 5; i += 1) {
    const a = (i * Math.PI * 2) / 5;
    circle(ctx, x + Math.cos(a) * 5, y + Math.sin(a) * 5, 4.5, petal);
  }
  circle(ctx, x, y, 4, centre);
}
function cat(ctx, x, y, s, coat, tailUp) {
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.ellipse(x, y, 16 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 11 * s, y - 12 * s, 9 * s, 0, Math.PI * 2);
  ctx.fill();
  poly(ctx, [[x + 4 * s, y - 18 * s], [x + 7 * s, y - 27 * s], [x + 11 * s, y - 19 * s]], coat);
  poly(ctx, [[x + 12 * s, y - 19 * s], [x + 16 * s, y - 27 * s], [x + 19 * s, y - 18 * s]], coat);
  ctx.strokeStyle = coat;
  ctx.lineWidth = 4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (tailUp) {
    ctx.moveTo(x - 15 * s, y + 2 * s);
    ctx.quadraticCurveTo(x - 26 * s, y - 2 * s, x - 24 * s, y - 16 * s);
  } else {
    ctx.moveTo(x - 15 * s, y + 6 * s);
    ctx.quadraticCurveTo(x - 26 * s, y + 10 * s, x - 30 * s, y + 2 * s);
  }
  ctx.stroke();
}

/* ---- LEVEL 1: Taman Senja (dusk garden) ---- */
function gardenBase(ctx, rng) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#3b2d5e');
  sky.addColorStop(0.55, '#c65b7c');
  sky.addColorStop(1, '#ffb347');
  rect(ctx, 0, 0, PANEL_W, 300, sky);
  ellipse(ctx, 90, 330, 330, 90, '#5c4a7a');
  ellipse(ctx, 470, 340, 320, 95, '#6b5570');
  rect(ctx, 0, 300, PANEL_W, PANEL_H - 300, '#4e7a45');
  // pond
  ellipse(ctx, 420, 362, 112, 34, '#7ec8e3');
  ellipse(ctx, 420, 358, 100, 28, '#a5dcf0');
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2;
  for (const [wx, wy, wr] of [[390, 358, 26], [440, 366, 30], [410, 372, 20]]) {
    ctx.beginPath();
    ctx.arc(wx, wy, wr, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  // path from the house door
  poly(ctx, [[128, 330], [156, 330], [168, 420], [112, 420]], '#d9b380');
  // house
  rect(ctx, 70, 210, 140, 122, '#f7e8c9');
  poly(ctx, [[58, 212], [140, 158], [222, 212]], '#b5502e');
  rect(ctx, 128, 268, 26, 64, '#7a4a2b');
  circle(ctx, 146, 300, 3, '#ffd94d');
  rect(ctx, 82, 226, 30, 30, '#8fb8d8');
  // trees
  rect(ctx, 34, 268, 12, 62, '#6b4a2f');
  circle(ctx, 40, 252, 26, '#3f7d4e');
  circle(ctx, 22, 268, 18, '#4c8f5c');
  circle(ctx, 58, 268, 18, '#35703f');
  rect(ctx, 512, 258, 11, 58, '#6b4a2f');
  circle(ctx, 517, 244, 22, '#3f7d4e');
  circle(ctx, 500, 258, 15, '#4c8f5c');
  // flowers along the bottom, skipping the one that differs
  const petals = ['#ff6b81', '#ff9a3c', '#c77dff', '#ff6b81', '#ff9a3c', '#c77dff'];
  [60, 105, 150, 195, 305, 350].forEach((fx, i) => flower(ctx, fx, 402, petals[i]));
  // one bird that is always there
  bird(ctx, 180, 108);
}
const gardenDiffs = [
  { id: 1, x: 468, y: 78, r: 34, label: 'warna matahari', draw(ctx, side) {
    circle(ctx, 468, 78, 34, side === 'L' ? '#ffd94d' : '#ff8c42');
    if (side === 'L') {
      ctx.strokeStyle = 'rgba(255,217,77,0.85)';
      ctx.lineWidth = 4;
      for (let i = 0; i < 8; i += 1) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(468 + Math.cos(a) * 42, 78 + Math.sin(a) * 42);
        ctx.lineTo(468 + Math.cos(a) * 52, 78 + Math.sin(a) * 52);
        ctx.stroke();
      }
    }
  } },
  { id: 2, x: 330, y: 90, r: 22, label: 'burung di langit', draw(ctx, side) {
    if (side === 'L') bird(ctx, 330, 90);
  } },
  { id: 3, x: 250, y: 402, r: 20, label: 'warna bunga', draw(ctx, side) {
    flower(ctx, 250, 402, side === 'L' ? '#ff4757' : '#8e44ad');
  } },
  { id: 4, x: 232, y: 322, r: 30, label: 'ekor kucing', draw(ctx, side) {
    cat(ctx, 232, 322, 1, '#3a3230', side === 'L');
  } },
  { id: 5, x: 193, y: 241, r: 22, label: 'jendela menyala', draw(ctx, side) {
    rect(ctx, 178, 226, 30, 30, side === 'L' ? '#ffe08a' : '#4a3a5e');
    if (side === 'L') {
      ctx.strokeStyle = 'rgba(255,224,138,0.9)';
      ctx.lineWidth = 3;
      ctx.strokeRect(176, 224, 34, 34);
    }
  } },
  { id: 6, x: 330, y: 372, r: 22, label: 'batu di kolam', draw(ctx, side) {
    if (side === 'R') {
      ellipse(ctx, 330, 372, 18, 11, '#8d8d9e');
      ellipse(ctx, 322, 366, 8, 5, '#a9a9bd');
    }
  } },
  { id: 7, x: 300, y: 50, r: 30, label: 'bentuk awan', draw(ctx, side) {
    cloud(ctx, 300, 50, 1);
    if (side === 'R') ellipse(ctx, 300, 38, 16, 10, 'rgba(255,244,230,0.92)');
  } },
  { id: 8, x: 300, y: 380, r: 22, label: 'kupu-kupu', draw(ctx, side) {
    if (side === 'L') {
      ellipse(ctx, 293, 380, 8, 11, '#ff9ff3');
      ellipse(ctx, 307, 380, 8, 11, '#ff9ff3');
      ctx.strokeStyle = '#2c2340';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, 372);
      ctx.lineTo(300, 390);
      ctx.stroke();
    }
  } },
];

/* ---- LEVEL 2: Pantai Senja (dusk beach) ---- */
function beachBase(ctx, rng) {
  const sky = ctx.createLinearGradient(0, 0, 0, 190);
  sky.addColorStop(0, '#2e3a67');
  sky.addColorStop(0.6, '#ff9a5c');
  sky.addColorStop(1, '#ffd194');
  rect(ctx, 0, 0, PANEL_W, 190, sky);
  circle(ctx, 280, 150, 30, '#ffe9a8');
  circle(ctx, 280, 150, 44, 'rgba(255,233,168,0.25)');
  const sea = ctx.createLinearGradient(0, 190, 0, 300);
  sea.addColorStop(0, '#3d7ea6');
  sea.addColorStop(1, '#2a5a7d');
  rect(ctx, 0, 190, PANEL_W, 110, sea);
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = 2.5;
  for (const [wx, wy, wr] of [[90, 222, 40], [300, 240, 52], [470, 222, 38], [180, 272, 46], [400, 280, 44]]) {
    ctx.beginPath();
    ctx.arc(wx, wy, wr, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  rect(ctx, 0, 300, PANEL_W, 120, '#f2d8a0');
  const speck = mulberry32(7);
  for (let i = 0; i < 40; i += 1) circle(ctx, range(speck, 8, 552), range(speck, 308, 412), 1.6, 'rgba(190,150,90,0.7)');
  // boat hull and mast (the sail differs)
  poly(ctx, [[86, 218], [168, 218], [152, 236], [102, 236]], '#8a5a3b');
  rect(ctx, 126, 168, 5, 52, '#6b4a2f');
  // palm tree
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(498, 330);
  ctx.quadraticCurveTo(505, 280, 492, 246);
  ctx.stroke();
  ctx.strokeStyle = '#2f7d3f';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (const [dx, dy] of [[-38, -8], [-26, -26], [0, -32], [28, -24], [40, -4]]) {
    ctx.beginPath();
    ctx.moveTo(492, 246);
    ctx.quadraticCurveTo(492 + dx * 0.6, 246 + dy - 8, 492 + dx, 246 + dy);
    ctx.stroke();
  }
  // umbrella pole and canopy (stripes differ)
  rect(ctx, 368, 300, 5, 62, '#6b4a2f');
  // crab body and legs (one claw differs)
  ellipse(ctx, 200, 366, 20, 13, '#e2603f');
  ctx.strokeStyle = '#e2603f';
  ctx.lineWidth = 3;
  for (const s of [-1, 1]) for (let l = 0; l < 3; l += 1) {
    ctx.beginPath();
    ctx.moveTo(200 + s * 14, 366 - 4 + l * 4);
    ctx.lineTo(200 + s * 30, 362 - 4 + l * 6);
    ctx.stroke();
  }
  circle(ctx, 193, 356, 2.5, '#2c2340');
  circle(ctx, 207, 356, 2.5, '#2c2340');
  // two starfish that are always there
  star(ctx, 300, 386, 13, '#ff9a3c');
  star(ctx, 440, 392, 11, '#ff9a3c');
  // gulls that are always there
  bird(ctx, 150, 80);
  bird(ctx, 220, 60);
}
const beachDiffs = [
  { id: 1, x: 128, y: 192, r: 30, label: 'warna layar perahu', draw(ctx, side) {
    poly(ctx, [[131, 172], [131, 214], [168, 214]], side === 'L' ? '#e74c3c' : '#3d7ea6');
  } },
  { id: 2, x: 90, y: 396, r: 20, label: 'bintang laut ketiga', draw(ctx, side) {
    if (side === 'R') star(ctx, 90, 396, 12, '#ff9a3c');
  } },
  { id: 3, x: 492, y: 232, r: 22, label: 'kelapa di palem', draw(ctx, side) {
    if (side === 'L') {
      circle(ctx, 484, 250, 7, '#6b4a2f');
      circle(ctx, 500, 252, 7, '#6b4a2f');
    }
  } },
  { id: 4, x: 176, y: 352, r: 22, label: 'capit kepiting', draw(ctx, side) {
    ctx.strokeStyle = '#e2603f';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(182, 360);
    if (side === 'L') ctx.quadraticCurveTo(172, 348, 176, 336);
    else ctx.quadraticCurveTo(170, 368, 176, 376);
    ctx.stroke();
    circle(ctx, side === 'L' ? 176 : 176, side === 'L' ? 334 : 378, 5, '#e2603f');
  } },
  { id: 5, x: 370, y: 296, r: 32, label: 'corak payung', draw(ctx, side) {
    const cols = side === 'L' ? ['#e74c3c', '#fff6e8'] : ['#2a9d8f', '#fff6e8'];
    ctx.beginPath();
    ctx.moveTo(318, 302);
    ctx.quadraticCurveTo(370, 258, 422, 302);
    ctx.closePath();
    ctx.fillStyle = cols[0];
    ctx.fill();
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(318 + i * 35, 302);
      ctx.quadraticCurveTo(336 + i * 30, 272, 352 + i * 24, 300);
      ctx.lineTo(352 + i * 24, 302);
      ctx.closePath();
      ctx.fillStyle = cols[1];
      ctx.fill();
    }
  } },
  { id: 6, x: 250, y: 256, r: 26, label: 'ombak tambahan', draw(ctx, side) {
    if (side === 'R') {
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(250, 256, 34, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }
  } },
  { id: 7, x: 150, y: 400, r: 20, label: 'kerang di pasir', draw(ctx, side) {
    if (side === 'L') {
      ellipse(ctx, 150, 400, 12, 8, '#fff6e8');
      ctx.strokeStyle = '#d9a06b';
      ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(150 + i * 5, 393);
        ctx.lineTo(150 + i * 5, 406);
        ctx.stroke();
      }
    }
  } },
  { id: 8, x: 400, y: 90, r: 22, label: 'burung camar', draw(ctx, side) {
    if (side === 'L') bird(ctx, 400, 90);
  } },
];

/* ---- LEVEL 3: Pasar Malam (night market) ---- */
function marketBase(ctx, rng) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#141b3a');
  sky.addColorStop(1, '#2c3e6b');
  rect(ctx, 0, 0, PANEL_W, 260, sky);
  const stars = mulberry32(99);
  for (let i = 0; i < 22; i += 1) {
    const sx = range(stars, 10, 550);
    const sy = range(stars, 12, 120);
    if (Math.abs(sx - 480) < 14 && Math.abs(sy - 60) < 14) continue;
    circle(ctx, sx, sy, range(stars, 1, 2.2), 'rgba(255,255,255,0.9)');
  }
  rect(ctx, 0, 260, PANEL_W, 160, '#241a2e');
  // stall 1 (left): counter, roof, sign board (the sign differs)
  rect(ctx, 40, 300, 190, 60, '#8a5a3b');
  rect(ctx, 40, 292, 190, 10, '#6b4226');
  poly(ctx, [[28, 300], [242, 300], [228, 252], [42, 252]], '#b5502e');
  rect(ctx, 96, 258, 78, 30, '#fff6e8');
  // stall 2 (right): counter, awning, hanging lanterns (one differs)
  rect(ctx, 320, 306, 200, 54, '#3d6b5e');
  rect(ctx, 320, 298, 200, 10, '#2a4a42');
  poly(ctx, [[308, 306], [532, 306], [518, 262], [322, 262]], '#2a9d8f');
  // lanterns on stall 2
  for (const lx of [350, 420, 490]) {
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx, 306);
    ctx.lineTo(lx, 318);
    ctx.stroke();
  }
  circle(ctx, 350, 330, 11, '#ff9a3c');
  circle(ctx, 490, 330, 11, '#ff9a3c');
  // food cart in the middle
  rect(ctx, 246, 330, 76, 42, '#7a4a8f');
  rect(ctx, 246, 322, 76, 10, '#5e3870');
  circle(ctx, 262, 340, 5, '#ffd94d');
  circle(ctx, 306, 340, 5, '#ffd94d');
  // basket of fruit on the ground
  ellipse(ctx, 250, 392, 22, 10, '#8a5a3b');
  // string lights across the top
  ctx.strokeStyle = '#3a2f4a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 36);
  ctx.quadraticCurveTo(280, 66, 560, 30);
  ctx.stroke();
  for (let i = 0; i < 9; i += 1) {
    const t = i / 8;
    const bx = t * 560;
    const by = 36 + (66 - 36) * 2 * t * (1 - t) * 1.9 + (30 - 36) * t * t;
    if (Math.abs(bx - 280) < 20) continue;
    circle(ctx, bx, by + 8, 5, ['#ffd94d', '#ff9a3c', '#7ed957', '#7ec8ff'][i % 4]);
  }
}
const marketDiffs = [
  { id: 1, x: 420, y: 330, r: 22, label: 'warna lampion', draw(ctx, side) {
    circle(ctx, 420, 330, 11, side === 'L' ? '#ff9a3c' : '#7ed957');
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(420, 320);
    ctx.lineTo(420, 340);
    ctx.stroke();
  } },
  { id: 2, x: 135, y: 273, r: 22, label: 'gambar papan warung', draw(ctx, side) {
    if (side === 'L') star(ctx, 135, 273, 10, '#e74c3c');
    else circle(ctx, 135, 273, 9, '#2a9d8f');
  } },
  { id: 3, x: 280, y: 58, r: 20, label: 'lampu gantung mati', draw(ctx, side) {
    circle(ctx, 280, 58, 5, side === 'L' ? '#ffd94d' : '#3a3348');
  } },
  { id: 4, x: 130, y: 238, r: 26, label: 'kucing di atap', draw(ctx, side) {
    if (side === 'L') cat(ctx, 130, 240, 0.85, '#2c2340', true);
  } },
  { id: 5, x: 470, y: 70, r: 30, label: 'bentuk bulan', draw(ctx, side) {
    if (side === 'L') {
      circle(ctx, 470, 70, 28, '#f5e9c8');
      circle(ctx, 460, 62, 5, '#d9c9a0');
      circle(ctx, 478, 78, 4, '#d9c9a0');
      circle(ctx, 474, 58, 3, '#d9c9a0');
    } else {
      circle(ctx, 470, 70, 28, '#f5e9c8');
      circle(ctx, 482, 64, 26, '#2c3e6b');
    }
  } },
  { id: 6, x: 284, y: 380, r: 24, label: 'roda gerobak', draw(ctx, side) {
    circle(ctx, 262, 380, 8, '#2c2340');
    if (side === 'L') circle(ctx, 306, 380, 8, '#2c2340');
  } },
  { id: 7, x: 250, y: 382, r: 22, label: 'isi keranjang', draw(ctx, side) {
    const col = side === 'L' ? '#ff9a3c' : '#7ed957';
    circle(ctx, 240, 382, 6, col);
    circle(ctx, 252, 378, 6, col);
    circle(ctx, 262, 383, 6, col);
  } },
  { id: 8, x: 480, y: 60, r: 20, label: 'bintang di langit', draw(ctx, side) {
    if (side === 'L') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(480, 60, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(480, 52);
      ctx.lineTo(480, 68);
      ctx.moveTo(472, 60);
      ctx.lineTo(488, 60);
      ctx.stroke();
    }
  } },
];

/** The three levels: base painter, differences, and the seed that fixes them. */
export const SCENES = [
  { base: gardenBase, diffs: gardenDiffs },
  { base: beachBase, diffs: beachDiffs },
  { base: marketBase, diffs: marketDiffs },
];

/**
 * Paint one panel of a level: the base scene, then that side's version of
 * every difference. `side` is 'L' or 'R'; (ox, oy) is the panel's top-left
 * corner on the destination canvas.
 */
export function drawScene(ctx, levelIndex, side, ox, oy) {
  const scene = SCENES[levelIndex];
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, oy, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(ox, oy);
  const rng = mulberry32(levelIndex * 1000 + 7);
  scene.base(ctx, rng);
  for (const diff of scene.diffs) diff.draw(ctx, side);
  ctx.restore();
}

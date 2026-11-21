// STARLIGHT STATION — panel renderer: draws one scene twin per canvas and
// paints gold rings + green checks on every difference already found.
import { SCENE_W, SCENE_H } from './scenes.js';

export function drawPanel(canvas, scene, changed, found, hintIndex, hintPulse) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  scene.draw(ctx, changed);
  // found markers: gold ring + green check, mirrored on both panels
  found.forEach((i) => {
    const d = scene.diffs[i];
    ring(ctx, d.x, d.y, d.r + 6, '#f5b301');
    check(ctx, d.x + d.r * 0.45, d.y - d.r * 0.55);
  });
  // hint pulse on the hinted difference
  if (hintIndex !== null && hintIndex !== undefined) {
    const d = scene.diffs[hintIndex];
    const p = 1 + 0.18 * Math.sin(hintPulse);
    ring(ctx, d.x, d.y, (d.r + 10) * p, '#37c8e8');
    ring(ctx, d.x, d.y, (d.r + 16) * p, 'rgba(55,200,232,0.45)');
  }
}

export function ring(ctx, x, y, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r - 3, 0, Math.PI * 2);
  ctx.stroke();
}

export function check(ctx, x, y) {
  ctx.fillStyle = '#2fd67a';
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x - 1.5, y + 4);
  ctx.lineTo(x + 5.5, y - 4.5);
  ctx.stroke();
}

export function drawCrosshair(canvas, x, y) {
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#ffd34d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 20, y); ctx.lineTo(x - 8, y);
  ctx.moveTo(x + 8, y); ctx.lineTo(x + 20, y);
  ctx.moveTo(x, y - 20); ctx.lineTo(x, y - 8);
  ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 20);
  ctx.stroke();
}

// STARLIGHT STATION — procedural scene art (canvas 2D, no external assets).
// Every scene is drawn twice: the original (changed=false) and the changed
// twin (changed=true). Each difference is one fair shift: removed, recoloured,
// moved, resized, flipped or added. Scene space is 640 x 400.

export const SCENE_W = 640;
export const SCENE_H = 400;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

export function stars(ctx, seed, n, x0, y0, x1, y1, color) {
  const rand = rng(seed);
  ctx.fillStyle = color || '#ffffff';
  for (let i = 0; i < n; i++) {
    const x = x0 + rand() * (x1 - x0);
    const y = y0 + rand() * (y1 - y0);
    const r = 0.8 + rand() * 1.8;
    circle(ctx, x, y, r);
    ctx.fill();
  }
}

export function wall(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, SCENE_H);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);
}

export function floorStrip(ctx, y, h, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, SCENE_W, 0);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, y, SCENE_W, h);
}

// ---------------------------------------------------------------- scene 1
function drawCommandDeck(ctx, ch) {
  wall(ctx, '#262f5c', '#161c3c');
  // floor
  ctx.fillStyle = '#2a3358';
  ctx.fillRect(0, 318, SCENE_W, 82);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= SCENE_W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 318); ctx.lineTo(x - 24, 400); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(0, 352); ctx.lineTo(SCENE_W, 352); ctx.stroke();
  // floor light strip — diff 7: recoloured cyan -> magenta
  ctx.fillStyle = ch ? '#e83e8c' : '#37c8e8';
  ctx.fillRect(0, 330, SCENE_W, 5);
  // ceiling lamp — diff 8: removed in changed
  if (!ch) {
    ctx.strokeStyle = '#8a93b8'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(320, 0); ctx.lineTo(320, 18); ctx.stroke();
    ctx.fillStyle = '#ffd34d';
    rr(ctx, 296, 18, 48, 12, 6); ctx.fill();
  }
  // viewport window
  ctx.fillStyle = '#0a0e22';
  rr(ctx, 148, 16, 344, 152, 14); ctx.fill();
  ctx.strokeStyle = '#4a5588'; ctx.lineWidth = 4;
  rr(ctx, 148, 16, 344, 152, 14); ctx.stroke();
  const sky = ctx.createLinearGradient(0, 16, 0, 168);
  sky.addColorStop(0, '#04081a'); sky.addColorStop(1, '#0e2a55');
  ctx.fillStyle = sky;
  rr(ctx, 156, 24, 328, 136, 10); ctx.fill();
  ctx.save();
  rr(ctx, 156, 24, 328, 136, 10); ctx.clip();
  stars(ctx, 11, 42, 156, 24, 484, 160, '#ffffff');
  // star cluster — diff 2: recoloured white -> gold
  ctx.fillStyle = ch ? '#ffd34d' : '#ffffff';
  circle(ctx, 200, 52, 2.2); ctx.fill();
  circle(ctx, 212, 46, 1.8); ctx.fill();
  circle(ctx, 206, 62, 2.0); ctx.fill();
  // planet — diff 1: removed in changed
  if (!ch) {
    ctx.fillStyle = '#e8823a';
    circle(ctx, 430, 82, 26); ctx.fill();
    ctx.fillStyle = '#c96a28';
    circle(ctx, 422, 74, 7); ctx.fill();
    circle(ctx, 438, 90, 5); ctx.fill();
    ctx.strokeStyle = 'rgba(255,211,77,0.8)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(430, 82, 36, 9, -0.35, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = '#c9d4f2';
  circle(ctx, 250, 130, 12); ctx.fill();
  ctx.restore();
  // wall poster — diff 5: arrow flipped
  ctx.fillStyle = '#f2c94c';
  rr(ctx, 58, 58, 72, 54, 6); ctx.fill();
  ctx.fillStyle = '#1c2450';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('DOCK', 74, 76);
  ctx.strokeStyle = '#1c2450'; ctx.lineWidth = 3;
  ctx.beginPath();
  if (!ch) { ctx.moveTo(70, 98); ctx.lineTo(112, 98); ctx.moveTo(102, 90); ctx.lineTo(114, 98); ctx.lineTo(102, 106); }
  else { ctx.moveTo(118, 98); ctx.lineTo(76, 98); ctx.moveTo(86, 90); ctx.lineTo(74, 98); ctx.lineTo(86, 106); }
  ctx.stroke();
  // left console + screen — diff 3: screen moved down in changed
  ctx.fillStyle = '#1c2450';
  rr(ctx, 28, 228, 184, 92, 10); ctx.fill();
  ctx.strokeStyle = '#3a467a'; ctx.lineWidth = 2;
  rr(ctx, 28, 228, 184, 92, 10); ctx.stroke();
  const sy = ch ? 258 : 240;
  ctx.fillStyle = '#12283f';
  rr(ctx, 42, sy, 156, 52, 6); ctx.fill();
  ctx.fillStyle = '#37c8e8';
  for (let i = 0; i < 4; i++) ctx.fillRect(52 + i * 36, sy + 34 - i * 6, 26, 6 + i * 6);
  ctx.fillStyle = '#2fd67a';
  circle(ctx, 190, sy + 12, 4); ctx.fill();
  // mug on left console — diff 4: resized (bigger in changed)
  const mr = ch ? 13 : 8;
  ctx.fillStyle = '#ff5a5a';
  rr(ctx, 62 - mr, 206 - mr, mr * 2, mr * 2 + 4, 3); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(62 - mr, 206 - mr, mr * 2, 4);
  // captain chair
  ctx.fillStyle = '#3d4a7a';
  rr(ctx, 292, 238, 56, 66, 10); ctx.fill();
  ctx.fillStyle = '#55619b';
  rr(ctx, 282, 296, 76, 16, 8); ctx.fill();
  ctx.fillStyle = '#f5b301';
  circle(ctx, 320, 252, 5); ctx.fill();
  // right console + radar — diff 9: blip added in changed; diff 6: antenna added
  ctx.fillStyle = '#1c2450';
  rr(ctx, 428, 228, 184, 92, 10); ctx.fill();
  ctx.strokeStyle = '#3a467a'; ctx.lineWidth = 2;
  rr(ctx, 428, 228, 184, 92, 10); ctx.stroke();
  ctx.fillStyle = '#0d1f33';
  circle(ctx, 520, 272, 26); ctx.fill();
  ctx.strokeStyle = '#2fd67a'; ctx.lineWidth = 2;
  circle(ctx, 520, 272, 26); ctx.stroke();
  circle(ctx, 520, 272, 13); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(520, 272); ctx.lineTo(538, 256); ctx.stroke();
  ctx.fillStyle = '#2fd67a';
  circle(ctx, 520, 272, 3); ctx.fill();
  if (ch) { circle(ctx, 530, 260, 4); ctx.fill(); }
  if (ch) {
    ctx.strokeStyle = '#8a93b8'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(560, 228); ctx.lineTo(560, 206); ctx.stroke();
    ctx.fillStyle = '#ff4d5e';
    circle(ctx, 560, 202, 5); ctx.fill();
  }
  ctx.fillStyle = '#ffd34d';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('NAV', 446, 252);
  ctx.fillStyle = '#9aa7d6';
  ctx.fillRect(446, 260, 60, 4); ctx.fillRect(446, 270, 44, 4);
}

export const SCENES = [
  {
    name: 'Command Deck', par: '2:00',
    draw: drawCommandDeck,
    diffs: [
      { x: 430, y: 82, r: 28, kind: 'removed', label: 'planet vanished' },
      { x: 205, y: 54, r: 20, kind: 'recoloured', label: 'stars turned gold' },
      { x: 120, y: 266, r: 24, kind: 'moved', label: 'screen slid down' },
      { x: 62, y: 206, r: 16, kind: 'resized', label: 'mug grew bigger' },
      { x: 95, y: 88, r: 22, kind: 'flipped', label: 'poster arrow flipped' },
      { x: 560, y: 210, r: 14, kind: 'added', label: 'antenna appeared' },
      { x: 320, y: 332, r: 20, kind: 'recoloured', label: 'floor strip turned pink' },
      { x: 320, y: 28, r: 20, kind: 'removed', label: 'ceiling lamp gone' },
      { x: 528, y: 262, r: 14, kind: 'added', label: 'radar blip appeared' },
    ],
  },
];

// ---------------------------------------------------------------- scene 2
function drawHydroponics(ctx, ch) {
  wall(ctx, '#14301f', '#0c1f14');
  // grow lamps — diff 7: glow recoloured purple -> orange
  for (const lx of [90, 320, 550]) {
    ctx.fillStyle = ch ? 'rgba(255,150,60,0.35)' : 'rgba(180,110,255,0.35)';
    ctx.beginPath(); ctx.moveTo(lx - 55, 0); ctx.lineTo(lx + 55, 0); ctx.lineTo(lx + 30, 90); ctx.lineTo(lx - 30, 90); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2a2f4a';
    rr(ctx, lx - 46, 0, 92, 12, 4); ctx.fill();
    ctx.fillStyle = ch ? '#ff9a3c' : '#b46eff';
    for (let i = 0; i < 5; i++) { circle(ctx, lx - 32 + i * 16, 7, 3); ctx.fill(); }
  }
  // shelves with plants
  const shelfY = [120, 210, 300];
  for (let s = 0; s < 3; s++) {
    ctx.fillStyle = '#3a2f22';
    ctx.fillRect(20, shelfY[s] + 52, 440, 10);
    for (let p = 0; p < 5; p++) {
      const px = 52 + p * 86;
      const py = shelfY[s] + 52;
      // plant removed — diff 2 (row 2, plant 3)
      if (s === 1 && p === 2 && ch) continue;
      ctx.fillStyle = '#7a4a21';
      rr(ctx, px - 14, py - 16, 28, 18, 3); ctx.fill();
      ctx.strokeStyle = '#2fd67a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(px, py - 16); ctx.lineTo(px, py - 40); ctx.stroke();
      ctx.fillStyle = '#37b24d';
      circle(ctx, px - 10, py - 38, 9); ctx.fill();
      circle(ctx, px + 10, py - 42, 10); ctx.fill();
      circle(ctx, px, py - 48, 8); ctx.fill();
      // tomato — diff 1: recoloured red -> gold (row 1, plant 1)
      if (s === 0 && p === 1) {
        ctx.fillStyle = ch ? '#ffd34d' : '#ff4d5e';
        circle(ctx, px + 12, py - 26, 7); ctx.fill();
      }
      // leaf flipped — diff 5 (row 2, plant 4)
      if (s === 1 && p === 3) {
        ctx.fillStyle = '#2fd67a';
        ctx.beginPath();
        if (!ch) { ctx.ellipse(px - 16, py - 30, 10, 5, -0.6, 0, Math.PI * 2); }
        else { ctx.ellipse(px + 16, py - 30, 10, 5, 0.6, 0, Math.PI * 2); }
        ctx.fill();
      }
    }
  }
  // robot bee — diff 9: added in changed
  if (ch) {
    ctx.fillStyle = '#ffd34d';
    circle(ctx, 200, 118, 9); ctx.fill();
    ctx.fillStyle = '#1c2450';
    ctx.fillRect(196, 112, 8, 3); ctx.fillRect(196, 120, 8, 3);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(200, 104, 8, 4, -0.5, 0, Math.PI * 2); ctx.stroke();
  }
  // water tank right — diff 8: water level lower (resized) in changed
  ctx.fillStyle = '#22304f';
  rr(ctx, 500, 130, 120, 190, 10); ctx.fill();
  ctx.strokeStyle = '#4a5588'; ctx.lineWidth = 3;
  rr(ctx, 500, 130, 120, 190, 10); ctx.stroke();
  const wl = ch ? 240 : 190;
  ctx.fillStyle = '#37c8e8';
  rr(ctx, 508, wl, 104, 320 - wl, 6); ctx.fill();
  ctx.fillStyle = '#9aa7d6';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('H2O', 546, 150);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(516, wl + 20); ctx.lineTo(604, wl + 20); ctx.stroke();
  // pipe + valve — diff 4: valve resized (bigger in changed)
  ctx.fillStyle = '#5a6a8a';
  ctx.fillRect(0, 52, SCENE_W, 12);
  const vr = ch ? 18 : 11;
  ctx.strokeStyle = '#c9d4f2'; ctx.lineWidth = 4;
  circle(ctx, 500, 58, vr); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(500 - vr, 58); ctx.lineTo(500 + vr, 58); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(500, 58 - vr); ctx.lineTo(500, 58 + vr); ctx.stroke();
  // watering can — diff 3: moved right in changed
  const cx = ch ? 132 : 96;
  ctx.fillStyle = '#2fd67a';
  rr(ctx, cx - 18, 318, 40, 26, 5); ctx.fill();
  ctx.strokeStyle = '#2fd67a'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx + 20, 326); ctx.lineTo(cx + 38, 312); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 18, 322); ctx.arc(cx - 24, 330, 9, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
  // sprout — diff 6: added in changed
  if (ch) {
    ctx.strokeStyle = '#2fd67a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(250, 352); ctx.lineTo(250, 332); ctx.stroke();
    ctx.fillStyle = '#37b24d';
    circle(ctx, 242, 330, 7); ctx.fill();
    circle(ctx, 258, 328, 7); ctx.fill();
  }
  ctx.fillStyle = '#1d2c1f';
  ctx.fillRect(0, 352, SCENE_W, 48);
}

SCENES.push({
  name: 'Hydroponics Bay', par: '2:00',
  draw: drawHydroponics,
  diffs: [
    { x: 150, y: 146, r: 16, kind: 'recoloured', label: 'tomato turned gold' },
    { x: 224, y: 232, r: 22, kind: 'removed', label: 'plant vanished' },
    { x: 114, y: 331, r: 24, kind: 'moved', label: 'watering can slid right' },
    { x: 500, y: 58, r: 18, kind: 'resized', label: 'valve wheel grew' },
    { x: 310, y: 232, r: 18, kind: 'flipped', label: 'leaf flipped side' },
    { x: 250, y: 338, r: 14, kind: 'added', label: 'sprout appeared' },
    { x: 320, y: 40, r: 20, kind: 'recoloured', label: 'grow lamps turned orange' },
    { x: 560, y: 215, r: 30, kind: 'resized', label: 'tank water dropped' },
    { x: 200, y: 118, r: 14, kind: 'added', label: 'robot bee appeared' },
  ],
});

// ---------------------------------------------------------------- scene 3
function drawAirlock(ctx, ch) {
  wall(ctx, '#2b3242', '#171c28');
  // corridor floor + ceiling perspective
  ctx.fillStyle = '#3a4157';
  ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(220, 240); ctx.lineTo(420, 240); ctx.lineTo(640, 400); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#232838';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(220, 240); ctx.lineTo(420, 240); ctx.lineTo(640, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath(); ctx.moveTo(0, 60 + i * 70); ctx.lineTo(220, 240); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(640, 60 + i * 70); ctx.lineTo(420, 240); ctx.stroke();
  }
  // top pipe — diff 4: resized (thicker in changed)
  ctx.fillStyle = '#5a6a8a';
  ctx.fillRect(180, 8, 280, ch ? 22 : 12);
  ctx.fillStyle = '#7a8aa8';
  ctx.fillRect(180, 8, 280, 3);
  // ceiling light — diff 5: added in changed
  if (ch) {
    ctx.fillStyle = '#ffd34d';
    rr(ctx, 462, 30, 36, 12, 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,211,77,0.25)';
    ctx.beginPath(); ctx.moveTo(462, 42); ctx.lineTo(498, 42); ctx.lineTo(520, 110); ctx.lineTo(440, 110); ctx.closePath(); ctx.fill();
  }
  // suit locker left
  ctx.fillStyle = '#2c3a55';
  rr(ctx, 36, 130, 110, 190, 8); ctx.fill();
  ctx.strokeStyle = '#4a5588'; ctx.lineWidth = 2;
  rr(ctx, 36, 130, 110, 190, 8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(36, 225); ctx.lineTo(146, 225); ctx.stroke();
  // helmet — diff 3: removed in changed
  if (!ch) {
    ctx.fillStyle = '#e8ecf7';
    circle(ctx, 90, 262, 22); ctx.fill();
    ctx.fillStyle = '#37c8e8';
    rr(ctx, 74, 254, 32, 14, 7); ctx.fill();
  }
  ctx.fillStyle = '#f5b301';
  rr(ctx, 56, 150, 70, 56, 6); ctx.fill();
  ctx.fillStyle = '#1c2450';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('SUIT', 78, 172);
  ctx.fillText('07', 84, 190);
  // gauge — diff 1: needle moved
  ctx.fillStyle = '#0d1f33';
  circle(ctx, 120, 90, 26); ctx.fill();
  ctx.strokeStyle = '#c9d4f2'; ctx.lineWidth = 2;
  circle(ctx, 120, 90, 26); ctx.stroke();
  ctx.strokeStyle = '#ff4d5e'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(120, 90);
  if (!ch) ctx.lineTo(138, 74); else ctx.lineTo(102, 74);
  ctx.stroke();
  ctx.fillStyle = '#2fd67a';
  circle(ctx, 120, 90, 3); ctx.fill();
  // warning sign — diff 2: recoloured yellow -> red
  ctx.fillStyle = ch ? '#ff4d5e' : '#ffd34d';
  ctx.beginPath(); ctx.moveTo(520, 66); ctx.lineTo(556, 118); ctx.lineTo(484, 118); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1c2450';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('!', 516, 112);
  ctx.fillStyle = '#9aa7d6';
  ctx.font = '11px sans-serif';
  ctx.fillText('AIRLOCK', 494, 134);
  // big round airlock door
  ctx.fillStyle = '#39415e';
  circle(ctx, 320, 200, 96); ctx.fill();
  ctx.strokeStyle = '#5a6a8a'; ctx.lineWidth = 5;
  circle(ctx, 320, 200, 96); ctx.stroke();
  ctx.strokeStyle = '#2a3350'; ctx.lineWidth = 3;
  circle(ctx, 320, 200, 78); ctx.stroke();
  const dg = ctx.createLinearGradient(280, 140, 360, 260);
  dg.addColorStop(0, '#0e2a55'); dg.addColorStop(1, '#04081a');
  ctx.fillStyle = dg;
  circle(ctx, 320, 200, 62); ctx.fill();
  ctx.save();
  circle(ctx, 320, 200, 62); ctx.clip();
  stars(ctx, 33, 26, 258, 138, 382, 262, '#ffffff');
  ctx.fillStyle = '#e8823a';
  circle(ctx, 356, 168, 14); ctx.fill();
  ctx.restore();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.fillStyle = '#8a93b8';
    circle(ctx, 320 + Math.cos(a) * 87, 200 + Math.sin(a) * 87, 5); ctx.fill();
  }
  // door handle — diff 6: flipped (points left vs right)
  ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(396, 200);
  if (!ch) { ctx.lineTo(414, 188); ctx.lineTo(414, 212); }
  else { ctx.lineTo(378, 188); ctx.lineTo(378, 212); }
  ctx.stroke();
  // floor arrow — diff 7: removed in changed
  if (!ch) {
    ctx.fillStyle = '#ffd34d';
    ctx.beginPath(); ctx.moveTo(320, 330); ctx.lineTo(344, 356); ctx.lineTo(332, 356); ctx.lineTo(332, 372); ctx.lineTo(308, 372); ctx.lineTo(308, 356); ctx.lineTo(296, 356); ctx.closePath(); ctx.fill();
  }
  // loose cable — diff 8: added in changed
  if (ch) {
    ctx.strokeStyle = '#ff4d5e'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(170, 330); ctx.bezierCurveTo(200, 312, 220, 348, 250, 330); ctx.stroke();
  }
  // warning stripes near door
  ctx.fillStyle = '#ffd34d';
  for (let i = 0; i < 6; i++) ctx.fillRect(216 + i * 12, 318, 6, 10);
  for (let i = 0; i < 6; i++) ctx.fillRect(412 + i * 12, 318, 6, 10);
}

SCENES.push({
  name: 'Airlock Corridor', par: '2:00',
  draw: drawAirlock,
  diffs: [
    { x: 120, y: 90, r: 18, kind: 'moved', label: 'gauge needle swung' },
    { x: 520, y: 96, r: 20, kind: 'recoloured', label: 'warning sign turned red' },
    { x: 90, y: 262, r: 22, kind: 'removed', label: 'helmet vanished' },
    { x: 320, y: 14, r: 18, kind: 'resized', label: 'top pipe grew thicker' },
    { x: 480, y: 40, r: 14, kind: 'added', label: 'ceiling light appeared' },
    { x: 396, y: 200, r: 18, kind: 'flipped', label: 'door handle flipped' },
    { x: 320, y: 350, r: 20, kind: 'removed', label: 'floor arrow gone' },
    { x: 208, y: 330, r: 16, kind: 'added', label: 'loose cable appeared' },
  ],
});

// ---------------------------------------------------------------- scene 4
function drawObservatory(ctx, ch) {
  wall(ctx, '#101736', '#0a0e26');
  // dome window
  ctx.fillStyle = '#050914';
  ctx.beginPath(); ctx.arc(320, 430, 330, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.arc(320, 430, 330, Math.PI, 0); ctx.closePath(); ctx.clip();
  const sky = ctx.createLinearGradient(0, 60, 0, 400);
  sky.addColorStop(0, '#03061a'); sky.addColorStop(0.6, '#12224f'); sky.addColorStop(1, '#3a2a6e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_W, 400);
  stars(ctx, 44, 90, 0, 40, SCENE_W, 380, '#ffffff');
  // nebula — diff 3: recoloured purple -> teal
  ctx.fillStyle = ch ? 'rgba(55,200,180,0.45)' : 'rgba(150,90,220,0.45)';
  ctx.beginPath(); ctx.ellipse(300, 110, 90, 34, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(330, 126, 60, 24, -0.2, 0, Math.PI * 2); ctx.fill();
  // big star — diff 5: resized (bigger in changed)
  const br = ch ? 12 : 6;
  ctx.fillStyle = '#ffd34d';
  ctx.beginPath();
  ctx.moveTo(520, 70 - br); ctx.lineTo(520 + br * 0.35, 70 - br * 0.35); ctx.lineTo(520 + br, 70);
  ctx.lineTo(520 + br * 0.35, 70 + br * 0.35); ctx.lineTo(520, 70 + br); ctx.lineTo(520 - br * 0.35, 70 + br * 0.35);
  ctx.lineTo(520 - br, 70); ctx.lineTo(520 - br * 0.35, 70 - br * 0.35); ctx.closePath(); ctx.fill();
  // comet — diff 1: added in changed
  if (ch) {
    const cg = ctx.createLinearGradient(90, 70, 150, 90);
    cg.addColorStop(0, 'rgba(255,255,255,0)'); cg.addColorStop(1, 'rgba(255,255,255,0.9)');
    ctx.strokeStyle = cg; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(92, 72); ctx.lineTo(146, 90); ctx.stroke();
    ctx.fillStyle = '#fff';
    circle(ctx, 148, 91, 5); ctx.fill();
  }
  // planet below with ring — diff 8: ring removed in changed
  ctx.fillStyle = '#7a9cc9';
  circle(ctx, 320, 330, 52); ctx.fill();
  ctx.fillStyle = '#5a7ba8';
  circle(ctx, 300, 316, 12); ctx.fill();
  circle(ctx, 336, 344, 8); ctx.fill();
  if (!ch) {
    ctx.strokeStyle = 'rgba(255,211,77,0.85)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(320, 330, 78, 16, -0.25, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
  // dome frame
  ctx.strokeStyle = '#4a5588'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(320, 430, 330, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(SCENE_W, 400); ctx.stroke();
  // telescope — diff 2: moved (shifts right/down in changed)
  const tx = ch ? 478 : 448;
  const ty = ch ? 258 : 240;
  ctx.strokeStyle = '#8a93b8'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(tx, ty + 60); ctx.lineTo(tx - 14, ty + 118); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx, ty + 60); ctx.lineTo(tx + 14, ty + 118); ctx.stroke();
  ctx.fillStyle = '#c9d4f2';
  ctx.save();
  ctx.translate(tx, ty); ctx.rotate(-0.5);
  rr(ctx, -14, -58, 92, 22, 10); ctx.fill();
  ctx.fillStyle = '#37c8e8';
  circle(ctx, 82, -47, 9); ctx.fill();
  ctx.restore();
  // chair — diff 4: removed in changed
  if (!ch) {
    ctx.fillStyle = '#3d4a7a';
    rr(ctx, 128, 300, 48, 60, 8); ctx.fill();
    ctx.fillStyle = '#55619b';
    rr(ctx, 118, 352, 68, 12, 6); ctx.fill();
  }
  // side table + mug — diff 7: mug added in changed
  ctx.fillStyle = '#2c3a55';
  rr(ctx, 218, 330, 64, 10, 4); ctx.fill();
  ctx.fillStyle = '#1c2450';
  ctx.fillRect(244, 340, 6, 40); ctx.fillRect(268, 340, 6, 40);
  if (ch) {
    ctx.fillStyle = '#ff5a5a';
    rr(ctx, 232, 312, 18, 16, 3); ctx.fill();
  }
  // control panel with indicator — diff 6: flipped (light on left vs right)
  ctx.fillStyle = '#1c2450';
  rr(ctx, 520, 300, 90, 44, 8); ctx.fill();
  ctx.fillStyle = '#2fd67a';
  circle(ctx, ch ? 596 : 534, 322, 6); ctx.fill();
  ctx.fillStyle = '#55619b';
  circle(ctx, ch ? 534 : 596, 322, 6); ctx.fill();
  ctx.fillStyle = '#9aa7d6';
  ctx.fillRect(536, 334, 58, 3);
}

SCENES.push({
  name: 'Observation Dome', par: '2:00',
  draw: drawObservatory,
  diffs: [
    { x: 128, y: 84, r: 20, kind: 'added', label: 'comet appeared' },
    { x: 462, y: 248, r: 24, kind: 'moved', label: 'telescope slid over' },
    { x: 310, y: 116, r: 26, kind: 'recoloured', label: 'nebula turned teal' },
    { x: 152, y: 328, r: 22, kind: 'removed', label: 'chair vanished' },
    { x: 520, y: 70, r: 16, kind: 'resized', label: 'star grew bigger' },
    { x: 565, y: 322, r: 34, kind: 'flipped', label: 'panel light swapped side' },
    { x: 241, y: 320, r: 14, kind: 'added', label: 'mug appeared' },
    { x: 320, y: 330, r: 22, kind: 'removed', label: 'planet ring gone' },
  ],
});

// ---------------------------------------------------------------- scene 5
function drawEngineRoom(ctx, ch) {
  wall(ctx, '#33241a', '#1c130d');
  ctx.fillStyle = '#241a12';
  ctx.fillRect(0, 330, SCENE_W, 70);
  // pipes along walls
  ctx.fillStyle = '#5a6a8a';
  ctx.fillRect(0, 40, SCENE_W, 14);
  ctx.fillRect(40, 0, 14, 400);
  ctx.fillRect(586, 0, 14, 400);
  ctx.fillStyle = '#7a8aa8';
  ctx.fillRect(0, 40, SCENE_W, 3);
  // valve — diff 2: removed in changed
  if (!ch) {
    ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 4;
    circle(ctx, 120, 120, 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(104, 120); ctx.lineTo(136, 120); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(120, 104); ctx.lineTo(120, 136); ctx.stroke();
  } else {
    ctx.fillStyle = '#5a6a8a';
    ctx.fillRect(112, 112, 16, 16);
  }
  // warning light — diff 6: flipped (on top vs bottom of its post)
  ctx.fillStyle = '#2a2f4a';
  ctx.fillRect(74, 44, 12, 60);
  ctx.fillStyle = ch ? '#55619b' : '#ff4d5e';
  circle(ctx, 80, ch ? 98 : 52, 7); ctx.fill();
  ctx.fillStyle = ch ? '#ff4d5e' : '#55619b';
  circle(ctx, 80, ch ? 52 : 98, 7); ctx.fill();
  // reactor core — diff 1: recoloured blue -> green
  const core = ctx.createRadialGradient(320, 180, 8, 320, 180, 72);
  if (!ch) { core.addColorStop(0, '#bfe9ff'); core.addColorStop(0.5, '#37c8e8'); core.addColorStop(1, 'rgba(55,200,232,0)'); }
  else { core.addColorStop(0, '#d2ffe2'); core.addColorStop(0.5, '#2fd67a'); core.addColorStop(1, 'rgba(47,214,122,0)'); }
  ctx.fillStyle = core;
  circle(ctx, 320, 180, 72); ctx.fill();
  ctx.fillStyle = '#22304f';
  circle(ctx, 320, 180, 46); ctx.fill();
  ctx.strokeStyle = '#8a93b8'; ctx.lineWidth = 4;
  circle(ctx, 320, 180, 46); ctx.stroke();
  ctx.fillStyle = ch ? '#2fd67a' : '#37c8e8';
  circle(ctx, 320, 180, 26); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  circle(ctx, 312, 172, 7); ctx.fill();
  // gauges row
  for (const gx of [220, 420]) {
    ctx.fillStyle = '#0d1f33';
    circle(ctx, gx, 100, 22); ctx.fill();
    ctx.strokeStyle = '#c9d4f2'; ctx.lineWidth = 2;
    circle(ctx, gx, 100, 22); ctx.stroke();
    ctx.strokeStyle = '#ff4d5e'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(gx, 100); ctx.lineTo(gx + 12, 86); ctx.stroke();
  }
  // extra gauge — diff 3: added in changed
  if (ch) {
    ctx.fillStyle = '#0d1f33';
    circle(ctx, 520, 120, 22); ctx.fill();
    ctx.strokeStyle = '#c9d4f2'; ctx.lineWidth = 2;
    circle(ctx, 520, 120, 22); ctx.stroke();
    ctx.strokeStyle = '#2fd67a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(520, 120); ctx.lineTo(508, 106); ctx.stroke();
  }
  // steam puff — diff 8: removed in changed
  if (!ch) {
    ctx.fillStyle = 'rgba(220,230,255,0.75)';
    circle(ctx, 496, 214, 14); ctx.fill();
    circle(ctx, 512, 206, 17); ctx.fill();
    circle(ctx, 528, 218, 12); ctx.fill();
  }
  // crates — diff 5: crate resized (bigger in changed)
  ctx.fillStyle = '#7a5a21';
  const cw = ch ? 92 : 66;
  rr(ctx, 480 - cw / 2, 300, cw, 52, 4); ctx.fill();
  ctx.strokeStyle = '#a8842f'; ctx.lineWidth = 2;
  rr(ctx, 480 - cw / 2, 300, cw, 52, 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(480 - cw / 2, 326); ctx.lineTo(480 + cw / 2, 326); ctx.stroke();
  ctx.fillStyle = '#7a5a21';
  rr(ctx, 90, 296, 70, 56, 4); ctx.fill();
  ctx.strokeStyle = '#a8842f';
  rr(ctx, 90, 296, 70, 56, 4); ctx.stroke();
  // cable — diff 4: moved (rerouted lower in changed)
  ctx.strokeStyle = '#ff9a3c'; ctx.lineWidth = 4;
  ctx.beginPath();
  if (!ch) { ctx.moveTo(180, 300); ctx.bezierCurveTo(210, 330, 230, 300, 260, 330); }
  else { ctx.moveTo(180, 348); ctx.bezierCurveTo(210, 368, 230, 348, 260, 368); }
  ctx.stroke();
  // bolt — diff 7: added in changed
  if (ch) {
    ctx.fillStyle = '#c9d4f2';
    circle(ctx, 400, 262, 6); ctx.fill();
    ctx.fillStyle = '#5a6a8a';
    circle(ctx, 400, 262, 2.5); ctx.fill();
  }
  // floor hazard line
  ctx.fillStyle = '#ffd34d';
  for (let i = 0; i < 16; i++) if (i % 2 === 0) ctx.fillRect(i * 40, 388, 22, 8);
}

SCENES.push({
  name: 'Engine Room', par: '2:00',
  draw: drawEngineRoom,
  diffs: [
    { x: 320, y: 180, r: 30, kind: 'recoloured', label: 'reactor turned green' },
    { x: 120, y: 120, r: 18, kind: 'removed', label: 'valve vanished' },
    { x: 520, y: 120, r: 18, kind: 'added', label: 'extra gauge appeared' },
    { x: 220, y: 336, r: 24, kind: 'moved', label: 'cable rerouted lower' },
    { x: 480, y: 326, r: 26, kind: 'resized', label: 'crate grew wider' },
    { x: 80, y: 75, r: 26, kind: 'flipped', label: 'warning light swapped' },
    { x: 400, y: 262, r: 14, kind: 'added', label: 'bolt appeared' },
    { x: 512, y: 212, r: 20, kind: 'removed', label: 'steam puff gone' },
  ],
});

// ---------------------------------------------------------------- scene 6
function drawCargoHold(ctx, ch) {
  wall(ctx, '#26202e', '#171221');
  ctx.fillStyle = '#1d1826';
  ctx.fillRect(0, 330, SCENE_W, 70);
  // crane rail + hook — diff 5: hook flipped (opens left vs right)
  ctx.fillStyle = '#3a3350';
  ctx.fillRect(0, 30, SCENE_W, 10);
  ctx.strokeStyle = '#8a93b8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(320, 40); ctx.lineTo(320, 66); ctx.stroke();
  ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(320, 66); ctx.lineTo(320, 84);
  if (!ch) { ctx.arc(312, 84, 8, 0, Math.PI * 1.5, false); }
  else { ctx.arc(328, 84, 8, Math.PI * 1.5, Math.PI * 2.5, false); }
  ctx.stroke();
  // big container — diff 4: resized (wider in changed)
  const cwid = ch ? 190 : 140;
  ctx.fillStyle = '#2f6db3';
  rr(ctx, 420 - cwid / 2, 84, cwid, 84, 6); ctx.fill();
  ctx.strokeStyle = '#7ab3e8'; ctx.lineWidth = 2;
  for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(420 - cwid / 2 + (cwid / 5) * i, 84); ctx.lineTo(420 - cwid / 2 + (cwid / 5) * i, 168); ctx.stroke(); }
  rr(ctx, 420 - cwid / 2, 84, cwid, 84, 6); ctx.stroke();
  // small box on shelf — diff 7: added in changed
  if (ch) {
    ctx.fillStyle = '#b3742f';
    rr(ctx, 548, 168, 30, 24, 3); ctx.fill();
    ctx.strokeStyle = '#e8b06a'; ctx.lineWidth = 2;
    rr(ctx, 548, 168, 30, 24, 3); ctx.stroke();
  }
  // crate stack left — diff 1: one crate recoloured orange -> blue
  const crateCols = ['#b3742f', '#b3742f', '#b3742f'];
  const cratePos = [[80, 130, 76, 60], [164, 130, 76, 60], [122, 196, 76, 60]];
  cratePos.forEach(([cx, cy, cw2, ch2], i) => {
    ctx.fillStyle = (i === 0 && ch) ? '#2f6db3' : crateCols[i];
    rr(ctx, cx, cy, cw2, ch2, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
    rr(ctx, cx, cy, cw2, ch2, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy + ch2 / 2); ctx.lineTo(cx + cw2, cy + ch2 / 2); ctx.stroke();
  });
  // shipping label — diff 3: moved (from crate 2 to crate 3)
  ctx.fillStyle = '#f2ead8';
  if (!ch) rr(ctx, 176, 146, 52, 26, 3); else rr(ctx, 134, 212, 52, 26, 3);
  ctx.fill();
  ctx.fillStyle = '#1c2450';
  ctx.font = 'bold 10px sans-serif';
  if (!ch) ctx.fillText('FRAGILE', 184, 163); else ctx.fillText('FRAGILE', 142, 229);
  // barrel — diff 2: removed in changed
  if (!ch) {
    ctx.fillStyle = '#3f7a4d';
    rr(ctx, 500, 272, 40, 56, 8); ctx.fill();
    ctx.fillStyle = '#2f5c3a';
    ctx.fillRect(500, 292, 40, 5); ctx.fillRect(500, 310, 40, 5);
  }
  // conveyor belt
  ctx.fillStyle = '#2c3a55';
  rr(ctx, 250, 300, 260, 34, 8); ctx.fill();
  ctx.fillStyle = '#55619b';
  for (let i = 0; i < 6; i++) { circle(ctx, 268 + i * 42, 317, 7); ctx.fill(); }
  // forklift bot + eye — diff 6: eye added (lights up in changed)
  ctx.fillStyle = '#c9a227';
  rr(ctx, 168, 268, 64, 52, 8); ctx.fill();
  ctx.fillStyle = '#3a3350';
  rr(ctx, 182, 240, 36, 30, 6); ctx.fill();
  ctx.fillStyle = ch ? '#2fd67a' : '#222';
  circle(ctx, 192, 254, 5); ctx.fill();
  circle(ctx, 208, 254, 5); ctx.fill();
  ctx.strokeStyle = '#8a93b8'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(232, 280); ctx.lineTo(258, 280); ctx.lineTo(258, 316); ctx.stroke();
  // strap — diff 8: removed in changed
  if (!ch) {
    ctx.strokeStyle = '#ff4d5e'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(80, 292); ctx.lineTo(156, 292); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(80, 292); ctx.lineTo(80, 330); ctx.stroke();
  }
  // net on the wall
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath(); ctx.moveTo(560, 220 + i * 18); ctx.lineTo(630, 220 + i * 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(560 + i * 18, 220); ctx.lineTo(560 + i * 18, 292); ctx.stroke();
  }
  ctx.fillStyle = '#9aa7d6';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('BAY 07', 40, 380);
}

SCENES.push({
  name: 'Cargo Hold', par: '2:00',
  draw: drawCargoHold,
  diffs: [
    { x: 118, y: 160, r: 24, kind: 'recoloured', label: 'crate turned blue' },
    { x: 520, y: 300, r: 20, kind: 'removed', label: 'barrel vanished' },
    { x: 181, y: 192, r: 48, kind: 'moved', label: 'label slid to lower crate' },
    { x: 420, y: 126, r: 26, kind: 'resized', label: 'container grew wider' },
    { x: 320, y: 76, r: 16, kind: 'flipped', label: 'crane hook flipped' },
    { x: 200, y: 254, r: 14, kind: 'added', label: 'robot eyes lit up' },
    { x: 563, y: 180, r: 16, kind: 'added', label: 'small box appeared' },
    { x: 118, y: 300, r: 18, kind: 'removed', label: 'red strap gone' },
  ],
});

export function totalDiffs() {
  return SCENES.reduce((n, s) => n + s.diffs.length, 0);
}

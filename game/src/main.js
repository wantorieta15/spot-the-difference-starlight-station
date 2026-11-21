// STARLIGHT STATION — game state, HUD, timer, scoring and screenshots staging.
// Six station rooms, 50 fair differences, 2:00 per room. Wrong guesses cost
// 5 seconds and break the streak; hints (3 per room) pulse one difference.
import { SCENES, SCENE_W, SCENE_H, totalDiffs } from './scenes.js';
import { drawPanel, drawCrosshair } from './render.js';
import { bindPanels, hitDiff, KEY_ACTIONS, toSceneCoords } from './input.js';
import * as sfx from './audio.js';

const TIME_PER_SCENE = 120;
const WRONG_COST = 5;

const $ = (id) => document.getElementById(id);
const leftCanvas = $('left');
const rightCanvas = $('right');
const lens = $('lens');
const lensCtx = lens.getContext('2d');

const state = {
  scene: 0,
  found: new Set(),
  score: 0,
  streak: 0,
  strikes: 0,
  timeLeft: TIME_PER_SCENE,
  hintsLeft: 3,
  hintIndex: null,
  hintUntil: 0,
  paused: false,
  started: false,
  over: false,
  soundOn: true,
  activeSide: 0,
  cross: { x: SCENE_W / 2, y: SCENE_H / 2, visible: false },
  lastTick: 0,
};

function scene() {
  return SCENES[state.scene];
}

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function render() {
  const hint = state.hintIndex !== null && performance.now() < state.hintUntil
    ? state.hintIndex : null;
  const pulse = performance.now() / 240;
  drawPanel(leftCanvas, scene(), false, state.found, hint, pulse);
  drawPanel(rightCanvas, scene(), true, state.found, hint, pulse);
  if (state.cross.visible && !state.over) {
    drawCrosshair(state.activeSide === 0 ? leftCanvas : rightCanvas, state.cross.x, state.cross.y);
  }
}

function hud() {
  const sc = scene();
  $('pill-level').textContent = 'Level ' + (state.scene + 1) + ' — ' + sc.name;
  $('pill-left').textContent = (sc.diffs.length - state.found.size) + ' left';
  $('pill-found').textContent = state.found.size + ' / ' + sc.diffs.length + ' found';
  $('pill-score').textContent = String(state.score);
  $('pill-streak').textContent = 'Streak ×' + state.streak;
  $('pill-time').innerHTML = '&#9200; ' + fmtTime(state.timeLeft);
  $('timebar').style.width = Math.max(0, (state.timeLeft / TIME_PER_SCENE) * 100) + '%';
  $('btn-hint').textContent = 'Hint (' + state.hintsLeft + ')';
  $('btn-hint').disabled = state.hintsLeft <= 0 || !state.started || state.over;
  $('btn-sound').textContent = state.soundOn ? 'Sound on' : 'Sound off';
  const dots = $('dots');
  dots.innerHTML = '';
  sc.diffs.forEach((d, i) => {
    const s = document.createElement('span');
    if (state.found.has(i)) { s.className = 'on'; s.textContent = '✓'; }
    dots.appendChild(s);
  });
  $('found-text').textContent = state.found.size === sc.diffs.length
    ? '— scene clear!'
    : '— ' + (sc.diffs.length - state.found.size) + ' still hiding';
  document.querySelectorAll('#levels button').forEach((b, i) => {
    b.classList.toggle('on', i === state.scene);
  });
  leftCanvas.classList.toggle('active', state.activeSide === 0);
  rightCanvas.classList.toggle('active', state.activeSide === 1);
}

function announce(msg) {
  $('status').textContent = msg;
}

function loadScene(index, keepScore) {
  state.scene = index;
  state.found = new Set();
  state.streak = 0;
  state.timeLeft = TIME_PER_SCENE;
  state.hintsLeft = 3;
  state.hintIndex = null;
  state.over = false;
  state.paused = false;
  state.cross = { x: SCENE_W / 2, y: SCENE_H / 2, visible: false };
  if (!keepScore) state.score = 0;
  hideOverlays();
  render();
  hud();
}

function guessAt(pos) {
  if (!state.started || state.over || state.paused) return;
  const i = hitDiff(scene(), pos.x, pos.y, state.found);
  if (i >= 0) {
    state.found.add(i);
    state.streak += 1;
    state.score += 100 + 10 * state.streak;
    sfx.sndFind();
    announce('Found: ' + scene().diffs[i].label + '. ' + (scene().diffs.length - state.found.size) + ' left.');
    if (state.found.size === scene().diffs.length) sceneClear();
  } else {
    state.streak = 0;
    state.strikes += 1;
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_COST);
    sfx.sndWrong();
    announce('No difference there — 5 seconds lost.');
    if (state.timeLeft <= 0) timeUp();
  }
  render();
  hud();
}

function useHint() {
  if (!state.started || state.over || state.paused || state.hintsLeft <= 0) return;
  const rest = scene().diffs.map((d, i) => i).filter((i) => !state.found.has(i));
  if (!rest.length) return;
  state.hintsLeft -= 1;
  state.hintIndex = rest[Math.floor(Math.random() * rest.length)];
  state.hintUntil = performance.now() + 3000;
  sfx.sndHint();
  announce('Hint: look near the pulsing ring.');
  render();
  hud();
  setTimeout(() => { state.hintIndex = null; render(); }, 3100);
}

function sceneClear() {
  state.over = true;
  const bonus = Math.round(state.timeLeft) * 5;
  state.score += bonus;
  sfx.sndClear();
  const last = state.scene === SCENES.length - 1;
  $('clear-title').textContent = last ? 'Final Scene Clear!' : 'Scene Clear!';
  $('clear-text').textContent = 'All ' + scene().diffs.length + ' differences in the ' + scene().name +
    ' found — time bonus +' + bonus + ' points. Total score: ' + state.score + '.' +
    (last ? ' That was the last room — the station is yours!' : ' Ready for the next room, cadet?');
  $('btn-next').textContent = last ? 'Finish — see results' : 'Next scene';
  showOverlay('ov-clear');
  announce('Scene clear! Score ' + state.score + '.');
  render();
  hud();
}

function timeUp() {
  state.over = true;
  sfx.sndWrong();
  $('time-text').textContent = 'The air ran out in the ' + scene().name + ' with ' +
    (scene().diffs.length - state.found.size) + ' differences still hiding. Score so far: ' + state.score + '.';
  showOverlay('ov-time');
  announce('Time up in the ' + scene().name + '.');
  render();
  hud();
}

function winGame() {
  state.over = true;
  sfx.sndWin();
  $('win-text').textContent = 'You found all ' + totalDiffs() + ' differences across all 6 rooms of STARLIGHT STATION. ' +
    'Final score: ' + state.score + '. The station is safe — and you are officially its sharpest-eyed cadet.';
  showOverlay('ov-win');
  announce('All 6 scenes clear! Final score ' + state.score + '.');
}

function showOverlay(id) {
  document.querySelectorAll('.overlay').forEach((o) => o.classList.remove('show'));
  $(id).classList.add('show');
}

function hideOverlays() {
  document.querySelectorAll('.overlay').forEach((o) => o.classList.remove('show'));
}

function togglePause() {
  if (!state.started || state.over) return;
  state.paused = !state.paused;
  $('btn-pause').textContent = state.paused ? 'Resume' : 'Pause';
  if (state.paused) showOverlay('ov-pause');
  else hideOverlays();
  render();
  hud();
}

// ------------------------------------------------------------ magnifier
function showLens(canvas, pos, event) {
  if (!state.started || state.over || state.paused) { lens.style.display = 'none'; return; }
  const size = 90;
  const sx = Math.max(0, Math.min(SCENE_W - size, pos.x - size / 2));
  const sy = Math.max(0, Math.min(SCENE_H - size, pos.y - size / 2));
  lensCtx.clearRect(0, 0, 300, 300);
  lensCtx.drawImage(canvas, sx, sy, size, size, 0, 0, 300, 300);
  lensCtx.strokeStyle = 'rgba(245,179,1,0.9)';
  lensCtx.lineWidth = 3;
  lensCtx.beginPath();
  lensCtx.arc(150, 150, 146, 0, Math.PI * 2);
  lensCtx.stroke();
  lens.style.display = 'block';
  lens.style.left = Math.min(window.innerWidth - 160, event.clientX + 18) + 'px';
  lens.style.top = Math.max(8, event.clientY - 75) + 'px';
}

function hideLens() {
  lens.style.display = 'none';
}

// ------------------------------------------------------------ keyboard
function onKey(event) {
  const action = KEY_ACTIONS[event.key];
  if (!action) return;
  if (action === 'hint') { useHint(); return; }
  if (action === 'pause') { togglePause(); return; }
  if (action === 'sound') { toggleSound(); return; }
  if (action === 'restart') { loadScene(state.scene, true); announce('Level restarted.'); return; }
  if (action === 'levels') { $('levels').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  if (action === 'next') { nextScene(); return; }
  if (action.startsWith('scene')) {
    const idx = Number(action.slice(5));
    if (idx !== state.scene) { state.score = state.score; loadScene(idx, true); }
    return;
  }
  if (!state.started || state.over || state.paused) return;
  const step = event.shiftKey ? 4 : 12;
  if (action === 'left') state.cross.x = Math.max(0, state.cross.x - step);
  if (action === 'right') state.cross.x = Math.min(SCENE_W, state.cross.x + step);
  if (action === 'up') state.cross.y = Math.max(0, state.cross.y - step);
  if (action === 'down') state.cross.y = Math.min(SCENE_H, state.cross.y + step);
  if (action === 'guess') { guessAt({ x: state.cross.x, y: state.cross.y }); return; }
  state.cross.visible = true;
  render();
}

function nextScene() {
  if (state.scene === SCENES.length - 1) { winGame(); return; }
  loadScene(state.scene + 1, true);
  announce('Level ' + (state.scene + 1) + ': ' + scene().name + '.');
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  sfx.setEnabled(state.soundOn);
  if (state.soundOn) sfx.sndClick();
  hud();
}

// ------------------------------------------------------------ wiring
function buildLevels() {
  const box = $('levels');
  box.innerHTML = '';
  SCENES.forEach((s, i) => {
    const b = document.createElement('button');
    b.textContent = (i + 1) + '. ' + s.name;
    b.addEventListener('click', () => {
      sfx.sndClick();
      if (!state.started) { state.started = true; hideOverlays(); }
      loadScene(i, true);
      announce('Level ' + (i + 1) + ': ' + s.name + '.');
    });
    box.appendChild(b);
  });
}

function wireButtons() {
  $('btn-hint').addEventListener('click', useHint);
  $('btn-pause').addEventListener('click', togglePause);
  $('btn-resume').addEventListener('click', togglePause);
  $('btn-restart').addEventListener('click', () => { loadScene(state.scene, true); announce('Level restarted.'); });
  $('btn-restart2').addEventListener('click', () => { loadScene(state.scene, true); announce('Level restarted.'); });
  $('btn-levels').addEventListener('click', () => $('levels').scrollIntoView({ behavior: 'smooth', block: 'center' }));
  $('btn-levels2').addEventListener('click', () => { hideOverlays(); $('levels').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  $('btn-sound').addEventListener('click', toggleSound);
  $('btn-start').addEventListener('click', () => {
    state.started = true;
    hideOverlays();
    sfx.sndClick();
    announce('Level 1: Command Deck. Find 9 differences.');
  });
  $('btn-next').addEventListener('click', nextScene);
  $('btn-replay').addEventListener('click', () => loadScene(state.scene, true));
  $('btn-retry').addEventListener('click', () => loadScene(state.scene, true));
  $('btn-again').addEventListener('click', () => {
    state.score = 0;
    loadScene(0, false);
    state.started = true;
  });
}

// ------------------------------------------------------------ timer loop
function tick(now) {
  if (state.lastTick === 0) state.lastTick = now;
  const dt = (now - state.lastTick) / 1000;
  state.lastTick = now;
  if (state.started && !state.paused && !state.over) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      $('pill-time').innerHTML = '&#9200; ' + fmtTime(0);
      $('timebar').style.width = '0%';
      timeUp();
    } else {
      $('pill-time').innerHTML = '&#9200; ' + fmtTime(state.timeLeft);
      $('timebar').style.width = Math.max(0, (state.timeLeft / TIME_PER_SCENE) * 100) + '%';
    }
  }
  if (state.hintIndex !== null && performance.now() < state.hintUntil) render();
  requestAnimationFrame(tick);
}

// ------------------------------------------------------------ ?shot= staging
function applyShot() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return;
  state.started = true;
  hideOverlays();
  if (shot === 'start') {
    state.started = false;
    loadScene(0, false);
    showOverlay('ov-title');
    return;
  }
  if (shot === 'play') {
    loadScene(0, false);
    state.found = new Set([0, 1, 2]);
    state.score = 360;
    state.streak = 3;
    state.timeLeft = 83;
  } else if (shot === 'play2') {
    loadScene(2, false);
    state.found = new Set([0, 1, 3, 4, 6]);
    state.score = 610;
    state.streak = 2;
    state.timeLeft = 47;
  } else if (shot === 'win') {
    loadScene(5, false);
    state.found = new Set(SCENES[5].diffs.map((d, i) => i));
    state.score = 5420;
    state.streak = 8;
    state.timeLeft = 12;
    state.over = true;
    winGame();
    $('win-text').textContent = 'You found all ' + totalDiffs() + ' differences across all 6 rooms of STARLIGHT STATION. ' +
      'Final score: 5420. The station is safe — and you are officially its sharpest-eyed cadet.';
  }
  render();
  hud();
}

// ------------------------------------------------------------ init
buildLevels();
wireButtons();
bindPanels(leftCanvas, rightCanvas, {
  onGuess: (pos) => guessAt(pos),
  onHover: (canvas, pos, event) => showLens(canvas, pos, event),
  onHoverEnd: hideLens,
  onFocus: (side) => { state.activeSide = side; hud(); },
  onTab: () => {
    state.activeSide = 1 - state.activeSide;
    state.cross.visible = true;
    render();
    hud();
  },
  onKey,
});
loadScene(0, false);
showOverlay('ov-title');
applyShot();
requestAnimationFrame(tick);

// STARLIGHT STATION — mouse + keyboard input for both panels.
// Clicks on either picture guess a difference; hover shows a magnifier lens;
// arrow keys move a crosshair, Enter guesses at it, Tab swaps the picture.
import { SCENE_W, SCENE_H } from './scenes.js';

export function toSceneCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * SCENE_W,
    y: ((event.clientY - rect.top) / rect.height) * SCENE_H,
  };
}

export function hitDiff(scene, x, y, found) {
  for (let i = 0; i < scene.diffs.length; i++) {
    if (found.has(i)) continue;
    const d = scene.diffs[i];
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return i;
  }
  return -1;
}

export function bindPanels(left, right, hooks) {
  const panels = [left, right];
  panels.forEach((canvas, side) => {
    canvas.addEventListener('click', (event) => {
      hooks.onGuess(toSceneCoords(canvas, event), side);
    });
    canvas.addEventListener('mousemove', (event) => {
      hooks.onHover(canvas, toSceneCoords(canvas, event), event);
    });
    canvas.addEventListener('mouseleave', () => {
      hooks.onHoverEnd();
    });
    canvas.addEventListener('mouseenter', () => {
      hooks.onFocus(side);
    });
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      hooks.onTab();
      return;
    }
    hooks.onKey(event);
  });
}

export const KEY_ACTIONS = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  Enter: 'guess',
  h: 'hint', H: 'hint',
  l: 'levels', L: 'levels',
  n: 'next', N: 'next',
  r: 'restart', R: 'restart',
  p: 'pause', P: 'pause',
  m: 'sound', M: 'sound',
  '1': 'scene0', '2': 'scene1', '3': 'scene2',
  '4': 'scene3', '5': 'scene4', '6': 'scene5',
};

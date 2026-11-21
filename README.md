# STARLIGHT STATION — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/wantorieta15/spot-the-difference-starlight-station/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/wantorieta15/spot-the-difference-starlight-station/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game that plays offline in a desktop browser
from its own static files. Two near-identical pictures side by side, gold
rings + green checks on the differences found, several still unfound, and a
counter of how many remain.

## The game

Six rooms of a space station — Command Deck, Hydroponics Bay, Airlock
Corridor, Observation Dome, Engine Room, Cargo Hold — with **50 fair
differences** in all (9 + 9 + 8 + 8 + 8 + 8): things removed, recoloured,
moved, resized, flipped or added. Every scene is drawn procedurally on
canvas, so the game needs no image files at all.

- Click a difference on **either** picture to ring it (gold ring + green check)
- **Magnifier** follows the mouse over a picture
- **Full keyboard play**: arrows move a crosshair, Enter guesses, Tab swaps
  pictures, H hint, L levels, N next scene, R restart, P pause, M sound, 1–6 jump to a level
- **Hint (3 per level)** pulses one unfound difference
- **Timer 2:00 per level** + progress bar; wrong guesses cost 5 seconds
- **Score + Streak** (finds pay 100 + 10 × streak, plus a time bonus)
- **Levels** bar, pause, restart, sound toggle (synthesized WebAudio beeps)
- **Dots** show every found / still-hiding difference

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

Staging shots for screenshots: `?shot=start`, `?shot=play`, `?shot=play2`, `?shot=win`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `game/` and
`screenshots/` to `/output` and writes `/output/dossier.json` with the
vendored make.fun library (`vendor/makefun-game.ts`).

## Layout

- `main.ts` — the hand-in program
- `serve.ts` — tiny static server for local play
- `game/index.html` — page + HUD
- `game/src/scenes.js` — the 6 procedural scenes + their 50 differences
- `game/src/render.js` — panel drawing, gold rings, green checks, crosshair
- `game/src/input.js` — mouse + keyboard input
- `game/src/audio.js` — synthesized sound effects (WebAudio, no files)
- `game/src/main.js` — game state, timer, scoring, levels, `?shot=` staging
- `screenshots/` — 4 real renders of the game's own code
- `shots.json` — the staging queries behind the screenshots

# Koda — a little logic, a little play

Muhammad Hidayat's static portfolio lives in `level-1/task-1/`. His pixel character appears throughout the profile. The site also includes a shared pixel forest, a playable piano, optional music, and **Infinity Forest**, a hidden sword arena. No build step or package installation is needed.

## Run locally

From the repository root:

```sh
python3 -m http.server 4173
```

Open [the portfolio](http://localhost:4173/level-1/task-1/). All assets and scripts are completely self-contained inside `level-1/task-1/`.

Open [Level 1 Task 2](http://localhost:4173/level-1/task-2/) for the separate CSS exercise. It does not load Task 1's stylesheets. Its inline, internal, and external CSS demonstrate the required rules, and the external stylesheet contains the written answers in multiline CSS comments.

## Find and play the game

Click the forest preview, press **Q**, use the footer's hidden-game button, or enter the Konami sequence: **↑ ↑ ↓ ↓ ← → ← → B A**. Shortcuts are ignored while typing or using the game dialog.

| Action | Keyboard |
| --- | --- |
| Move | A / D or ← / → |
| Chain three sword strikes | Hold Space, Z, or J |
| Dodge | Shift, X, or K |
| Pause / resume | P |
| Close | Escape |

Touch devices also have movement, dodge, and strike buttons. Watch for orange attack warnings and dodge through swings. Clear five waves, choose damage, movement, or health upgrades between waves, and defeat the Gatekeeper in the final wave. Losing focus automatically pauses the run.

Personal best is stored in this browser's `localStorage` under `koda-sidequest-best`. A fresh run resets upgrades and score; the best remains. The game still works when browser storage is unavailable.

## Files and verification

- `index.html`, `styles.css`, `script.js`: portfolio, interactions, music, and piano.
- `arena.js`: forest renderer shared by the preview and game.
- `game.js`, `game.css`: game mechanics, dialog, and touch controls.
- `fonts/`: local Space Grotesk Semibold and DM Sans Regular/Bold, with their SIL Open Font License 1.1 notices.
- `DESIGN.md`: visual system and interaction conventions.

Run the dependency-free game regression suite with Node.js:

```sh
node --test tests/sidequest.test.cjs
```

The suite drives the actual engine through keyboard and button events with a simulated animation clock. It checks combat, pause/restart cleanup, upgrades, and a complete five-wave victory; canvas rendering is mocked.

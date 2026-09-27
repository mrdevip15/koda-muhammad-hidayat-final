# Dusk journal

A quiet personal journal opens onto a small forest after dark. The page pairs large editorial typography with restrained pixel art, then carries that same world into the hidden arcade. Indonesian profile copy and playful English labels reflect the current page.

## Color and type

| Token | Value | Current role |
| --- | --- | --- |
| `--ink` | `#14231e` | Main dark surface and paper-section text |
| `--ink-deep` | `#101c18` | Deep forest tone |
| `--paper` | `#f1eedf` | Cream sections and light text |
| `--paper-dark` | `#e8e5d6` | Secondary paper token |
| `--sage` | `#b4c6aa` | Secondary headings, game health, forest accents |
| `--orange` | `#f07b4f` | Interaction accents, focus, attack warnings |
| `--muted` | `#aab6ab` | Supporting copy on dark surfaces |
| `--line-dark` / `--line-light` | `#c9cbbc` / `#36443a` | Section and row rules |

Space Grotesk 600 supplies headings and the geometric identity; DM Sans 400/700 supplies body copy and controls. Both are local fonts loaded with `font-display: swap`; license files live beside them. Arcade screen headlines share Space Grotesk; compact canvas annotations use system monospace.

## Composition

The page is capped at 1280px. The desktop hero balances an oversized name against a lightly rotated forest window. Cream biography and journey sections use generous spacing, clear columns, and ruled hobby/education rows. A dark green footer completes the page. Most surfaces are flat; thin borders, small corner radii, and circular arrow controls provide structure.

The layout compresses at 1100px and 800px, then becomes one column at 600px. Mobile removes the forest's rotation and keeps the same content order. The arcade has its own responsive HUD, overlay screens, and touch controls.

## One shared world

`arena.js` draws the moon, layered ridges, trees, fireflies, and ruined gate in both the hero preview and the playable arena. Existing Soldier and Orc sprites retain hard pixel edges. The arcade repeats the page's cream, sage, orange, and deep green; orange also communicates imminent enemy attacks. The piano and optional soundtrack extend the playful details without starting sound automatically.

Muhammad Hidayat's own pixel frames are the profile's recurring character. The hero introduces him beside “Player, Learner, Builder”; his laptop pose marks coding, his standing pose accompanies education, and his wave closes the page. The game header echoes the same portrait while combat keeps its purpose-built Soldier animation. Frame changes run only while each image is visible and stop when the document is hidden or reduced motion is requested.

## Interaction and access

Keep visible focus outlines, the skip link, semantic headings, labeled icon buttons, and text alongside game statistics. The game moves focus into its dialog, traps Tab navigation, makes the background inert, and restores focus and scrolling on close. Health and major game transitions have live announcements. Keyboard controls and touch buttons share the same game actions; blur or a hidden document pauses combat.

Reduced-motion preferences remove CSS animation and transitions, stop ambient forest motion and parallax, and suppress combat shake, flashes, and dodge trails while reducing particles. Essential combat movement remains. The hero animation also stops when offscreen, when the document is hidden, or while the game is open.

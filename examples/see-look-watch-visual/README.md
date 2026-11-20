# SEE · LOOK · WATCH

Episode 4 shows the difference between seeing something passively, looking at a target, and watching movement. The Remotion composition runs for ten 75-frame beats at 30 fps. Procedural sound effects are placed by frame.

## Render

Install Node.js, Python 3, and FFmpeg. From this directory run the following commands.

```sh
npm ci
python -m pip install -r requirements.txt
python scripts/build_sfx_timeline.py
npm run typecheck
npm run render
```

Remotion writes `out/see_look_watch_visual.mp4`. To use an existing Chromium binary, append `-- --browser-executable=/path/to/chromium` to the render command. The three Be Vietnam Pro weights are bundled for offline rendering.

## Source

- `src/index.tsx` registers `SeeLookWatchVisual` and places the WAVs from `src/data/timeline.json`.
- `src/Art.tsx` retains the Stage Card, typography zones, progress pill, and camera from `SecretOfOff` and `InOnAtVisual`.
- `src/Shots.tsx` contains the ten scenes. `src/components/Stickman.tsx` uses the character design established in `SurvivalEnglish`.
- `scripts/build_sfx_timeline.py` regenerates the WAVs and the edit timeline.

## Verification stills

Use `npx remotion still src/index.tsx SeeLookWatchVisual out/still.png --frame=20`. The four verification frames are 20, 184, 334 and 486. Frames 0 and 749 are the loop endpoints.

# IN · ON · AT

Episode 3 uses an open box, a flat surface, and a pinpoint to illustrate when to use IN, ON, and AT. The vertical composition runs for ten 75-frame beats at 30 fps with procedural sound effects placed by frame.

## Render

Install Node.js, Python 3, and FFmpeg. From this directory run the following commands.

```sh
npm ci
python -m pip install -r requirements.txt
python scripts/build_sfx_timeline.py
npm run typecheck
npm run render
```

Remotion writes `out/in_on_at_visual.mp4`. For an existing local Chromium installation, append `-- --browser-executable=/path/to/chromium` to the render command. The three Be Vietnam Pro weights are bundled for offline rendering.

## Source

- `src/index.tsx` registers `InOnAtVisual` and places the WAVs from `src/data/timeline.json`.
- `src/Art.tsx` uses the Stage Card, typography zones, progress pill, and frame-based camera from `SecretOfOff`.
- `src/Shots.tsx` contains the 10 scenes. `src/components/Stickman.tsx` retains the character from `SurvivalEnglish` and `SecretOfOff`.
- `scripts/build_sfx_timeline.py` regenerates the audio assets and timeline.

## Verification stills

Use `npx remotion still src/index.tsx InOnAtVisual out/still.png --frame=20`. The four verification frames are 20, 183, 325, and 493. Frames 0 and 749 are the loop endpoints.

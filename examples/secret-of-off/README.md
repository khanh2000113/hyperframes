# Secret of OFF

Episode 2 is an editable Remotion composition about three meanings of OFF. Its 10 beats each run for 75 frames. The soundtrack uses procedural effects timed by frame.

## Render locally

Install Node.js, Python 3 and FFmpeg. The three Be Vietnam Pro font weights are bundled for offline rendering.

```sh
npm ci
python -m pip install -r requirements.txt
python scripts/build_sfx_timeline.py
npm run typecheck
npm run render
```

The H.264 video is saved at `out/secret_of_off.mp4`. To use an existing Chromium binary, append `-- --browser-executable=/path/to/chromium` to the render command.

## Composition

- `src/index.tsx` registers `SecretOfOff` at 1080 × 1920 and 30 fps and places the sound cues.
- `src/Art.tsx` defines the 10 shots, frame-driven camera, progress pill, stage, and captions.
- `src/components/Stickman.tsx` adapts the SVG character from `SurvivalEnglish` on the `survival-english-shotcraft` branch.
- `scripts/build_sfx_timeline.py` regenerates the WAVs and `src/data/timeline.json`.

## Verification stills

Use `npx remotion still src/index.tsx SecretOfOff out/still.png --frame=20`. The verification frames for beats 1, 3, 5 and 8 are 20, 182, 324 and 564. Frames 0 and 749 are the loop endpoints.

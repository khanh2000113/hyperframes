# SAY · TELL · SPEAK

The series finale shows how SAY focuses on the words, TELL on the listener, and SPEAK on the language or the act of speaking. The Remotion composition runs for ten 75-frame beats at 30 fps with procedural sound effects placed by frame.

## Render

Install Node.js, Python 3, and FFmpeg. From this directory run the following commands.

```sh
npm ci
python -m pip install -r requirements.txt
python scripts/build_sfx_timeline.py
npm run typecheck
npm run render
```

Remotion writes `out/say_tell_speak_visual.mp4`. To use an existing Chromium binary, append `-- --browser-executable=/path/to/chromium`. The three Be Vietnam Pro weights are bundled for offline rendering.

## Source

- `src/index.tsx` registers `SayTellSpeakVisual` and places the WAVs from `src/data/timeline.json`.
- `src/Art.tsx` reuses the established Stage Card, typography zones, progress pill, and camera.
- `src/Shots.tsx` contains the ten scenes. `src/components/Stickman.tsx` uses the character design established in `SurvivalEnglish`.
- `scripts/build_sfx_timeline.py` regenerates the WAVs and edit timeline.

## Verification stills

Use `npx remotion still src/index.tsx SayTellSpeakVisual out/still.png --frame=20`. The four verification frames are 20, 190, 338 and 494. Frames 0 and 749 are the loop endpoints.

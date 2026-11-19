# Survival English

A vertical, 11-beat lesson on three English phrases for recovering mid-conversation. Remotion renders the editable React/SVG composition at 1080 × 1920, 30 fps. The default timing is 825 frames (27.5 seconds) with procedural sound effects and a 115 BPM marimba bed. Be Vietnam Pro is bundled for offline rendering.

## Setup on Windows

Install Node.js, Python, and FFmpeg, and confirm that `ffmpeg` is on PATH. Run the project setup once in Windows CMD.

```cmd
cd /d C:\Github\hyperframes\examples\survival-english-shotcraft
npm ci
python -m pip install -r requirements.txt
```

## Add narration and render

Place the recordings in `public\vo\` as `beat_01_1.mp3` through `beat_11_1.mp3`. Beats 3, 5, and 8 also accept `beat_03_2`, `beat_05_2`, and `beat_08_2` for the English line. WAV files work as well. When a beat has no audio file it uses its default timing, and longer recordings extend the beat and shift all subsequent beat starts. The timeline builder leaves the input recordings in place and generates normalized WAV copies.

From `C:\Github\hyperframes` run these two commands in Windows CMD after you add or change recordings.

```cmd
cd /d C:\Github\hyperframes\examples\survival-english-shotcraft && python scripts\build_timeline.py
npm run render
```

The MP4 appears at `out\survival_english_shotcraft.mp4`. For an existing Chrome or Chromium installation, pass `--browser-executable` after `npm run render --`.

## Project files

- `src/Art.tsx` contains frame-driven artwork, camera moves, progress, and text.
- `src/index.tsx` registers the Remotion composition and mixes the audio tracks.
- `scripts/build_timeline.py` generates the soundtrack and frame schedule in `src/data/timeline.json`.
- `public/fonts/OFL.txt` contains the bundled font license.

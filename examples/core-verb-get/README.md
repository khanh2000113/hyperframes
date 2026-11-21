# Series 2 · Episode 1 · GET

`CoreVerbGet` is a 1080×1920 Remotion composition with 780 frames at 30 fps.
The Stickman geometry and local Be Vietnam Pro fonts are adapted from
`SurvivalEnglish` on `survival-english-shotcraft`.

From this directory, install and render the episode.

```sh
npm ci
npm run render
```

The H.264 render is written to `out/core_verb_get.mp4`. To use an installed
Chromium executable, pass `--browser-executable=/path/to/chromium` after
`npm run render --`.

The frame cues in `src/data/timeline.json` drive the SFX-only soundtrack.
The WAVs are included in `public/sfx/`. To regenerate both, install the Python
dependency and run the synthesis script.

```sh
python -m pip install -r requirements.txt
npm run sfx
```

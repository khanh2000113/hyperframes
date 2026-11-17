# IN / ON / AT — English, made visible

A complete 26-second vertical lesson: 1080×1920, 30 fps, male English narration and pop / boing / thud / swoosh. Editable React/SVG source supports both Remotion and HyperFrames without a prerendered-video dependency.

## Quick start

Node 22+, FFmpeg, and Chrome/Chromium are required.

```sh
npm ci
npm run studio
npm run render
```

Remotion entry: `src/index.ts`. Composition: `InOnAt`, 780 frames at 30 fps. Default output: `output.mp4` (H.264, yuv420p, AAC audio). The render script normalizes the final mix to -16 LUFS with a -1.5 dBTP ceiling using FFmpeg; and encodes a standard limited-range yuv420p H.264 stream for broad phone/browser compatibility. If Chrome cannot be downloaded, use `npm run render -- --browser-executable=/path/to/chromium`.

## HyperFrames integration

```sh
npm run build:hyperframes
npx hyperframes lint
npx hyperframes validate
npx hyperframes inspect
npm run preview:hyperframes
npm run render:hyperframes
```

`src/Art.tsx` is the shared deterministic frame renderer. Remotion drives it with `useCurrentFrame()`. `src/hyperframes.tsx` listens to the official `hf-seek` event and synchronously renders the same frame with React `flushSync`. `src/gsap.ts` bundles the GSAP ESM distribution into a local browser file, avoiding UMD globals in the HyperFrames compiler. `index.html` defines a 26-second HyperFrames composition and separate timed narration/SFX clips; a paused, registered GSAP timeline supplies a short entrance. The bundled JS and GSAP are local files. No render-time network request is needed. A regular static server shows the initial frame; the HyperFrames Studio supplies the playback clock.

## Source layout / video-shotcraft handoff

- `src/index.ts`, `src/Root.tsx`: standard Remotion registration and composition.
- `src/Art.tsx`: editable SVG character, spatial diagrams, typography, transitions.
- `src/Lesson.tsx`: `<Audio>` narration and SFX sequences.
- `public/audio/`: all ready-to-use narration and effects.
- `index.html`, `src/hyperframes.tsx`, `public/lesson.js`: HyperFrames adapter.
- `STORYBOARD.md`, `DESIGN.md`, `audio-manifest.json`: script, art direction and narration metadata.

For a video-shotcraft workflow that accepts a standard Remotion project, select `src/index.ts` and composition `InOnAt`; the duration, resolution and fps are registered in `Root.tsx`. No video-shotcraft-specific schema or version was supplied, so a proprietary importer has not been tested. Standard Remotion rendering and the HyperFrames adapter are verified separately.

The target `khanh2000113/hyperframes` is a framework monorepo. Add this project as a self-contained folder such as `examples/in-on-at/`, then run commands from that folder. Do not replace the repository's root package.json. This package is prepared for upload; it does not push or overwrite the remote repository.

## Regenerate audio (optional)

The finished audio is included, so Python and models are unnecessary for normal rendering.

```sh
python -m pip install -r requirements.txt
python scripts/download_models.py
npm run audio
```

The generator first attempts male Edge TTS `en-US-GuyNeural`. If unavailable, it uses local Kokoro neural male `am_michael` at speed 0.96. Set `KOKORO_MODEL_DIR` to reuse an existing model directory. SFX are deterministically synthesized, with no external sample licensing. The ZIP excludes model weights, dependencies, caches and temporary render files.

## Character constraint

The Stickman head is a single unfilled SVG circle. There are no eyes, nose, mouth or facial features. The emoji in the Hook is separate text.

## Licensing

Original lesson code and artwork are supplied under MIT (LICENSE). DejaVu fonts are bundled under their own license (FONT-LICENSE.txt). GSAP retains its own license (GSAP-LICENSE.txt). Kokoro model licensing applies if you download weights; model weights are not redistributed here. Remotion's applicable license applies to your usage.

## Verification included

The `verification/` folder records TypeScript, HyperFrames lint/runtime/layout/motion/contrast checks and final MP4 stream validation. Craft heuristics are disabled for the shared frame-renderer adapter; actual SVG text bounds were checked at six key frames.

# Vertical stock promo

15 seconds, 1080×1920, 30 fps. Silent kinetic typography followed by Remotion compositing.

Render the base from the repository root:

```sh
HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium HYPERFRAMES_CACHE_DIR=/tmp/stock-promo-cache node packages/cli/bin/hyperframes.mjs render .agents/stock-promo --output shared-data/hyperframes-layer.mp4 --fps 30 --quality high --workers 2
node .agents/remotion-app/scripts/render.mjs --bg-video shared-data/hyperframes-layer.mp4 --output shared-data/final-combined-video.mp4
```

The growing chart is illustrative, with spring-driven node and financial icon animations. HyperFrames browser checks passed: runtime, layout, motion, contrast; composition nesting and deliberate scene-cover transitions produce nonblocking authoring warnings.

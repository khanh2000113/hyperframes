# SERIES 2 VISUAL TEMPLATE — TYPOGRAPHIC PLAYGROUND + INFINITE CANVAS (CORE VERBS)

## 0. REPO & CONTINUITY LOCK
1. Reuse the existing `hyperframes` + Remotion workspace and the channel's signature Stickman anatomy/proportions from `SurvivalEnglish` (branch `survival-english-shotcraft`)—same white circular head, clean charcoal strokes (`strokeWidth: 7–8`, rounded caps), expressive minimal face, and clean hand anatomy.
2. **BREAK AWAY FROM SERIES 1 LAYOUT:**
   - **NO** rounded Stage Card frame.
   - **NO** top `01/04` progress bar pill.
   - **NO** 3-color Blue/Amber/Green system.
   - **NO** split-screen quiz or 3-card recap stack.

---

## 1. AUDIO RULE: SFX-ONLY (NO VOICEOVER, NO MUSIC)
Voiceover and background music will be added later in ElevenLabs directly synced to the rendered `.mp4`.
- **DO NOT** generate any TTS / voiceover audio or background music.
- **DO generate crisp Procedural SFX (`public/sfx/`):** Synthesize tactile WAV effects via Python (`numpy` + `wave`) synced frame-accurately to camera pans, letter impacts, line-draw whooshes, pops, and zoom-outs (`whoosh`, `whoosh_soft`, `pop`, `pop_high`, `click`, `snap`, `ding`, `chime`, `boing`, `record_scratch`, `reverse_whoosh`, plus episode-specific SFX).
- **SFX Headroom:** Transient SFX at `0.18–0.30` gain; subtle swoosh/ambient SFX at `0.10–0.14` gain.

---

## 2. VISUAL SYSTEM: LIGHT TYPOGRAPHIC PLAYGROUND -> INFINITE CANVAS
- **Canvas:** `1080x1920` (9:16 vertical), `30fps`, render with `--codec=h264 --crf=18`.
- **Font:** `Be Vietnam Pro` (`600, 800, 900`) via `@remotion/google-fonts`.
- **Background:** Full-bleed Light Editorial Matte `#F7F6F2` with subtle dot-grid pattern (`#141416` at `9%` opacity, spacing `44px`) that smoothly fades in when entering Infinite Canvas mode.
- **Monochrome + 1 Signature Accent Color per Episode:**
  - Ink / Typography / Stickman Outlines: Deep Charcoal `#141416`
  - Secondary Muted Gray (connectors / subtle labels): `#8A8A8E`
  - **1 Episode Accent Color** (defined per episode, e.g., `#FF4D2A` Vermilion Orange for `GET`), plus a soft pastel tint of that SAME accent color for Stickman's torso shirt and soft node halos.

---

## 3. CAMERA & STAGING ARCHITECTURE
1. **Act 1 — Typographic Playground (Hook):**
   - Full-bleed light background. The core English verb (e.g., `GET`) is rendered massive (`280px–360px` ultra-bold) as physical terrain.
   - Stickman interacts physically with the letters (standing on top, leaning, pulling, or dodging falling meaning tags).
2. **Act 2 — Infinite Canvas (Core Hub + 4 Radial Branches):**
   - Build a single large virtual 2D world (e.g., `3600x3600` coordinate space) controlled by a smooth spring-interpolated **Virtual Camera (`x`, `y`, `scale`, subtle `rotate`)**.
   - Place the **Core Visual Meaning Hub** at `(0, 0)` and 4 illustrated Stickman situations around it, connected by animated dashed/curved vector paths (`stroke-dashoffset` drawing ahead of the camera).
   - Camera glides continuously from node to node (no hard card cuts), giving a fluid Vox / Figma-motion feel.
3. **Act 3 — The "Aha!" Zoom-Out & Seamless Loop:**
   - Camera pulls far back (`scale` zoom-out) so the viewer sees the Central Hub and all 4 live animated branches simultaneously on the dot-grid.
   - All 4 branches snap/retract back into the center, morphing into the exact Frame-0 giant Typographic Playground verb for a seamless loop.

---

## 4. SAFE MARGINS & CLEARANCE
- **Top Safe Margin (`y < 140px`):** Keep free of main content (optional tiny minimal tag like `CORE VERB • 01` at `y: 115px`).
- **Bottom UI Margin (`y > 1580px`):** Keep 100% empty for TikTok / Reels / Shorts UI.
- **Editorial Captions:** Place kinetic English phrases + clean 1-line Vietnamese meaning organically below the active node or in the lower-third (`y: 1320–1530px`) with zero overlap on Stickman or props.
- **Overhead Prop Clearance:** Always maintain `≥40px` clearance from Stickman's face/eyes.

---

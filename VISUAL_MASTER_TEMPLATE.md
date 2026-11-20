# MASTER PROMPT TEMPLATE — VISUAL ENGLISH MOTION GRAPHIC (HYPERFRAMES + REMOTION + VIDEO-SHOTCRAFT)

## 0. REPO, SKILL & TEMPLATE LOCK (MANDATORY)
1. Inspect the existing `hyperframes` repository and its Remotion add-on setup. Keep all existing folders and conventions intact.
2. Read and apply the **`video-shotcraft`** skill (in `skills/video-shotcraft/`) for camera choreography (punch-ins, micro-pans, whip-pans, impact shakes, snappy transitions) and micro-beat pacing.
3. **Reuse & preserve the exact visual design system** established in our Video 1 (`SurvivalEnglish3Phrases`)—including the rounded Stage Card, colored-torso Stickman component, progress pill, typography hierarchy, and pastel tint logic.

---

## 1. AUDIO RULE: SFX-ONLY (NO VOICEOVER, NO MUSIC)
Voiceover and background music will be added later in ElevenLabs directly synced to the rendered `.mp4`.
- **DO NOT** generate any TTS / voiceover audio (no `edge-tts`, no Piper, no offline fallback, no `public/vo/`).
- **DO NOT** generate any background music or rhythmic beat bed (`bg_bed.wav`).
- **DO generate crisp Procedural SFX (`public/sfx/`):** Write/run a Python script (`numpy` + `wave`) to synthesize clean, tactile WAV sound effects synced frame-accurately to every visual impact, pop, slide, transformation, and transition (e.g., `record_scratch`, `error_beep`, `crumble`, `pop`, `pop_high`, `whoosh`, `reverse_whoosh`, `vacuum`, `click`, `ding`, `snap`, `boing`, `tick_tock`, `buzzer`, `chime`, plus any topic-specific SFX listed in the Beat Sheet).
- **SFX Headroom Rule:** Keep transient SFX clean (`0.18–0.32` gain) and ambient/continuous SFX (like rain, wind, ticking) softer (`0.10–0.14` gain) so they leave plenty of clarity for the ElevenLabs voiceover later.
- **Deterministic Timeline:** Build `src/data/timeline.json` (`30fps`) directly from the exact target beat durations in the Episode Brief (no audio-length guessing).

---

## 2. LOCKED VISUAL DESIGN SYSTEM (BRAND IDENTITY)
- **Canvas:** `1080x1920` (9:16 vertical), `30fps`, render with `--codec=h264 --crf=18`.
- **Base Background:** Warm matte beige `#F5F0E6` with subtle 3% paper grain texture.
- **Font:** `Be Vietnam Pro` (`600, 800, 900`) via `@remotion/google-fonts` (crisp Vietnamese diacritics + bold English kinetic type).
- **Color-Coding Palette (Accent + Matching Soft Pastel Tint):**
  - Ink / Outlines: Matte Charcoal `#1D1D1F` (rounded caps/joins)
  - Hook / Error: Coral Red `#E63946` | Pastel Stage Tint: `#FDECEC` | Shirt: `#F5B7A5`
  - Section 1: Cobalt Blue `#2563EB` | Pastel Stage Tint: `#EBF2FE` | Shirt: `#BDD4FA`
  - Section 2: Amber Gold `#D97706` | Pastel Stage Tint: `#FEF5E6` | Shirt: `#F7CE8A`
  - Section 3: Emerald Green `#059669` | Pastel Stage Tint: `#E7F7F0` | Shirt: `#A5E4C9`
  - Neutral / Recap: Charcoal `#1D1D1F` | Pastel Stage Tint: `#F7F3EA`

---

## 3. LOCKED COMPONENT ARCHITECTURE & SAFE ZONES

### A. Zone 1 — Top Progress Pill (`y: 90px – 220px`)
- Centered white rounded pill (`border: 2px solid #1D1D1F`), displaying bold counter (`01/04`, `02/04`, etc.) on the left and a sleek horizontal progress bar on the right that smoothly fills using the current Beat's accent color.

### B. Zone 2 — Rounded Stage Card (`y: 260px – 1160px`, horizontal margin `~52px`)
- Large rounded rectangle (`border-radius: 40px`, `border: 3.5px solid #1D1D1F`), filled with the current Beat's soft pastel tint.
- **Mandatory Ambient Interior Details:**
  1. Soft concentric translucent white circular halo centered behind the action.
  2. Subtle horizontal dashed ground line near the bottom of the card (`opacity: 0.25`) grounding all characters.
  3. Two minimal `+` geometric sparkle accents in the current accent color placed asymmetrically near opposite corners (e.g., top-left & bottom-right), subtly pulsing.
- **Supported Layout Variants inside Zone 2:**
  - *Single Stage:* Default full card for character actions & props.
  - *Split-Screen Comparison:* Two side-by-side vertical rounded cards inside the same footprint (Left: soft red tint + Red `✕` circle badge | Right: soft green tint + Green `✓` circle badge).
  - *Recap Card Stack:* Neutral stage card containing 3 vertically stacked rounded pill-cards (`border: 2.5px solid #1D1D1F`), each tinted in its section's pastel color with a left icon box and bold numbered phrase.

### C. Signature Stickman Component (`src/components/Stickman.tsx`)
- **Proportions:** Large circular white head (`#FFFFFF`, charcoal outline `strokeWidth: 7`), rounded trapezoid/pill torso filled with pastel shirt color, clean charcoal stick arms/legs (`strokeWidth: 7–8`, rounded caps), soft oval ground shadow under feet.
- **Expressions & Hands:** Crisp minimalist eyes/mouth (smile, frown, open 'O', sweat drop, or badge overlay). Any pointing/counting hand must have clear anatomy (e.g., index finger strictly on outer edge of fist with thumb tucked across folded fingers).
- **STRICT Prop Clearance Rule:** Overhead props (umbrellas, clouds, hats, thought bubbles, speech bubbles) MUST maintain at least `35–40px` clearance from the Stickman's eyes/face so facial expressions are never obstructed.

### D. Zone 3 — Kinetic Typography (`y: 1210px – 1540px`)
- Strictly below the Stage Card; **ZERO overlap** with Zone 2 or Zone 4.
- Bold kinetic English headline using color-coded keyword highlights (charcoal + accent color), word-by-word spring bounce, or hollow outline emphasis where meaningful.
- Optional max 1-line Vietnamese translation or sub-phrase inside a clean pastel pill badge below the headline.
- CTA Beat: Clean bold Vietnamese text + inline rounded square icon pill (e.g., bookmark icon).

### E. Zone 4 — Bottom Safe Margin (`y: 1560px – 1920px`)
- Keep 100% empty for TikTok / Reels / Shorts UI overlays.

---

## 4. PACING & LOOP RULES
- **Micro-Beat Rhythm:** Every beat runs `1.5s–3.0s`. No frame may remain visually static for more than `1.0s`—maintain subtle idle breathing, bobbing, floating particles, pulsing `+` accents, or spring micro-motions.
- **Seamless Loop:** The final beat MUST transition visually into the exact Frame-0 geometry and staging of Beat 1, paired with a `reverse_whoosh` SFX.

---

## 5. STANDARD EXECUTION & VERIFICATION (FOR EVERY EPISODE)
1. Run the SFX & timeline script (`python scripts/build_sfx_timeline.py`).
2. Render the final SFX-only video to `out/<episode_filename>.mp4` (`1080x1920`, `30fps`, `--codec=h264 --crf=18`).
3. Render 4 verification still frames across key beats using `npx remotion still` and inspect for: zero text overlap, strict Zone 1–4 boundaries, `35–40px` face clearance from overhead props, and clean hand anatomy.

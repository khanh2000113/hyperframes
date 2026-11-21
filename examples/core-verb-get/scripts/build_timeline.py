"""Build the episode cue sheet and synthesize its one-shot PCM effects."""
import json
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FPS = 30
RATE = 48_000

# Each cue is (local frame, effect, volume[, playback rate]).
BEATS = (
    ("playground", 90, [(0, "record_scratch", .24), (16, "pop", .24),
                        (28, "pop_high", .22), (48, "error_beep", .19)]),
    ("core-hub", 90, [(0, "whoosh", .14), (26, "snap", .24), (40, "ding", .22)]),
    ("receive", 105, [(0, "whoosh_soft", .11), (28, "pop", .23), (46, "click", .20)]),
    ("become", 105, [(0, "whoosh_soft", .11), (32, "boing", .24), (50, "pop", .19)]),
    ("arrive", 105, [(0, "whoosh_soft", .11), (40, "click", .22), (54, "ding", .24)]),
    ("understand", 105, [(0, "whoosh_soft", .11), (34, "snap", .25), (46, "chime", .24)]),
    ("mind-map", 105, [(0, "whoosh", .14), (24, "pop", .23), (40, "pop_high", .23),
                       (56, "pop_high", .23, 1.12), (72, "ding", .24)]),
    ("loop", 75, [(75 - 14, "reverse_whoosh", .13)]),
)


def synthesize():
    rng = np.random.default_rng(209)

    def shot(seconds, voice, *, attack=.003, release=.014):
        t = np.arange(round(seconds * RATE)) / RATE
        ramp = np.minimum(t / attack, np.clip((seconds - t) / release, 0, 1))
        signal = voice(t) * np.minimum(ramp, 1)
        return np.asarray(signal * (29_000 / np.max(np.abs(signal))), dtype="<i2")

    def oscillator(t, hz):
        return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(hz, t.shape)) / RATE)

    def air(t, width):
        noise = rng.standard_normal(t.size)
        return np.convolve(noise, np.ones(width) / width, mode="same")

    def sweep(t, soft=False, reverse=False):
        p = t / (len(t) / RATE)
        envelope = p**2 if reverse else np.sin(np.pi * p)**1.35
        frequency = 90 + (260 * p if reverse else 200 * (1 - p))
        return envelope * (air(t, 36 if soft else 16) + .08 * oscillator(t, frequency))

    def pop(t, hz):
        return np.exp(-37 * t) * (
            oscillator(t, hz * (.43 + .57 * np.exp(-31 * t))) + .12 * air(t, 8)
        )

    def bell(t, hz):
        return np.exp(-12 * t) * (oscillator(t, hz) + .28 * np.exp(-9*t) * oscillator(t, hz * 2.73))

    effects = {
        "record_scratch": shot(.32, lambda t: np.exp(-6 * t) *
                               (air(t, 5) + .2 * oscillator(t, 118 + 45 * np.sin(76*t))) *
                               (.6 + .4 * np.cos(2*np.pi*22*t))),
        "pop": shot(.12, lambda t: pop(t, 383)),
        "pop_high": shot(.12, lambda t: pop(t, 690)),
        "error_beep": shot(.22, lambda t: np.exp(-6*t) * (oscillator(t, 420) +
                           .25 * oscillator(t, 615)) * np.where((t > .073) & (t < .106), .06, 1)),
        "whoosh": shot(.47, sweep),
        "whoosh_soft": shot(.36, lambda t: sweep(t, soft=True)),
        "reverse_whoosh": shot(14 / FPS, lambda t: sweep(t, soft=True, reverse=True), release=.008),
        "snap": shot(.095, lambda t: np.exp(-63*t) * (air(t, 4) +
                    .28 * oscillator(t, 1320 * np.exp(-8*t)))),
        "click": shot(.07, lambda t: np.exp(-98*t) * (air(t, 8) + .28 * oscillator(t, 1520))),
        "ding": shot(.34, lambda t: bell(t, 980), release=.065),
        "chime": shot(.44, lambda t: bell(t, 740) + .6 * np.where(t > .054,
                              bell(np.maximum(t - .054, 0), 1110), 0), release=.08),
        "boing": shot(.32, lambda t: np.exp(-14*t) * oscillator(
                            t, 154 + 248*np.exp(-12*t)*(1 + .45 * np.sin(95*t)))),
    }
    directory = ROOT / "public/sfx"
    directory.mkdir(parents=True, exist_ok=True)
    for name, samples in effects.items():
        with wave.open(str(directory / f"{name}.wav"), "wb") as wav:
            wav.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
            wav.writeframes(samples.tobytes())
    return effects


def main():
    effects = synthesize()
    beats, audio = [], []
    start = 0
    for name, duration, cues in BEATS:
        beats.append({"id": name, "start": start, "duration": duration})
        for offset, effect, gain, *rates in cues:
            rate = rates[0] if rates else 1
            frames = int(np.ceil(len(effects[effect]) * FPS / (RATE * rate)))
            audio.append({"frame": start + offset, "effect": effect,
                          "gain": gain, "rate": rate, "duration": frames})
        start += duration
    assert start == 780 and all(cue["frame"] + cue["duration"] <= start for cue in audio)
    timeline = {"id": "CoreVerbGet", "width": 1080, "height": 1920,
                "fps": FPS, "duration": start, "beats": beats, "audio": audio}
    destination = ROOT / "src/data/timeline.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(timeline, indent=2) + "\n")
    print(f"Wrote {len(effects)} WAVs and {len(audio)} frame cues for {start} frames.")


if __name__ == "__main__":
    main()

"""Generate deterministic, mono procedural effects and the 30 fps edit."""
import json
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
RATE = 48000
FPS = 30
BEAT_FRAMES = 75
CUES = [
    [("record_scratch", 0), ("error_beep", 10)],
    [("snap", 0), ("pop", 12), ("pop_high", 22), ("ding", 34)],
    [("whoosh", 0), ("boing", 16), ("pop", 30)],
    [("click", 8), ("pop_high", 26), ("chime", 42)],
    [("snap", 0), ("whoosh", 12), ("pop", 24)],
    [("click", 8), ("pop_high", 26), ("ding", 40)],
    [("whoosh", 0), ("snap", 14), ("ding", 28)],
    [("buzzer", 4), ("chime", 34)],
    [("pop", 6), ("pop_high", 24), ("pop_high", 42, 1.15)],
    [("reverse_whoosh", BEAT_FRAMES - 14)],
]
DURATIONS = {
    "record_scratch": .27, "error_beep": .18, "snap": .075, "whoosh": .26,
    "ding": .32, "click": .055, "pop": .13, "chime": .38,
    "boing": .37, "buzzer": .23, "pop_high": .12, "reverse_whoosh": 14 / FPS,
}
GAINS = {
    "record_scratch": .28, "error_beep": .22, "snap": .28, "whoosh": .21,
    "ding": .20, "click": .24, "pop": .27, "chime": .20,
    "boing": .25, "buzzer": .23, "pop_high": .24, "reverse_whoosh": .21,
}


def effect(name, seed):
    t = np.arange(round(RATE * DURATIONS[name])) / RATE
    u = t / DURATIONS[name]
    rng = np.random.default_rng(seed)
    raw = rng.uniform(-1, 1, len(t))
    noise = np.convolve(raw, np.ones(18) / 18, mode="same")
    if name in {"whoosh", "reverse_whoosh"}:
        signal = (noise + .08 * np.sin(2 * np.pi * (180 * t + 650 * t**2))) * np.sin(np.pi * u)**1.5
        if name == "reverse_whoosh":
            signal = signal[::-1] * (0.25 + u)
    elif name == "record_scratch":
        signal = (noise + .13 * np.sin(2 * np.pi * (690 * t - 1000 * t**2))) * np.exp(-4 * u) * (.6 + .4 * np.cos(2 * np.pi * 41 * t))
    elif name in {"click", "snap"}:
        frequency = 850 if name == "click" else 440
        signal = (raw * .5 + np.sin(2 * np.pi * frequency * t)) * np.exp(-12 * u)
    elif name in {"ding", "chime"}:
        signal = np.sin(2 * np.pi * 1046.5 * t) * np.exp(-5 * u)
        if name == "chime":
            delay = int(.065 * RATE)
            signal[delay:] += .7 * np.sin(2 * np.pi * 1568 * t[:-delay]) * np.exp(-5 * u[:-delay])
    elif name in {"error_beep", "buzzer"}:
        frequency = 330 if name == "error_beep" else 135
        phase = 2 * np.pi * frequency * t
        signal = (np.sin(phase) + .30 * np.sin(3 * phase) + .13 * np.sin(5 * phase)) * ((np.sin(2 * np.pi * 10 * t) > -.2) if name == "error_beep" else 1)
    else:
        start, end = {"pop": (500, 160), "pop_high": (800, 290), "boing": (240, 92)}[name]
        phase = 2 * np.pi * (start * t + (end - start) * t * u / 2)
        signal = np.sin(phase) * np.exp(-(7 if name.startswith("pop") else 3) * u)
        if name == "boing":
            signal *= .75 + .25 * np.cos(2 * np.pi * 17 * t)
    signal *= np.minimum(1, t / .003) * np.minimum(1, (DURATIONS[name] - t) / .012)
    signal /= np.max(np.abs(signal))
    return (signal * 32767).astype("<i2")


def main():
    folder = ROOT / "public/sfx"
    folder.mkdir(parents=True, exist_ok=True)
    for seed, name in enumerate(DURATIONS):
        with wave.open(str(folder / f"{name}.wav"), "wb") as stream:
            stream.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
            stream.writeframes(effect(name, seed).tobytes())
    beats = []
    for index, entries in enumerate(CUES):
        cues = [
            {"file": f"sfx/{name}.wav", "offset": offset, "gain": GAINS[name], "rate": rate[0] if rate else 1}
            for name, offset, *rate in entries
        ]
        beats.append({"number": index + 1, "start": index * BEAT_FRAMES, "frames": BEAT_FRAMES, "cues": cues})
    out = ROOT / "src/data/timeline.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"fps": FPS, "frames": len(beats) * BEAT_FRAMES, "beats": beats}, indent=2) + "\n")


if __name__ == "__main__":
    main()

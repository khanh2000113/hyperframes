"""Build narration clips, procedural audio, and a 30 fps edit timeline."""
import json
import math
import shutil
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FPS, RATE = 30, 48000
DURATIONS = (75, 60, 75, 75, 75, 90, 60, 75, 75, 75, 90)
DOUBLE = {3, 5, 8}
CUES = (
    ((27, 'record_scratch'), (39, 'error_beep')),
    ((0, 'crumble'), (13, 'pop'), (22, 'pop_high'), (31, 'pop_high', 1.21)),
    ((0, 'whoosh'), (25, 'vacuum'), (49, 'pop')),
    ((9, 'click'), (29, 'ding')),
    ((0, 'snap'), (18, 'boing')),
    ((13, 'pop'), (19, 'rain_short')),
    ((7, 'umbrella_pop'), (23, 'ding')),
    ((0, 'whoosh'), (14, 'tick_tock')),
    ((12, 'buzzer'), (37, 'chime')),
    ((7, 'pop'), (25, 'pop_high'), (43, 'pop_high', 1.21)),
    ((55, 'reverse_whoosh'),),
)
SFX = ROOT / 'public/sfx'
VO = ROOT / 'public/vo'
RNG = np.random.default_rng(125)


def time(seconds):
    return np.arange(round(seconds * RATE)) / RATE


def osc(t, hz):
    return np.sin(2 * np.pi * hz * t)


def sweep(t, start, end):
    return np.sin(2 * np.pi * (start * t + (end - start) * t * t / (2 * t[-1])))


def noise(t, smooth=5):
    return np.convolve(RNG.uniform(-1, 1, len(t)), np.ones(smooth) / smooth, mode='same')


def pluck(t, hz, decay=13):
    return (osc(t, hz) + .24 * osc(t, 3 * hz) + .095 * osc(t, 5.2 * hz)) * np.exp(-t * decay)


def write(path, values, peak=None, pan=0):
    if peak:
        values = values * (peak / max(np.max(np.abs(values)), .001))
    stereo = np.column_stack((values * (1 - max(0, pan)), values * (1 + min(0, pan))))
    with wave.open(str(path), 'wb') as file:
        file.setparams((2, 2, RATE, 0, 'NONE', 'not compressed'))
        file.writeframes((np.clip(stereo, -1, 1) * 32767).astype('<i2').tobytes())


def effects():
    size = {
        'record_scratch': .48, 'error_beep': .26, 'crumble': .39,
        'pop': .15, 'pop_high': .15, 'whoosh': .34, 'reverse_whoosh': .67,
        'vacuum': .73, 'click': .075, 'ding': .52, 'snap': .13, 'boing': .44,
        'rain_short': 2.25, 'umbrella_pop': .32, 'tick_tock': 1.85,
        'buzzer': .31, 'chime': .73,
    }
    for name, seconds in size.items():
        t = time(seconds)
        air = noise(t)
        phase = t / seconds
        decay = np.exp(-phase * 5)
        shape = np.sin(np.pi * phase) ** 1.4
        patterns = {
            'record_scratch': lambda: (air + .5 * sweep(t, 1500, 180)) * (.55 + .45 * osc(t, 19)) * decay,
            'error_beep': lambda: (osc(t, 240) + osc(t, 309)) * (np.cos(t * 38) > 0),
            'crumble': lambda: (air + .45 * sweep(t, 180, 63)) * (.36 + .64 * abs(osc(t, 34))) * decay,
            'pop': lambda: sweep(t, 440, 150) * decay,
            'pop_high': lambda: sweep(t, 650, 200) * decay,
            'whoosh': lambda: (air + .19 * sweep(t, 710, 220)) * shape,
            'reverse_whoosh': lambda: (air + .18 * sweep(t, 170, 940)) * phase ** 2.4,
            'vacuum': lambda: (air + .28 * sweep(t, 140, 1100)) * shape,
            'click': lambda: (air + osc(t, 990)) * decay,
            'ding': lambda: pluck(t, 850, 8) + .31 * pluck(t, 1275, 6),
            'snap': lambda: (air + .35 * osc(t, 390)) * decay,
            'boing': lambda: np.sin(2 * np.pi * (258 * t + 1.9 * osc(t, 9))) * decay,
            'rain_short': lambda: (air * .36 + noise(t, 2) * .2) * shape ** .4,
            'umbrella_pop': lambda: (sweep(t, 170, 490) + air * 1.4) * decay,
            'tick_tock': lambda: osc(t, 950 + 390 * (np.floor(t * 4) % 2)) * np.exp(-130 * (t % .25)),
            'buzzer': lambda: (osc(t, 126) + .23 * osc(t, 378)) * decay ** .5,
            'chime': lambda: pluck(t, 659, 9) + .7 * pluck(t, 988, 8) + .32 * pluck(t, 1318, 7),
        }
        gain = .19 if name in ('rain_short', 'tick_tock', 'reverse_whoosh', 'buzzer') else .43
        values = patterns[name]() * np.minimum(t / .008, 1) * np.minimum((seconds - t) / .028, 1)
        write(SFX / f'{name}.wav', values, gain)
    for count, rate in enumerate((1.21,), start=1):
        with wave.open(str(SFX / 'pop_high.wav'), 'rb') as file:
            samples = np.frombuffer(file.readframes(file.getnframes()), dtype='<i2')[::2] / 32767
        shifted = np.interp(np.arange(0, len(samples), rate), np.arange(len(samples)), samples)
        write(SFX / f'pop_high_{count}.wav', shifted)


def bed(frames):
    length = frames * RATE // FPS
    left = np.zeros(length)
    notes = (261.63, 392, 329.63, 440, 293.66, 392, 329.63, 349.23)
    interval = 60 / 115
    for index in range(math.ceil(frames / FPS / interval)):
        start = round(index * interval * RATE)
        t = time(.48)[:max(0, length - start)]
        note = notes[index % len(notes)]
        accent = .9 if index % 4 == 0 else .57
        sound = (pluck(t, note, 10) + .3 * pluck(t, note / 2, 15)) * accent
        left[start:start + len(t)] += sound * np.minimum(t / .018, 1) * np.minimum((.48 - t) / .032, 1)
    write(SFX / 'bg_bed.wav', left, .76)


def clean_voice(source, target):
    """Retain up to 150 ms at each quiet boundary and level the processed take."""
    filtering = (
        'silenceremove=start_periods=1:start_duration=0.025:start_threshold=-42dB:'
        'start_silence=0:stop_periods=-1:stop_duration=0.14:stop_threshold=-42dB:'
        'stop_silence=0:window=0.006,loudnorm=I=-16:TP=-2:LRA=7'
    )
    subprocess.run([
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
        '-af', filtering, '-ar', str(RATE), '-ac', '1', '-c:a', 'pcm_s16le', str(target),
    ], check=True)
    with wave.open(str(target), 'rb') as file:
        samples = file.getnframes()
    if not samples:
        raise ValueError(f'{source.name} has no usable speech after silence removal')
    return math.ceil(samples * FPS / RATE)


def main():
    SFX.mkdir(parents=True, exist_ok=True)
    VO.mkdir(parents=True, exist_ok=True)
    processed = VO / 'processed'
    processed.mkdir(exist_ok=True)
    effects()
    beats, frame = [], 0
    with tempfile.TemporaryDirectory(dir=VO) as staging:
        for number, base in enumerate(DURATIONS, 1):
            tracks, cursor = [], 3
            for part in range(1, 3 if number in DOUBLE else 2):
                stem = f'beat_{number:02d}_{part}'
                source = next((VO / f'{stem}.{ext}' for ext in ('mp3', 'wav')
                               if (VO / f'{stem}.{ext}').is_file()), None)
                if source:
                    output = f'{stem}.wav'
                    length = clean_voice(source, Path(staging) / output)
                    tracks.append({'file': f'vo/processed/{output}', 'offset': cursor, 'frames': length, 'part': part})
                    cursor += length + 3
            phrase_offset = next((track['offset'] for track in tracks if track['part'] == 2), 0)
            phrase_hold = phrase_offset + 38 if phrase_offset else 0
            duration = max(base, cursor + (14 if number == 11 else 3), phrase_hold)
            cues = []
            for offset, name, *pitch in CUES[number - 1]:
                if pitch:
                    name = 'pop_high_1'
                if number == 11:
                    offset = duration - 35
                cues.append({'file': f'sfx/{name}.wav', 'offset': offset})
            beats.append({'number': number, 'start': frame, 'frames': duration, 'voice': tracks, 'cues': cues})
            frame += duration
        for wave_file in Path(staging).glob('*.wav'):
            shutil.move(str(wave_file), processed / wave_file.name)
    bed(frame)
    payload = {'fps': FPS, 'frames': frame, 'beats': beats}
    destination = ROOT / 'src/data/timeline.json'
    pending = destination.with_suffix('.tmp')
    pending.write_text(json.dumps(payload, indent=2) + '\n', encoding='utf-8')
    pending.replace(destination)
    count = sum(len(beat['voice']) for beat in beats)
    print(f'{frame} frames at {FPS} fps ({frame / FPS:.2f}s), {count} voiceover clips')


if __name__ == '__main__':
    main()

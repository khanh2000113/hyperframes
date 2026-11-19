import { Audio, Composition, Sequence, registerRoot, staticFile, useCurrentFrame } from "remotion";
import { Art } from "./Art";
import data from "./data/timeline.json";
import "./fonts";

type Cue = { file: string; offset: number };
type Beat = {
  number: number;
  start: number;
  frames: number;
  cues: Cue[];
  voice: (Cue & { part: number; frames: number })[];
};
const timeline: { fps: number; frames: number; beats: Beat[] } = data;

function SurvivalEnglish() {
  const frame = useCurrentFrame();
  const beat =
    timeline.beats.find((b) => frame < b.start + b.frames) ??
    timeline.beats[timeline.beats.length - 1];
  const bedLevel = 10 ** (-22 / 20);
  const scratch = timeline.beats[0].cues[0].offset;
  const nextBeat = timeline.beats[1].start;
  const volume = (audioFrame: number) =>
    audioFrame < scratch
      ? bedLevel * Math.min(1, (scratch - audioFrame) / 3)
      : bedLevel * Math.min(1, Math.max(0, (audioFrame - nextBeat) / 4));
  const spokenPhrase = beat.voice.find((voice) => voice.part === 2);
  return (
    <>
      <Art
        number={beat.number}
        frame={frame - beat.start}
        total={beat.frames}
        voiceAt={spokenPhrase?.offset}
      />
      <Audio src={staticFile("sfx/bg_bed.wav")} volume={volume} />
      {timeline.beats.flatMap(({ start, cues, voice }) => [
        ...cues.map(({ file, offset }) => (
          <Sequence key={`${start}:${offset}:${file}`} from={start + offset} layout="none">
            <Audio src={staticFile(file)} volume={0.84} />
          </Sequence>
        )),
        ...voice.map(({ file, offset, frames }) => (
          <Sequence key={file} from={start + offset} durationInFrames={frames} layout="none">
            <Audio src={staticFile(file)} />
          </Sequence>
        )),
      ])}
    </>
  );
}
registerRoot(() => (
  <Composition
    id="SurvivalEnglish"
    component={SurvivalEnglish}
    width={1080}
    height={1920}
    fps={timeline.fps}
    durationInFrames={timeline.frames}
  />
));

import { Audio, Composition, Sequence, registerRoot, staticFile, useCurrentFrame } from "remotion";
import { Art } from "./Art";
import timeline from "./data/timeline.json";
import "./fonts";

function SecretOfOff() {
  const frame = useCurrentFrame();
  const beat = timeline.beats[Math.min(Math.floor(frame / 75), timeline.beats.length - 1)];
  return (
    <>
      <Art beat={beat.number} frame={frame - beat.start} />
      {timeline.beats.flatMap(({ start, cues }) =>
        cues.map(({ file, offset, gain, rate }) => (
          <Sequence key={`${start}:${offset}:${file}`} from={start + offset} layout="none">
            <Audio src={staticFile(file)} volume={gain} playbackRate={rate} />
          </Sequence>
        )),
      )}
    </>
  );
}

registerRoot(() => (
  <Composition
    id="SecretOfOff"
    component={SecretOfOff}
    width={1080}
    height={1920}
    fps={timeline.fps}
    durationInFrames={timeline.frames}
  />
));

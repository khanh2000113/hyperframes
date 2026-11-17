import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Art } from "./Art";
const C = { paper: "#F7F3E8" };
const SFX: [number, string, number][] = [
  [0.2, "pop", 0.5],
  [0.7, "pop", 0.4],
  [1.2, "pop", 0.4],
  [3.2, "pop", 0.7],
  [3.8, "swoosh", 0.38],
  [4.3, "pop", 0.5],
  [5.15, "boing", 0.5],
  [6.4, "thud", 0.35],
  [9.8, "swoosh", 0.38],
  [10.2, "thud", 0.38],
  [10.65, "boing", 0.5],
  [12.1, "thud", 0.7],
  [15.85, "swoosh", 0.45],
  [17.1, "pop", 0.55],
  [18.8, "pop", 0.32],
  [20.3, "pop", 0.32],
  [21.8, "swoosh", 0.4],
  [22.25, "pop", 0.45],
  [23.5, "pop", 0.35],
];
export const Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <style>{`@font-face{font-family:Display;src:url('${staticFile("Display.ttf")}')}@font-face{font-family:Body;src:url('${staticFile("Body.ttf")}')}`}</style>
      <Art frame={frame} />
      {[
        [0.25, "hook"],
        [4.45, "in"],
        [10.45, "on"],
        [16.65, "at"],
        [22.3, "outro"],
      ].map(([s, name]) => (
        <Sequence key={name} from={Math.round(Number(s) * 30)}>
          <Audio src={staticFile(`audio/${name}.mp3`)} volume={1} />
        </Sequence>
      ))}
      {SFX.map(([s, name, vol], i) => (
        <Sequence
          key={i}
          from={Math.round(s * 30)}
          durationInFrames={Math.min(24, 780 - Math.round(s * 30))}
        >
          <Audio src={staticFile(`audio/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

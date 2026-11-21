import { fontFamily } from "@remotion/google-fonts/BeVietnamPro";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { Drop, INK, ORANGE, PAPER, Person, Rays, TINT, bounce, ease, mix, progress } from "./Art";
import { Illustration, nodes } from "./Branches";
import timeline from "./data/timeline.json";

const { beats, width, height } = timeline;
const center = { x: 540, y: 780 };
const wideScale = 0.46;
const wide = beats[6].start;
const loop = beats[7].start;

type Camera = { x: number; y: number; scale: number; rotation: number };
const hubCamera: Camera = { x: 0, y: 0, scale: 1.04, rotation: 0 };
const mapCamera: Camera = { x: 0, y: 0, scale: wideScale, rotation: 0 };
const beatCameras: Camera[] = [
  { x: 0, y: 0, scale: 1.85, rotation: 0.6 },
  hubCamera,
  ...nodes.map(({ x, y }) => ({ x, y: y - 10, scale: 1.02, rotation: 0 })),
  mapCamera,
  mapCamera,
];

function cameraAt(frame: number, index: number): Camera {
  const relative = frame - beats[index].start;
  const from = beatCameras[Math.max(0, index - 1)];
  const to = beatCameras[index];
  const arrival = bounce(relative, 0, index === 6 ? 25 : 30);
  const settle = ease(relative, 0, index === 6 ? 24 : 29);
  const arc = index >= 2 && index <= 5 ? Math.sin(Math.PI * settle) : 0;
  return {
    x: mix(from.x, to.x, settle) + arc * ((from.x + to.x) * -0.11),
    y: mix(from.y, to.y, settle) + arc * ((from.y + to.y) * -0.12),
    scale: mix(from.scale, to.scale, arrival) - 0.15 * arc,
    rotation: mix(from.rotation, to.rotation, settle) + arc * (index % 2 ? -1.45 : 1.45),
  };
}

function Editorial({
  children,
  y = 1380,
  size = 65,
  weight = 900,
  color = INK,
}: {
  children: ReactNode;
  y?: number;
  size?: number;
  weight?: number;
  color?: string;
}) {
  return (
    <text
      x={center.x}
      y={y}
      textAnchor="middle"
      fill={color}
      xmlSpace="preserve"
      fontSize={size}
      fontWeight={weight}
      letterSpacing={size >= 60 ? -2.2 : -0.6}
    >
      {children}
    </text>
  );
}

const tags = [
  { text: "Lấy?", x: 323, start: 2, hit: 16, rest: 632, angle: -14 },
  { text: "Hiểu?", x: 750, start: 9, hit: 28, rest: 652, angle: 13 },
  { text: "Đến?", x: 182, start: 19, hit: 36, rest: 686, angle: -14 },
  { text: "Bị?", x: 891, start: 25, hit: 44, rest: 685, angle: 16 },
];

function Playground({ frame, returning }: { frame: number; returning: boolean }) {
  const handoff = returning ? 0 : ease(frame, 90, 113);
  const surprise = returning ? 0 : ease(frame, 46, 51) * (1 - ease(frame, 57, 74));
  const scale = 1 + 0.07 * surprise + 0.98 * handoff;
  const shake = 5.5 * surprise * Math.sin((frame - 46) * 2.8);
  const legScale = 0.8;
  const land = returning ? bounce(frame, 18, 28) : 1;
  const pose = returning ? "balance" : frame >= 48 && frame < 75 ? "freeze" : "balance";

  return (
    <g opacity={returning ? ease(frame, 12, 33) : 1 - handoff}>
      <g clipPath="url(#art-window)">
        <g transform={`translate(${center.x + shake} 778) scale(${scale}) translate(-540 -778)`}>
          <g fill={INK} fontWeight="900" fontSize="348">
            <text x="162" y="990" textLength="277" lengthAdjust="spacingAndGlyphs">
              G
            </text>
            <text x="439" y="990" textLength="239" lengthAdjust="spacingAndGlyphs">
              E
            </text>
            <text x="678" y="990" textLength="240" lengthAdjust="spacingAndGlyphs">
              T
            </text>
          </g>
          <Person
            x={548}
            y={737 - 318 * legScale - (1 - land) * 80}
            scale={legScale}
            pose={pose}
            frame={returning ? Math.min(0, frame - 52) : frame}
          />
          {!returning &&
            tags.map(({ text, x, start, hit, rest, angle }, index) => {
              const fall = progress(frame, start, hit) ** 1.65;
              const rebound = progress(frame, hit, hit + 14);
              const air =
                frame < hit
                  ? mix(220 + (index % 2) * 42, 717, fall)
                  : mix(717, rest, rebound) - Math.sin(Math.PI * rebound) * 120;
              const visible = ease(frame, start, start + 4) * (1 - ease(frame, 79, 92));
              return (
                <g
                  key={text}
                  opacity={visible}
                  transform={`translate(${x + Math.sign(x - 540) * 22 * rebound} ${air}) rotate(${angle * (1 - 0.43 * rebound)})`}
                >
                  <rect
                    x="-63"
                    y="-25"
                    width="126"
                    height="50"
                    rx="12"
                    fill={PAPER}
                    stroke={ORANGE}
                    strokeWidth="4"
                  />
                  <text y="11" textAnchor="middle" fill={INK} fontWeight="800" fontSize="32">
                    {text}
                  </text>
                </g>
              );
            })}
          {!returning && (
            <Drop
              x={676 + progress(frame, 48, 69) * 12}
              y={506 + progress(frame, 48, 69) * 38}
              scale={0.76}
              opacity={surprise}
            />
          )}
        </g>
      </g>
      {!returning && (
        <g opacity={1 - ease(frame, 78, 96)}>
          <Editorial y={1360}>
            1 TỪ MÀ <tspan fill={ORANGE}>CHỤC NGHĨA</tspan>?
          </Editorial>
        </g>
      )}
    </g>
  );
}

function Hub({
  frame,
  overview,
  personOpacity,
}: {
  frame: number;
  overview: number;
  personOpacity: number;
}) {
  const pull = ease(frame, 20, 38);
  const glow = Math.min(1, bounce(frame, 38, 22));
  const shift = mix(0, 55, pull);
  return (
    <g>
      <circle
        cx="103"
        cy="-39"
        r={92 + 5 * Math.sin(frame / 11)}
        fill={TINT}
        opacity={glow * 0.85}
      />
      <circle cx="-214" cy="-39" r="65" fill={PAPER} stroke={INK} strokeWidth="11" />
      <path
        d={`M${-128 + shift * 0.38} -39 H${41 + shift * 0.18}`}
        fill="none"
        stroke={ORANGE}
        strokeWidth="17"
        strokeLinecap="round"
      />
      <path d="M-13-77 L48-39 L-13-1Z" fill={ORANGE} transform={`translate(${shift * 0.18} 0)`} />
      <circle cx="111" cy="-39" r="58" fill={PAPER} stroke={ORANGE} strokeWidth="9" />
      <circle cx="111" cy="-39" r={58 * glow} fill={ORANGE} />
      <Rays x={111} y={-40} size={111} opacity={glow * (1 - 0.42 * overview)} />
      <g opacity={personOpacity}>
        <path
          d={`M152 -39 H${mix(264, 277, pull) + (-115 + 40 * pull) * 0.85}`}
          stroke={ORANGE}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <Person
          x={mix(264, 277, pull)}
          y={-130}
          frame={frame}
          pose="pull"
          scale={0.85}
          action={pull}
        />
      </g>
      <g opacity={overview}>
        <rect x="-122" y="77" width="220" height="99" rx="49" fill={PAPER} />
        <text
          x="-12"
          y="154"
          textAnchor="middle"
          fontSize="101"
          letterSpacing="-4"
          fontWeight="900"
          fill={INK}
        >
          GET
        </text>
      </g>
    </g>
  );
}

function BranchLabel({ node, wideMode }: { node: (typeof nodes)[number]; wideMode: boolean }) {
  return wideMode ? (
    <g>
      <rect x="-284" y="229" width="568" height="82" rx="37" fill={PAPER} />
      <text
        y="290"
        textAnchor="middle"
        fontSize="68"
        fontWeight="900"
        fill={INK}
        letterSpacing="-2.5"
        xmlSpace="preserve"
      >
        {node.before}
        <tspan fill={ORANGE}>GET</tspan>
        {node.after}
      </text>
    </g>
  ) : (
    <>
      <Editorial y={1380} size={85}>
        {node.before}
        <tspan fill={ORANGE}>GET</tspan>
        {node.after}
      </Editorial>
      <Editorial y={1460} size={49} weight={600}>
        {node.meaning}
      </Editorial>
    </>
  );
}

function World({ frame, index }: { frame: number; index: number }) {
  const camera = cameraAt(frame, index);
  const reveal = ease(frame, 94, 117);
  const fold = Math.max(0, bounce(frame, loop + 4, 43));
  const mapLabels = ease(frame, wide + 10, wide + 24);
  const worldOpacity = reveal * (1 - ease(frame, loop + 16, loop + 37));
  const contraction = Math.max(0.025, 1 - fold);
  const formulaScale = 1 + fold * 0.24;

  return (
    <g opacity={worldOpacity} clipPath="url(#art-window)">
      <g
        transform={`translate(${center.x} ${center.y}) scale(${camera.scale}) rotate(${camera.rotation}) translate(${-camera.x} ${-camera.y})`}
      >
        <g transform={`scale(${contraction})`}>
          {nodes.map((node, i) => {
            const start = beats[i + 2].start;
            const drawn = ease(frame, start - 4, start + 28);
            return (
              <g key={node.id}>
                <mask
                  id={`draw-${node.id}`}
                  maskUnits="userSpaceOnUse"
                  x="-1600"
                  y="-1300"
                  width="3200"
                  height="2600"
                >
                  <path
                    d={node.path}
                    pathLength="100"
                    fill="none"
                    stroke="white"
                    strokeWidth="32"
                    strokeDasharray="100 100"
                    strokeDashoffset={100 * (1 - drawn)}
                  />
                </mask>
                <path
                  d={node.path}
                  mask={`url(#draw-${node.id})`}
                  fill="none"
                  stroke={ORANGE}
                  strokeWidth="9"
                  strokeDasharray="13 22"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>
        <g transform={`scale(${formulaScale})`}>
          <Hub
            frame={frame - beats[1].start}
            overview={mapLabels}
            personOpacity={1 - ease(frame, beats[2].start + 4, beats[2].start + 20)}
          />
        </g>
        {nodes.map((node, i) => {
          const age = frame - beats[i + 2].start;
          const appearance = ease(age, -3, 19);
          const phase = progress(frame, wide + 16 + i * 16, wide + 32 + i * 16);
          const pulse = 1 + 0.08 * Math.sin(Math.PI * phase);
          const scale = Math.max(0.03, 1 - 1.14 * fold) * pulse;
          if (appearance === 0) return null;
          return (
            <g
              key={node.id}
              opacity={appearance}
              transform={`translate(${node.x * contraction} ${node.y * contraction}) scale(${scale})`}
            >
              <ellipse cy="32" rx="291" ry="223" fill={TINT} opacity={0.43 * mapLabels} />
              <Illustration node={node.id} frame={age} overview={index >= 6} />
              <g opacity={mapLabels}>
                <BranchLabel node={node} wideMode />
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
}

function CanvasCopy({ frame, index }: { frame: number; index: number }) {
  if (index === 0 || index === 7) return null;
  const age = frame - beats[index].start;
  const last = beats[index].duration;
  const enter = ease(age, index === 6 ? 20 : 13, index === 6 ? 33 : 25);
  const exit = 1 - ease(age, last - 9, last);
  return (
    <g opacity={enter * exit} transform={`translate(0 ${(1 - enter) * 25})`}>
      {index === 1 && (
        <>
          <Editorial y={1360} size={58}>
            1 LÕI DUY NHẤT:
          </Editorial>
          <Editorial y={1441} size={53} color={ORANGE}>
            CHUYỂN TRẠNG THÁI / KÉO VỀ
          </Editorial>
        </>
      )}
      {index >= 2 && index <= 5 && <BranchLabel node={nodes[index - 2]} wideMode={false} />}
      {index === 6 && (
        <Editorial y={1380} size={57}>
          1 LÕI — <tspan fill={ORANGE}>HIỂU CẢ TRĂM CÂU</tspan>
        </Editorial>
      )}
    </g>
  );
}

function Bookmark({ frame }: { frame: number }) {
  const rise = bounce(frame, 23, 30);
  return (
    <g opacity={ease(frame, 20, 29) * (1 - ease(frame, 55, 68))}>
      <g transform="translate(-27 0)">
        <Editorial y={1380} size={66}>
          Lưu lại khỏi học vẹt
        </Editorial>
      </g>
      <path
        transform={`translate(851 ${1353 - 46 * (1 - rise)}) scale(${0.7 + 0.3 * rise})`}
        d="M-17-23 H17 Q21-23 21-19 V26 L0 13 L-21 26 V-19 Q-21-23-17-23Z"
        fill={ORANGE}
        stroke={ORANGE}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </g>
  );
}

export function CoreVerbGet() {
  const renderFrame = useCurrentFrame();
  // Draw the exact opening scene once the returning character has landed.
  const frame = renderFrame >= timeline.duration - 2 ? 0 : renderFrame;
  const index = beats.findIndex(
    ({ start, duration }) => frame >= start && frame < start + duration,
  );
  const last = index === 7;
  const grid = ease(frame, 96, 122) * (1 - ease(frame, loop + 4, loop + 38));
  const returnToHook = ease(frame, loop + 63, loop + 73);

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fontFamily={fontFamily}
        aria-label="GET — English core verb"
      >
        <defs>
          <pattern id="dot-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <circle cx="22" cy="22" r="2.2" fill={INK} opacity=".09" />
          </pattern>
          <clipPath id="art-window">
            <rect width={width} y="140" height="1120" />
          </clipPath>
        </defs>
        <rect y="140" width={width} height="1440" fill="url(#dot-grid)" opacity={grid} />
        {index >= 1 && <World frame={frame} index={index} />}
        {index <= 1 && <Playground frame={frame} returning={false} />}
        {last && <Playground frame={frame - loop} returning />}
        <CanvasCopy frame={frame} index={index} />
        {last && <Bookmark frame={frame - loop} />}
        {last && (
          <g opacity={returnToHook}>
            <Editorial y={1360}>
              1 TỪ MÀ <tspan fill={ORANGE}>CHỤC NGHĨA</tspan>?
            </Editorial>
          </g>
        )}
      </svg>
      {timeline.audio.map(({ frame: start, duration, effect, gain, rate }) => (
        <Sequence key={start} name={effect} from={start} durationInFrames={duration} layout="none">
          <Audio src={staticFile(`sfx/${effect}.wav`)} volume={gain} playbackRate={rate} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

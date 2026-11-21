import { Easing, interpolate, spring } from "remotion";

export const PAPER = "#F7F6F2";
export const INK = "#141416";
export const GRAY = "#8A8A8E";
export const ORANGE = "#FF4D2A";
export const TINT = "#FFE4DE";
const WHITE = "#FFFFFF";

export const outline = {
  stroke: INK,
  strokeWidth: 8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

export const progress = (frame: number, from: number, to: number, easing = Easing.linear) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const ease = (frame: number, from: number, to: number) =>
  progress(frame, from, to, Easing.inOut(Easing.cubic));

export const bounce = (frame: number, start: number, duration: number) =>
  frame <= start
    ? 0
    : spring({
        frame: frame - start,
        fps: 30,
        durationInFrames: duration,
        config: { damping: 12, stiffness: 170, mass: 0.8 },
      });

type Pose = "balance" | "freeze" | "pull" | "reach" | "idle" | "shiver" | "run" | "puzzle" | "snap";

// Head, shirt, facial marks and neutral stance derive from SurvivalEnglish's Person.
export function Person({
  x,
  y,
  frame,
  pose = "idle",
  scale = 1,
  action = 0,
}: {
  x: number;
  y: number;
  frame: number;
  pose?: Pose;
  scale?: number;
  action?: number;
}) {
  const cycle = Math.sin(frame * 0.36);
  const frozen = pose === "freeze";
  const uneasy = pose === "balance" || pose === "shiver" || pose === "puzzle";
  const tilt = frozen ? 0 : pose === "puzzle" ? -8 : Math.sin(frame * 0.15) * 3;
  const stride = pose === "run" ? cycle * (1 - action) : 0;
  let left = "M-48 115 Q-80 145 -91 197";
  let right = "M43 115 Q82 150 100 196";
  let hand: [number, number] | undefined;

  switch (pose) {
    case "balance":
      left = `M-48 115 Q-82 130 -115 ${103 + cycle * 13}`;
      right = `M43 115 Q82 128 114 ${98 - cycle * 13}`;
      break;
    case "freeze":
      left = "M-45 112 L-70 210";
      right = "M45 112 L70 210";
      break;
    case "pull":
      left = `M-48 115 Q-75 142 ${-115 + 40 * action} 112`;
      right = "M43 115 Q77 143 72 189";
      hand = [-115 + 40 * action, 112];
      break;
    case "reach":
      hand = [154 - 42 * action, 138 - 20 * action];
      right = `M43 115 Q96 ${149 - 24 * action} ${hand[0]} ${hand[1]}`;
      break;
    case "shiver":
      left = "M-48 115 Q-96 167 -36 159";
      right = "M43 115 Q92 165 20 172";
      hand = [20, 172];
      break;
    case "run":
      left = `M-48 115 Q${-76 - stride * 38} 153 ${-92 - stride * 43} ${164 - stride * 31}`;
      right = `M43 115 Q${83 + stride * 41} 148 ${91 + stride * 46} ${158 + stride * 34}`;
      break;
    case "puzzle":
      right = "M43 109 Q106 67 75 21 L54 5";
      break;
    case "snap":
      hand = [123, 84];
      right = "M43 113 Q91 143 109 108 L123 84";
      break;
  }

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="4" cy="325" rx="102" ry="14" fill={INK} opacity=".09" />
      <g transform={`rotate(${pose === "run" ? 9 * (1 - action) : 0} 0 190)`} {...outline}>
        <path
          d={`M-11 210 L${-38 + stride * 62} ${269 - Math.max(0, stride) * 30} L${-70 + stride * 99} ${318 - Math.max(0, stride) * 42} h27
          M14 210 L${40 - stride * 62} ${274 + Math.min(0, stride) * 34} L${67 - stride * 99} ${318 + Math.min(0, stride) * 42} h20`}
          fill="none"
        />
        <path d={left} fill="none" />
        <path d={right} fill="none" />
        <path
          d="M-38 87 Q0 71 39 87 Q63 98 57 131 L48 193 Q43 212 23 214 H-25 Q-46 212 -50 190 L-57 130 Q-61 101 -38 87Z"
          fill={TINT}
        />
        <path d="M-20 86 Q0 101 20 86" fill="none" strokeWidth="5" />
        <g transform={`rotate(${tilt} 0 40)`}>
          <circle cy="13" r="62" fill={WHITE} />
          <path d="M-47 -25 Q-31 -55 -6 -51" fill="none" strokeWidth="5" />
          <ellipse
            cx="-13"
            cy="10"
            rx={frozen ? 4 : 5}
            ry={frozen ? 4 : 7}
            fill={INK}
            stroke="none"
          />
          <ellipse
            cx="23"
            cy="10"
            rx={frozen ? 4 : 5}
            ry={frozen ? 4 : 7}
            fill={INK}
            stroke="none"
          />
          <path
            d={frozen || uneasy ? "M1 39 Q14 28 30 38" : "M-4 34 Q15 51 34 32"}
            fill="none"
            strokeWidth="5"
          />
        </g>
        {hand && (
          <g transform={`translate(${hand[0]} ${hand[1]}) rotate(${pose === "snap" ? -47 : 0})`}>
            <path
              d="M-12 6 Q-15 0 -9-4 L-2-7 L2-14 Q5-18 9-15 Q12-12 9-7 L7-4 H16 Q23-4 22 2 L20 12 Q19 18 12 18 H-2 Q-10 17-12 6Z"
              fill={WHITE}
              strokeWidth="4"
            />
            <path d="M9 2 H19 M8 8 H18" fill="none" strokeWidth="2.5" />
          </g>
        )}
      </g>
    </g>
  );
}

export function Drop({
  x,
  y,
  scale = 1,
  opacity = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0-18 Q15 2 12 10 Q9 19 0 19 Q-9 19-12 10 Q-15 2 0-18Z"
      fill={ORANGE}
      opacity={opacity}
    />
  );
}

export function Rays({
  x,
  y,
  size,
  opacity = 1,
}: {
  x: number;
  y: number;
  size: number;
  opacity?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={ORANGE}
      strokeWidth="5"
      strokeLinecap="round"
      opacity={opacity}
    >
      {[-170, -125, -90, -55, -10].map((angle) => (
        <path key={angle} transform={`rotate(${angle})`} d={`M${size} 0 h17`} />
      ))}
    </g>
  );
}

export function Floor({ x = 0, y = 205, width = 445 }: { x?: number; y?: number; width?: number }) {
  return (
    <path
      d={`M${x - width / 2} ${y} h${width}`}
      fill="none"
      stroke={GRAY}
      strokeWidth="3"
      opacity=".5"
      strokeLinecap="round"
    />
  );
}

const INK = "#1D1D1F";
const WHITE = "#FFFFFF";
const outline = {
  stroke: INK,
  strokeWidth: 8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Stickman({
  x,
  y,
  scale = 1,
  f = 0,
  face = 1,
  pose = "idle",
  shirt = "#D9E4FD",
  hand,
  gaze = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  f?: number;
  face?: number;
  pose?:
    | "wave"
    | "walk"
    | "squint"
    | "sit"
    | "celebrate"
    | "idle"
    | "talk"
    | "freeze"
    | "scratch"
    | "nod"
    | "point"
    | "roof"
    | "thumb"
    | "index"
    | "worry";
  shirt?: string;
  hand?: [number, number];
  gaze?: number;
}) {
  const beat = Math.sin(f * 0.15);
  const rigid = pose === "freeze";
  const headAngle =
    8 * gaze +
    (pose === "nod" ? 10 * Math.sin(f * 0.23) : pose === "scratch" ? -9 + 3 * beat : 3 * beat);
  const flutter = pose === "talk" || pose === "worry" ? beat * 17 : beat * 4;
  let left = "M-48 115 Q-80 145 -91 197";
  let right = `M43 115 Q82 150 100 ${196 + flutter}`;
  if (pose === "talk") right = `M43 113 Q91 156 125 ${115 + flutter} l16 -22`;
  if (pose === "point") right = "M43 115 Q103 126 166 106 L189 101";
  if (pose === "freeze") {
    left = "M-45 112 L-70 210";
    right = "M45 112 L70 210";
  }
  if (pose === "scratch") right = `M43 109 Q106 67 75 ${21 + flutter} L53 ${-1 + flutter}`;
  if (pose === "celebrate") {
    left = `M-48 115 Q-114 116 -126 ${4 + flutter} l-12 -21`;
    right = `M43 115 Q112 112 125 ${2 - flutter} l12 -22`;
  }
  if (pose === "roof") {
    left = "M-47 111 Q-133 61 -78 -55 L-15 -77";
    right = "M47 111 Q133 61 78 -55 L18 -77";
  }
  if (pose === "thumb" || pose === "index") right = "M43 113 Q97 146 130 109 L133 46";
  if (hand) right = `M43 115 Q105 125 ${hand[0]} ${hand[1]}`;
  const stride = 51 * Math.sin(f * 0.28);
  const legs =
    pose === "walk"
      ? `M-11 210 Q-26 265 ${-30 + stride} ${318 - Math.max(0, stride) * 0.55} h22 M14 210 Q29 266 ${37 - stride} ${318 - Math.max(0, -stride) * 0.55} h22`
      : pose === "sit"
        ? "M-12 210 Q-24 254 -15 268 H71 L95 314 H122 M14 210 Q22 243 35 252 H107 L133 313 H154"
        : "M-11 210 L-38 269 L-70 318 H-43 M14 210 L40 274 L67 318 H87";
  if (pose === "walk") {
    left = `M-48 115 Q-78 148 ${-85 - stride * 0.58} ${189 + stride * 0.25}`;
    right = `M43 115 Q72 150 ${84 + stride * 0.58} ${189 - stride * 0.25}`;
  }
  if (pose === "sit") right = "M43 115 Q81 165 75 185 L112 226";
  const waveX = 144 + 17 * Math.sin(f * 0.34);
  if (pose === "wave") right = `M43 114 Q86 147 110 117 Q133 82 ${waveX} 40`;
  const eye = rigid ? 4 : 5;
  const squint = pose === "squint";
  return (
    <g transform={`translate(${x} ${y}) scale(${face * scale} ${scale})`}>
      <ellipse cx="4" cy="325" rx="102" ry="14" fill={INK} opacity=".10" />
      <g {...outline}>
        <path d={legs} fill="none" />
        <path d={left} fill="none" strokeWidth="8" />
        <path d={right} fill="none" strokeWidth="8" />
        {hand && <circle cx={hand[0]} cy={hand[1]} r="9" fill={WHITE} strokeWidth="5" />}
        <path
          d="M-38 87 Q0 71 39 87 Q63 98 57 131 L48 193 Q43 212 23 214 H-25 Q-46 212 -50 190 L-57 130 Q-61 101 -38 87Z"
          fill={shirt}
        />
        <path d="M-20 86 Q0 101 20 86" fill="none" strokeWidth="5" />
        <g transform={`rotate(${rigid ? 0 : headAngle} 0 40)`}>
          <circle cx="0" cy="13" r="62" fill={WHITE} strokeWidth="7" />
          <path d="M-47 -25 Q-31 -55 -6 -51" fill="none" strokeWidth="5" />
          <ellipse
            cx={-13 + 7 * gaze}
            cy={10 + (squint ? 1 : 0)}
            rx={squint ? 7 : eye}
            ry={squint ? 2.5 : rigid ? eye : 7}
            fill={INK}
            stroke="none"
          />
          <ellipse
            cx={23 + 7 * gaze}
            cy="10"
            rx={squint ? 7 : eye}
            ry={squint ? 2.5 : rigid ? eye : 7}
            fill={INK}
            stroke="none"
          />
          {pose === "talk" ? (
            <ellipse cx="18" cy="35" rx="13" ry={7 + Math.abs(beat) * 9} fill={INK} stroke="none" />
          ) : (
            <path
              d={
                pose === "worry" || pose === "scratch" || squint || rigid
                  ? "M1 39 Q14 28 30 38"
                  : "M-4 34 Q15 51 34 32"
              }
              fill="none"
              strokeWidth="5"
            />
          )}
        </g>
        {pose === "wave" && (
          <g transform={`translate(${waveX} 37) rotate(${10 + 17 * Math.sin(f * 0.34)})`}>
            <path
              d="M-10 5q-8-7-9-15q-1-5 4-6q5-1 8 8v-22q0-5 5-5q4 0 4 5v13h3v-17q0-5 5-5t5 5v18q1-3 5-3t4 5v14q-1 12-13 13H2Q-6 11-10 5Z"
              fill={WHITE}
              strokeWidth="4"
            />
            <path d="M2-8q6-2 12 0" fill="none" strokeWidth="3" />
          </g>
        )}
        {pose === "point" && (
          <g transform="translate(188 99) rotate(-9)">
            <path
              d="M-14-12Q-5-20 4-14H37Q47-14 47-7Q47 0 38 0H13Q20 5 17 12Q15 20 5 22H-7Q-17 20-17 10V-4Z"
              fill={WHITE}
              strokeWidth="5"
            />
            <path d="M2 1L11 3Q16 7 13 11Q9 15 4 12L-4 8M1 17h11" fill="none" strokeWidth="3" />
          </g>
        )}
        {pose === "thumb" && (
          <path
            d="M113 47 v-24 q1-10 10-9 l12 15 20 0 q12 0 10 12 l-4 19 q-1 7-12 7 h-27 q-9-1-9-9Z"
            fill={WHITE}
            strokeWidth="6"
          />
        )}
        {pose === "index" && (
          <g transform="translate(137 23) scale(1.1)">
            <path
              d="M-24 28 V-47 Q-24-59-15-59 Q-6-59-6-48 V-10
          Q2-17 10-10 Q19-16 26-6 Q36-9 42 1 L42 26 Q42 47 22 51
          H-7 Q-24 50-24 28Z"
              fill={WHITE}
              strokeWidth="6"
            />
            <path d="M-5 -9 V6 M10 -10 V8 M25 -6 V9" fill="none" strokeWidth="4" />
            <path
              d="M-23 27 Q-20 10-7 7 L19 14 Q30 19 24 28 Q20 32 10 29 L-1 24"
              fill={WHITE}
              strokeWidth="6"
            />
          </g>
        )}
      </g>
    </g>
  );
}

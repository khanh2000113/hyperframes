import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { fontFamily } from "@remotion/google-fonts/BeVietnamPro";

export const INK = "#1D1D1F";
const PAPER = "#F5F0E6";
const WHITE = "#FFFCF7";
const RED = "#E63946";
const BLUE = "#2563EB";
const AMBER = "#D97706";
const GREEN = "#059669";
const colors = [BLUE, AMBER, GREEN];
const pale = ["#EBF1FF", "#FFF0D7", "#E2F4E9"];
const phrases = ["My mind went blank", "What do you call...?", "Give me a second"];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const pulse = (f: number, at: number, length = 16) =>
  Math.sin(Math.PI * interpolate(f, [at, at + length], [0, 1], clamp));
const bounce = (f: number, at: number, duration = 19) =>
  f < at
    ? 0
    : spring({
        fps: 30,
        frame: f - at,
        durationInFrames: duration,
        config: { damping: 12, stiffness: 175, mass: 0.85 },
      });
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const offset = (x: number, y: number, s = 1) => `translate(${x} ${y}) scale(${s})`;
const titleBase = {
  fontWeight: 900,
  letterSpacing: -4.5,
  lineHeight: 0.98,
  textAlign: "center" as const,
};
const shadow = "#1D1D1F";
const outline = {
  stroke: INK,
  strokeWidth: 9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Spark({
  x,
  y,
  color = INK,
  size = 23,
}: {
  x: number;
  y: number;
  color?: string;
  size?: number;
}) {
  return (
    <path
      d={`M ${x - size} ${y} h ${2 * size} M ${x} ${y - size} v ${2 * size}`}
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
    />
  );
}
function Sweep({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
      <path d={`M${x} ${y} l-34 -12 m19 38 l-27 6 m48 -60 l-16 -28`} />
    </g>
  );
}
function Person({
  x,
  y,
  scale = 1,
  f = 0,
  face = 1,
  pose = "idle",
  shirt = "#D9E4FD",
}: {
  x: number;
  y: number;
  scale?: number;
  f?: number;
  face?: number;
  pose?:
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
}) {
  const beat = Math.sin(f * 0.15);
  const rigid = pose === "freeze";
  const headAngle =
    pose === "nod" ? 10 * Math.sin(f * 0.23) : pose === "scratch" ? -9 + 3 * beat : 3 * beat;
  const flutter = pose === "talk" || pose === "worry" ? beat * 17 : beat * 4;
  let left = "M-48 115 Q-80 145 -91 197";
  let right = `M43 115 Q82 150 100 ${196 + flutter}`;
  if (pose === "talk") right = `M43 113 Q91 156 125 ${115 + flutter} l16 -22`;
  if (pose === "point") right = `M43 115 Q99 132 155 ${98 + flutter} l43 -8`;
  if (pose === "freeze") {
    left = "M-45 112 L-70 210";
    right = "M45 112 L70 210";
  }
  if (pose === "scratch") right = `M43 109 Q106 67 75 ${21 + flutter} L53 ${-1 + flutter}`;
  if (pose === "roof") {
    left = "M-47 111 Q-133 61 -78 -55 L-15 -77";
    right = "M47 111 Q133 61 78 -55 L18 -77";
  }
  if (pose === "thumb" || pose === "index") right = "M43 113 Q97 146 130 109 L133 46";
  const eye = rigid ? 4 : 5;
  return (
    <g transform={`translate(${x} ${y}) scale(${face * scale} ${scale})`}>
      <ellipse cx="4" cy="325" rx="102" ry="14" fill={INK} opacity=".10" />
      <g {...outline}>
        <path d="M-11 210 L-38 269 L-70 318 H-43 M14 210 L40 274 L67 318 H87" fill="none" />
        <path d={left} fill="none" />
        <path d={right} fill="none" />
        <path
          d="M-38 87 Q0 71 39 87 Q63 98 57 131 L48 193 Q43 212 23 214 H-25 Q-46 212 -50 190 L-57 130 Q-61 101 -38 87Z"
          fill={shirt}
        />
        <path d="M-20 86 Q0 101 20 86" fill="none" strokeWidth="5" />
        <g transform={`rotate(${rigid ? 0 : headAngle} 0 40)`}>
          <circle cx="0" cy="13" r="62" fill={WHITE} />
          <path d="M-47 -25 Q-31 -55 -6 -51" fill="none" strokeWidth="5" />
          <ellipse cx="-13" cy="10" rx={eye} ry={rigid ? eye : 7} fill={INK} stroke="none" />
          <ellipse cx="23" cy="10" rx={eye} ry={rigid ? eye : 7} fill={INK} stroke="none" />
          {pose === "talk" ? (
            <ellipse cx="18" cy="35" rx="13" ry={7 + Math.abs(beat) * 9} fill={INK} stroke="none" />
          ) : (
            <path
              d={pose === "worry" || rigid ? "M1 39 Q14 28 30 38" : "M-4 34 Q15 51 34 32"}
              fill="none"
              strokeWidth="5"
            />
          )}
        </g>
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

function Bubble({
  x,
  y,
  w = 225,
  h = 101,
  color = WHITE,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  color?: string;
  children?: ReactNode;
}) {
  return (
    <g transform={offset(x, y)}>
      <path
        d={`M34 5 H${w - 34} Q${w - 5} 5 ${w - 5} 33 V${h - 32} Q${w - 5} ${h - 5} ${w - 34} ${h - 5} H79 L43 ${h + 18} L48 ${h - 5} H34 Q5 ${h - 5} 5 ${h - 32} V33 Q5 5 34 5Z`}
        fill={color}
        stroke={INK}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {children}
    </g>
  );
}
function Sweat({ x, y, f }: { x: number; y: number; f: number }) {
  const fall = (Math.max(f, 0) % 25) / 25;
  return (
    <path
      transform={offset(x + fall * 9, y + fall * 44)}
      opacity={1 - fall * 0.82}
      d="M0-18 Q18 0 15 9 Q9 25-4 16 Q-15 11-10 0Z"
      fill="#89B8FF"
      stroke={BLUE}
      strokeWidth="3"
    />
  );
}
function Heart({ color = BLUE }: { color?: string }) {
  return <path d="M0 26 Q-38 1-26-15 Q-15-29 0-12 Q15-29 26-15 Q38 1 0 26Z" fill={color} />;
}
function SymbolIcon({ index, color }: { index: number; color: string }) {
  if (index === 0)
    return (
      <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
        <rect x="-27" y="-19" width="54" height="36" rx="12" />
        <path d="M-13 17 l-2 12 15-11 M-13 0 h26" strokeDasharray="3 8" />
      </g>
    );
  if (index === 1)
    return (
      <text y="22" textAnchor="middle" fill={color} fontSize="60" fontWeight="900">
        ?
      </text>
    );
  return (
    <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round">
      <circle cy="3" r="22" />
      <path d="M0-19 v-11 m-8 0 h16 M0 3 l10-9" />
    </g>
  );
}
function Cards({ f, mode }: { f: number; mode: "fan" | "stack" | "fold" }) {
  return (
    <>
      {range(3).map((i) => {
        const isFan = mode === "fan";
        const appear = isFan ? bounce(f, 9 + i * 9, 24) : 1;
        const shrink = mode === "fold" ? ease(f, 32 + i * 3, 56 + i * 3) : 0;
        const travel = mode === "fold" ? ease(f, 16, 61) : 0;
        const x = isFan ? 490 + (i - 1) * 231 * appear : mix(490, 276, travel);
        const y = isFan ? 441 + Math.abs(i - 1) * 45 * appear : mix(220 + i * 207, 164, travel);
        const s = isFan
          ? 0.43 + 0.57 * appear
          : (1 + 0.06 * pulse(f, 7 + i * 18)) * (1 - shrink * 0.91);
        return (
          <g
            key={i}
            opacity={isFan ? Math.min(1, appear) : 1 - shrink}
            transform={`translate(${x} ${y}) rotate(${isFan ? (i - 1) * 13 * appear : 0}) scale(${s})`}
          >
            {isFan ? (
              <>
                <rect
                  x="-99"
                  y="-139"
                  width="198"
                  height="300"
                  rx="28"
                  fill={shadow}
                  opacity=".13"
                />
                <rect
                  x="-105"
                  y="-153"
                  width="198"
                  height="300"
                  rx="28"
                  fill={pale[i]}
                  stroke={INK}
                  strokeWidth="5"
                />
                <rect x="-78" y="-123" width="45" height="37" rx="11" fill={INK} />
                <text
                  x="-55.5"
                  y="-96"
                  textAnchor="middle"
                  fontSize="20"
                  fill={WHITE}
                  fontWeight="900"
                >
                  0{i + 1}
                </text>
                <circle cx="-6" cy="9" r="61" fill={colors[i]} opacity=".14" />
                <g transform="translate(-6 9) scale(1.4)">
                  <SymbolIcon index={i} color={colors[i]} />
                </g>
                <path
                  d="M-49 101 h85"
                  stroke={colors[i]}
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity=".6"
                />
              </>
            ) : (
              <>
                <rect
                  x="-390"
                  y="-65"
                  width="790"
                  height="145"
                  rx="32"
                  fill={shadow}
                  opacity=".15"
                />
                <rect
                  x="-397"
                  y="-76"
                  width="790"
                  height="145"
                  rx="32"
                  fill={pale[i]}
                  stroke={INK}
                  strokeWidth="5"
                />
                <rect x="-373" y="-51" width="96" height="96" rx="24" fill={WHITE} />
                <g transform="translate(-325 -2)">
                  <SymbolIcon index={i} color={colors[i]} />
                </g>
                <text
                  x="-251"
                  y="12"
                  fontSize="43"
                  fill={INK}
                  fontWeight="800"
                  letterSpacing="-1.5"
                >
                  {i + 1}. {phrases[i]}
                </text>
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

function Conversation({ f, mode = "hook" }: { f: number; mode?: "hook" | "crash" | "friendly" }) {
  const freeze = mode === "hook" && f >= 27;
  const friendly = mode === "friendly";
  const punch = freeze ? ease(f, 26, 34) : 0;
  const pull = friendly ? 1 - ease(f, 0, 23) : 0;
  const shake = freeze ? Math.sin((f - 27) * 2.3) * 9 * Math.exp(-(f - 27) / 8) : 0;
  const z = 1 + punch * 0.19 + pull * 0.12;
  const camX = shake - punch * 104 + pull * 40;
  const bob = Math.sin(f * 0.095) * 6;
  const crash = mode === "crash";
  return (
    <g
      transform={`translate(${490 + camX} 455) scale(${z}) translate(-490 -455)`}
      opacity={crash ? 1 - ease(f, 0, 14) : 1}
    >
      <path
        d="M81 734 Q490 710 899 734"
        fill="none"
        stroke={INK}
        strokeOpacity=".18"
        strokeWidth="3"
        strokeDasharray="8 18"
      />
      <Person x={260} y={424 + bob} f={f} shirt="#B9CAF4" pose={friendly ? "nod" : "talk"} />
      <Person
        x={712}
        y={440 + (freeze ? 0 : -bob * 0.7)}
        f={freeze ? 0 : f}
        face={-1}
        shirt={friendly ? "#B9D8FA" : "#F3C4A8"}
        pose={freeze ? "freeze" : friendly ? "scratch" : "idle"}
      />
      {!crash && (
        <g transform={offset(146, 165 + bob)} opacity={freeze ? 0.56 : 1}>
          <Bubble x={0} y={0} w={232} color={friendly ? "#E6EFFF" : WHITE}>
            {friendly ? (
              <g transform={offset(115, 51, 0.45 + 0.55 * bounce(f, 19))}>
                <Heart />
              </g>
            ) : (
              range(3).map((i) => (
                <circle
                  key={i}
                  cx={72 + i * 44}
                  cy={49 - 9 * Math.abs(Math.sin(f * 0.23 + i * 0.8))}
                  r={9 + 5 * Math.abs(Math.sin(f * 0.23 + i * 0.8))}
                  fill={INK}
                />
              ))
            )}
          </Bubble>
          {!friendly && f > 3 && (
            <g opacity={0.32 + 0.68 * pulse(f % 21, 0, 21)}>
              <rect
                x="254"
                y="-34"
                width="80"
                height="49"
                rx="20"
                fill={WHITE}
                stroke={INK}
                strokeWidth="4"
              />
              <path
                d="M275-8 h38"
                stroke={INK}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="4 12"
              />
            </g>
          )}
        </g>
      )}
      {friendly && (
        <g transform={offset(705, 300)} opacity={0.5 + 0.5 * pulse(f % 28, 0, 28)}>
          <Sweep x={108} y={15} color={BLUE} />
        </g>
      )}
      {freeze && (
        <>
          <g transform={`translate(715 452) rotate(-9) scale(${bounce(f, 27, 15)})`}>
            <rect x="-93" y="-56" width="192" height="116" rx="24" fill={INK} opacity=".18" />
            <rect
              x="-99"
              y="-62"
              width="192"
              height="116"
              rx="24"
              fill={RED}
              stroke={INK}
              strokeWidth="6"
            />
            <text x="-2" y="23" textAnchor="middle" fill={WHITE} fontWeight="900" fontSize="73">
              404
            </text>
          </g>
          <Sweep x={564} y={372} color={RED} />
          <Sweat x={821} y={369} f={f - 27} />
        </>
      )}
    </g>
  );
}

function Rain({ f, umbrella = false }: { f: number; umbrella?: boolean }) {
  return (
    <g stroke={BLUE} strokeWidth="5" strokeLinecap="round" opacity=".58">
      {range(24).map((i) => {
        const x = 560 + ((i * 47) % 288);
        const y = 418 + ((f * 13 + i * 53) % 334);
        const canHit = umbrella && x > 540 && x < 777 && y > 459;
        return (
          <path
            key={i}
            d={
              canHit
                ? `M${x < 666 ? 523 : 799} ${y} l${x < 666 ? -18 : 18} 17`
                : `M${x} ${y} l-13 29`
            }
          />
        );
      })}
    </g>
  );
}
function Mystery({ f, kind }: { f: number; kind: "question" | "rain" | "rescue" }) {
  const bob = Math.sin(f * 0.135) * 12;
  const rescue = kind === "rescue";
  const isQuestion = kind === "question";
  const flip = isQuestion ? 1 : Math.abs(Math.cos(Math.PI * ease(f, 0, 24)));
  const revealCloud = !isQuestion && (rescue || f >= 12);
  const hit = rescue ? pulse(f, 5, 20) : 0;
  return (
    <g
      transform={`translate(${-24 * ease(f, 0, 62) + hit * 10} ${rescue ? -20 * hit : !isQuestion ? 22 * ease(f, 4, 70) : 0})
    translate(615 521) scale(${1 + hit * 0.1}) translate(-615 -521)`}
    >
      <path d="M92 774 H894" stroke={INK} strokeWidth="3" opacity=".15" strokeDasharray="8 19" />
      <Person
        x={rescue ? 581 : 251}
        y={rescue ? 457 : 473}
        scale={rescue ? 0.88 : 1}
        f={f}
        pose={rescue ? "thumb" : !revealCloud ? "point" : "roof"}
        shirt="#F5CA86"
      />
      <g transform={`translate(690 ${309 + bob}) scale(${revealCloud && rescue ? 1 : flip} 1)`}>
        {revealCloud ? (
          <>
            <path
              d="M-135 37 Q-167 30-160 3 Q-153-24-111-27 Q-97-74-49-76 Q-7-77 13-42 Q58-59 86-31 Q133-28 138 5 Q145 36 114 49 H-113Z"
              fill="#E5EEFF"
              {...outline}
              strokeWidth="6"
            />
            <path
              d="M-83-46 q24-22 45-12"
              fill="none"
              stroke={WHITE}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <rect
              x="-146"
              y="-171"
              width="295"
              height="306"
              rx="40"
              fill={AMBER}
              opacity=".15"
              transform="translate(9 13)"
            />
            <rect
              x="-154"
              y="-180"
              width="295"
              height="306"
              rx="40"
              fill="#FFF9EB"
              stroke={AMBER}
              strokeWidth="6"
              strokeDasharray="13 10"
            />
            <text
              x="-4"
              y="67"
              textAnchor="middle"
              fill={AMBER}
              fontSize="226"
              fontWeight="900"
              transform={`rotate(${Math.sin(f * 0.2) * 9})`}
            >
              ?
            </text>
          </>
        )}
      </g>
      {revealCloud && <Rain f={f} umbrella={rescue && f > 7} />}
      {rescue && (
        <g transform={`translate(623 468) scale(${0.12 + 0.88 * bounce(f, 5, 15)} 1)`}>
          <path d="M0-157 V99 q0 36 29 36 q27 0 27-24" fill="none" {...outline} />
          <path
            d="M-220 19 Q-203-133 0-143 Q195-134 222 19 Q167-33 109 19 Q54-33 0 19 Q-54-33-109 19 Q-168-33-220 19Z"
            fill="#F8BE54"
            {...outline}
          />
          <path
            d="M0-141 Q-86-117-109 19 M0-141 Q79-113 109 19"
            fill="none"
            stroke={INK}
            strokeWidth="5"
          />
        </g>
      )}
      {isQuestion && (
        <>
          <Sweep x={495} y={284} color={AMBER} />
          <Spark x={875} y={481 + bob} color={AMBER} size={19} />
        </>
      )}
    </g>
  );
}

function Thought({ f }: { f: number }) {
  const amount = ease(f, 20, 46);
  const spin = f * 0.037;
  const z = 1 + 0.14 * ease(f, 5, 61);
  return (
    <g transform={`translate(596 296) scale(${z}) translate(-596 -296)`}>
      <Person x={318} y={458} f={f} pose="worry" shirt="#B9CAF4" />
      <path
        d="M438 238 Q413 182 481 151 Q486 99 560 107 Q604 67 671 112 Q744 92 769 145 Q838 160 817 229
      Q854 274 800 313 Q777 366 708 354 Q659 392 609 351 Q530 376 510 329 Q436 333 438 270 Q417 252 438 238Z"
        fill={WHITE}
        stroke={BLUE}
        strokeWidth="7"
      />
      <circle cx="442" cy="379" r="25" fill={WHITE} stroke={BLUE} strokeWidth="6" />
      <circle cx="407" cy="421" r="13" fill={WHITE} stroke={BLUE} strokeWidth="5" />
      {["A", "B", "?", "W", "E", "T", "S", "…"].map((letter, i) => {
        const angle = (i * Math.PI) / 4 + spin + amount * 4.3;
        return (
          <text
            key={letter}
            textAnchor="middle"
            fontSize={68 - i * 3}
            fill={BLUE}
            fontWeight="900"
            opacity={1 - amount}
            transform={`translate(${628 + Math.cos(angle) * 153 * (1 - amount)} ${238 + Math.sin(angle) * 89 * (1 - amount)}) rotate(${i * 12 - 43 + amount * 100}) scale(${1 - amount * 0.95})`}
          >
            {letter}
          </text>
        );
      })}
      {f > 41 && f < 65 && (
        <g opacity={pulse(f, 41, 24)}>
          <Spark x={829} y={157} color={BLUE} size={22} />
        </g>
      )}
    </g>
  );
}

function Timepiece({ f }: { f: number }) {
  const raise = bounce(f, 4, 18);
  const zoom = 1 + 0.065 * ease(f, 0, 68);
  const tick = Math.floor(f / 4) * 24 + (f % 4) * 4;
  const badge = 1 + 0.08 * Math.sin(f * 0.25);
  return (
    <g transform={`translate(471 431) scale(${zoom}) translate(-471 -431)`}>
      <path d="M92 763 H894" stroke={INK} strokeWidth="3" opacity=".15" strokeDasharray="8 19" />
      <Person x={282} y={464 - 10 * raise} f={f} pose={f >= 4 ? "index" : "idle"} shirt="#A9DFC9" />
      <g transform={offset(690, 350 + Math.sin(f * 0.13) * 10)}>
        <path
          d="M0-118 v-52 m-30 0 h60 m81 63 l22-25"
          fill="none"
          stroke={INK}
          strokeWidth="13"
          strokeLinecap="round"
        />
        <circle cx="9" cy="15" r="124" fill={INK} opacity=".13" />
        <circle r="126" fill="#C9EFDF" {...outline} strokeWidth="7" />
        <circle r="100" fill={WHITE} stroke={GREEN} strokeWidth="4" />
        {range(12).map((i) => (
          <path
            key={i}
            d="M0-90 v14"
            transform={`rotate(${i * 30})`}
            stroke={GREEN}
            strokeWidth={i % 3 === 0 ? 5 : 3}
            strokeLinecap="round"
          />
        ))}
        <path
          d="M0 14 V-66"
          transform={`rotate(${tick})`}
          stroke={GREEN}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle r="9" fill={INK} />
        <g transform={offset(107, 104, badge)}>
          <rect
            x="-48"
            y="-35"
            width="96"
            height="67"
            rx="22"
            fill={GREEN}
            stroke={INK}
            strokeWidth="5"
          />
          <text y="15" fill={WHITE} textAnchor="middle" fontSize="48" fontWeight="900">
            1s
          </text>
        </g>
      </g>
      <Spark x={836} y={223} color={GREEN} size={21} />
    </g>
  );
}

function Comparison({ f }: { f: number }) {
  const split = ease(f, 0, 12);
  const tremor = Math.sin(f * 1.7) * 2;
  return (
    <>
      <defs>
        <clipPath id="compare">
          <rect x="490" y="29" width={458 * split} height="822" rx="35" />
        </clipPath>
      </defs>
      <rect
        x="33"
        y="29"
        width="437"
        height="822"
        rx="35"
        fill="#F9E0DB"
        stroke={INK}
        strokeWidth="4"
      />
      <g clipPath="url(#compare)">
        <rect
          x="492"
          y="29"
          width="454"
          height="822"
          rx="35"
          fill="#DDF1E6"
          stroke={INK}
          strokeWidth="4"
        />
        <Person x={713} y={453} f={f} scale={0.85} face={-1} shirt="#9BDCBF" />
        <Bubble x={513} y={167} w={405} h={96}>
          <text x="202" y="59" fontSize="35" textAnchor="middle" fontWeight="800" fill={INK}>
            Give me a second
          </text>
        </Bubble>
        <g transform={offset(832, 361, bounce(f, 34, 18))}>
          <circle r="49" fill={GREEN} stroke={INK} strokeWidth="5" />
          <path
            d="M-23 0 l15 16 29-32"
            fill="none"
            stroke={WHITE}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      <Person x={241} y={455} f={f} scale={0.85} pose="worry" shirt="#F7B3A2" />
      <Sweat x={326} y={407} f={f} />
      <Bubble x={89 + tremor} y={168} w={319} h={96}>
        <text x="159" y="60" fontSize="40" textAnchor="middle" fontWeight="800" fill={INK}>
          À... Ừm...
        </text>
      </Bubble>
      <g transform={offset(353, 361, bounce(f, 11, 18))}>
        <circle r="49" fill={RED} stroke={INK} strokeWidth="5" />
        <path
          d="M-15-15 l30 30 m0-30 l-30 30"
          fill="none"
          stroke={WHITE}
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
    </>
  );
}

const tints = [
  "#F6DFD7",
  "#F4E8DB",
  "#DFE8FA",
  "#E5ECF8",
  "#F9E7C6",
  "#F9E7C6",
  "#F9E7C6",
  "#DCEDE2",
  "#E7EBDE",
  "#EEE8DD",
  "#EEE8DD",
];
const progress = [0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const accents = [RED, RED, BLUE, BLUE, AMBER, AMBER, AMBER, GREEN, GREEN, INK, INK];

function Bookmark({ f }: { f: number }) {
  const s = bounce(f, 7) * (1 + 0.065 * Math.sin(f * 0.27));
  return (
    <svg
      width="78"
      height="78"
      viewBox="0 0 78 78"
      aria-hidden="true"
      style={{
        marginLeft: 22,
        verticalAlign: "middle",
        transform: `translateY(${Math.sin(f * 0.2) * 5}px) scale(${s})`,
      }}
    >
      <rect
        x="4"
        y="4"
        width="70"
        height="70"
        fill="#FFD670"
        rx="22"
        stroke={INK}
        strokeWidth="4"
      />
      <path d="M26 21 h26 v39 L39 50 26 60Z" fill={INK} />
    </svg>
  );
}

function Headline({ n, f, voiceAt }: { n: number; f: number; voiceAt?: number }) {
  const titleAt = voiceAt ?? 5;
  const hop = bounce(f, titleAt);
  const headlineOpacity = ease(f, titleAt, titleAt + 7);
  const scaled = (x: number) => `translateY(${(1 - hop) * x}px) scale(${0.91 + 0.09 * hop})`;
  const pill = (text: string, fill: string, color = INK, delay = 10) => {
    const rise = bounce(f, titleAt + delay);
    return (
      <span
        style={{
          display: "inline-block",
          background: fill,
          color,
          borderRadius: 23,
          padding: "12px 23px 14px",
          fontSize: 35,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: -0.8,
          whiteSpace: "nowrap",
          transform: `translateY(${12 * (1 - rise)}px)`,
          opacity: ease(f, titleAt + delay, titleAt + delay + 7),
        }}
      >
        {text}
      </span>
    );
  };
  const title = (text: ReactNode, size: number, color = INK, move = 44) => (
    <div
      style={{
        ...titleBase,
        fontSize: size,
        color,
        opacity: headlineOpacity,
        transform: scaled(move),
      }}
    >
      {text}
    </div>
  );
  switch (n) {
    case 1:
      return (
        <div
          style={{
            ...titleBase,
            fontSize: 124,
            color: RED,
            opacity: ease(f, 27, 34),
            transform: `translateY(${(1 - bounce(f, 27)) * 33}px) scale(${0.72 + 0.28 * bounce(f, 27)})`,
          }}
        >
          ĐỨNG HÌNH?
        </div>
      );
    case 2:
      return title(
        <>
          <span style={{ color: RED }}>3 CÂU</span>
          <br />
          CỨU MẠNG
        </>,
        109,
      );
    case 3:
      return (
        <div style={{ ...titleBase, fontSize: 98, color: BLUE }}>
          {["MY", "MIND", "WENT", "BLANK"].map((word, i) => {
            const at = titleAt + i * 5;
            return (
              <span
                key={word}
                style={{
                  display: "inline-block",
                  margin: "0 11px",
                  opacity: ease(f, at, at + 6),
                  transform: `translateY(${(1 - bounce(f, at)) * 30}px)`,
                  ...(i === 3 && f > titleAt + 28
                    ? { color: "transparent", WebkitTextStroke: `3px ${BLUE}` }
                    : {}),
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      );
    case 4:
      return (
        <>
          {title("My mind went blank", 82, BLUE, 20)}
          {pill("Đầu tôi tự dưng trống rỗng", "#DFEAFF")}
        </>
      );
    case 5:
      return title(
        <>
          WHAT DO YOU
          <br />
          <span style={{ color: AMBER }}>CALL...?</span>
        </>,
        107,
        INK,
        -32,
      );
    case 6:
      return (
        <>
          {title("What do you call...", 86)}
          {pill("the thing for rain?", "#FFD97E", INK, 15)}
        </>
      );
    case 7:
      return (
        <div style={{ filter: `drop-shadow(0 7px 22px #f7bb5960)` }}>
          {title("UMBRELLA!", 139, AMBER)}
        </div>
      );
    case 8:
      return (
        <div
          style={{
            ...titleBase,
            fontSize: 111,
            transform: `translateX(${-84 * (1 - ease(f, titleAt, titleAt + 15))}px)`,
            opacity: headlineOpacity,
          }}
        >
          GIVE ME
          <br />
          <span style={{ color: GREEN }}>A SECOND</span>
        </div>
      );
    case 9:
      return (
        <span
          style={{
            background: "#D9EFE3",
            color: "#086349",
            fontWeight: 800,
            fontSize: 64,
            lineHeight: 1.16,
            letterSpacing: -2.8,
            padding: "16px 34px 21px",
            borderRadius: 26,
            opacity: ease(f, 14, 23),
            transform: `translateY(${(1 - bounce(f, 14)) * 25}px)`,
          }}
        >
          Tự nhiên hơn hẳn
        </span>
      );
    case 10:
      return title(
        <>
          3 PHAO
          <br />
          CỨU SINH
        </>,
        116,
      );
    case 11:
      return title(
        <span style={{ whiteSpace: "nowrap" }}>
          Lưu lại dùng dần nhé
          <Bookmark f={f} />
        </span>,
        66,
      );
    default:
      return null;
  }
}

function Progress({ n, f }: { n: number; f: number }) {
  const count = progress[n - 1];
  if (count === 0) return null;
  const newChapter = [2, 3, 5, 8].includes(n);
  const slide = n === 2 ? 1 - bounce(f, 2) : 0;
  const fill = (count - (newChapter ? 1 - ease(f, 0, 20) : 0)) / 4;
  return (
    <div
      data-zone="progress"
      style={{
        position: "absolute",
        left: 369,
        top: 137,
        width: 342,
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        padding: "0 23px",
        boxSizing: "border-box",
        background: WHITE,
        border: `2px solid ${INK}`,
        borderRadius: 100,
        boxShadow: "0 5px 0 #1d1d1f17",
        opacity: n === 2 ? ease(f, 2, 12) : 1,
        transform: `translateY(${slide * -28}px)`,
      }}
    >
      <span
        style={{
          fontSize: 27,
          fontVariantNumeric: "tabular-nums",
          fontWeight: 800,
          letterSpacing: -1,
          color: INK,
        }}
      >
        0{count}/04
      </span>
      <span
        style={{
          position: "relative",
          background: "#EAE2D6",
          borderRadius: 10,
          width: 160,
          height: 10,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${fill * 100}%`,
            borderRadius: 10,
            background: accents[n - 1],
          }}
        />
      </span>
    </div>
  );
}

function Shot({ n, f }: { n: number; f: number }) {
  if (n === 1 || n === 4) return <Conversation f={f} mode={n === 4 ? "friendly" : "hook"} />;
  if (n === 2)
    return (
      <>
        <Conversation f={f} mode="crash" />
        {range(19).map((i) => {
          const p = ease(f, 0, 28);
          const direction = i * 2.399;
          const spread = 55 + p * (120 + i * 13);
          return (
            <path
              key={i}
              d={i % 2 ? "M-14 13 L-10-12 L17 4Z" : "M-11-7 L18-10 L10 14 L-4 12Z"}
              opacity={1 - p}
              fill={i % 3 === 0 ? INK : RED}
              transform={`translate(${693 + Math.cos(direction) * spread} ${440 + Math.sin(direction) * spread + p * 95}) rotate(${i * 23 + p * 179})`}
            />
          );
        })}
        <Cards f={f} mode="fan" />
      </>
    );
  if (n === 3) return <Thought f={f} />;
  if (n === 5 || n === 6 || n === 7)
    return <Mystery f={f} kind={n === 5 ? "question" : n === 6 ? "rain" : "rescue"} />;
  if (n === 8) return <Timepiece f={f} />;
  if (n === 9) return <Comparison f={f} />;
  return <Cards f={f} mode={n === 10 ? "stack" : "fold"} />;
}

function Stage({ n, f, styleOpacity = 1 }: { n: number; f: number; styleOpacity?: number }) {
  const whip = [3, 8].includes(n) ? 1 - ease(f, 0, 10) : 0;
  const snap = n === 5 ? pulse(f, 0, 11) : 0;
  const parallax = Math.sin(f * 0.08);
  return (
    <svg
      data-zone="stage"
      width="980"
      height="880"
      viewBox="0 0 980 880"
      style={{
        position: "absolute",
        left: 50,
        top: 290,
        opacity: styleOpacity,
        overflow: "hidden",
        borderRadius: 61,
        boxShadow: "0 9px 0 #1d1d1f12",
      }}
    >
      <defs>
        <pattern id={`dots${n}`} width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.6" fill="#282426" opacity=".15" />
        </pattern>
      </defs>
      <rect width="980" height="880" rx="59" fill={tints[n - 1]} />
      <rect x="13" y="13" width="954" height="854" rx="47" fill={`url(#dots${n})`} opacity=".53" />
      {n !== 9 && (
        <>
          <circle cx={491 + parallax * 18} cy="442" r="319" fill={WHITE} opacity=".36" />
          <circle
            cx={491 + parallax * 18}
            cy="442"
            r="349"
            fill="none"
            stroke={WHITE}
            strokeWidth="2"
            opacity=".62"
          />
          <Spark x={124} y={152} color={accents[n - 1]} size={15} />
          <Spark x={861} y={673} color={accents[n - 1]} size={19} />
          <circle cx="874" cy="704" r="4" fill={accents[n - 1]} />
        </>
      )}
      <g
        transform={`translate(${whip * (n === 3 ? 310 : -318) + snap * 18} 0)`}
        opacity={1 - whip * 0.5}
      >
        <Shot n={n} f={f} />
      </g>
      {whip > 0 && (
        <path
          d="M-70 270 H1010 M-80 448 H1040 M-60 610 H1020"
          opacity={whip * 0.17}
          stroke={accents[n - 1]}
          strokeWidth="24"
          strokeLinecap="round"
        />
      )}
      <rect x="2" y="2" width="976" height="876" rx="59" fill="none" stroke={INK} strokeWidth="4" />
    </svg>
  );
}

const grain = `url("data:image/svg+xml,%3Csvg viewBox='0 0 190 190' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.81' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%23836F52' filter='url(%23g)' d='M0 0h190v190H0z'/%3E%3C/svg%3E")`;

export function Art({
  number,
  frame,
  total,
  voiceAt,
}: {
  number: number;
  frame: number;
  total: number;
  voiceAt?: number;
}) {
  const loop = number === 11 ? ease(frame, total - 31, total - 2) : 0;
  const cut = number === 4 ? 1 - ease(frame, 0, 9) : 0;
  return (
    <AbsoluteFill style={{ background: PAPER, color: INK, fontFamily, overflow: "hidden" }}>
      <AbsoluteFill
        style={{ backgroundImage: grain, backgroundSize: "190px 190px", opacity: 0.03 }}
      />
      <div style={{ opacity: 1 - loop }}>
        <Progress n={number} f={frame} />
        <Stage n={number} f={frame} />
        <div
          data-zone="typography"
          style={{
            position: "absolute",
            top: 1200,
            height: 340,
            left: 65,
            right: 65,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <Headline n={number} f={frame} voiceAt={voiceAt} />
        </div>
      </div>
      {cut > 0 && <Stage n={3} f={74} styleOpacity={cut} />}
      {loop > 0 && <Stage n={1} f={0} styleOpacity={loop} />}
    </AbsoluteFill>
  );
}

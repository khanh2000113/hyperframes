import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { fontFamily } from "@remotion/google-fonts/BeVietnamPro";
import { Stickman } from "./components/Stickman";

const INK = "#1D1D1F";
const WHITE = "#FFFFFF";
const RED = "#E63946";
const BLUE = "#2563EB";
const AMBER = "#D97706";
const GREEN = "#059669";
const palette = [
  { accent: RED, tint: "#FDECEC", shirt: "#F5B7A5" },
  { accent: BLUE, tint: "#EBF2FE", shirt: "#BDD4FA" },
  { accent: AMBER, tint: "#FEF5E6", shirt: "#F7CE8A" },
  { accent: GREEN, tint: "#E7F7F0", shirt: "#A5E4C9" },
  { accent: INK, tint: "#F7F3EA", shirt: "#D9D4CA" },
];
const chapter = [0, 0, 1, 1, 2, 2, 3, 3, 4, 0];
const counts = [0, 1, 2, 2, 3, 3, 4, 4, 4, 4];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const pulse = (f: number, at: number, length = 16) =>
  Math.sin(Math.PI * interpolate(f, [at, at + length], [0, 1], clamp));
const bounce = (f: number, at: number) =>
  f < at
    ? 0
    : spring({
        fps: 30,
        frame: f - at,
        durationInFrames: 19,
        config: { damping: 12, stiffness: 175, mass: 0.85 },
      });
const offset = (x: number, y: number, scale = 1) => `translate(${x} ${y}) scale(${scale})`;
const line = {
  fill: "none",
  stroke: INK,
  strokeWidth: 7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Spark({
  x,
  y,
  color,
  size = 15,
  opacity = 1,
}: {
  x: number;
  y: number;
  color: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <path
      d={`M ${x - size} ${y} h ${2 * size} M ${x} ${y - size} v ${2 * size}`}
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      opacity={opacity}
    />
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
function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dashed?: boolean;
}) {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g {...line} stroke={color}>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} strokeDasharray={dashed ? "13 14" : undefined} />
      <path transform={`translate(${x2} ${y2}) rotate(${angle})`} d="M-20-15L0 0L-20 15" />
    </g>
  );
}
function Label({ children }: { children: ReactNode }) {
  return (
    <text
      fill={INK}
      textAnchor="middle"
      y="1"
      dominantBaseline="central"
      fontSize="28"
      fontWeight="800"
    >
      {children}
    </text>
  );
}
function Blocks({ x, y, scale = 1, p }: { x: number; y: number; scale?: number; p: number }) {
  const spread = 103 * p;
  return (
    <g transform={offset(x, y, scale)}>
      <ellipse rx={90 * p} ry="149" fill={RED} opacity={0.13 * p} />
      <path d="M0-95V95" stroke={RED} strokeWidth="6" strokeDasharray="8 12" opacity={p} />
      <g opacity={p}>
        <Arrow x1={-13} y1={0} x2={-78} y2={0} color={RED} />
        <Arrow x1={13} y1={0} x2={78} y2={0} color={RED} />
      </g>
      <path
        transform={offset(-spread, 0)}
        d="M-211-105H-5V-30H-43V29H-5V105H-211Q-228 105-228 88V-88Q-228-105-211-105Z"
        fill={INK}
      />
      <path
        transform={offset(spread, 0)}
        d="M4-105H210Q228-105 228-88V88Q228 105 210 105H4V29H-39V-30H4Z"
        fill={INK}
      />
    </g>
  );
}

const tags = ["Tắt?", "Cất cánh?", "Hủy?"];
function tagPosition(index: number, f: number) {
  const angle = (index * 2 * Math.PI) / 3 + Math.PI / 6 + f * 0.16;
  return [488 + 275 * Math.cos(angle), 308 + 42 * Math.sin(angle)];
}
function Tag({ index, x, y, alpha = 1 }: { index: number; x: number; y: number; alpha?: number }) {
  const width = index === 1 ? 184 : 130;
  return (
    <g transform={offset(x, y)} opacity={alpha}>
      <rect
        x={-width / 2}
        y="-29"
        width={width}
        height="58"
        fill={WHITE}
        stroke={RED}
        strokeWidth="3"
        rx="29"
      />
      <Label>{tags[index]}</Label>
    </g>
  );
}
function Hook({ f, showTags = true }: { f: number; showTags?: boolean }) {
  const frozen = f >= 10;
  return (
    <>
      <text
        x="488"
        y="234"
        textAnchor="middle"
        fill={RED}
        fontWeight="900"
        fontSize="204"
        letterSpacing="-12"
      >
        OFF
      </text>
      {showTags &&
        tags.map((tag, i) => {
          const [x, y] = tagPosition(i, f);
          return <Tag key={tag} index={i} x={x} y={y} />;
        })}
      <Stickman
        x={488}
        y={495 + (frozen ? 2 * Math.sin(f * 0.23) : 0)}
        f={f}
        pose={frozen ? "freeze" : "worry"}
        shirt={palette[0].shirt}
      />
      {frozen && <Sweat x={573} y={476} f={f - 10} />}
    </>
  );
}

function Bulb({
  lit,
  x = 0,
  y = 0,
  scale = 1,
}: {
  lit: number;
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <g transform={offset(x, y, scale)}>
      <circle cy="-18" r="142" fill="#FFD670" opacity={0.2 * lit} />
      <g stroke={AMBER} strokeWidth="8" strokeLinecap="round" opacity={lit}>
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d="M0-110v-22" transform={`rotate(${i * 45 - 90} 0 -21)`} />
        ))}
      </g>
      <path
        {...line}
        fill={lit > 0.4 ? "#FFD670" : "#F4F5F9"}
        d="M-45 6c-33-39-7-91 45-91S78-33 45 6Q26 24 26 49H-26Q-26 24-45 6Z"
      />
      <path {...line} fill="#BAC5DC" d="M-27 49H27L21 76Q0 86-21 76Z" />
      <path {...line} strokeWidth="4" d="M-10 48L-15 7H15L10 48" />
    </g>
  );
}
function SwitchShot({ f }: { f: number }) {
  const flip = ease(f, 24, 29);
  const split = ease(f, 27, 36);
  const lit = 1 - ease(f, 28, 43);
  return (
    <>
      <path
        {...line}
        d={`M350 568H${500 - 40 * split}M${500 + 40 * split} 568H655Q708 568 708 515V347`}
      />
      <circle cx={500 - 40 * split} cy="568" r="7" fill={BLUE} />
      <circle cx={500 + 40 * split} cy="568" r="7" fill={BLUE} />
      <Bulb x={708} y={274} lit={lit} scale={1.15} />
      <rect
        x="318"
        y="478"
        width="100"
        height="137"
        rx="19"
        fill={WHITE}
        stroke={INK}
        strokeWidth="6"
      />
      <rect
        x="341"
        y="504"
        width="52"
        height="83"
        rx="12"
        fill="#D1E0FD"
        stroke={INK}
        strokeWidth="4"
      />
      <path {...line} stroke={BLUE} strokeWidth="13" d={`M365 547l12 ${-21 + 43 * flip}`} />
      <Stickman
        x={197}
        y={501}
        f={f}
        shirt={palette[1].shirt}
        hand={[mix(98, 165, ease(f, 8, 24)), 43 + 22 * flip]}
      />
      <Spark x={500} y={565} color={BLUE} size={24} opacity={pulse(f, 26, 15)} />
    </>
  );
}
function AlarmShot({ f }: { f: number }) {
  const tap = ease(f, 13, 22);
  const stop = ease(f, 22, 38);
  const jitter = Math.sin(f * 2.8) * 7 * (1 - stop);
  return (
    <>
      <path {...line} d="M515 643H795M565 647V803M745 647V803" />
      <g transform={offset(655 + jitter, 536)}>
        <path {...line} d="M-52 57l-21 37m125-37l21 37" />
        <path
          {...line}
          fill="#AFCBFA"
          d="M-86-35q-27-37 16-52q21-5 34 17m122 35q27-37-16-52q-21-5-34 17"
        />
        <circle r="79" fill={WHITE} stroke={INK} strokeWidth="7" />
        <path {...line} d="M0-39V0L35 17" />
        <circle r="8" fill={BLUE} />
      </g>
      <g
        {...line}
        stroke={BLUE}
        strokeWidth="5"
        opacity={1 - stop}
        transform={`translate(0 ${-46 * stop})`}
      >
        <path d="M520 461q-18-28 0-57m-28 63q-22-37 0-74m298 68q18-28 0-57m28 63q22-37 0-74" />
      </g>
      <Stickman
        x={338}
        y={501 + 4 * Math.sin(f * 0.16)}
        f={f}
        shirt={palette[1].shirt}
        pose={f < 22 ? "worry" : "idle"}
        hand={[mix(92, 243, tap) - 134 * ease(f, 25, 42), mix(164, 99, tap) + 56 * ease(f, 25, 42)]}
      />
      <Spark x={454} y={450} color={BLUE} size={18} opacity={pulse(f, 30, 22)} />
    </>
  );
}
function CapShot({ f }: { f: number }) {
  const pull = ease(f, 16, 42);
  const x = mix(476, 672, pull),
    y = mix(362, 197, pull);
  return (
    <>
      <ellipse cx="479" cy="439" rx="109" ry="17" fill={AMBER} opacity={0.09 * pulse(f, 16, 36)} />
      <Stickman
        x={414}
        y={493}
        f={f}
        shirt={palette[2].shirt}
        hand={[x - 414 - 28, y - 493 + 13]}
      />
      {pull > 0.1 && (
        <g opacity={pull * 0.9}>
          <Arrow x1={520} y1={418} x2={x + 41} y2={y + 43} color={AMBER} dashed />
        </g>
      )}
      <g transform={`translate(${x} ${y}) rotate(${-16 * pull})`}>
        <path {...line} fill="#F7CE8A" d="M-75 7Q-68-66-3-62Q58-62 61 7Z" />
        <path {...line} fill="#FFD98E" d="M-6 7Q63-10 113 8Q116 23 83 22H-5Z" />
        <path {...line} stroke={AMBER} strokeWidth="4" d="M-14 5Q-20-34-2-58" />
      </g>
      <Spark x={770} y={169} color={AMBER} size={22} opacity={pulse(f, 30, 26)} />
    </>
  );
}
function Plane({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={offset(0, 0, scale)}>
      <path
        {...line}
        fill={WHITE}
        d="M-164 7L-193-47H-166L-124-14L-49-16L-99-103H-62L32-17H111Q159-17 188 12Q195 34 150 39L11 40L-59 101H-103L-63 40H-119Z"
      />
      <path d="M-110 13H150" stroke={AMBER} strokeWidth="6" strokeLinecap="round" />
      <path {...line} d="M20-4h11m15 0h11m15 0h11m15 0h11m16-1l20 2" />
      <path {...line} d="M-100 41v19m220-19v19" />
      <circle cx="-100" cy="63" r="11" fill={INK} />
      <circle cx="120" cy="63" r="11" fill={INK} />
    </g>
  );
}
function FlightShot({ f }: { f: number }) {
  const roll = ease(f, 6, 30),
    lift = ease(f, 26, 69);
  const x = 267 + 204 * roll + 225 * lift - 42 * ease(f, 10, 74);
  const y = 747 - 352 * lift;
  return (
    <>
      <path {...line} stroke={AMBER} opacity=".22" strokeDasharray="33 23" d="M95 772H885" />
      <g opacity={lift}>
        <Arrow x1={x + 30} y1={791} x2={x + 30} y2={Math.min(753, y + 91)} color={AMBER} dashed />
      </g>
      <g transform={`translate(${x} ${y}) rotate(${-18 * pulse(f, 26, 72)})`}>
        <Plane scale={0.89} />
      </g>
      <Spark x={782} y={342} color={AMBER} opacity={pulse(f, 40, 27)} />
    </>
  );
}
function Calendar({ scale = 1, small = false }: { scale?: number; small?: boolean }) {
  return (
    <g transform={offset(0, 0, scale)}>
      <rect
        x="-174"
        y="-153"
        width="348"
        height="308"
        rx="30"
        fill={WHITE}
        stroke={INK}
        strokeWidth="7"
      />
      <path d="M-170-94H170V-123Q170-149 145-149H-145Q-170-149-170-123Z" fill="#A5E4C9" />
      <path {...line} d="M-171-93H171M-92-126v-43m184 43v-43" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={-144 + (i % 3) * 100}
          y={-69 + Math.floor(i / 3) * 99}
          width="87"
          height="78"
          rx="11"
          fill={i === 1 && !small ? "#F5F0E6" : "#E7F7F0"}
        />
      ))}
    </g>
  );
}
function CallShot({ f }: { f: number }) {
  const raise = ease(f, 7, 20),
    fly = ease(f, 34, 63);
  const handY = mix(163, 30, raise);
  return (
    <>
      <g transform={offset(633, 482)}>
        <Calendar />
      </g>
      <g transform={`translate(${633 + 196 * fly} ${452 - 111 * fly}) rotate(${11 * fly})`}>
        <rect
          x="-44"
          y="-39"
          width="87"
          height="78"
          rx="12"
          fill="#A5E4C9"
          stroke={GREEN}
          strokeWidth="4"
        />
        <Label>9:00</Label>
      </g>
      <g opacity={pulse(f, 34, 45)}>
        <Arrow x1={685} y1={437} x2={798} y2={381} color={GREEN} dashed />
      </g>
      <Stickman x={262} y={497} f={f} shirt={palette[3].shirt} pose="talk" hand={[73, handY]} />
      <g transform={`translate(332 ${479 + handY}) rotate(-20)`}>
        <rect x="-13" y="-30" width="26" height="52" rx="9" fill={INK} />
        <path d="M0-23v12" stroke="#A5E4C9" strokeWidth="3" strokeLinecap="round" />
      </g>
    </>
  );
}
function Verdict({ x, y, good }: { x: number; y: number; good: boolean }) {
  return (
    <g transform={offset(x, y)}>
      <circle r="30" fill={good ? GREEN : RED} />
      <path
        d={good ? "M-13 1l8 10 19-22" : "M-10-10l20 20m0-20l-20 20"}
        fill="none"
        stroke={WHITE}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
function Comparison({ f }: { f: number }) {
  const split = ease(f, 0, 11);
  const yes = ease(f, 25, 39);
  const wobble = Math.sin(f * 0.37) * (3 + 6 * pulse(f, 3, 20));
  return (
    <>
      <g transform={offset(-28 * (1 - split), 0)} opacity={0.4 + 0.6 * split}>
        <rect
          x="31"
          y="63"
          width="443"
          height="756"
          rx="34"
          fill="#FDECEC"
          stroke={INK}
          strokeWidth="4"
        />
        <Verdict x={100} y={128} good={false} />
        <text x="255" y="185" textAnchor="middle" fontSize="43" fontWeight="900" fill={RED}>
          Học vẹt
        </text>
        <g transform={`rotate(${wobble} 253 370)`}>
          {["#ECC1BB", "#F7CE8A", "#BDD4FA", "#F5B7A5"].map((color, i) => (
            <g key={color} transform={offset(253 + (i % 2 ? 12 : -15), 376 - i * 37)}>
              <rect
                x={-111 + 8 * i}
                y="-30"
                width={220 - 13 * i}
                height="33"
                rx="6"
                fill={color}
                stroke={INK}
                strokeWidth="5"
              />
              <path d="M-72-13h129" stroke={INK} strokeWidth="2" opacity=".31" />
            </g>
          ))}
        </g>
        <Stickman
          x={252}
          y={493}
          f={f}
          pose="worry"
          shirt={palette[0].shirt}
          scale={0.92}
          hand={[117, -106]}
        />
        <Sweat x={325} y={459} f={f} />
      </g>
      <g transform={offset(28 * (1 - split), 0)} opacity={0.4 + 0.6 * split}>
        <rect
          x="502"
          y="63"
          width="443"
          height="756"
          rx="34"
          fill="#E7F7F0"
          stroke={INK}
          strokeWidth="4"
        />
        <Verdict x={570} y={128} good />
        <text x="727" y="185" textAnchor="middle" fontSize="39" fontWeight="900" fill={GREEN}>
          OFF = Tách rời
        </text>
        <Stickman x={663} y={493} f={f} shirt={palette[3].shirt} scale={0.92} hand={[107, 150]} />
        <circle cx="797" cy="573" r={82 + 10 * yes} fill={WHITE} opacity={0.48 + yes * 0.36} />
        <Blocks x={797} y={573} scale={0.24 + 0.025 * pulse(f, 33, 19)} p={0.47 + 0.53 * yes} />
        <Spark x={875} y={489} color={GREEN} opacity={yes * (0.64 + 0.36 * Math.sin(f * 0.19))} />
      </g>
    </>
  );
}

const recap = [
  { phrase: "1. TURN OFF — Tắt", y: 258, size: 43 },
  { phrase: "2. TAKE OFF — Cởi / Cất cánh", y: 450, size: 38 },
  { phrase: "3. CALL OFF — Hủy bỏ", y: 642, size: 43 },
];
function RecapIcon({ i }: { i: number }) {
  if (i === 0) return <Bulb lit={1} scale={0.41} />;
  if (i === 1) return <Plane scale={0.22} />;
  return <Calendar scale={0.22} small />;
}
function Recap({ f, morph = 0 }: { f: number; morph?: number }) {
  return (
    <>
      {recap.map(({ phrase, y, size }, i) => {
        const brand = palette[i + 1];
        const [tx, ty] = tagPosition(i, 0);
        const scale = 1 + 0.06 * pulse(f, 6 + i * 18, 18);
        const x = mix(488, tx, morph);
        const positionY = mix(y, ty, morph);
        const width = mix(790, i === 1 ? 184 : 130, morph);
        const height = mix(138, 58, morph);
        const swap = ease(morph, 0.45, 0.93);
        return (
          <g key={phrase} transform={offset(x, positionY, mix(scale, 1, morph))}>
            <rect
              x={-width / 2}
              y={-height / 2}
              width={width}
              height={height}
              rx={mix(34, 29, morph)}
              stroke={morph > 0.68 ? RED : INK}
              strokeWidth={mix(2.5, 3, morph)}
              fill={morph > 0.68 ? WHITE : brand.tint}
            />
            <g opacity={1 - ease(morph, 0.05, 0.39)}>
              <g transform={offset(-319, 0)}>
                <rect
                  x="-51"
                  y="-50"
                  width="102"
                  height="100"
                  rx="22"
                  fill={WHITE}
                  stroke={INK}
                  strokeWidth="3"
                />
                <RecapIcon i={i} />
              </g>
              <text
                x="-236"
                y="1"
                dominantBaseline="central"
                fontSize={size}
                fontWeight="900"
                fill={INK}
              >
                {phrase}
              </text>
            </g>
            <g opacity={swap}>
              <Label>{tags[i]}</Label>
            </g>
          </g>
        );
      })}
    </>
  );
}
function Stage({ beat, f }: { beat: number; f: number }) {
  const brand = palette[chapter[beat - 1]];
  const whip = beat === 3 || beat === 7 ? 1 - ease(f, 0, 10) : 0;
  const punch =
    beat === 1
      ? 0.115 * (ease(f, 6, 13) - ease(f, 33, 62))
      : beat === 2
        ? 0.1 * (1 - ease(f, 0, 11))
        : beat === 4
          ? 0.05 * ease(f, 0, 74)
          : beat === 5
            ? 0.045 * (1 - ease(f, 0, 11))
            : 0;
  const shake = beat === 1 ? 12 * Math.sin((f - 10) * 1.55) * pulse(f, 10, 17) : 0;
  const pan =
    (beat === 3 ? 306 : beat === 7 ? -306 : 0) * whip + (beat === 6 ? -36 * ease(f, 4, 73) : 0);
  const morph = beat === 10 ? ease(f, 39, 73) : 0;
  const tint = beat === 10 && f < 19 ? "#F7F3EA" : brand.tint;
  return (
    <svg
      data-zone="stage"
      width="976"
      height="900"
      viewBox="0 0 976 900"
      style={{
        position: "absolute",
        left: 52,
        top: 260,
        borderRadius: 40,
        overflow: "hidden",
        boxShadow: "inset 0 0 0 1px #1d1d1f07",
      }}
    >
      <defs>
        <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.6" fill={INK} opacity=".13" />
        </pattern>
      </defs>
      <rect width="976" height="900" rx="40" fill={tint} />
      <rect x="12" y="12" width="952" height="876" rx="32" fill="url(#dots)" opacity=".53" />
      <circle cx={488 + Math.sin(f * 0.08) * 12} cy="435" r="329" fill={WHITE} opacity=".36" />
      <circle
        cx={488 + Math.sin(f * 0.08) * 12}
        cy="435"
        r="359"
        fill="none"
        stroke={WHITE}
        strokeWidth="2"
        opacity=".65"
      />
      <path
        d="M85 817H891"
        stroke={INK}
        strokeWidth="4"
        strokeDasharray="14 15"
        opacity=".25"
        strokeLinecap="round"
      />
      <Spark x={101} y={131} color={brand.accent} opacity={0.66 + 0.26 * Math.cos(f * 0.13)} />
      <Spark
        x={868}
        y={746}
        color={brand.accent}
        opacity={0.66 + 0.26 * Math.sin(f * 0.13)}
        size={19}
      />
      <g
        transform={`translate(${pan + shake} 0) translate(488 475) scale(${1 + punch}) translate(-488 -475)`}
        opacity={1 - whip * 0.49}
      >
        {beat === 1 && <Hook f={f} />}
        {beat === 2 && (
          <>
            <g opacity={1 - ease(f, 0, 11)}>
              {tags.map((tag, i) => {
                const [x, y] = tagPosition(i, 74);
                return <Tag key={tag} index={i} x={x} y={y - f * 8} />;
              })}
            </g>
            <Blocks
              x={488}
              y={445}
              p={0.94 * ease(f, 8, 17) + 0.13 * pulse(f, 12, 16) + 0.06 * ease(f, 20, 34)}
            />
            <Spark x={488} y={312} color={RED} opacity={pulse(f, 18, 24)} />
          </>
        )}
        {beat === 3 && <SwitchShot f={f} />}
        {beat === 4 && <AlarmShot f={f} />}
        {beat === 5 && <CapShot f={f} />}
        {beat === 6 && <FlightShot f={f} />}
        {beat === 7 && <CallShot f={f} />}
        {beat === 8 && <Comparison f={f} />}
        {beat === 9 && <Recap f={f} />}
        {beat === 10 && (
          <>
            <g opacity={ease(f, 46, 73)}>
              <Hook f={0} showTags={false} />
            </g>
            <Recap f={75} morph={morph} />
          </>
        )}
      </g>
      {whip > 0 && (
        <path
          d="M-70 270H1010M-80 448H1040M-60 610H1020"
          opacity={whip * 0.17}
          stroke={brand.accent}
          strokeWidth="24"
          strokeLinecap="round"
        />
      )}
      <rect
        x="1.75"
        y="1.75"
        width="972.5"
        height="896.5"
        rx="39"
        fill="none"
        stroke={INK}
        strokeWidth="3.5"
      />
    </svg>
  );
}
function Progress({ beat, f }: { beat: number; f: number }) {
  const count = counts[beat - 1];
  if (!count) return null;
  const changed = [2, 3, 5, 7].includes(beat);
  const slide = beat === 2 ? (1 - bounce(f, 1)) * -28 : 0;
  const fill = (count - (changed ? 1 - ease(f, 0, 20) : 0)) / 4;
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
        opacity: beat === 2 ? ease(f, 1, 12) : beat === 10 ? 1 - ease(f, 9, 47) : 1,
        transform: `translateY(${slide}px)`,
      }}
    >
      <span
        style={{
          fontSize: 27,
          fontVariantNumeric: "tabular-nums",
          fontWeight: 800,
          letterSpacing: -1,
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
            inset: `0 auto 0 0`,
            width: `${fill * 100}%`,
            borderRadius: 10,
            background: palette[chapter[beat === 10 ? 8 : beat - 1]].accent,
          }}
        />
      </span>
    </div>
  );
}
function Bookmark({ f }: { f: number }) {
  return (
    <svg
      width="78"
      height="78"
      viewBox="0 0 78 78"
      aria-hidden="true"
      style={{
        marginLeft: 22,
        verticalAlign: "middle",
        transform: `translateY(${Math.sin(f * 0.2) * 5}px) scale(${bounce(f, 7)})`,
      }}
    >
      <rect
        x="4"
        y="4"
        width="70"
        height="70"
        rx="22"
        fill="#FFD670"
        stroke={INK}
        strokeWidth="4"
      />
      <path d="M26 21h26v39L39 50 26 60Z" fill={INK} />
    </svg>
  );
}
const translations: Record<number, string> = {
  3: "Ngắt điện = Tắt",
  4: "Tắt báo thức",
  5: "Tách khỏi người = Cởi ra",
  6: "Tách mặt đất = Cất cánh",
  7: "Tách khỏi lịch = Hủy bỏ",
};
const titleStyle = {
  fontWeight: 900,
  letterSpacing: -3,
  lineHeight: 1.12,
  textAlign: "center",
} as const;
function Headline({ beat, f }: { beat: number; f: number }) {
  const brand = palette[chapter[beat - 1]];
  const off = (hollow = false) => (
    <span
      style={{
        color: hollow ? "transparent" : brand.accent,
        WebkitTextStroke: hollow ? `4px ${brand.accent}` : undefined,
        display: "inline-block",
        transform: `translateY(${(1 - bounce(f, 4)) * 11}px) scale(${1 + 0.075 * pulse(f, 7, 19)})`,
      }}
    >
      OFF
    </span>
  );
  const headlines: ReactNode[] = [
    <>
      SAO{" "}
      <span
        style={{
          color: RED,
          display: "inline-block",
          transform: `scale(${1 + 0.105 * pulse(f, 8, 19)})`,
        }}
      >
        'OFF'
      </span>
      <br />
      LẮM NGHĨA VẬY?
    </>,
    <>
      1 NGHĨA GỐC:
      <br />
      <span
        style={{
          color: RED,
          display: "inline-block",
          transform: `scale(${1 + 0.11 * pulse(f, 16, 17)})`,
        }}
      >
        TÁCH RỜI
      </span>
    </>,
    <>TURN {off(true)}</>,
    <>Turn off the alarm</>,
    <>TAKE {off()}</>,
    <>The plane takes off</>,
    <>CALL {off()}</>,
    null,
    <>
      1 TỪ LÕI: <span style={{ color: RED }}>TÁCH RỜI</span>
    </>,
    <>
      Lưu lại khỏi học vẹt
      <Bookmark f={f} />
    </>,
  ];
  const fontSize = [90, 100, 112, 80, 112, 75, 112, 76, 75, 72][beat - 1];
  const title = headlines[beat - 1];
  const label = beat === 8 ? "Học 1 hiểu 10" : translations[beat];
  const wordSpring = beat === 1 || beat === 10 ? 0 : 17 * (1 - bounce(f, 0));
  return (
    <div
      data-zone="typography"
      style={{
        position: "absolute",
        top: 1210,
        height: 330,
        left: 65,
        right: 65,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        textAlign: "center",
        opacity: beat === 10 ? 1 - ease(f, 57, 72) : 1,
      }}
    >
      {title && (
        <div style={{ ...titleStyle, fontSize, transform: `translateY(${wordSpring}px)` }}>
          {title}
        </div>
      )}
      {label && (
        <div
          style={{
            fontWeight: 800,
            fontSize: beat === 8 ? 76 : 35,
            color: brand.accent,
            background: brand.tint,
            border: `2px solid ${brand.accent}`,
            padding: beat === 8 ? "19px 49px" : "11px 32px",
            borderRadius: 100,
            whiteSpace: "nowrap",
            transform: `translateY(${(1 - bounce(f, 7)) * 8}px)`,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
const grain = `url("data:image/svg+xml,%3Csvg viewBox='0 0 190 190' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.81' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%23836F52' filter='url(%23g)' d='M0 0h190v190H0z'/%3E%3C/svg%3E")`;

export function Art({ beat, frame }: { beat: number; frame: number }) {
  const loop = beat === 10 && frame === 74;
  const shownBeat = loop ? 1 : beat;
  const f = loop ? 0 : frame;
  return (
    <AbsoluteFill style={{ background: "#F5F0E6", color: INK, fontFamily, overflow: "hidden" }}>
      <AbsoluteFill
        style={{ backgroundImage: grain, backgroundSize: "190px 190px", opacity: 0.03 }}
      />
      <Progress beat={shownBeat} f={f} />
      <Stage beat={shownBeat} f={f} />
      {beat === 10 && !loop && (
        <div style={{ opacity: ease(frame, 64, 74) }}>
          <Headline beat={1} f={0} />
        </div>
      )}
      <Headline beat={shownBeat} f={f} />
    </AbsoluteFill>
  );
}

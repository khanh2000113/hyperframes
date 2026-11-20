import type { ReactNode } from "react";
import {
  AMBER,
  BLUE,
  GREEN,
  INK,
  RED,
  WHITE,
  Spark,
  Sweat,
  bounce,
  ease,
  line,
  mix,
  offset,
  palette,
  pulse,
} from "./visual";
import { Stickman } from "./components/Stickman";

const labels = ["IN", "ON", "AT"];
const glyphColors = [BLUE, AMBER, GREEN];

function Text({
  children,
  x = 0,
  y = 0,
  size = 32,
  color = INK,
  anchor = "middle",
}: {
  children: ReactNode;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  anchor?: "start" | "middle";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fill={color}
      stroke="none"
      fontSize={size}
      fontWeight="900"
    >
      {children}
    </text>
  );
}

function tilePosition(i: number, f: number) {
  const angle =
    (i * 2 * Math.PI) / 3 - Math.PI / 2 + 0.29 * Math.min(f, 10) + 0.082 * Math.max(f - 10, 0);
  return [488 + 270 * Math.cos(angle), 232 + 110 * Math.sin(angle)];
}

function Tile({
  i,
  x,
  y,
  opacity = 1,
  scale = 1,
}: {
  i: number;
  x: number;
  y: number;
  opacity?: number;
  scale?: number;
}) {
  return (
    <g transform={offset(x, y, scale)} opacity={opacity}>
      <rect
        x="-74"
        y="-47"
        width="148"
        height="94"
        rx="25"
        fill={WHITE}
        stroke={RED}
        strokeWidth="3.5"
      />
      <Text color={RED} size={53}>
        {labels[i]}
      </Text>
    </g>
  );
}

function Hook({ f, showTiles = true }: { f: number; showTiles?: boolean }) {
  return (
    <>
      {showTiles &&
        labels.map((label, i) => {
          const [x, y] = tilePosition(i, f);
          return <Tile key={label} i={i} x={x} y={y} />;
        })}
      <Stickman
        x={488}
        y={494 + 2 * Math.sin(f * 0.19)}
        f={f}
        pose={f < 10 ? "scratch" : "freeze"}
        shirt={palette[0].shirt}
      />
      {f >= 10 && (
        <>
          <g transform={offset(672, 474, 0.82 + 0.18 * bounce(f, 10))}>
            <circle r="36" fill={RED} />
            <Text color={WHITE} size={49}>
              ?
            </Text>
          </g>
          <Sweat x={570} y={475} f={f - 10} />
        </>
      )}
    </>
  );
}

function BoxIcon() {
  return (
    <g {...line} stroke={BLUE} strokeWidth="6">
      <path d="M-65-12L-32-41H66L33-12M66-41v59L33 46" fill="#BDD4FA" />
      <path d="M-65-12H33V46H-65Z" fill="#EBF2FE" />
      <path d="M-65-12L-84-42l37-22 15 23M33-12L51-49l35-15-20 23" fill="#F5F9FF" />
      <path strokeWidth="4" d="M-45 10h19" />
    </g>
  );
}
function SurfaceIcon() {
  return (
    <g {...line} stroke={AMBER} strokeWidth="6">
      <path d="M-72 9L-42-20H72L43 9Z" fill="#F7CE8A" />
      <path d="M-72 9v14H43L72-6v-14M43 9v14" />
      <circle cx="4" cy="-36" r="14" fill={WHITE} />
    </g>
  );
}
function PinIcon() {
  return (
    <g {...line} stroke={GREEN} strokeWidth="6">
      <ellipse cy="41" rx="38" ry="13" fill="#E7F7F0" />
      <path d="M0 36Q-35-1-35-22a35 35 0 0 1 70 0Q35-1 0 36Z" fill={GREEN} />
      <circle cy="-23" r="11" fill={WHITE} stroke="none" />
    </g>
  );
}
function Icon({ i }: { i: number }) {
  if (i === 0) return <BoxIcon />;
  if (i === 1) return <SurfaceIcon />;
  return <PinIcon />;
}
function KeyShot({ f }: { f: number }) {
  return (
    <>
      {labels.map((label, i) => {
        const [fromX, fromY] = tilePosition(i, 74);
        const at = [12, 22, 34][i];
        const p = ease(f, 0, at);
        const show = ease(f, at - 4, at + 6);
        const x = mix(fromX, [207, 490, 764][i], p);
        const y = mix(fromY, 445, p);
        const size = [1.48, 1.21, 1.02][i];
        return (
          <g key={label}>
            <Tile i={i} x={x} y={y} opacity={1 - show} scale={mix(1, 0.77, show)} />
            <g opacity={show} transform={offset(x, y, size * (0.8 + 0.2 * bounce(f, at - 3)))}>
              <circle r="81" fill={palette[i + 1].tint} opacity=".79" />
              <Icon i={i} />
            </g>
            <g opacity={show} transform={offset(x, 590)}>
              <rect
                x="-61"
                y="-33"
                width="122"
                height="66"
                rx="33"
                fill={WHITE}
                stroke={glyphColors[i]}
                strokeWidth="3"
              />
              <Text size={39} color={glyphColors[i]}>
                {label}
              </Text>
            </g>
          </g>
        );
      })}
    </>
  );
}

function BoxFrame({
  x,
  y,
  w,
  h,
  opacity = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="37"
        fill="#BDD4FA"
        fillOpacity=".30"
        stroke={BLUE}
        strokeWidth="8"
      />
      <rect
        x={x + 16}
        y={y + 16}
        width={w - 32}
        height={h - 32}
        rx="24"
        fill="none"
        stroke={WHITE}
        strokeWidth="3"
      />
      <path
        d={`M${x + 34} ${y + h - 36}H${x + w - 34}`}
        stroke={BLUE}
        strokeWidth="5"
        opacity=".45"
        strokeDasharray="13 14"
        strokeLinecap="round"
      />
    </g>
  );
}
function InCore({ f }: { f: number }) {
  const hop = ease(f, 16, 30);
  return (
    <>
      <BoxFrame x={280} y={251} w={500} h={510} />
      <Stickman
        x={mix(153, 529, hop)}
        y={mix(583, 495, hop) - 121 * pulse(f, 16, 14)}
        scale={0.73}
        f={f}
        pose={f < 16 ? "idle" : "celebrate"}
        shirt={palette[1].shirt}
      />
      <Spark x={691} y={410} color={BLUE} size={25} opacity={pulse(f, 30, 22)} />
      <Spark x={360} y={337} color={BLUE} size={17} opacity={0.6 * pulse(f, 33, 31)} />
    </>
  );
}

function Calendar({ day = false }: { day?: boolean }) {
  return (
    <g {...line} strokeWidth="6">
      <rect x="-51" y="-43" width="102" height="88" rx="13" fill={WHITE} />
      <path
        d="M-47-19H47V-32Q47-39 39-39H-39Q-47-39-47-32Z"
        fill={day ? "#F7CE8A" : "#BDD4FA"}
        stroke="none"
      />
      <path d="M-48-19H48M-26-51v20m52-20v20" />
      <Text y={12} size={day ? 28 : 25} color={day ? AMBER : BLUE}>
        {day ? "MON" : "2026"}
      </Text>
    </g>
  );
}
function Skyline() {
  return (
    <g {...line} stroke={BLUE} strokeWidth="5" fill="#BDD4FA">
      <path d="M-49 39v-48h27v48M-22 39v-70H4v70M4 39V-9h12v-13h29v61ZM-56 39H53" />
      <path d="M-12-16h5m-5 15h5m26 3h10m-10 13h10" fill="none" />
    </g>
  );
}
function Clock() {
  return (
    <g {...line} strokeWidth="6">
      <circle r="44" fill={WHITE} />
      <path d="M0-26V0L20 14" stroke={GREEN} />
    </g>
  );
}
function Door() {
  return (
    <g {...line} strokeWidth="6">
      <path d="M-35 45V-43H35V45M-45 45H45" fill={WHITE} />
      <path d="M-22 43V-29L23-40V44Z" fill="#A5E4C9" />
      <circle cx="12" cy="6" r="3" fill={GREEN} stroke={GREEN} />
    </g>
  );
}

function Badge({
  x,
  y,
  w,
  text,
  color,
  children,
}: {
  x: number;
  y: number;
  w: number;
  text: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <g transform={offset(x, y)}>
      <rect
        x={-w / 2}
        y="-50"
        width={w}
        height="100"
        rx="28"
        fill={WHITE}
        stroke={color}
        strokeWidth="3"
      />
      <g transform={offset(-w / 2 + 59, 0, 0.59)}>{children}</g>
      <Text x={-w / 2 + 108} anchor="start" size={30}>
        {text}
      </Text>
    </g>
  );
}
function InExamples({ f }: { f: number }) {
  const first = bounce(f, 8),
    second = bounce(f, 26);
  return (
    <>
      <BoxFrame x={335} y={232} w={476} h={513} />
      <g opacity={ease(f, 8, 12)} transform={offset(17 * (1 - first), 22 * (1 - first))}>
        <Badge x={573} y={400} w={373} text="in 2026" color={BLUE}>
          <Calendar />
        </Badge>
      </g>
      <g opacity={ease(f, 26, 30)} transform={offset(22 * (1 - second), 20 * (1 - second))}>
        <Badge x={573} y={548} w={373} text="in Saigon" color={BLUE}>
          <Skyline />
        </Badge>
      </g>
      <Stickman
        x={215}
        y={550}
        scale={0.8}
        f={f < 42 ? 0 : f - 42}
        pose="nod"
        shirt={palette[1].shirt}
      />
      <Spark x={742} y={664} color={BLUE} opacity={pulse(f, 42, 25)} />
    </>
  );
}
const platformY = 752;
function Platform({
  x = 174,
  w = 628,
  y = platformY,
  height = 33,
}: {
  x?: number;
  w?: number;
  y?: number;
  height?: number;
}) {
  return (
    <g {...line} stroke={AMBER}>
      <rect x={x} y={y} width={w} height={height} rx={Math.min(23, height / 2)} fill="#F7CE8A" />
      <path d={`M${x + 22} ${y + 1}H${x + w - 22}`} strokeWidth="9" />
    </g>
  );
}
function OnCore({ f }: { f: number }) {
  const flatten = ease(f, 0, 24);
  const touch = pulse(f, 24, 22);
  const y = platformY - 318 * 0.76 - 92 * (1 - ease(f, 12, 24)) - 19 * pulse(f, 25, 12);
  return (
    <>
      {f < 21 && (
        <BoxFrame
          x={280}
          y={mix(251, 685, flatten)}
          w={500}
          h={mix(510, 75, flatten)}
          opacity={1 - ease(f, 0, 17)}
        />
      )}
      <g opacity={ease(f, 2, 14)}>
        <Platform
          x={mix(280, 176, flatten)}
          w={mix(500, 624, flatten)}
          y={mix(251, platformY, flatten)}
          height={mix(510, 38, flatten) - 16 * pulse(f, 24, 15)}
        />
      </g>
      <ellipse
        cx="493"
        cy={platformY - 1}
        rx={102 + 43 * touch}
        ry={14 + 16 * touch}
        fill="#FFD670"
        opacity={0.27 * touch}
      />
      <Stickman
        x={mix(529, 489, flatten)}
        y={y}
        scale={0.76}
        f={f}
        pose={f < 24 ? "celebrate" : "idle"}
        shirt={palette[2].shirt}
      />
      <Spark x={340} y={720} color={AMBER} opacity={touch} size={19} />
      <Spark x={645} y={721} color={AMBER} opacity={touch} size={18} />
    </>
  );
}
function Cup() {
  return (
    <g {...line}>
      <path d="M44-20H62Q94-20 90 6Q86 27 51 26" fill={WHITE} />
      <path d="M-57-39H54L45 37Q40 57 20 57H-28Q-45 57-50 38Z" fill="#F7CE8A" />
      <ellipse cx="-1.5" cy="-39" rx="55.5" ry="13" fill="#936039" />
      <path d="M-72 62H70" stroke={AMBER} />
      <path
        d="M-25-65q-15-19 4-32m22 29q-15-19 4-32m22 34q-15-19 4-32"
        stroke={AMBER}
        strokeWidth="4"
        opacity=".7"
      />
    </g>
  );
}
function OnExamples({ f }: { f: number }) {
  const day = bounce(f, 8);
  const cup = bounce(f, 26);
  return (
    <>
      <Platform x={110} w={756} />
      <path {...line} stroke={AMBER} d="M165 786v43m647-43v43" opacity=".55" />
      <g opacity={ease(f, 8, 14)}>
        <Badge x={279} y={248} w={285} text="on Monday" color={AMBER}>
          <Calendar day />
        </Badge>
        <g transform={offset(279, platformY - 45 * 2.58 - 70 * (1 - day), 2.58)}>
          <Calendar day />
        </g>
      </g>
      <g opacity={ease(f, 26, 32)}>
        <Badge x={680} y={248} w={312} text="on the table" color={AMBER}>
          <g transform="scale(.72)">
            <Cup />
          </g>
        </Badge>
        <g transform={offset(674, platformY - 62 * 2.31 - 70 * (1 - cup), 2.31)}>
          <Cup />
        </g>
      </g>
      <Spark x={822} y={560} color={AMBER} opacity={pulse(f, 40, 27)} size={19} />
    </>
  );
}

function AtCore({ f }: { f: number }) {
  const drop = ease(f, 0, 14);
  const wave = ease(f, 14, 39);
  const impact = pulse(f, 14, 19);
  const examples = bounce(f, 28);
  return (
    <>
      <ellipse
        cx="488"
        cy="817"
        rx={78 + 24 * wave}
        ry={26 + 6 * wave}
        fill="#A5E4C9"
        opacity={0.42 + 0.23 * impact}
      />
      <ellipse
        cx="488"
        cy="817"
        rx={62 + 20 * wave}
        ry={19 + 6 * wave}
        fill="none"
        stroke={GREEN}
        strokeWidth="4"
        opacity={0.48 + 0.38 * (1 - wave)}
      />
      <ellipse cx="488" cy="817" rx="32" ry="11" fill={GREEN} opacity=".6" />
      <circle cx="488" cy="817" r="7" fill={WHITE} />
      <g transform={offset(488, 817 - 388 * (1 - drop) - 17 * pulse(f, 15, 18))}>
        <path
          {...line}
          stroke={GREEN}
          fill={GREEN}
          d="M0 0C-27-43-113-107-113-172a113 113 0 0 1 226 0C113-107 27-43 0 0Z"
        />
        <circle cy="-172" r="43" fill={WHITE} />
        <circle cy="-172" r="16" fill="#A5E4C9" />
      </g>
      <g opacity={ease(f, 28, 35)}>
        <Badge
          x={mix(460, 226, examples)}
          y={mix(569, 448, examples)}
          w={250}
          text="at 7:00"
          color={GREEN}
        >
          <Clock />
        </Badge>
        <Badge
          x={mix(520, 748, examples)}
          y={mix(560, 448, examples)}
          w={282}
          text="at the door"
          color={GREEN}
        >
          <Door />
        </Badge>
      </g>
      <Spark x={340} y={763} color={GREEN} opacity={impact} />
      <Spark x={652} y={754} color={GREEN} opacity={impact} size={21} />
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
function Quiz({ f }: { f: number }) {
  const split = ease(f, 0, 11);
  return (
    <>
      {[false, true].map((correct, i) => {
        const x = i === 0 ? 31 : 502;
        const color = correct ? GREEN : RED;
        const phrases = correct ? ["on Monday", "at 7:00"] : ["in Monday", "on 7:00"];
        const reveal = ease(f, correct ? 31 : 3, correct ? 42 : 13);
        return (
          <g
            key={color}
            transform={offset((i === 0 ? -28 : 28) * (1 - split), 0)}
            opacity={0.4 + 0.6 * split}
          >
            <rect
              x={x}
              y="63"
              width="443"
              height="756"
              rx="34"
              fill={correct ? "#E7F7F0" : "#FDECEC"}
              stroke={INK}
              strokeWidth="4"
            />
            <Verdict x={x + 67} y={130} good={correct} />
            <Stickman
              x={x + 105}
              y={538}
              f={f}
              scale={0.72}
              pose={correct ? "thumb" : "worry"}
              shirt={palette[correct ? 3 : 0].shirt}
            />
            {!correct && <Sweat x={x + 152} y={505} f={f} />}
            {phrases.map((phrase, j) => (
              <g
                key={phrase}
                opacity={0.23 + 0.77 * reveal}
                transform={offset(x + 241, 258 + j * 126 + 24 * (1 - reveal))}
              >
                <rect
                  x="-163"
                  y="-39"
                  width="326"
                  height="78"
                  rx="26"
                  fill={WHITE}
                  stroke={color}
                  strokeWidth="3"
                />
                <Text size={39}>{phrase}</Text>
              </g>
            ))}
            {correct && (
              <Spark x={x + 317} y={594} color={GREEN} opacity={pulse(f, 34, 32)} size={23} />
            )}
          </g>
        );
      })}
    </>
  );
}

const recap = [
  { phrase: "1. IN — Trong hộp (vùng rộng)", y: 258, size: 37 },
  { phrase: "2. ON — Mặt phẳng (ngày / bề mặt)", y: 450, size: 35 },
  { phrase: "3. AT — Chấm điểm (giờ / vị trí)", y: 642, size: 36 },
];
function Recap({ f, morph = 0 }: { f: number; morph?: number }) {
  return (
    <>
      {recap.map(({ phrase, y, size }, i) => {
        const brand = palette[i + 1];
        const [tx, ty] = tilePosition(i, 0);
        const bump = 1 + 0.06 * pulse(f, 6 + i * 18, 18);
        const x = mix(488, tx, morph);
        const cardY = mix(y, ty, morph);
        const scale = mix(bump, 1, morph);
        const w = mix(812, 148, morph);
        const h = mix(138, 94, morph);
        const swap = ease(morph, 0.45, 0.93);
        return (
          <g key={phrase} transform={offset(x, cardY, scale)}>
            <rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              rx={mix(34, 25, morph)}
              stroke={morph > 0.68 ? RED : INK}
              strokeWidth={mix(2.5, 3.5, morph)}
              fill={morph > 0.68 ? WHITE : brand.tint}
            />
            <g opacity={1 - ease(morph, 0.05, 0.38)}>
              <g transform={offset(-329, 0)}>
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
                <g transform={offset(0, 0, 0.47)}>
                  <Icon i={i} />
                </g>
              </g>
              <Text x={-248} size={size} anchor="start">
                {phrase}
              </Text>
            </g>
            <g opacity={swap}>
              <Text size={53} color={RED}>
                {labels[i]}
              </Text>
            </g>
          </g>
        );
      })}
    </>
  );
}
export function Shot({ beat, f, morph }: { beat: number; f: number; morph: number }) {
  switch (beat) {
    case 1:
      return <Hook f={f} />;
    case 2:
      return <KeyShot f={f} />;
    case 3:
      return <InCore f={f} />;
    case 4:
      return <InExamples f={f} />;
    case 5:
      return <OnCore f={f} />;
    case 6:
      return <OnExamples f={f} />;
    case 7:
      return <AtCore f={f} />;
    case 8:
      return <Quiz f={f} />;
    case 9:
      return <Recap f={f} />;
    case 10:
      return (
        <>
          <g opacity={ease(f, 46, 73)}>
            <Hook f={0} showTiles={false} />
          </g>
          <Recap f={75} morph={morph} />
        </>
      );
    default:
      return null;
  }
}

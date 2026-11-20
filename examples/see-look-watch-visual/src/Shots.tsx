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

const labels = ["SEE", "LOOK", "WATCH"];
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

const tileWidths = [174, 201, 225];
const ground = 817;

function Eye({ color, gaze = 0 }: { color: string; gaze?: number }) {
  return (
    <g {...line} stroke={color}>
      <path d="M-61 0Q0-66 61 0Q0 66-61 0Z" fill={WHITE} />
      <circle cx={gaze * 19} r="18" fill={color} stroke="none" />
      <circle cx={gaze * 19 + 5} cy="-6" r="5" fill={WHITE} stroke="none" />
    </g>
  );
}

function tilePosition(i: number, f: number) {
  const angle =
    (i * 2 * Math.PI) / 3 - Math.PI / 2 + 0.29 * Math.min(f, 10) + 0.087 * Math.max(f - 10, 0);
  return [488 + 281 * Math.cos(angle), 224 + 110 * Math.sin(angle)];
}

function TileContent({ i }: { i: number }) {
  const inset = -tileWidths[i] / 2;
  return (
    <>
      <g transform={offset(inset + 35, 0, 0.35)}>
        <Eye color={RED} />
      </g>
      <Text x={inset + 65} color={RED} size={37} anchor="start">
        {labels[i]}
      </Text>
    </>
  );
}

function Tile({ i, x, y, opacity = 1 }: { i: number; x: number; y: number; opacity?: number }) {
  const w = tileWidths[i];
  return (
    <g transform={offset(x, y)} opacity={opacity}>
      <rect
        x={-w / 2}
        y="-47"
        width={w}
        height="94"
        rx="25"
        fill={WHITE}
        stroke={RED}
        strokeWidth="3.5"
      />
      <TileContent i={i} />
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
        gaze={-0.26 * Math.sin(f * 0.25)}
        pose={f < 10 ? "squint" : "freeze"}
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
          <Sweat x={578} y={475} f={f - 10} />
        </>
      )}
    </>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  dash = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dash?: boolean;
}) {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g {...line} stroke={color}>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} strokeDasharray={dash ? "13 13" : undefined} />
      <path transform={`translate(${x2} ${y2}) rotate(${angle})`} d="M-19-14L0 0L-19 14" />
    </g>
  );
}

function EyeBehavior({ i, f = 0 }: { i: number; f?: number }) {
  const color = glyphColors[i];
  return (
    <>
      {i === 0 && (
        <>
          <g transform={offset(24, 13, 0.9)}>
            <Eye color={color} />
          </g>
          <g {...line} stroke={color} strokeWidth="5">
            <path d="M-88-47l41 28m-48 25h43m-34 49l43-23" />
          </g>
        </>
      )}
      {i === 1 && (
        <>
          <g transform={offset(-43, 5, 0.7)}>
            <Eye color={color} gaze={0.68} />
          </g>
          <Arrow x1={11} y1={5} x2={62} y2={5} color={color} />
          <circle cx="81" cy="5" r="13" fill={WHITE} stroke={color} strokeWidth="5" />
          <circle cx="81" cy="5" r="4" fill={color} />
        </>
      )}
      {i === 2 && (
        <>
          <g transform={offset(0, 15, 0.92)}>
            <Eye color={color} gaze={0.72 * Math.sin(f * 0.22)} />
          </g>
          <path
            {...line}
            stroke={color}
            strokeWidth="5"
            d="M-70-25Q0-89 70-25M-71-46V-24H-49M71-46V-24H49"
          />
        </>
      )}
    </>
  );
}

function KeyShot({ f }: { f: number }) {
  return (
    <>
      {labels.map((label, i) => {
        const [fromX, fromY] = tilePosition(i, 74);
        const at = [12, 22, 34][i];
        const p = ease(f, 0, at),
          show = ease(f, at - 4, at + 6);
        const x = mix(fromX, [198, 488, 778][i], p),
          y = mix(fromY, 440, p);
        return (
          <g key={label}>
            <Tile i={i} x={x} y={y} opacity={1 - show} />
            <g opacity={show} transform={offset(x, y, 0.86 + 0.24 * bounce(f, at - 3))}>
              <circle r="103" fill={palette[i + 1].tint} />
              <EyeBehavior i={i} f={f} />
            </g>
            <g opacity={show} transform={offset(x, 602)}>
              <rect
                x="-86"
                y="-33"
                width="172"
                height="66"
                rx="33"
                fill={WHITE}
                stroke={glyphColors[i]}
                strokeWidth="3"
              />
              <Text size={36} color={glyphColors[i]}>
                {label}
              </Text>
            </g>
          </g>
        );
      })}
    </>
  );
}

function PaperPlane() {
  return (
    <g {...line} stroke={BLUE} strokeWidth="5">
      <path d="M-82-16L78-42 43 35 5 12-20 38-25 3Z" fill="#BDD4FA" />
      <path d="M-82-16L78-42 5 12-25 3Z" fill={WHITE} />
      <path d="M5 12L78-42" strokeWidth="3" />
    </g>
  );
}

function SeeCore({ f }: { f: number }) {
  const walkX = mix(243, 464, ease(f, 3, 71));
  const walkY = ground - 318 * 0.91 - 4 * Math.abs(Math.sin(f * 0.28));
  const planeX = 365 + 485 * ease(f, 0, 74);
  const planeY = 252 + 48 * ease(f, 0, 74) + 11 * Math.sin(f * 0.09);
  const rays = ease(f, 16, 24) * (0.57 + 0.27 * pulse(f, 33, 27));
  return (
    <>
      <g
        opacity=".85"
        transform={`translate(${planeX} ${planeY}) rotate(${-8 + 5 * Math.sin(f * 0.08)})`}
      >
        <PaperPlane />
      </g>
      <g opacity={rays}>
        <Arrow x1={planeX} y1={planeY + 49} x2={walkX + 59} y2={walkY + 10} color={BLUE} dash />
        <path
          {...line}
          stroke={BLUE}
          strokeWidth="3"
          strokeDasharray="7 10"
          d={`M${planeX + 36} ${planeY + 47} Q${mix(planeX, walkX, 0.52) + 51} ${walkY - 100} ${walkX + 80} ${walkY - 3}`}
        />
      </g>
      <Stickman x={walkX} y={walkY} scale={0.91} f={f} pose="walk" shirt={palette[1].shirt} />
      <Spark x={walkX + 83} y={walkY - 80} color={BLUE} size={17} opacity={pulse(f, 34, 17)} />
    </>
  );
}

function Bird() {
  return (
    <g {...line} strokeWidth="6">
      <path d="M-111 57Q-35 61 100 49M73 53l35-29" stroke="#976447" />
      <path d="M71 53q22-36 48-31q-5 24-48 31Z" fill="#A5E4C9" stroke={GREEN} strokeWidth="4" />
      <path d="M35 12l52 14-51 17" fill="#BDD4FA" />
      <path d="M-10 39v17M17 39v15" stroke="#976447" />
      <path
        d="M-64-3Q-61-50-25-47Q1-47 16-22Q64-18 61 13Q53 51-10 45Q-62 38-64-3Z"
        fill="#70A9F8"
      />
      <path d="M-16 9Q10-8 38 15Q22 43-16 22Z" fill="#BDD4FA" stroke={BLUE} strokeWidth="4" />
      <path d="M-61-15L-90-8-61 3" fill="#F7CE8A" strokeWidth="4" />
      <circle cx="-42" cy="-18" r="5.5" fill={INK} stroke="none" />
    </g>
  );
}

function SeeExample({ f }: { f: number }) {
  const notice = ease(f, 8, 17);
  return (
    <>
      <Stickman
        x={280}
        y={528 + 3 * Math.sin(f * 0.2)}
        scale={0.9}
        f={f}
        pose="idle"
        gaze={0.7 * notice}
        shirt={palette[1].shirt}
      />
      <g transform={offset(692, 434 + 4 * Math.sin(f * 0.15), 1.38)}>
        <Bird />
      </g>
      <Spark x={308} y={362} color={BLUE} size={27} opacity={pulse(f, 28, 24)} />
      <Spark x={352} y={339} color={BLUE} size={13} opacity={0.7 * pulse(f, 31, 19)} />
    </>
  );
}
function Star({ color = AMBER, r = 55 }: { color?: string; r?: number }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const theta = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.44;
    return `${radius * Math.cos(theta)},${radius * Math.sin(theta)}`;
  }).join(" ");
  return (
    <polygon points={points} fill="#FFD670" stroke={color} strokeWidth="6" strokeLinejoin="round" />
  );
}

function LookCore({ f }: { f: number }) {
  const lean = ease(f, 6, 18),
    focus = ease(f, 14, 25),
    lock = bounce(f, 28);
  const x = 220 + 38 * lean,
    y = ground - 318 * 0.91;
  return (
    <>
      <rect
        x="634"
        y="369"
        width="216"
        height="232"
        rx="32"
        fill={WHITE}
        stroke={INK}
        strokeWidth="6"
      />
      <rect
        x="650"
        y="385"
        width="184"
        height="200"
        rx="23"
        fill="#FEF5E6"
        stroke="#F7CE8A"
        strokeWidth="3"
      />
      <g transform={offset(742, 485, 1.05 + 0.095 * pulse(f, 28, 18))}>
        <Star />
      </g>
      <g opacity={focus}>
        <Arrow
          x1={x + 71}
          y1={y + 7}
          x2={mix(x + 91, 616, focus)}
          y2={mix(y + 7, 494, focus)}
          color={AMBER}
          dash
        />
      </g>
      <g transform={`translate(742 485) scale(${1.18 - 0.18 * lock})`} opacity={ease(f, 28, 33)}>
        <path
          {...line}
          stroke={AMBER}
          strokeWidth="8"
          d="M-121-88v-42h42m158 0h42v42m0 176v42h-42m-158 0h-42v-42"
        />
      </g>
      <g transform={`rotate(${10 * lean} ${x} ${ground})`}>
        <Stickman
          x={x}
          y={y}
          scale={0.91}
          f={f}
          gaze={0.67 * lean}
          pose={f < 12 ? "idle" : "point"}
          shirt={palette[2].shirt}
        />
      </g>
      <Spark x={802} y={324} color={AMBER} opacity={pulse(f, 28, 22)} size={18} />
    </>
  );
}

function LookExample({ f }: { f: number }) {
  const hold = bounce(f, 6),
    lean = ease(f, 14, 28),
    lock = ease(f, 25, 35);
  const phoneY = mix(562, 477, hold);
  const y = ground - 318 * 0.84;
  return (
    <>
      <Stickman
        x={237}
        y={y}
        scale={0.84}
        f={f}
        gaze={0.54}
        shirt="#F7CE8A"
        hand={[223, (phoneY + 41 - y) / 0.84]}
      />
      <g transform={offset(482, phoneY)} opacity={0.33 + 0.67 * ease(f, 6, 13)}>
        <rect x="-60" y="-100" width="120" height="200" rx="22" fill={INK} />
        <rect x="-50" y="-83" width="100" height="163" rx="14" fill="#FEF5E6" />
        <ellipse rx="44" ry="47" fill="#F7CE8A" opacity={0.45 + 0.42 * pulse(f, 28, 24)} />
        <Star r={34} />
        <path d="M-10 90H10" stroke={WHITE} strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform={`rotate(${-10 * lean} 735 ${ground})`}>
        <Stickman x={735} y={y} scale={0.84} face={-1} f={f} gaze={0.62 * lean} shirt="#F7CE8A" />
      </g>
      <g opacity={lock}>
        <Arrow
          x1={mix(658, 626, lean)}
          y1={y + 7}
          x2={mix(617, 554, lock)}
          y2={phoneY + 8}
          color={AMBER}
          dash
        />
      </g>
      <Spark x={555} y={phoneY - 91} color={AMBER} opacity={pulse(f, 28, 23)} size={16} />
    </>
  );
}

function ScreenIcon() {
  return (
    <g {...line} stroke={GREEN}>
      <rect x="-70" y="-44" width="140" height="88" rx="14" fill="#E7F7F0" />
      <path d="M-13-20V20L23 0Z" fill={GREEN} strokeWidth="4" />
      <path d="M-22 58H22M0 45v13" strokeWidth="5" />
    </g>
  );
}

function WatchCore({ f }: { f: number }) {
  const hops = f <= 16 ? ease(f, 0, 16) : f <= 36 ? ease(f, 16, 36) : ease(f, 36, 62);
  const ballX = f <= 16 ? mix(684, 468, hops) : f <= 36 ? mix(468, 771, hops) : mix(771, 510, hops);
  const ballY = f <= 16 ? mix(369, 562, hops) : 562 - (f <= 36 ? 132 : 96) * 4 * hops * (1 - hops);
  const gaze = (ballX - 610) / 183;
  const y = ground - 313 * 0.82;
  return (
    <>
      <path
        {...line}
        fill="#A5E4C9"
        stroke={GREEN}
        d="M117 757V686Q117 672 135 672H166Q184 672 184 689V750H305Q321 750 321 768V792H117Z"
      />
      <path {...line} stroke={GREEN} d="M145 792v22m148-22v22" />
      <Stickman x={208} y={y} scale={0.82} f={f} pose="sit" gaze={gaze} shirt={palette[3].shirt} />
      <rect x="386" y="231" width="475" height="392" rx="36" fill={INK} />
      <rect x="398" y="244" width="451" height="354" rx="27" fill="#E7F7F0" />
      <circle cx="426" cy="272" r="16" fill={GREEN} />
      <path d="M423 264v16l10-8Z" fill={WHITE} />
      <path
        d="M424 568H823"
        stroke={GREEN}
        strokeWidth="4"
        opacity=".28"
        strokeDasharray="12 13"
        strokeLinecap="round"
      />
      <path
        d="M500 474Q600 347 725 455"
        stroke={GREEN}
        strokeWidth="4"
        fill="none"
        opacity=".25"
        strokeDasharray="8 12"
        strokeLinecap="round"
      />
      <ellipse
        cx={ballX}
        cy="570"
        rx={33 - (11 * (562 - ballY)) / 190}
        ry="8"
        fill={GREEN}
        opacity=".22"
      />
      <circle cx={ballX} cy={ballY - 21} r="27" fill={GREEN} stroke="#087D59" strokeWidth="5" />
      <circle cx={ballX - 8} cy={ballY - 30} r="8" fill="#A5E4C9" />
      <Spark x={476} y={538} color={GREEN} opacity={pulse(f, 16, 15)} size={16} />
      <Spark x={769} y={538} color={GREEN} opacity={pulse(f, 36, 17)} size={16} />
      <path d="M610 610H640" stroke="#A5E4C9" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

function RecapIcon({ i }: { i: number }) {
  if (i === 0) return <Eye color={BLUE} />;
  if (i === 1) return <EyeBehavior i={1} />;
  return <ScreenIcon />;
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
        const phrases = correct ? ["Watch TV", "Look at this"] : ["Look TV", "Watch at this"];
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
  { phrase: "1. SEE — Tự thấy (vô tình)", y: 258, size: 37 },
  { phrase: "2. LOOK — Hướng mắt (1 điểm)", y: 450, size: 35 },
  { phrase: "3. WATCH — Theo dõi (chuyển động)", y: 642, size: 32 },
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
        const w = mix(812, tileWidths[i], morph);
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
                  <RecapIcon i={i} />
                </g>
              </g>
              <Text x={-248} size={size} anchor="start">
                {phrase}
              </Text>
            </g>
            <g opacity={swap}>
              <TileContent i={i} />
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
      return <SeeCore f={f} />;
    case 4:
      return <SeeExample f={f} />;
    case 5:
      return <LookCore f={f} />;
    case 6:
      return <LookExample f={f} />;
    case 7:
      return <WatchCore f={f} />;
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

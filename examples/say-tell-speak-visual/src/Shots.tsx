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

const labels = ["SAY", "TELL", "SPEAK"];
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
        <QuoteIcon color={RED} />
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
        pose={f < 10 ? "worry" : "freeze"}
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
              <SpeechFocus i={i} />
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

function QuoteIcon({ color }: { color: string }) {
  return (
    <g {...line} stroke={color}>
      <path
        d="M-42-37H43Q59-37 59-20V15Q59 31 43 31H-7L-30 49-25 31H-42Q-59 31-59 15V-20Q-59-37-42-37Z"
        fill={WHITE}
      />
      <path
        d="M-15-11q-9 2-9 12h12v12h-19V2q0-13 12-20m36 7q-9 2-9 12h12v12H1V2q0-13 12-20"
        fill={color}
        stroke="none"
      />
    </g>
  );
}

function PersonIcon({ x, color }: { x: number; color: string }) {
  return (
    <g transform={offset(x, 0)} {...line} stroke={color} strokeWidth="6">
      <circle cy="-25" r="16" fill={WHITE} />
      <path d="M-25 37V22Q-25-1 0-1T25 22V37Z" fill="#F7CE8A" />
    </g>
  );
}

function Globe({ waves = true, phase = 0 }: { waves?: boolean; phase?: number }) {
  return (
    <g {...line} stroke={GREEN}>
      <circle r="61" fill="#E7F7F0" />
      <ellipse rx="31" ry="61" opacity=".53" strokeWidth="4" />
      <path d="M-58-18H58M-61 0H61" opacity=".47" strokeWidth="4" />
      <path
        d="M-45-33l13-10 12 7-3 11 15 8-10 10-14-6-11 2-8-9Zm45 25 15-11 16 9-5 10 13 13-10 16-11 3-8-12-13-9Zm24-32 16 7 10 13-14 3-14-10Z"
        fill="#28AE88"
        stroke="none"
      />
      <path d="M-58 19H58" opacity=".37" strokeWidth="4" />
      {waves && (
        <>
          <path d="M76-17Q87 0 76 17" strokeWidth="6" opacity={0.73 + 0.22 * Math.sin(phase)} />
          <path
            d="M88-28Q107 0 88 28"
            strokeWidth="6"
            opacity={0.67 + 0.31 * Math.sin(phase - 0.8)}
          />
        </>
      )}
    </g>
  );
}

function SpeechFocus({ i }: { i: number }) {
  if (i === 0)
    return (
      <g transform="scale(1.21)">
        <QuoteIcon color={BLUE} />
      </g>
    );
  if (i === 1)
    return (
      <>
        <PersonIcon x={-64} color={AMBER} />
        <Arrow x1={-30} y1={7} x2={29} y2={7} color={AMBER} />
        <PersonIcon x={64} color={AMBER} />
      </>
    );
  return (
    <g transform={offset(-15, 0, 0.88)}>
      <Globe />
    </g>
  );
}

function QuoteBubble({ hello = false }: { hello?: boolean }) {
  return (
    <>
      <rect x="-210" y="-115" width="420" height="230" rx="65" fill="#BDD4FA" opacity=".48" />
      <path
        {...line}
        stroke={BLUE}
        strokeWidth="9"
        d="M-163-101H164Q193-101 193-72V67Q193 96 164 96H-83L-152 142-141 96H-163Q-193 96-193 67V-72Q-193-101-163-101Z"
        fill={WHITE}
      />
      {hello ? (
        <Text color={BLUE} size={85}>
          Hello!
        </Text>
      ) : (
        <Text color={BLUE} size={146}>
          &quot;...&quot;
        </Text>
      )}
    </>
  );
}

function SayCore({ f }: { f: number }) {
  const show = bounce(f, 18);
  const glow = pulse(f, 34, 26);
  return (
    <>
      <Stickman
        x={252}
        y={ground - 318 * 0.91}
        scale={0.91}
        f={f}
        gaze={0.48}
        pose={f >= 18 ? "talk" : "idle"}
        shirt={palette[1].shirt}
      />
      <circle cx="664" cy="424" r={173 + 45 * glow} fill="#BDD4FA" opacity={0.24 * show} />
      <g
        transform={offset(664, 424 - 23 * (1 - show), 0.71 + 0.29 * show)}
        opacity={ease(f, 18, 22)}
      >
        <QuoteBubble />
      </g>
      <Spark x={826} y={256} color={BLUE} size={26} opacity={glow} />
      <Spark x={877} y={304} color={BLUE} size={13} opacity={0.8 * pulse(f, 37, 24)} />
    </>
  );
}

function SayExample({ f }: { f: number }) {
  const show = bounce(f, 8);
  return (
    <>
      <Stickman
        x={256}
        y={ground - 318 * 0.89}
        scale={0.89}
        f={f}
        gaze={0.47}
        pose={f < 8 ? "idle" : "wave"}
        shirt={palette[1].shirt}
      />
      <g
        transform={offset(664, 416 - 24 * (1 - show), 0.72 + 0.28 * show)}
        opacity={ease(f, 8, 12)}
      >
        <QuoteBubble hello />
      </g>
      <Spark x={853} y={280} color={BLUE} size={21} opacity={pulse(f, 28, 28)} />
    </>
  );
}

function Envelope() {
  return (
    <g {...line} stroke={AMBER} strokeWidth="6">
      <rect x="-66" y="-43" width="132" height="86" rx="17" fill="#FFF9E8" />
      <path d="M-60-33l60 46 60-46m-116 65 37-29m74 29L20 4" />
    </g>
  );
}

function TellCore({ f }: { f: number }) {
  const send = ease(f, 14, 28);
  const ring = ease(f, 26, 35);
  const impact = pulse(f, 28, 23);
  const y = ground - 318 * 0.87;
  const cardX = mix(414, 576, send);
  return (
    <>
      <ellipse
        cx="746"
        cy="636"
        rx={117 + 15 * impact}
        ry={193 + 16 * impact}
        fill="#FFD670"
        fillOpacity=".20"
        stroke={AMBER}
        strokeWidth="6"
        opacity={ring}
      />
      <Arrow x1={336} y1={593} x2={667} y2={593} color={AMBER} />
      <Stickman
        x={224}
        y={y}
        scale={0.87}
        f={f}
        gaze={0.5}
        pose={f >= 13 ? "talk" : "idle"}
        shirt={palette[2].shirt}
      />
      <Stickman x={746} y={y} scale={0.87} f={f} gaze={0.55} face={-1} shirt={palette[2].shirt} />
      <g transform={offset(cardX, 593, 1 + 0.08 * impact)}>
        <ellipse rx="96" ry="65" fill="#FFD670" opacity={0.35 + 0.29 * impact} />
        <Envelope />
      </g>
      <g transform={offset(746, 329 - 16 * (1 - ring))} opacity={ring}>
        <rect
          x="-90"
          y="-37"
          width="180"
          height="74"
          rx="37"
          fill={WHITE}
          stroke={AMBER}
          strokeWidth="4"
        />
        <Text color={AMBER} size={39}>
          AI ĐÓ
        </Text>
      </g>
      <Spark x={860} y={451} color={AMBER} opacity={impact} size={20} />
    </>
  );
}

function TellExample({ f }: { f: number }) {
  const speak = ease(f, 4, 16);
  const send = ease(f, 6, 28);
  const pickup = pulse(f, 28, 24);
  const y = ground - 318 * 0.87;
  return (
    <>
      <path
        {...line}
        stroke={AMBER}
        strokeWidth="4"
        d="M378 501H596"
        strokeDasharray="12 14"
        opacity={0.27 + 0.4 * pickup}
      />
      <g transform={`rotate(${8 * speak} 218 ${ground})`}>
        <Stickman
          x={218}
          y={y}
          scale={0.87}
          f={f}
          pose={f >= 6 ? "talk" : "idle"}
          gaze={0.41}
          shirt={palette[2].shirt}
        />
      </g>
      <Stickman
        x={756}
        y={y}
        scale={0.87}
        f={Math.max(0, f - 27)}
        pose={f >= 28 ? "nod" : "idle"}
        face={-1}
        gaze={0.48}
        shirt={palette[2].shirt}
      />
      <g
        opacity={ease(f, 6, 12)}
        transform={offset(
          mix(420, 539, send),
          420 - 24 * Math.sin(send * Math.PI),
          0.85 + 0.15 * bounce(f, 6),
        )}
      >
        <rect
          x="-111"
          y="-40"
          width="222"
          height="80"
          rx="40"
          fill="#FFF9E8"
          stroke={AMBER}
          strokeWidth="5"
        />
        <Text color={AMBER} size={38}>
          the truth
        </Text>
      </g>
      <Spark x={643} y={361} color={AMBER} opacity={pickup} size={19} />
    </>
  );
}

function LanguagePill({
  text,
  x,
  y,
  f,
  at,
}: {
  text: string;
  x: number;
  y: number;
  f: number;
  at: number;
}) {
  const pop = bounce(f, at);
  return (
    <g opacity={ease(f, at, at + 5)} transform={offset(x, y + 49 * (1 - pop), 0.79 + 0.21 * pop)}>
      <rect
        x="-63"
        y="-39"
        width="126"
        height="78"
        rx="39"
        fill={WHITE}
        stroke={GREEN}
        strokeWidth="4"
      />
      <Text color={GREEN} size={42}>
        {text}
      </Text>
    </g>
  );
}

function SpeakCore({ f }: { f: number }) {
  const spin = f * 0.16;
  const glow = pulse(f, 40, 23);
  return (
    <>
      <Stickman
        x={244}
        y={ground - 318 * 0.93}
        scale={0.93}
        f={f}
        gaze={0.53}
        pose={f >= 16 ? "talk" : "idle"}
        shirt={palette[3].shirt}
      />
      <circle cx="621" cy="496" r={153 + 31 * glow} fill="#A5E4C9" opacity={0.3 + 0.1 * glow} />
      <g transform={offset(621, 496, 1.98 + 0.06 * pulse(f, 16, 18))}>
        <Globe phase={spin} />
      </g>
      <LanguagePill text="EN" x={548} y={268} f={f} at={16} />
      <LanguagePill text="VI" x={701} y={238} f={f} at={28} />
      <Spark x={831} y={347} color={GREEN} opacity={glow} size={25} />
      <Spark x={736} y={679} color={GREEN} opacity={0.83 * pulse(f, 42, 27)} size={19} />
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
        const phrases = correct ? ["Tell me", "Speak English"] : ["Say me", "Tell English"];
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
  { phrase: '1. SAY — Lời nói ("Hello")', y: 258, size: 37 },
  { phrase: "2. TELL — Người nghe (Tell me)", y: 450, size: 35 },
  { phrase: "3. SPEAK — Ngôn ngữ (English)", y: 642, size: 32 },
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
                  <SpeechFocus i={i} />
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
      return <SayCore f={f} />;
    case 4:
      return <SayExample f={f} />;
    case 5:
      return <TellCore f={f} />;
    case 6:
      return <TellExample f={f} />;
    case 7:
      return <SpeakCore f={f} />;
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

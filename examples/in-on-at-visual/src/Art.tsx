import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { fontFamily } from "@remotion/google-fonts/BeVietnamPro";
import { Shot } from "./Shots";
import { AMBER, BLUE, INK, WHITE, Spark, bounce, chapter, ease, palette, pulse } from "./visual";

const counts = [0, 1, 2, 2, 3, 3, 4, 4, 4, 4];

function Stage({ beat, f }: { beat: number; f: number }) {
  const brand = palette[chapter[beat - 1]];
  const whip = beat === 3 || beat === 7 ? 1 - ease(f, 0, 10) : 0;
  const zoom = [
    0.115 * (ease(f, 6, 13) - ease(f, 33, 62)),
    0.1 * (1 - ease(f, 0, 11)),
    0.045 * ease(f, 16, 67),
    0,
    0.045 * (1 - ease(f, 0, 11)) + 0.025 * pulse(f, 24, 15),
    0.05 * ease(f, 6, 74),
    0.075 * pulse(f, 14, 16),
  ];
  const punch = zoom[beat - 1] ?? 0;
  const shake = beat === 1 ? 12 * Math.sin((f - 10) * 1.55) * pulse(f, 10, 17) : 0;
  const pan =
    (beat === 3 ? 306 : beat === 7 ? -306 : 0) * whip + (beat === 4 ? 25 * ease(f, 4, 73) - 12 : 0);
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
        <Shot beat={beat} f={f} morph={morph} />
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
  3: "Không gian / Thời gian rộng",
  4: "Năm, tháng, thành phố",
  5: "Chạm bề mặt / Ngày cụ thể",
  6: "Thứ, ngày, trên mặt bàn",
  7: "at 7:00 • at the door",
  8: "Hết nhầm ngay lập tức",
};
const titleStyle = {
  fontWeight: 900,
  letterSpacing: -3,
  lineHeight: 1.12,
  textAlign: "center",
} as const;
function Headline({ beat, f }: { beat: number; f: number }) {
  const brand = palette[chapter[beat - 1]];
  function accent(text: string, at: number, hollow = false) {
    const entrance = bounce(f, at);
    return (
      <span
        style={{
          color: hollow ? "transparent" : brand.accent,
          WebkitTextStroke: hollow ? `4px ${brand.accent}` : undefined,
          display: "inline-block",
          transform: `translateY(${8 * (1 - entrance)}px) scale(${1 + 0.09 * pulse(f, at, 16)})`,
        }}
      >
        {text}
      </span>
    );
  }
  const headlines: ReactNode[] = [
    <>
      {accent("IN – ON – AT", 8)}
      <br />
      LẪN LỘN?
    </>,
    <>
      NHỚ ĐÚNG
      <br />
      {accent("3 HÌNH NÀY", 18)}
    </>,
    <>{accent("IN", 16, true)} = BÊN TRONG HỘP</>,
    <>in 2026 • in Saigon</>,
    <>{accent("ON", 24)} = TRÊN MẶT PHẲNG</>,
    <>on Monday • on the table</>,
    <>{accent("AT", 14)} = 1 CHẤM CHÍNH XÁC</>,
    null,
    <>
      HỘP <span style={{ color: BLUE }}>→</span> MẶT <span style={{ color: AMBER }}>→</span> CHẤM
    </>,
    <>
      Lưu lại khỏi học vẹt
      <Bookmark f={f} />
    </>,
  ];
  const fontSize = [97, 93, 70, 80, 66, 64, 65, 62, 82, 72][beat - 1];
  const title = headlines[beat - 1];
  const label = translations[beat];
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
        opacity: beat === 10 ? 1 - ease(f, 54, 64) : 1,
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
            fontSize: beat === 8 ? 62 : 35,
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

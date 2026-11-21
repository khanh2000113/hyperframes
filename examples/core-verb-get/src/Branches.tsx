import {
  Drop,
  Floor,
  GRAY,
  INK,
  ORANGE,
  PAPER,
  Person,
  Rays,
  TINT,
  bounce,
  ease,
  mix,
  outline,
} from "./Art";

export const nodes = [
  {
    id: "receive",
    x: 785,
    y: -670,
    path: "M175 -49 C300 -88 290 -393 560 -548 Q663 -615 785 -670",
    before: "",
    after: " A COFFEE",
    meaning: "Lấy / Mua cà phê",
  },
  {
    id: "become",
    x: 785,
    y: 690,
    path: "M175 54 C298 101 333 389 543 541 Q665 625 785 690",
    before: "",
    after: " WET",
    meaning: "Chuyển sang bị ướt",
  },
  {
    id: "arrive",
    x: -785,
    y: 690,
    path: "M-175 54 C-298 101 -333 389 -543 541 Q-665 625 -785 690",
    before: "",
    after: " HOME",
    meaning: "Chuyển sang tới nhà",
  },
  {
    id: "understand",
    x: -785,
    y: -670,
    path: "M-175 -49 C-300 -88 -290 -393 -560 -548 Q-663 -615 -785 -670",
    before: "I ",
    after: " IT!",
    meaning: "Chuyển sang hiểu rồi!",
  },
] as const;

function Cup({ x, y, frame }: { x: number; y: number; frame: number }) {
  return (
    <g transform={`translate(${x} ${y})`} {...outline} strokeWidth="6">
      <path d="M39-16 H53 Q77-16 72 2 Q68 19 46 17" fill="none" />
      <path d="M-46-27 H46 L35 30 Q32 46 15 46 H-15 Q-32 46-35 30Z" fill={PAPER} />
      <path d="M-41-10 H41 L37 17 H-37Z" fill={TINT} stroke="none" />
      <ellipse cy="-27" rx="46" ry="10" fill={TINT} />
      <path
        d="M0-77 q-15 13 0 25 M26-72 q-11 11 0 19"
        stroke={ORANGE}
        strokeWidth="4"
        fill="none"
        transform={`translate(${3 * Math.sin(frame / 6)} ${3 * Math.cos(frame / 7)})`}
      />
    </g>
  );
}

function Receive({ frame }: { frame: number }) {
  const pickup = ease(frame, 28, 46);
  const x = mix(157, -63, pickup);
  const y = mix(57, -42, pickup) - Math.sin(Math.PI * pickup) * 46;
  return (
    <>
      <Floor />
      <path
        d="M100 133 h142 m-20 0 v68 m-102-68 v68"
        fill="none"
        stroke={GRAY}
        strokeLinecap="round"
        strokeWidth="5"
        opacity={1 - 0.68 * pickup}
      />
      {pickup > 0 && pickup < 1 && (
        <path
          d="M165 6 Q117-122-22-71"
          fill="none"
          stroke={ORANGE}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="8 12"
          opacity={Math.sin(Math.PI * pickup)}
        />
      )}
      <Cup x={x} y={y} frame={frame} />
      <Person x={-165} y={-153} frame={frame} pose="reach" action={pickup} scale={1.1} />
    </>
  );
}

function Wet({ frame }: { frame: number }) {
  const wet = ease(frame, 40, 53);
  const shiver = wet * Math.sin(frame * 1.55) * 6;
  return (
    <>
      <Floor width={450} />
      <path
        d="M-124-269 Q-151-270-151-290 Q-151-311-123-315 Q-115-344-81-343 Q-60-343-48-326 Q-21-333-7-314 Q15-316 23-299 Q32-269 5-269Z"
        transform="translate(63 0)"
        fill={PAPER}
        {...outline}
      />
      {[
        [-195, -244],
        [126, -255],
        [194, -238],
      ].map(([x, y], i) => {
        const fall = ease(frame, 32 + i * 3, 46 + i * 3);
        const life =
          ease(frame, 32 + i * 3, 34 + i * 3) * (1 - ease(frame, 45 + i * 3, 51 + i * 3));
        return (
          <path
            key={x}
            d="M0 0 l-23 38"
            transform={`translate(${x - 15 * fall} ${y + (i === 1 ? 1 : 228) * fall})`}
            fill="none"
            stroke={ORANGE}
            strokeWidth="8"
            strokeLinecap="round"
            opacity={life}
          />
        );
      })}
      <Person x={shiver} y={-153} pose={wet > 0.22 ? "shiver" : "idle"} scale={1.1} frame={frame} />
      {[-160, 154, 204].map((x, i) => {
        const fall = ((frame + i * 7) % 23) / 23;
        return (
          <Drop
            key={x}
            x={x + Math.sign(x) * fall * 10}
            y={-93 + 142 * fall + i * 14}
            scale={0.66 - fall * 0.12}
            opacity={wet * (1 - fall * 0.72)}
          />
        );
      })}
      <ellipse cx="28" cy="209" rx={114 * wet} ry="10" fill={ORANGE} opacity=".14" />
    </>
  );
}

function Home({ frame, overview }: { frame: number; overview: boolean }) {
  const travel = ease(frame, 17, 54);
  const settle = ease(frame, 41, 57);
  const lit = bounce(frame, 53, 20);
  const x = mix(-228, 117, travel);
  const hop = (1 - settle) * (1 - Math.cos(frame * 0.7)) * 12;
  return (
    <>
      <Floor x={22} width={535} />
      <circle cx="-229" cy="205" r="10" fill={ORANGE} />
      <path
        d="M-207 205 H49"
        stroke={ORANGE}
        strokeWidth="5"
        strokeDasharray="7 12"
        opacity={0.6 - 0.35 * travel}
      />
      <circle cx="130" cy="6" r={173 + 5 * Math.sin(frame / 6)} fill={TINT} opacity={0.7 * lit} />
      <path d="M0-27 L130-169 L264-27 V205 H0Z" {...outline} fill={lit > 0.6 ? TINT : PAPER} />
      <path d="M-16-18 L130-182 L279-18" {...outline} fill="none" />
      <path d="M50 205 V66 Q50 44 72 44 H143 Q165 44 165 66 V205" {...outline} fill={PAPER} />
      <rect
        x="185"
        y="1"
        width="52"
        height="55"
        rx="5"
        {...outline}
        strokeWidth="5"
        fill={ORANGE}
        fillOpacity={lit > 1 ? 1 : 0.1 + 0.85 * lit}
      />
      <path d="M211 1 v55 m-26-27 h52" {...outline} strokeWidth="4" />
      {settle < 0.99 && (
        <g stroke={ORANGE} strokeWidth="5" strokeLinecap="round" opacity={(1 - settle) * 0.71}>
          <path d={`M${x - 102} 160 h-47 M${x - 111} 138 h-25`} />
        </g>
      )}
      <Person
        x={x}
        y={mix(-103, -52, settle) - hop}
        pose="run"
        action={settle}
        scale={mix(0.96, 0.8, settle)}
        frame={frame}
      />
      <Rays
        x={130}
        y={-121}
        size={72 + 9 * Math.sin(frame / 9)}
        opacity={Math.min(1, lit) * (overview ? 0.66 : 0.8)}
      />
    </>
  );
}

function Understand({ frame }: { frame: number }) {
  const idea = bounce(frame, 39, 25);
  const snap = ease(frame, 31, 34);
  const spark = ease(frame, 31, 34) * (1 - ease(frame, 36, 45));
  return (
    <>
      <Floor width={416} />
      <text
        x="7"
        y="-255"
        textAnchor="middle"
        fill={GRAY}
        fontWeight="900"
        fontSize="112"
        opacity={1 - ease(frame, 35, 43)}
      >
        ?
      </text>
      <g transform={`translate(6 -326) scale(${idea})`} opacity={Math.min(1, idea)}>
        <circle r={84 + 4 * Math.sin(frame / 7)} fill={TINT} />
        <Rays x={0} y={2} size={65} />
        <path
          d="M-26 22 Q-45 5-43-15 Q-41-48-8-52 Q34-57 42-22 Q48 2 25 24 Q19 30 18 40 H-18 Q-19 28-26 22Z"
          fill={ORANGE}
          stroke={ORANGE}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M-12-8 L0 2 L11-8 M0 2 V25"
          fill="none"
          stroke={PAPER}
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path d="M-16 51 h32 m-27 10 h22" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      </g>
      <Person x={0} y={-153} pose={snap > 0.5 ? "snap" : "puzzle"} scale={1.1} frame={frame} />
      <Rays x={154} y={-69} size={22} opacity={spark} />
    </>
  );
}

export function Illustration({
  node,
  frame,
  overview,
}: {
  node: (typeof nodes)[number]["id"];
  frame: number;
  overview: boolean;
}) {
  switch (node) {
    case "receive":
      return <Receive frame={frame} />;
    case "become":
      return <Wet frame={frame} />;
    case "arrive":
      return <Home frame={frame} overview={overview} />;
    case "understand":
      return <Understand frame={frame} />;
  }
}

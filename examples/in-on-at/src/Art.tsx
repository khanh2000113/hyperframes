import React from "react";
const C = {
  paper: "#F7F3E8",
  ink: "#142C3B",
  mint: "#52D6B0",
  yellow: "#FFD34E",
  red: "#F26655",
  line: "#D8DDD3",
};
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const bounce = (t: number, delay = 0) => {
  const x = Math.max(0, t - delay);
  return x === 0 ? 0 : 1 - Math.exp(-9 * x) * Math.cos(17 * x);
};
const Text: React.FC<{
  x?: number;
  y: number;
  size?: number;
  fill?: string;
  children: React.ReactNode;
  anchor?: "middle" | "start" | "end";
  opacity?: number;
}> = ({ x = 540, y, size = 56, fill = C.ink, children, anchor = "middle", opacity = 1 }) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fill={fill}
    fontSize={size}
    fontFamily="Display"
    fontWeight="bold"
    opacity={opacity}
  >
    {children}
  </text>
);
// The head is ONLY an unfilled circle. No face primitives or details exist.
const Stick: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: "scratch" | "jump" | "wave" | "stand";
  t: number;
  tilt?: number;
}> = ({ x, y, scale = 1, pose = "stand", t, tilt = 0 }) => (
  <g
    transform={`translate(${x} ${y}) scale(${scale})`}
    fill="none"
    stroke={C.ink}
    strokeWidth="13"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <g transform={`rotate(${tilt} 0 -266)`}>
      <circle cx="0" cy="-266" r="43" fill="none" />
    </g>
    <path d="M0 -216 L0 -100 M0 -100 L-55 0 M0 -100 L55 0" />
    {pose === "scratch" ? (
      <>
        <path d={`M0 -190 L65 -225 L${57 + Math.sin(t * 16) * 7} -275`} />
        <path d="M0 -185 L-63 -130" />
      </>
    ) : pose === "wave" ? (
      <>
        <path d={`M0 -190 L70 -235 L${90 + 22 * Math.sin(t * 10)} -325`} />
        <path d="M0 -185 L-70 -140 L-130 -160" />
      </>
    ) : pose === "jump" ? (
      <path d="M0 -190 L-80 -255 M0 -190 L80 -255" />
    ) : (
      <path d="M0 -190 L-65 -145 M0 -190 L65 -145" />
    )}
  </g>
);
const Footer: React.FC<{ word: string; detail: string; color: string; t: number }> = ({
  word,
  detail,
  color,
  t,
}) => (
  <g transform={`translate(0 ${65 * (1 - ease(t - 0.3))})`} opacity={ease(t - 0.3)}>
    <rect x="95" y="1518" width="890" height="212" rx="36" fill={color} />
    <Text y={1604} size={62}>
      {word}
    </Text>
    <Text y={1673} size={35}>
      {detail}
    </Text>
  </g>
);
const Top: React.FC<{ n: number; color: string; t: number }> = ({ n, color }) => (
  <>
    <Text x={82} y={132} size={28} anchor="start">
      ENGLISH, MADE VISIBLE.
    </Text>
    <Text x={998} y={132} size={28} anchor="end">
      {String(n).padStart(2, "0")} / 05
    </Text>
    {[0, 1, 2, 3, 4].map((i) => (
      <rect
        key={i}
        x={82 + i * 187}
        y="177"
        width="166"
        height="9"
        rx="4"
        fill={i < n ? color : C.line}
      />
    ))}
  </>
);
const Title: React.FC<{ word: string; phrase: string; color: string; t: number }> = ({
  word,
  phrase,
  color,
  t,
}) => (
  <>
    <g transform={`translate(540 535) scale(${bounce(t, 0.12)})`}>
      <text
        x="0"
        y="0"
        textAnchor="middle"
        fontFamily="Display"
        fontSize="260"
        fill={color}
        stroke={C.ink}
        strokeWidth="4"
        paintOrder="stroke"
      >
        {word}
      </text>
    </g>
    <g transform={`translate(${(1 - ease(t - 0.3)) * -120} 0)`} opacity={ease(t - 0.3)}>
      <Text y={650} size={55}>
        {word} = {phrase}
      </Text>
    </g>
  </>
);
const Box: React.FC<{ closed?: boolean; opacity?: number }> = ({ closed = false, opacity = 1 }) => (
  <g opacity={opacity} stroke={C.ink} strokeWidth="9" strokeLinejoin="round">
    <path d="M285 1110 L390 1020 L795 1020 L795 1320 L690 1430 L285 1430 Z" fill={C.mint} />
    {closed ? (
      <path d="M285 1110 L390 1020 L795 1020 L690 1110 Z" fill={C.yellow} />
    ) : (
      <>
        <path d="M285 1110 L390 1020 L795 1020 L690 1110 Z" fill={C.ink} />
        <path
          d="M285 1110 L195 1010 L300 920 L390 1020 M795 1020 L865 915 L760 1008"
          fill={C.mint}
        />
      </>
    )}
    <path d="M690 1110 V1430 M690 1110 H285" fill="none" />
  </g>
);
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const gather = ease((t - 2.5) / 0.65),
    burst = clamp((t - 3.18) / 0.4);
  return (
    <>
      <Top n={1} color={C.red} t={t} />
      <g transform={`translate(540 355) scale(${bounce(t, 0.1)})`}>
        <Text x={0} y={0} size={100}>
          In, On, At?
        </Text>
      </g>
      <Text y={480} size={64} opacity={ease(t - 0.4)}>
        So confusing! 🤯
      </Text>
      <ellipse cx="540" cy="1370" rx="170" ry="24" fill={C.ink} opacity=".1" />
      <Stick x={540} y={1350} scale={1.3} pose="scratch" t={t} tilt={-8 + Math.sin(t * 5) * 5} />
      {["IN", "ON", "AT"].map((w, i) => {
        const a = t * (i % 2 ? -1.8 : 1.6) + i * 2.1;
        let x = 540 + Math.cos(a) * (290 - 250 * gather),
          y = 760 + Math.sin(a) * 110;
        y = y * (1 - gather) + 760 * gather;
        const sc = (1 + 0.16 * Math.sin(t * 9 + i)) * (1 + burst * 1.6);
        return (
          <g
            key={w}
            opacity={1 - burst}
            transform={`translate(${x} ${y}) rotate(${(1 - gather) * Math.sin(t * 5 + i) * 18}) scale(${sc})`}
          >
            <rect
              x="-119"
              y="-90"
              width="238"
              height="137"
              rx="28"
              fill={[C.mint, C.yellow, C.red][i]}
              stroke={C.ink}
              strokeWidth="5"
            />
            <Text x={0} y={10} size={102}>
              {w}
            </Text>
          </g>
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return (
          <path
            key={i}
            d={`M${540 + Math.cos(a) * (50 + burst * 90)} ${760 + Math.sin(a) * (50 + burst * 90)} l${Math.cos(a) * 45} ${Math.sin(a) * 45}`}
            stroke={[C.red, C.yellow, C.mint][i % 3]}
            strokeWidth="16"
            strokeLinecap="round"
            opacity={Math.sin(burst * Math.PI)}
          />
        );
      })}
      <Footer
        word="LET’S MAKE IT CLICK."
        detail="Three words. Three pictures."
        color={C.yellow}
        t={t}
      />
    </>
  );
};
const InScene: React.FC<{ t: number }> = ({ t }) => {
  const p = clamp((t - 1.15) / 1.2),
    jump = Math.sin(p * Math.PI) * 500;
  const px = 185 + (470 - 185) * ease(p),
    py = 1430 - jump - 60 * p;
  return (
    <>
      <Top n={2} color={C.mint} t={t} />
      <Title word="IN" phrase="In a box" color={C.mint} t={t} />
      <g transform={`translate(540 1225) scale(${bounce(t, 0.25)}) translate(-540 -1225)`}>
        <Box />
        <rect x="300" y="1120" width="374" height="295" fill={C.paper} opacity=".92" />
        <Stick x={px} y={py} scale={0.83} pose={p > 0 && p < 1 ? "jump" : "stand"} t={t} />
        <path
          d="M285 1110 V1430 H690 V1110"
          fill="none"
          stroke={C.ink}
          strokeWidth="9"
          strokeLinejoin="round"
        />
        <g
          opacity={ease(t - 2.1)}
          transform={`translate(610 ${900 + 330 * ease((t - 1.9) / 0.7)})`}
        >
          <Text x={0} y={0} size={92} fill={C.ink}>
            IN
          </Text>
        </g>
        <path
          d="M755 1165 L755 1250 M729 1224 L755 1250 L781 1224"
          stroke={C.ink}
          strokeWidth="7"
          fill="none"
          opacity={ease(t - 2.4)}
        />
      </g>
      <Footer word="INSIDE" detail="The box surrounds you." color={C.mint} t={t} />
    </>
  );
};
const OnScene: React.FC<{ t: number }> = ({ t }) => {
  const p = clamp((t - 0.65) / 1.25),
    y = 1370 - 285 * ease(p) - 430 * Math.sin(p * Math.PI);
  const hit = t - 2.1;
  return (
    <>
      <Top n={3} color={C.yellow} t={t} />
      <Title word="ON" phrase="On the table" color={C.yellow} t={t} />
      <g transform={`translate(0 ${24 * (1 - ease(t / 0.4))})`}>
        <Box closed />
        <path
          d="M285 1110 L390 1020 L795 1020 L690 1110 Z"
          fill={C.yellow}
          stroke={C.ink}
          strokeWidth="9"
        />
        <g transform={`rotate(${-75 * (1 - ease(t / 0.5))} 390 1020)`}>
          <path
            d="M285 1110 L390 1020 L795 1020 L690 1110 Z"
            fill={C.yellow}
            stroke={C.ink}
            strokeWidth="9"
          />
        </g>
        <Stick x={470} y={y} scale={0.83} pose={p > 0 && p < 1 ? "jump" : "stand"} t={t} />
        <g
          opacity={ease(t - 0.95)}
          transform={`translate(685 ${Math.min(1, bounce(t, 0.95)) * 1044})`}
        >
          <Text x={0} y={0} size={93}>
            ON
          </Text>
        </g>
        <ellipse
          cx="470"
          cy="1085"
          rx={hit > 0 ? 90 + clamp(hit / 0.6) * 180 : 0}
          ry={hit > 0 ? 15 + clamp(hit / 0.6) * 40 : 0}
          fill="none"
          stroke={C.yellow}
          strokeWidth="12"
          opacity={1 - clamp(hit / 0.65)}
        />
        <path d="M285 1110 H690 L795 1020" fill="none" stroke={C.ink} strokeWidth="10" />
        <Text y={1370} size={30}>
          THE LID BECOMES A TABLETOP
        </Text>
      </g>
      <Footer word="TOUCHING THE SURFACE" detail="On top. In contact." color={C.yellow} t={t} />
    </>
  );
};
const Map: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect
      x="100"
      y="800"
      width="880"
      height="635"
      rx="48"
      fill="#E6EBDC"
      stroke={C.ink}
      strokeWidth="7"
    />
    <g clipPath="url(#mapclip)">
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${115 + i * 245} 760 L${-15 + i * 245} 1480`}
          stroke={C.paper}
          strokeWidth="65"
        />
      ))}
      {[900, 1110, 1330].map((y) => (
        <path key={y} d={`M70 ${y} L1010 ${y - 105}`} stroke={C.paper} strokeWidth="65" />
      ))}
      <path
        d="M820 760 Q650 1050 855 1210 T820 1500"
        stroke="#A7D9D1"
        strokeWidth="65"
        fill="none"
      />
      <path
        d="M145 1310 L380 1212 L540 1090 L680 1020"
        fill="none"
        stroke={C.ink}
        strokeWidth="8"
        strokeDasharray="14 16"
      />
    </g>
    <circle cx="540" cy="1090" r={65 + 25 * Math.sin(t * 5)} fill={C.red} opacity=".15" />
    <g transform={`translate(540 1075) scale(${1 + 0.065 * Math.sin(t * 7)})`}>
      <path
        d="M0 0 C-18 -33 -90 -100 -90 -163 A90 90 0 1 1 90 -163 C90 -100 18 -33 0 0Z"
        fill={C.red}
        stroke={C.ink}
        strokeWidth="9"
      />
      <circle cy="-163" r="30" fill={C.paper} stroke={C.ink} strokeWidth="7" />
    </g>
    <rect x="380" y="1150" width="320" height="74" rx="20" fill={C.ink} />
    <Text y={1200} size={34} fill={C.paper}>
      BUS STOP
    </Text>
    <g transform="translate(752 1190)" fill="none" stroke={C.ink} strokeWidth="8">
      <path d="M0 185 V0 H105 V185 M-15 185 H120" />
      <rect x="17" y="23" width="73" height="68" rx="10" fill={C.yellow} />
      <path d="M31 47 H75 M31 69 H75" />
    </g>
  </g>
);
const AtScene: React.FC<{ t: number }> = ({ t }) => {
  const zoom = ease(t / 0.95);
  return (
    <>
      <Top n={4} color={C.red} t={t} />
      <Title word="AT" phrase="At the bus stop" color={C.red} t={t} />
      <g
        opacity={zoom}
        transform={`translate(540 1110) scale(${1 + 0.8 * (1 - zoom)}) translate(-540 -1110)`}
      >
        <Map t={t} />
      </g>
      <g
        opacity={1 - zoom}
        transform={`translate(540 1090) scale(${1 - zoom * 0.95}) translate(-540 -1090)`}
      >
        <Box closed />
        <Stick x={470} y={1085} scale={0.83} t={t} />
      </g>
      <g opacity={ease(t - 1.1)}>
        <Text y={737} size={32}>
          ZOOM OUT → ONE LOCATION
        </Text>
      </g>
      <Footer word="A SPECIFIC POINT" detail="At tells us where." color={C.red} t={t} />
    </>
  );
};
const Outro: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Top n={5} color={C.yellow} t={t} />
    <g transform={`translate(540 390) scale(${bounce(t, 0.1)})`}>
      <Text x={0} y={0} size={78}>
        Save this video
      </Text>
      <Text x={0} y={110} size={92}>
        for later!
      </Text>
    </g>
    <g transform={`translate(345 1010) scale(${1 + 0.09 * Math.sin(t * 8)})`}>
      <circle r="160" fill={C.yellow} opacity={0.5 + 0.4 * Math.sin(t * 8)} />
      <path
        d="M-65 -100 H65 V105 L0 57 L-65 105 Z"
        fill={C.yellow}
        stroke={C.ink}
        strokeWidth="12"
        strokeLinejoin="round"
      />
    </g>
    <Stick x={740} y={1360} scale={1.05} pose="wave" t={t} />
    <path
      d="M610 1000 Q540 925 475 1005 M483 963 L475 1005 L520 1000"
      fill="none"
      stroke={C.ink}
      strokeWidth="9"
      strokeLinecap="round"
      opacity={ease(t - 0.6)}
    />
    {["IN", "ON", "AT"].map((w, i) => (
      <g
        key={w}
        transform={`translate(${240 + i * 300} ${1540 + (1 - bounce(t, 0.6 + i * 0.12)) * 120})`}
      >
        <rect
          x="-120"
          y="-60"
          width="240"
          height="150"
          rx="24"
          fill={[C.mint, C.yellow, C.red][i]}
        />
        <Text x={0} y={23} size={76}>
          {w}
        </Text>
        <Text x={0} y={145} size={27}>
          {["INSIDE", "SURFACE", "POINT"][i]}
        </Text>
      </g>
    ))}
  </>
);
export const Art: React.FC<{ frame: number }> = ({ frame }) => {
  const time = frame / 30;
  const n = time < 4 ? 0 : time < 10 ? 1 : time < 16 ? 2 : time < 22 ? 3 : 4;
  const local = time - [0, 4, 10, 16, 22][n];
  const scenes = [Hook, InScene, OnScene, AtScene, Outro];
  const Scene = scenes[n];
  let wipe = 0;
  for (const b of [4, 10, 16, 22]) {
    const d = Math.abs(time - b);
    if (d < 0.18) wipe = Math.max(wipe, 1 - d / 0.18);
  }
  return (
    <svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="mapclip">
          <rect x="104" y="804" width="872" height="627" rx="43" />
        </clipPath>
      </defs>
      <rect width="1080" height="1920" fill={C.paper} />
      <Scene t={local} />
      <Text x={82} y={1825} anchor="start" size={25}>
        IN / ON / AT
      </Text>
      <Text x={998} y={1825} anchor="end" size={25}>
        LEARN IN 26 SECONDS
      </Text>
      <rect x="82" y="1860" width="916" height="7" rx="3" fill={C.line} />
      <rect x="82" y="1860" width={916 * clamp(time / 26)} height="7" rx="3" fill={C.ink} />
      {wipe > 0 && (
        <circle
          cx="540"
          cy="960"
          r={1150 * ease(wipe)}
          fill={[C.mint, C.yellow, C.red, C.yellow][Math.max(0, n - (local < 0.18 ? 1 : 0))]}
        />
      )}
    </svg>
  );
};

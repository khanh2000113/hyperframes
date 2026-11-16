import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  spring,
} from "remotion";
export type VideoProps = { text: string; bgVideo?: string };
const points = [
  [0, 310],
  [110, 280],
  [190, 305],
  [280, 210],
  [365, 245],
  [455, 160],
  [540, 185],
  [625, 95],
  [730, 115],
  [850, 20],
];
const FinanceFrame = ({ bgVideo }: VideoProps) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [24, 410], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const color = frame < 150 ? "#ff556c" : frame < 300 ? "#39edaf" : "#e8c575";
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: "#060d19" }}>
      {bgVideo ? (
        <OffthreadVideo
          muted
          src={staticFile(bgVideo)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : null}
      <div style={{ position: "absolute", left: 110, top: 1210, width: 850, height: 390 }}>
        <svg width="850" height="390" viewBox="0 0 850 390" style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="reveal">
              <rect width={850 * progress} height="390" />
            </clipPath>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor={color} stopOpacity=".22" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[80, 160, 240, 320].map((y) => (
            <line key={y} x1="0" x2="850" y1={y} y2={y} stroke="#a3b5c81a" />
          ))}
          <g clipPath="url(#reveal)">
            <path d={d + " L850 370 L0 370 Z"} fill="url(#fill)" />
            <path d={d} fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" />
            {points.map(([x, y], i) => {
              const beat = 24 + (i * 386) / 9;
              const s = spring({
                frame: frame - beat,
                fps: 30,
                config: { damping: 9, stiffness: 150 },
              });
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={7 * s} fill={color} />
                  <circle cx={x} cy={y} r={19 * s} fill="none" stroke={color} opacity={0.3} />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      {[
        { at: 35, x: 760, y: 1080, icon: "🤔" },
        { at: 165, x: 130, y: 1100, icon: "↗" },
        { at: 235, x: 760, y: 1040, icon: "$" },
        { at: 325, x: 120, y: 1110, icon: "🔥" },
        { at: 390, x: 760, y: 1080, icon: "↗" },
      ].map((item, i) => {
        const s = spring({
          frame: frame - item.at,
          fps: 30,
          config: { damping: 7, stiffness: 120, mass: 0.7 },
        });
        const opacity = interpolate(
          frame,
          [item.at, item.at + 5, item.at + 65, item.at + 80],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              width: 100,
              height: 100,
              borderRadius: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 62,
              fontWeight: 900,
              fontFamily: "DejaVu Sans",
              color: item.icon === "$" ? "#060d19" : color,
              background: item.icon === "$" ? "#e8c575" : "#102433",
              border: `2px solid ${color}`,
              opacity,
              transform: `translateY(${(1 - s) * 70}px) scale(${s}) rotate(${(1 - s) * -18}deg)`,
            }}
          >
            {item.icon}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
export const Root = () => (
  <Composition
    id="FinanceFrame"
    component={FinanceFrame}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={450}
    defaultProps={{ text: "", bgVideo: undefined }}
  />
);

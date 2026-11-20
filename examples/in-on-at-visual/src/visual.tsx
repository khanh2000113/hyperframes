import { Easing, interpolate, spring } from "remotion";

export const INK = "#1D1D1F";
export const WHITE = "#FFFFFF";
export const RED = "#E63946";
export const BLUE = "#2563EB";
export const AMBER = "#D97706";
export const GREEN = "#059669";
export const palette = [
  { accent: RED, tint: "#FDECEC", shirt: "#F5B7A5" },
  { accent: BLUE, tint: "#EBF2FE", shirt: "#BDD4FA" },
  { accent: AMBER, tint: "#FEF5E6", shirt: "#F7CE8A" },
  { accent: GREEN, tint: "#E7F7F0", shirt: "#A5E4C9" },
  { accent: INK, tint: "#F7F3EA", shirt: "#D9D4CA" },
];
export const chapter = [0, 0, 1, 1, 2, 2, 3, 3, 4, 0];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const pulse = (f: number, at: number, length = 16) =>
  Math.sin(Math.PI * interpolate(f, [at, at + length], [0, 1], clamp));
export const bounce = (f: number, at: number) =>
  f < at
    ? 0
    : spring({
        fps: 30,
        frame: f - at,
        durationInFrames: 19,
        config: { damping: 12, stiffness: 175, mass: 0.85 },
      });
export const offset = (x: number, y: number, scale = 1) => `translate(${x} ${y}) scale(${scale})`;
export const line = {
  fill: "none",
  stroke: INK,
  strokeWidth: 7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Spark({
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
export function Sweat({ x, y, f }: { x: number; y: number; f: number }) {
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

import { spawnSync } from "node:child_process";
import { unlinkSync } from "node:fs";
const run = (command, args) => {
  const r = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
run("npx", [
  "remotion",
  "render",
  "src/index.ts",
  "InOnAt",
  "output.raw.mp4",
  "--codec=h264",
  "--crf=18",
  "--pixel-format=yuv420p",
  ...process.argv.slice(2),
]);
run("ffmpeg", [
  "-y",
  "-i",
  "output.raw.mp4",
  "-vf",
  "scale=in_range=pc:out_range=tv,format=yuv420p",
  "-c:v",
  "libx264",
  "-preset",
  "fast",
  "-crf",
  "18",
  "-color_range",
  "tv",
  "-colorspace",
  "bt709",
  "-color_trc",
  "bt709",
  "-color_primaries",
  "bt709",
  "-af",
  "loudnorm=I=-16:TP=-1.5:LRA=11",
  "-c:a",
  "aac",
  "-ar",
  "48000",
  "-b:a",
  "192k",
  "-t",
  "26",
  "-movflags",
  "+faststart",
  "output.mp4",
]);
unlinkSync("output.raw.mp4");

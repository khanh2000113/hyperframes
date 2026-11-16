import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
const { values } = parseArgs({ options: { text: { type: "string" }, output: { type: "string" } } });
if (!values.text || !values.output) throw new Error("--text and --output are required");
const project = resolve("work/typography");
await mkdir(project, { recursive: true });
await copyFile("packages/player/node_modules/gsap/dist/gsap.min.js", `${project}/gsap.min.js`);
const escape = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const phrases = values.text
  .match(/[^,.!?]+[,.!?]?/g)
  ?.map((s) => s.trim())
  .filter(Boolean) ?? [values.text];
await writeFile(
  `${project}/index.html`,
  `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;background:#0a0a0a;color:#f5f5f5;font-family:Inter,sans-serif}#root{width:1920px;height:1080px;overflow:hidden}.content{width:100%;height:100%;padding:290px 200px 280px;display:flex;flex-direction:column;justify-content:center;gap:18px}.phrase{margin:0;font-size:76px;font-weight:700;line-height:1.1;letter-spacing:-2px;max-width:1240px}.phrase:last-child{color:#22c55e}
</style><script src="gsap.min.js"></script></head><body><div id="root" data-composition-id="money" data-start="0" data-duration="8" data-width="1920" data-height="1080" data-fps="30"><div class="content">${phrases.map((s, i) => `<p id="p${i}" class="phrase clip" data-start="0" data-duration="8" data-track-index="${i + 1}">${escape(s)}</p>`).join("")}</div></div><script>const tl=gsap.timeline({paused:true});${phrases.map((_, i) => `tl.from('#p${i}',{opacity:0,x:${i % 2 ? -38 : 38},duration:0.65,ease:'${["power3.out", "expo.out", "power2.out"][i % 3]}'},${0.2 + i * 1.4});`).join("")}window.__timelines={money:tl};</script></body></html>`,
);
function run(args) {
  const result = spawnSync(process.execPath, ["packages/cli/bin/hyperframes.mjs", ...args], {
    stdio: "inherit",
    env: {
      ...process.env,
      HYPERFRAMES_CACHE_DIR: process.env.HYPERFRAMES_CACHE_DIR ?? resolve("work/cache"),
      ...(existsSync("/usr/bin/chromium")
        ? { HYPERFRAMES_BROWSER_PATH: process.env.HYPERFRAMES_BROWSER_PATH ?? "/usr/bin/chromium" }
        : {}),
    },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run(["lint", project]);
run(["check", project, "--json"]);
run(["render", project, "--quality", "delivery", "--output", resolve(values.output)]);

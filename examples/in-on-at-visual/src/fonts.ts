import { fontFamily } from "@remotion/google-fonts/BeVietnamPro";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

const fontLoad = delayRender("Load Be Vietnam Pro");
Promise.all(
  ["600", "800", "900"].map(async (weight) => {
    const face = new FontFace(
      fontFamily,
      `url("${staticFile(`fonts/be-vietnam-pro-${weight}.ttf`)}") format("truetype")`,
      { weight },
    );
    document.fonts.add(await face.load());
  }),
)
  .then(() => continueRender(fontLoad))
  .catch(cancelRender);

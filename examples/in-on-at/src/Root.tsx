import React from "react";
import { Composition } from "remotion";
import { Lesson } from "./Lesson";
export const Root: React.FC = () => (
  <Composition
    id="InOnAt"
    component={Lesson}
    durationInFrames={780}
    fps={30}
    width={1080}
    height={1920}
  />
);

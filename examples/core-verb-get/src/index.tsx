import { Composition, registerRoot } from "remotion";
import { CoreVerbGet } from "./CoreVerbGet";
import timeline from "./data/timeline.json";
import "./fonts";

const Root = () => (
  <Composition
    id={timeline.id}
    component={CoreVerbGet}
    width={timeline.width}
    height={timeline.height}
    fps={timeline.fps}
    durationInFrames={timeline.duration}
  />
);

registerRoot(Root);

import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Art } from "./Art";
const root = createRoot(document.getElementById("art")!);
const renderAt = (time: number) =>
  flushSync(() => root.render(<Art frame={Math.min(779, Math.max(0, Math.round(time * 30)))} />));
window.addEventListener("hf-seek", ((event: CustomEvent<{ time: number }>) =>
  renderAt(event.detail.time)) as EventListener);
// Explicit adapter for embedding and frame parity verification.
Object.assign(window, { renderLessonAt: renderAt });
renderAt(0);

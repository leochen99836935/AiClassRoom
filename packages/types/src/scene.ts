/** @spec docs/specs/P0.B-1-domain-types.md */

import type { Id } from "./common";
import type { Action } from "./action";
import type { Slide } from "./slide";
import type { Whiteboard } from "./whiteboard";

/** 一个场景 = 一小节 = 一张"幕" */
export interface Scene {
  id: Id;
  index: number;
  title: string;
  summary: string;
  learningGoals: string[];
  slide?: Slide;
  whiteboard?: Whiteboard;
  actions: Action[];
  status: "pending" | "generating" | "ready" | "failed";
  durationMs?: number;
}

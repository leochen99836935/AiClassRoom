/** @spec docs/specs/P0.B-1-domain-types.md */

import type { Id } from "./common";

/** 一条笔迹 */
export interface Stroke {
  id: Id;
  points: [number, number][];
  color: string;
  width: number;
  createdByRoleId: Id;
}

/** 白板 */
export interface Whiteboard {
  id: Id;
  width: number;
  height: number;
  strokes: Stroke[];
}

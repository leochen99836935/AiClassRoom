/** @spec docs/specs/P0.B-1-domain-types.md */

import type { Id } from "./common";

/** 文本样式（data-model.md 未展开，暂定最小集） */
export interface TextStyle {
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  color?: string;
  align?: "left" | "center" | "right";
}

/** 0~1 归一化的矩形区域 */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Slide 内的元素，tagged union on `kind` */
export type SlideElement =
  | { kind: "text"; id: Id; text: string; style?: TextStyle; region: Rect }
  | { kind: "image"; id: Id; src: string; alt?: string; region: Rect }
  | { kind: "list"; id: Id; items: string[]; ordered: boolean; region: Rect }
  | { kind: "code"; id: Id; language: string; source: string; region: Rect }
  | {
      kind: "shape";
      id: Id;
      shape: "rect" | "circle" | "arrow";
      region: Rect;
    };

/** 一张幻灯片 */
export interface Slide {
  id: Id;
  layout: "title" | "content" | "two-column" | "image" | "quote" | "custom";
  title?: string;
  elements: SlideElement[];
  notes?: string;
  background?: string;
}

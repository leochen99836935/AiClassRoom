/** @spec docs/specs/P0.B-1-domain-types.md */

import type { Id } from "./common";
import type { Stroke } from "./whiteboard";

/** Action 基类 */
export interface ActionBase {
  id: Id;
  type: ActionType;
  roleId?: Id;
  startAtMs?: number;
  blocking: boolean;
  meta?: Record<string, unknown>;
}

/** 某个角色讲话 */
export interface SpeechAction extends ActionBase {
  type: "SPEECH";
  text: string;
  emotion?: "neutral" | "excited" | "serious" | "friendly";
  showSubtitle: boolean;
}

/** 切换 / 高亮 slide */
export interface SlideAction extends ActionBase {
  type: "SLIDE";
  op: "show" | "next" | "prev" | "goto";
  slideId?: Id;
  animation?: "fade" | "slide" | "none";
}

/** 聚焦 slide 内某个元素 */
export interface FocusAction extends ActionBase {
  type: "FOCUS";
  elementId: Id;
  style: "spotlight" | "zoom" | "underline" | "pulse";
  durationMs: number;
}

/** 白板绘制 */
export interface WriteAction extends ActionBase {
  type: "WRITE";
  strokes: Stroke[];
  speedMs: number;
}

/** 提问 / 测验 / 等待用户输入 */
export interface InteractAction extends ActionBase {
  type: "INTERACT";
  kind: "quiz" | "open_question" | "poll" | "code";
  prompt: string;
  choices?: { id: Id; text: string; correct?: boolean }[];
  acceptUserInput: boolean;
  timeoutMs?: number;
  onAnswer?: {
    nextAction?: "advance" | "repeat" | "branch";
    branchToActionId?: Id;
  };
}

/** 多 agent 讨论 */
export interface DiscussAction extends ActionBase {
  type: "DISCUSS";
  topic: string;
  participantRoleIds: Id[];
  minRounds: number;
  maxRounds: number;
  moderationPrompt?: string;
}

/** 纯等待（节奏控制） */
export interface WaitAction extends ActionBase {
  type: "WAIT";
  durationMs: number;
  reason?: string;
}

/** 所有 Action 类型的联合 */
export type Action =
  | SpeechAction
  | SlideAction
  | FocusAction
  | WriteAction
  | InteractAction
  | DiscussAction
  | WaitAction;

/** Action 类型标签 */
export type ActionType = Action["type"];

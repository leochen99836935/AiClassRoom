/** @spec docs/specs/P0.B-1-domain-types.md */

import type { ISODateString } from "./common";

/** 播放错误 */
export interface PlaybackError {
  sceneIndex: number;
  actionIndex: number;
  message: string;
  at: ISODateString;
}

/** 客户端播放状态 */
export interface PlaybackState {
  status:
    | "idle"
    | "loading"
    | "ready"
    | "playing"
    | "paused"
    | "waiting_for_user"
    | "error"
    | "finished";
  currentSceneIndex: number;
  currentActionIndex: number;
  elapsedMs: number;
  playbackRate: number;
  errors: PlaybackError[];
}

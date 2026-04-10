/** @spec docs/specs/P0.B-1-domain-types.md */

// Common
export type { Id, ISODateString } from "./common";

// Role
export type { VoiceConfig, Role } from "./role";

// Slide
export type { TextStyle, Rect, SlideElement, Slide } from "./slide";

// Whiteboard
export type { Stroke, Whiteboard } from "./whiteboard";

// Action
export type {
  ActionBase,
  SpeechAction,
  SlideAction,
  FocusAction,
  WriteAction,
  InteractAction,
  DiscussAction,
  WaitAction,
  Action,
  ActionType,
} from "./action";

// Scene
export type { Scene } from "./scene";

// Lesson
export type { LessonStatus, LessonMeta, Material, Lesson } from "./lesson";

// Trace
export type { TraceRecord } from "./trace";

// Playback
export type { PlaybackError, PlaybackState } from "./playback";

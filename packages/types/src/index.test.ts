/**
 * @spec docs/specs/P0.B-1-domain-types.md
 * 编译时 + 运行时校验：确保所有领域类型与 data-model.md 一致
 */
import { describe, expect, it } from "vitest";

import type {
  Action,
  ActionType,
  DiscussAction,
  FocusAction,
  InteractAction,
  Lesson,
  LessonMeta,
  LessonStatus,
  Material,
  PlaybackError,
  PlaybackState,
  Role,
  Scene,
  Slide,
  SlideAction,
  SlideElement,
  SpeechAction,
  Stroke,
  TraceRecord,
  VoiceConfig,
  WaitAction,
  Whiteboard,
  WriteAction,
} from "./index";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** AC-3: exhaustive switch 证明 tagged union 完整 */
function getActionLabel(a: Action): string {
  switch (a.type) {
    case "SPEECH":
      return "speech";
    case "SLIDE":
      return "slide";
    case "FOCUS":
      return "focus";
    case "WRITE":
      return "write";
    case "INTERACT":
      return "interact";
    case "DISCUSS":
      return "discuss";
    case "WAIT":
      return "wait";
    default: {
      const _exhaustive: never = a;
      return _exhaustive;
    }
  }
}

// ---------------------------------------------------------------------------
// Minimal valid objects (compile-time `satisfies` + runtime assertions)
// ---------------------------------------------------------------------------

const voiceConfig = {
  providerId: "openai",
  voiceId: "alloy",
} satisfies VoiceConfig;

const role = {
  id: "role-001",
  name: "Alice",
  kind: "teacher" as const,
  avatarUrl: "https://example.com/avatar.png",
  personality: "friendly teacher",
  bio: "An AI teacher",
  voice: voiceConfig,
  promptPersona: "You are Alice, a friendly teacher.",
  color: "#4F46E5",
} satisfies Role;

const slideElement = {
  kind: "text" as const,
  id: "el-001",
  text: "Hello",
  region: { x: 0, y: 0, w: 1, h: 0.5 },
} satisfies SlideElement;

const slide = {
  id: "slide-001",
  layout: "title" as const,
  elements: [slideElement],
} satisfies Slide;

const stroke = {
  id: "stroke-001",
  points: [[0, 0] as [number, number]],
  color: "#000",
  width: 2,
  createdByRoleId: "role-001",
} satisfies Stroke;

const whiteboard = {
  id: "wb-001",
  width: 1920,
  height: 1080,
  strokes: [stroke],
} satisfies Whiteboard;

const speechAction = {
  id: "a-001",
  type: "SPEECH" as const,
  roleId: "role-001",
  blocking: true,
  text: "Hello class!",
  showSubtitle: true,
} satisfies SpeechAction;

const slideAction = {
  id: "a-002",
  type: "SLIDE" as const,
  blocking: false,
  op: "show" as const,
} satisfies SlideAction;

const focusAction = {
  id: "a-003",
  type: "FOCUS" as const,
  blocking: true,
  elementId: "el-001",
  style: "spotlight" as const,
  durationMs: 2000,
} satisfies FocusAction;

const writeAction = {
  id: "a-004",
  type: "WRITE" as const,
  blocking: true,
  strokes: [stroke],
  speedMs: 1000,
} satisfies WriteAction;

const interactAction = {
  id: "a-005",
  type: "INTERACT" as const,
  blocking: true,
  kind: "quiz" as const,
  prompt: "What is 1+1?",
  choices: [
    { id: "c1", text: "2", correct: true },
    { id: "c2", text: "3" },
  ],
  acceptUserInput: true,
} satisfies InteractAction;

const discussAction = {
  id: "a-006",
  type: "DISCUSS" as const,
  blocking: true,
  roleId: "role-001",
  topic: "What is AI?",
  participantRoleIds: ["role-001", "role-002"],
  minRounds: 1,
  maxRounds: 3,
} satisfies DiscussAction;

const waitAction = {
  id: "a-007",
  type: "WAIT" as const,
  blocking: true,
  durationMs: 1000,
} satisfies WaitAction;

const scene = {
  id: "scene-001",
  index: 0,
  title: "Introduction",
  summary: "Opening scene",
  learningGoals: ["Understand the basics"],
  slide,
  whiteboard,
  actions: [speechAction, slideAction, focusAction],
  status: "ready" as const,
} satisfies Scene;

const material = {
  id: "mat-001",
  kind: "pdf" as const,
  name: "lecture.pdf",
} satisfies Material;

const lessonMeta = {
  estimatedDurationMin: 30,
  difficulty: "beginner" as const,
  tags: ["intro"],
  generationTraceIds: [],
} satisfies LessonMeta;

const lesson = {
  id: "lesson-001",
  title: "Intro to AI",
  description: "A beginner course",
  topic: "AI basics",
  language: "zh-CN" as const,
  createdAt: "2026-04-10T00:00:00Z",
  updatedAt: "2026-04-10T00:00:00Z",
  status: "ready" as const satisfies LessonStatus,
  roles: [role],
  scenes: [scene],
  meta: lessonMeta,
} satisfies Lesson;

const traceRecord = {
  id: "trace-001",
  agent: "outline_agent",
  node: "draft",
  provider: "anthropic",
  model: "claude-sonnet-4-6",
  inputTokens: 100,
  outputTokens: 200,
  latencyMs: 1500,
  startedAt: "2026-04-10T00:00:00Z",
  finishedAt: "2026-04-10T00:00:01Z",
  input: { prompt: "..." },
  output: { text: "..." },
} satisfies TraceRecord;

const playbackError = {
  sceneIndex: 0,
  actionIndex: 1,
  message: "TTS failed",
  at: "2026-04-10T00:00:00Z",
} satisfies PlaybackError;

const playbackState = {
  status: "playing" as const,
  currentSceneIndex: 0,
  currentActionIndex: 0,
  elapsedMs: 5000,
  playbackRate: 1,
  errors: [playbackError],
} satisfies PlaybackState;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("@aiclassroom/types — domain types", () => {
  it("Lesson has correct structure", () => {
    expect(typeof lesson.id).toBe("string");
    expect(lesson.status).toBe("ready");
    expect(lesson.roles).toHaveLength(1);
    expect(lesson.scenes).toHaveLength(1);
    expect(lesson.language).toBe("zh-CN");
  });

  it("Role has correct structure", () => {
    expect(role.kind).toBe("teacher");
    expect(role.voice.providerId).toBe("openai");
  });

  it("Scene has correct structure", () => {
    expect(scene.index).toBe(0);
    expect(scene.status).toBe("ready");
    expect(scene.actions).toHaveLength(3);
  });

  it("Slide and SlideElement have correct structure", () => {
    expect(slide.layout).toBe("title");
    expect(slideElement.kind).toBe("text");
    expect(slideElement.region.x).toBe(0);
  });

  it("All 7 Action types are constructible and exhaustive (AC-3)", () => {
    const actions: Action[] = [
      speechAction,
      slideAction,
      focusAction,
      writeAction,
      interactAction,
      discussAction,
      waitAction,
    ];

    const labels = actions.map(getActionLabel);
    expect(labels).toEqual(["speech", "slide", "focus", "write", "interact", "discuss", "wait"]);
  });

  it("ActionType union matches all 7 types", () => {
    const allTypes: ActionType[] = [
      "SPEECH",
      "SLIDE",
      "FOCUS",
      "WRITE",
      "INTERACT",
      "DISCUSS",
      "WAIT",
    ];
    expect(allTypes).toHaveLength(7);
  });

  it("TraceRecord accepts unknown input/output", () => {
    expect(traceRecord.agent).toBe("outline_agent");
    expect(traceRecord.input).toBeDefined();
  });

  it("PlaybackState has correct structure", () => {
    expect(playbackState.status).toBe("playing");
    expect(playbackState.errors).toHaveLength(1);
  });

  it("Whiteboard and Stroke have correct structure", () => {
    expect(whiteboard.strokes).toHaveLength(1);
    expect(stroke.points[0]).toEqual([0, 0]);
  });

  it("Material has correct structure", () => {
    expect(material.kind).toBe("pdf");
    expect(material.name).toBe("lecture.pdf");
  });
});

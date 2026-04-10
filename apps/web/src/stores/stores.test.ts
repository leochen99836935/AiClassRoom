/** @spec docs/specs/P0.C-5-stores-skeleton.md */

import { describe, expect, it, beforeEach } from "vitest";
import type { Lesson, TraceRecord } from "@aiclassroom/types";
import { useLessonStore } from "./lesson-store";
import { usePlaybackStore } from "./playback-store";
import { useTraceStore } from "./trace-store";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockLesson: Lesson = {
  id: "lesson-1",
  title: "Test Lesson",
  description: "A test lesson",
  topic: "Testing",
  language: "zh-CN",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  status: "draft",
  roles: [],
  scenes: [],
  meta: {
    estimatedDurationMin: 30,
    difficulty: "beginner",
    tags: [],
    generationTraceIds: [],
  },
};

const mockTrace: TraceRecord = {
  id: "trace-1",
  agent: "test-agent",
  node: "test-node",
  provider: "anthropic",
  model: "claude-sonnet-4-6",
  inputTokens: 100,
  outputTokens: 50,
  latencyMs: 1200,
  startedAt: "2026-01-01T00:00:00Z",
  finishedAt: "2026-01-01T00:00:01Z",
  input: { prompt: "hello" },
  output: { text: "hi" },
};

// ---------------------------------------------------------------------------
// lesson-store
// ---------------------------------------------------------------------------

describe("lesson-store", () => {
  beforeEach(() => useLessonStore.setState({ lesson: null }));

  it("defaults to null lesson", () => {
    expect(useLessonStore.getState().lesson).toBeNull();
  });

  it("setLesson updates lesson", () => {
    useLessonStore.getState().setLesson(mockLesson);
    expect(useLessonStore.getState().lesson?.id).toBe("lesson-1");
  });

  it("reset clears lesson", () => {
    useLessonStore.getState().setLesson(mockLesson);
    useLessonStore.getState().reset();
    expect(useLessonStore.getState().lesson).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// playback-store
// ---------------------------------------------------------------------------

describe("playback-store", () => {
  beforeEach(() =>
    usePlaybackStore.setState({
      status: "idle",
      currentSceneIndex: 0,
      currentActionIndex: 0,
      elapsedMs: 0,
      playbackRate: 1,
      errors: [],
    }),
  );

  it("defaults to idle status", () => {
    expect(usePlaybackStore.getState().status).toBe("idle");
  });

  it("setStatus updates status", () => {
    usePlaybackStore.getState().setStatus("playing");
    expect(usePlaybackStore.getState().status).toBe("playing");
  });

  it("reset restores defaults", () => {
    usePlaybackStore.getState().setStatus("playing");
    usePlaybackStore.getState().reset();
    expect(usePlaybackStore.getState().status).toBe("idle");
  });
});

// ---------------------------------------------------------------------------
// trace-store
// ---------------------------------------------------------------------------

describe("trace-store", () => {
  beforeEach(() => useTraceStore.setState({ traces: [] }));

  it("defaults to empty traces", () => {
    expect(useTraceStore.getState().traces).toHaveLength(0);
  });

  it("addTrace appends a trace", () => {
    useTraceStore.getState().addTrace(mockTrace);
    expect(useTraceStore.getState().traces).toHaveLength(1);
    expect(useTraceStore.getState().traces[0]?.id).toBe("trace-1");
  });

  it("clearTraces empties the list", () => {
    useTraceStore.getState().addTrace(mockTrace);
    useTraceStore.getState().clearTraces();
    expect(useTraceStore.getState().traces).toHaveLength(0);
  });
});

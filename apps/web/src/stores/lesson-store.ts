/** @spec docs/specs/P0.C-5-stores-skeleton.md */

"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Lesson } from "@aiclassroom/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LessonStoreState {
  lesson: Lesson | null;
}

export interface LessonStoreActions {
  setLesson: (lesson: Lesson | null) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const initialState: LessonStoreState = {
  lesson: null,
};

export const useLessonStore = create<LessonStoreState & LessonStoreActions>()(
  immer((set) => ({
    ...initialState,

    setLesson: (lesson) =>
      set((state) => {
        state.lesson = lesson;
      }),

    reset: () => set(() => initialState),
  })),
);

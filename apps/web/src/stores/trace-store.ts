/** @spec docs/specs/P0.C-5-stores-skeleton.md */

"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { TraceRecord } from "@aiclassroom/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TraceStoreState {
  traces: TraceRecord[];
}

export interface TraceStoreActions {
  addTrace: (trace: TraceRecord) => void;
  clearTraces: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const initialState: TraceStoreState = {
  traces: [],
};

export const useTraceStore = create<TraceStoreState & TraceStoreActions>()(
  immer((set) => ({
    ...initialState,

    addTrace: (trace) =>
      set((state) => {
        state.traces.push(trace);
      }),

    clearTraces: () => set(() => initialState),
  })),
);

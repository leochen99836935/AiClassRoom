/** @spec docs/specs/P0.C-5-stores-skeleton.md */

"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PlaybackState } from "@aiclassroom/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlaybackStoreActions {
  setStatus: (status: PlaybackState["status"]) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const initialState: PlaybackState = {
  status: "idle",
  currentSceneIndex: 0,
  currentActionIndex: 0,
  elapsedMs: 0,
  playbackRate: 1,
  errors: [],
};

export const usePlaybackStore = create<PlaybackState & PlaybackStoreActions>()(
  immer((set) => ({
    ...initialState,

    setStatus: (status) =>
      set((state) => {
        state.status = status;
      }),

    reset: () => set(() => initialState),
  })),
);

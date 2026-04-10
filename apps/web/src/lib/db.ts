/** @spec docs/specs/P0.C-3-dexie-schema.md */

"use client";

import Dexie from "dexie";
import type { Table } from "dexie";
import type { Lesson, TraceRecord } from "@aiclassroom/types";

// ---------------------------------------------------------------------------
// Table row types
// ---------------------------------------------------------------------------

/** 草稿 Lesson（与 Lesson 结构一致，status 可能为 draft） */
export type DraftRow = Lesson & { updatedAt: string };

/** API Key 存储行（Phase 0 明文，Phase 1 加密） */
export interface ApiKeyRow {
  provider: string;
  key: string;
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

export class AIClassRoomDB extends Dexie {
  drafts!: Table<DraftRow, string>;
  lessons!: Table<Lesson, string>;
  apiKeys!: Table<ApiKeyRow, string>;
  traces!: Table<TraceRecord, number>;

  constructor() {
    super("aiclassroom");

    this.version(1).stores({
      drafts: "id, updatedAt",
      lessons: "id, status, createdAt",
      apiKeys: "provider",
      traces: "++id, lessonId, agent, startedAt",
    });
  }
}

export const db = new AIClassRoomDB();

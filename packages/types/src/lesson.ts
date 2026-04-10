/** @spec docs/specs/P0.B-1-domain-types.md */

import type { Id, ISODateString } from "./common";
import type { Role } from "./role";
import type { Scene } from "./scene";

/** 课程状态 */
export type LessonStatus =
  | "draft"
  | "outlining"
  | "scenes_generating"
  | "actions_generating"
  | "ready"
  | "failed";

/** 课程元信息 */
export interface LessonMeta {
  estimatedDurationMin: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  generationTraceIds: Id[];
}

/** 用户上传的参考资料 */
export interface Material {
  id: Id;
  kind: "pdf" | "pptx" | "markdown" | "text" | "url" | "image";
  name: string;
  size?: number;
  content?: string;
  url?: string;
}

/** 一节完整的课程 */
export interface Lesson {
  id: Id;
  title: string;
  description: string;
  topic: string;
  language: "zh-CN" | "en-US";
  createdAt: ISODateString;
  updatedAt: ISODateString;
  status: LessonStatus;
  roles: Role[];
  scenes: Scene[];
  sourceMaterials?: Material[];
  meta: LessonMeta;
}

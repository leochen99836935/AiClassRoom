/** @spec docs/specs/P0.B-1-domain-types.md */

import type { Id } from "./common";

/** 语音配置 */
export interface VoiceConfig {
  providerId: string;
  voiceId: string;
  speed?: number;
  pitch?: number;
}

/** 课堂中的一个 AI 角色 */
export interface Role {
  id: Id;
  name: string;
  kind: "teacher" | "student";
  avatarUrl: string;
  personality: string;
  bio: string;
  voice: VoiceConfig;
  promptPersona: string;
  color: string;
}

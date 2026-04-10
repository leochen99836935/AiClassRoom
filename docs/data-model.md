# AIClassRoom — 数据模型

> 本文档是领域类型的唯一真相。`packages/types` 下的 TypeScript 定义必须与本文档一致；不一致以本文档为准。

## 1. 命名与约定

- 所有类型名用 PascalCase，字段名用 camelCase。
- ID 统一为 `string`（`nanoid(12)`）。
- 时间统一为 ISO 8601 字符串。
- 可选字段显式标 `?`，数组默认非空除非说明。
- 枚举用 union string type，不用 TS `enum`。

## 2. 核心领域

### 2.1 Lesson

一节完整的课程。

```ts
interface Lesson {
  id: string;
  title: string;
  description: string;
  topic: string; // 用户原始输入
  language: "zh-CN" | "en-US";
  createdAt: string;
  updatedAt: string;
  status: LessonStatus;
  roles: Role[]; // 本课堂参与的角色（1 位老师 + N 位学生）
  scenes: Scene[];
  sourceMaterials?: Material[]; // 用户上传的参考资料
  meta: LessonMeta;
}

type LessonStatus =
  | "draft" // 仅有 topic，尚未开始生成
  | "outlining" // 大纲生成中（outline_agent 运行中）
  | "scenes_generating" // 大纲已完成，正在生成各 Scene 的 slide+讲稿
  | "actions_generating" // 正在为各 Scene 编排 Action 列表
  | "ready" // **可进入课堂**（见下方"渐进式 ready 语义"）
  | "failed";

// —— 渐进式 ready 语义 (Phase 1+) ——
//
// Lesson.status === "ready" 的**充分条件**：
//   1. Lesson.scenes.length >= 1
//   2. Lesson.scenes[0].status === "ready"
//      （即首个 Scene 的 slide + actions 已全部就绪，可立即播放）
//
// 换句话说：Lesson 整体进入 "ready" **不**要求所有 Scene 都生成完。
// 剩余 Scene 可能仍是 "pending" / "generating"，由 Scene.status 单独表达。
// 这是"渐进式进入课堂"（见 ARCHITECTURE.md § 4.1）的核心语义：
// 第 1 个 Scene 就绪即跳转课堂，剩余 Scene 由后台 SSE 持续推送到 lessonStore。
//
// Playback Engine 遇到 Scene.status ∈ {"pending","generating"} 时显示
// "生成中…" 占位并轮询；"failed" 时显示"重试"；"ready" 时正常播放。
//
// 失败语义：任一 Scene "failed" **不**会把 Lesson 整体降级为 "failed"；
// 只有在 outline 阶段失败或所有 Scene 全部失败时 Lesson 才 "failed"。

interface LessonMeta {
  estimatedDurationMin: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  generationTraceIds: string[]; // 指向 TraceRecord
}
```

### 2.2 Role

课堂中的一个 AI 角色。

```ts
interface Role {
  id: string;
  name: string;
  kind: "teacher" | "student";
  avatarUrl: string;
  personality: string; // 一句话人设
  bio: string; // 详细介绍（角色介绍浮层使用）
  voice: VoiceConfig;
  promptPersona: string; // 写入系统 prompt 的角色设定
  color: string; // 品牌色（气泡、边框）
}

interface VoiceConfig {
  providerId: string; // e.g. "openai" / "minimax"
  voiceId: string; // 具体音色
  speed?: number; // 0.5 ~ 2.0
  pitch?: number;
}
```

### 2.3 Scene

一个场景 = 一小节 = 一张"幕"。

```ts
interface Scene {
  id: string;
  index: number; // 在 Lesson 中的顺序
  title: string;
  summary: string; // 大纲阶段产出
  learningGoals: string[];
  slide?: Slide; // 该场景的主视觉（可选，有的场景没有 slide）
  whiteboard?: Whiteboard; // 白板初始状态（可选）
  actions: Action[]; // 播放时序
  status: "pending" | "generating" | "ready" | "failed";
  durationMs?: number; // 估算播放时长
}
```

### 2.4 Slide

```ts
interface Slide {
  id: string;
  layout: "title" | "content" | "two-column" | "image" | "quote" | "custom";
  title?: string;
  elements: SlideElement[];
  notes?: string; // 讲稿（导出 PPTX 时进备注区）
  background?: string;
}

type SlideElement =
  | { kind: "text"; id: string; text: string; style?: TextStyle; region: Rect }
  | { kind: "image"; id: string; src: string; alt?: string; region: Rect }
  | { kind: "list"; id: string; items: string[]; ordered: boolean; region: Rect }
  | { kind: "code"; id: string; language: string; source: string; region: Rect }
  | { kind: "shape"; id: string; shape: "rect" | "circle" | "arrow"; region: Rect };

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
} // 0~1 归一化
```

### 2.5 Whiteboard

```ts
interface Whiteboard {
  id: string;
  width: number;
  height: number;
  strokes: Stroke[]; // 初始笔迹（空数组表示空白板）
}

interface Stroke {
  id: string;
  points: [number, number][];
  color: string;
  width: number;
  createdByRoleId: string;
}
```

## 3. Action 系统（核心）

**Action 是播放引擎的最小执行单元。** 新增 Action 类型必须：

1. 在这里加类型
2. 在 `packages/types/actions.ts` 加 TS 类型
3. 在 `features/classroom/playback/executors/` 加 executor
4. 写对应的 spec 并更新 `docs/specs/playback-engine.md`

### 3.1 基类

```ts
interface ActionBase {
  id: string;
  type: ActionType;
  roleId?: string; // 哪个角色发起（SPEECH/DISCUSS 必填）
  startAtMs?: number; // 相对 Scene 起点的时间，未填则顺序执行
  blocking: boolean; // 是否阻塞后续 action（TTS 通常 true）
  meta?: Record<string, unknown>;
}

type Action =
  | SpeechAction
  | SlideAction
  | FocusAction
  | WriteAction
  | InteractAction
  | DiscussAction
  | WaitAction;

type ActionType = Action["type"];
```

### 3.2 SPEECH — 某个角色讲话

```ts
interface SpeechAction extends ActionBase {
  type: "SPEECH";
  text: string; // 讲稿
  emotion?: "neutral" | "excited" | "serious" | "friendly";
  showSubtitle: boolean;
}
```

### 3.3 SLIDE — 切换 / 高亮 slide

```ts
interface SlideAction extends ActionBase {
  type: "SLIDE";
  op: "show" | "next" | "prev" | "goto";
  slideId?: string; // op=goto 时必填
  animation?: "fade" | "slide" | "none";
}
```

### 3.4 FOCUS — 聚焦 slide 内某个元素

```ts
interface FocusAction extends ActionBase {
  type: "FOCUS";
  elementId: string;
  style: "spotlight" | "zoom" | "underline" | "pulse";
  durationMs: number;
}
```

### 3.5 WRITE — 白板绘制

```ts
interface WriteAction extends ActionBase {
  type: "WRITE";
  strokes: Stroke[];
  speedMs: number; // 播放速度（每笔的总耗时）
}
```

### 3.6 INTERACT — 提问 / 测验 / 等待用户输入

```ts
interface InteractAction extends ActionBase {
  type: "INTERACT";
  kind: "quiz" | "open_question" | "poll" | "code";
  prompt: string;
  choices?: { id: string; text: string; correct?: boolean }[];
  acceptUserInput: boolean; // 是否等待用户作答
  timeoutMs?: number;
  onAnswer?: {
    nextAction?: "advance" | "repeat" | "branch";
    branchToActionId?: string;
  };
}
```

### 3.7 DISCUSS — 多 agent 讨论

```ts
interface DiscussAction extends ActionBase {
  type: "DISCUSS";
  topic: string;
  participantRoleIds: string[];
  minRounds: number;
  maxRounds: number;
  moderationPrompt?: string; // 给 moderator agent 的指令
}
```

### 3.8 WAIT — 纯等待（节奏控制）

```ts
interface WaitAction extends ActionBase {
  type: "WAIT";
  durationMs: number;
  reason?: string;
}
```

## 4. 生成与观测

### 4.1 Material

```ts
interface Material {
  id: string;
  kind: "pdf" | "pptx" | "markdown" | "text" | "url" | "image";
  name: string;
  size?: number;
  content?: string; // 提取后的纯文本
  url?: string;
}
```

### 4.2 TraceRecord

```ts
interface TraceRecord {
  id: string;
  lessonId?: string; // Lesson 上下文之外的调用可省略（如 Phase 0 Hello Claude 烟囱、独立调试）
  agent: string; // "outline_agent" / "scene_agent" / ... / "hello_smoke"
  node: string; // LangGraph 节点名；非 LangGraph 调用填 "direct"
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  costUsd?: number;
  startedAt: string;
  finishedAt: string;
  input: unknown;
  output: unknown;
  error?: { message: string; stack?: string };
}
```

### 4.3 PlaybackState (客户端)

```ts
interface PlaybackState {
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
  playbackRate: number; // 0.5 / 1 / 1.5 / 2
  errors: PlaybackError[];
}

interface PlaybackError {
  sceneIndex: number;
  actionIndex: number;
  message: string;
  at: string;
}
```

## 5. 运行时不变量 (Invariants)

- `Lesson.scenes[i].index === i`
- `Scene.actions` 中 `SPEECH` / `DISCUSS` 必须带 `roleId`
- `FocusAction.elementId` 必须指向同 Scene 的 `slide.elements[].id`
- `InteractAction.choices` 只在 `kind === "quiz" | "poll"` 时存在
- 所有 `Role.id` 在一个 Lesson 内唯一

**违反不变量的数据**：播放引擎必须拒绝播放并把该 action 标红，禁止"尽力而为"地跳过。

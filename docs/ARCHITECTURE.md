# AIClassRoom — 系统架构

## 1. 总览

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser (Client)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Next.js UI │  │ Zustand+Immer│  │ Playback Engine    │   │
│  │ (App Router │──│  Dexie (IDB) │──│ (state machine,    │   │
│  │  + shadcn)  │  │ lesson/play  │  │  action executor)  │   │
│  └─────┬───────┘  └──────────────┘  └─────────┬──────────┘   │
│        │                                       │              │
│        │                                       ▼              │
│        │                           ┌──────────────────────┐   │
│        │                           │ TTS / ASR Adapters   │   │
│        │                           │ (Web Audio / stream) │   │
│        │                           └──────────────────────┘   │
└────────┼──────────────────────────────────────────────────────┘
         │ fetch (SSE / JSON)
         ▼
┌──────────────────────────────────────────────────────────────┐
│                   Next.js Route Handlers                      │
│  /api/generate/outline   /api/generate/scene                  │
│  /api/generate/action    /api/chat    /api/grade              │
│  /api/tts   /api/asr     /api/export                          │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│              Agent Layer (LangGraph + LangChain Core)         │
│  ┌────────────┐ ┌────────────┐ ┌───────────┐ ┌────────────┐  │
│  │ outline_   │ │  scene_    │ │ action_   │ │ discuss_   │  │
│  │ agent      │ │  agent     │ │ agent     │ │ agent      │  │
│  └────────────┘ └────────────┘ └───────────┘ └────────────┘  │
│              │           │              │                    │
│              ▼           ▼              ▼                    │
│        ┌──────────────────────────────────────┐              │
│        │         Vercel AI SDK (ai)           │              │
│        │ @ai-sdk/anthropic · openai · google  │              │
│        │ · deepseek · openai-compatible(local)│              │
│        └──────────────────────────────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

## 2. 模块划分（monorepo）

```
apps/
  web/                        Next.js 16 主应用
    src/
      app/                    App Router 路由
        (marketing)/          首页、关于
        (app)/                已登录后的产品区
          classroom/[id]/     课堂播放页
          generate/           生成流程（角色→大纲→动作）
        api/                  Route Handlers
      components/             React 组件（UI / 业务）
      features/               按业务域分的 feature 模块
        home/                 首页与输入
        roles/                角色选择
        outline/              大纲生成
        classroom/            课堂播放
          playback/           播放引擎
          slide/              slide 渲染
          whiteboard/         白板
          dialogue/           对话气泡 + 字幕
        export/               PPTX / HTML 导出
      stores/                 Zustand stores
      lib/                    客户端工具
      hooks/                  自定义 hooks
packages/
  types/                      跨端共享类型（Lesson/Scene/Action/Role 等）
  ui/                         shadcn 基础组件 + 业务复用组件
  prompts/                    LLM prompt 模板（带版本号）
  agents/                     LangGraph agent 定义
  llm/                        Provider 抽象（Claude/OpenAI/...）
  tts/                        TTS/ASR 抽象
  config/                     eslint / tsconfig / tailwind 共享配置
```

## 3. 关键抽象

### 3.1 Lesson → Scene → Action 三层模型

- **Lesson**：一节课。包含元信息、角色列表、场景列表。
- **Scene**：一个场景（一个"小节"），对应 1-N 个 slide / 互动。包含 action timeline。
- **Action**：最小执行单元，播放引擎按顺序执行。类型见 `data-model.md`。

**为什么这样分层？**

- 生成阶段可以并行：大纲 = Scene 骨架；每个 Scene 的 action 可以独立生成和缓存。
- 播放阶段可以随时跳转、回看、倍速。
- 编辑阶段可以只改某个 action 而不重算全课。

### 3.2 播放引擎（Playback Engine）

一台客户端状态机。输入：`Scene.actions: Action[]` + 用户控制事件（play/pause/next/prev/seek）。输出：驱动 UI 渲染（slide 切换、气泡出现、白板绘制、TTS 播放）。

**状态**：

```
idle → loading → ready → playing ⇄ paused
                           │
                           ├── waiting_for_user (遇到 INTERACT 类型且需要用户输入)
                           ├── error
                           └── finished
```

**Action executor**：一个 action 类型对应一个 executor，注册在一个 map 里。新增 action 类型只需：

1. 在 `packages/types` 加类型
2. 在 `features/classroom/playback/executors/` 加一个 executor
3. 在 spec 中声明

见 `docs/specs/playback-engine.md`（待写）。

### 3.3 生成流水线（Generation Pipeline）

**阶段**：

1. `outline_agent`: `(topic, materials, roles) → Lesson skeleton (scenes with titles & summaries)`
2. `scene_agent`: `(Lesson, sceneIndex) → Scene content (slide draft, key points)`
3. `action_agent`: `(Scene, roles) → Action[] (SPEECH/SLIDE/FOCUS/INTERACT/...)`

每一阶段：

- 使用 LangGraph，节点显式分离：retrieve → plan → draft → critique → finalize
- 全量可流式输出（SSE），前端边生成边渲染进度
- 每次调用写入 trace：`{agent, node, model, tokens, latencyMs, cost, input, output}`
- 失败可从最后一个 checkpoint 恢复

### 3.4 LLM 接入层 (Vercel AI SDK)

**不再自写 Provider 抽象**，统一使用 **Vercel AI SDK**。`packages/llm/` 只做三件事：

1. 根据当前用户配置（provider + model + key）构造一个 AI SDK 的 `LanguageModel` 实例
2. 统一的超时、重试、trace 包装
3. 封装给 Agent 层使用的 helper（`chat`, `generateStructured`, `stream`）

```ts
// packages/llm 对外接口示意
import { generateObject, streamText, type LanguageModel } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { deepseek } from "@ai-sdk/deepseek";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function resolveModel(cfg: ModelConfig): LanguageModel { ... }
export async function generateStructured<T>(opts: { schema: ZodSchema<T>; prompt: string; cfg: ModelConfig }): Promise<T> { ... }
export function stream(opts: { messages; cfg: ModelConfig }): ReadableStream { ... }
```

- **默认**：`anthropic('claude-sonnet-4-6')`（生成）/ `anthropic('claude-opus-4-6')`（大纲编排）/ `anthropic('claude-haiku-4-5-20251001')`（测验评分）
- **配置来源**：Zustand `settingsStore` + Dexie 本地持久化；用户在首页 (`01-首页-配置模型.png`) 填入
- **阶段 1-2**：用户 Key 通过 Dexie 加密存在浏览器；Route Handler 从请求头读取
- **阶段 4**：Key 后端加密存储，前端只与自家 API 通信

### 3.5 Agent 编排层 (LangGraph + LangChain Core)

LangGraph 负责多节点状态图：

```
outline_agent:   plan → retrieve → draft → critique → finalize
scene_agent:     plan → draft_slide → draft_script → critique → finalize
action_agent:    analyze_scene → timeline_plan → expand_actions → validate
discuss_agent:   moderator ↔ participant_1 ↔ ... ↔ participant_N
```

- 节点内部用 **LangChain Core** 的 `Runnable` / `PromptTemplate` / `StructuredOutputParser`
- 叶子 LLM 调用走 `packages/llm` 的 helper → Vercel AI SDK
- 每次调用写入 trace，checkpoint 存内存（Phase 3+ 持久化）

### 3.6 TTS / ASR 抽象

```ts
interface TTSProvider {
  synthesize(text: string, voice: VoiceId, opts?): ReadableStream<Uint8Array>;
}
interface ASRProvider {
  recognize(audio: Blob, opts?): Promise<{ text: string; segments?: Segment[] }>;
}
```

MVP：可先用 Web Speech API 做占位；阶段 2 接入云 TTS（OpenAI / MiniMax / Azure）。

## 4. 数据流

### 4.1 生成阶段（渐进式进入课堂）

```
UI submit
  → POST /api/generate/outline (SSE)
      ↳ outline_agent stream
      ↳ 前端实时拼 Lesson.scenes[] 骨架（status="pending"）
  → 用户点"继续"
  → 并行 POST /api/generate/scene?i=0..N (SSE)
      ↳ scene_agent per scene，每个 Scene 就绪时 status: pending→generating→ready
  → 并行 POST /api/generate/action?i=0..N (SSE)
      ↳ action_agent per scene，往 lessonStore 推 Action 列表
  → 触发条件：outline 完成 + scenes[0].status === "ready"
      ↳ 立即 router.push("/classroom/:id") —— 此时 Lesson.status = "ready"
      ↳ 剩余 Scene 在后台继续 SSE 推流到 lessonStore
  → playback engine 播放时遇到未就绪 Scene 显示"生成中…"占位并等待
```

> 目标：用户从首页提交到进入课堂 P50 **< 60 秒**。达成方式不是让模型更快，而是"只等到第 1 个 Scene 就绪"。

### 4.2 播放阶段

```
Zustand.playbackStore {
  lesson, currentSceneIndex, currentActionIndex, status, ...
}
播放引擎 tick:
  取当前 action → 找 executor → 执行（可能是异步的 TTS 流）
  → 执行完 → currentActionIndex++ → 下一 tick
用户事件:
  pause / next / prev / seek / answer → 触发 reducer
```

### 4.3 课程持久化（阶段 3）

MVP 阶段课程只存在 Zustand + localStorage。阶段 3 加入：

- `/api/lessons` CRUD，存数据库（SQLite → Postgres）
- 资源（音频、图片）走对象存储（S3 兼容）

## 5. 错误处理与降级

- **LLM 失败**：自动重试 2 次（指数退避）；仍失败 → 给用户明确错误 + "查看 trace" + "切换模型重试"。
- **TTS 失败**：降级到字幕 only 模式。
- **Scene 生成失败**：不阻塞其他 scene；进入课堂时该 scene 显示"重新生成"按钮。
- **网络断开**：已生成的内容保留，未生成的提示稍后重试。

## 6. 可观测性

- 每个 LLM 调用写入一条 `TraceRecord`（详见 data-model）。
- 前端有隐藏入口查看当前会话的所有 trace（开发模式默认展开）。
- 阶段 4 接入 OpenTelemetry + 后端持久化。

## 7. 安全边界

- 用户 API Key：阶段 1-2 仅 localStorage，禁止进 URL / log / 分析。
- 生成的 HTML 片段（interactive simulations）必须放进 sandboxed iframe。
- 导出的 HTML 同样隔离脚本。

## 8. 性能预算

| 指标                          | 预算          |
| ----------------------------- | ------------- |
| 首页 JS 初始加载              | < 150 KB gzip |
| 课堂页 JS 初始加载            | < 300 KB gzip |
| 切换 Scene 响应               | < 300 ms      |
| 生成大纲 P50                  | < 15 s        |
| 生成一个 Scene 的 actions P50 | < 20 s        |

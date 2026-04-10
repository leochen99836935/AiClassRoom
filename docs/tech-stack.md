# AIClassRoom — 技术栈与约定

> 本文档是技术选型的唯一真相。新增/替换依赖必须先改本文件 + 说明理由。
> **每一项技术后都会注明它对应的功能**，实现时据此决定 import 哪个包。

## 1. 运行时与语言

| 项         | 选择                                            | 备注                |
| ---------- | ----------------------------------------------- | ------------------- |
| Node.js    | `>= 20.11` LTS                                  | 与 Next 16 对齐     |
| 包管理     | **pnpm** 9+                                     | monorepo workspaces |
| TypeScript | 5.x, `strict: true`                             | 禁用 `any`          |
| 目标浏览器 | 最近两个版本的 Chrome / Edge / Safari / Firefox |                     |

## 2. 前端框架与 UI

### 2.1 核心框架

| 技术                        | 用在什么功能上                                               |
| --------------------------- | ------------------------------------------------------------ |
| **Next.js 16** (App Router) | 整站路由、RSC 默认渲染、Route Handlers 做 API、SSE 流式生成  |
| **React 19**                | UI 组件、Server Components + `useActionState`、Suspense 边界 |
| **TypeScript 5** (`strict`) | 全栈类型共享，`packages/types` 领域类型驱动编辑/播放引擎     |

### 2.2 样式与组件

| 技术                    | 用在什么功能上                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| **Tailwind CSS 4**      | 全站样式、`@theme` 定义设计 token、light/dark 主题切换                                       |
| **Radix UI Primitives** | 无障碍基础组件：Dialog/Popover/Tabs/Slider/Toast —— 设置弹窗、角色卡、模型配置、课堂右侧 Tab |
| **shadcn/ui**           | 基于 Radix 二次封装的项目级组件库，统一放 `packages/ui`                                      |
| **lucide-react**        | 图标系统（工具栏、播放控制、角色卡）                                                         |
| **framer-motion**       | 场景切换动画、聚光灯 (`FocusAction`)、角色介绍浮层进出                                       |

### 2.3 富内容与可视化

| 技术                                                                                                  | 用在什么功能上                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ProseMirror**（**统一通过 Tiptap 封装** —— `@tiptap/react` + `@tiptap/pm` + `@tiptap/starter-kit`） | ① 右侧"笔记"面板的用户笔记编辑 ② Phase 3 Scene 编辑器中的讲稿编辑 ③ Slide 文本元素的富文本 ④ 导入 Markdown/HTML 资料的规范化。**约定**：业务代码不直接 import `prosemirror-*`，所有富文本入口走 `@tiptap/react`；如确需 PM 底层能力，在 `packages/ui/src/editor/` 内集中封装。 |
| **ECharts** (`echarts` + `echarts-for-react`)                                                         | Slide 中的数据图表元素（柱状/折线/饼图/散点）、测验结果统计图、Phase 4 成本与用量看板                                                                                                                                                                                          |
| **@xyflow/react**                                                                                     | ① 课程大纲流程图可视化（`03-生成课程大纲.png` 的 book 图示会升级为可交互流程图） ② Agent trace 的 DAG 展示 ③ Slide 中的流程图元素 ④ Phase 3 Scene 结构编辑器                                                                                                                   |
| **react-markdown** + `rehype-raw` + `rehype-highlight`                                                | 渲染 LLM 返回的 markdown（讲稿、笔记草稿）到只读视图                                                                                                                                                                                                                           |
| **原生 SVG** + 自写 hooks                                                                             | 白板 (`WriteAction`) 按笔画动画绘制，不引入 fabric/konva                                                                                                                                                                                                                       |
| **pdfjs-dist** / **mammoth**                                                                          | 用户上传 PDF / docx 资料的文本抽取（按需动态 import）                                                                                                                                                                                                                          |

### 2.4 状态与数据

| 技术                          | 用在什么功能上                                                                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zustand 5**                 | 跨页面客户端状态：`lessonStore`（当前课程）、`playbackStore`（播放状态机）、`settingsStore`（模型/语音/主题/语言）、`traceStore`（agent trace 收集） |
| **Immer**                     | 与 Zustand 配合做不可变更新。Lesson/Scene/Action 是深层嵌套结构，编辑器（Phase 3）和播放引擎的 reducer 必须用 Immer 避免手写深拷贝                   |
| **Dexie** (IndexedDB)         | 本地持久化：① 草稿 Lesson ② 会话历史 ③ API Key 加密存储（Phase 1-2） ④ 角色库 ⑤ TTS 音频缓存。阶段 3 引入服务端持久化后，Dexie 作为离线层保留        |
| **react-hook-form** + **zod** | 设置弹窗表单（模型配置、语音配置、角色自定义）、测验 (`InteractAction`) 用户作答表单                                                                 |
| **next-intl**                 | UI 文案 i18n，默认 `zh-CN` / `en-US`                                                                                                                 |

## 3. 服务端 / API

| 技术                                    | 用在什么功能上                                                                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Next.js Route Handlers** (`app/api/`) | 所有后端端点：`/api/generate/outline`、`/api/generate/scene`、`/api/generate/action`、`/api/chat`、`/api/tts`、`/api/export` |
| **SSE** (通过 `ReadableStream`)         | 流式返回生成进度（大纲、Scene、Action）；与 Vercel AI SDK 的 stream 协议对齐                                                 |
| **zod**                                 | Route Handler 入参校验、LLM 结构化输出校验                                                                                   |
| **pino**                                | 结构化日志，生产 JSON 输出，带 request-id                                                                                    |
| **Drizzle ORM** + SQLite/Postgres       | (Phase 3+) Lesson / Trace / User 持久化                                                                                      |
| **auth.js (next-auth)**                 | (Phase 4) 身份系统、OAuth、SSO/SAML                                                                                          |
| **对象存储** (S3 兼容，开发用 MinIO)    | (Phase 3+) TTS 音频、用户上传图片、导出的 HTML/PPTX                                                                          |

## 4. AI / Agent 核心

> **重要变更**：不再自写 LLM Provider 抽象。统一用 **Vercel AI SDK** 作为多模型接入层，LangGraph/LangChain 在其之上做编排。

### 4.1 分层

```
┌───────────────────────────────────────────────┐
│  LangGraph (多 Agent 编排、状态图、checkpoint) │
├───────────────────────────────────────────────┤
│  LangChain Core (Runnable、PromptTemplate、   │
│                 Output Parser、Tool calling)  │
├───────────────────────────────────────────────┤
│  Vercel AI SDK (generateText / streamText /   │
│                 generateObject / tool)        │
├───────────────────────────────────────────────┤
│  Providers: @ai-sdk/anthropic, @ai-sdk/openai,│
│             @ai-sdk/google, @ai-sdk/deepseek, │
│             本地模型 (openai-compatible)      │
└───────────────────────────────────────────────┘
```

### 4.2 逐项说明

| 技术                                   | 用在什么功能上                                                                                                                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LangGraph** (`@langchain/langgraph`) | 多节点 Agent 编排：`outline_agent`（plan→draft→critique→finalize）、`scene_agent`（per scene 的并行生成）、`action_agent`（把 Scene 编成 Action 列表）、`discuss_agent`（多角色轮流发言）。状态图、checkpoint、恢复重试都靠它 |
| **LangChain Core** (`@langchain/core`) | 基础原语：`Runnable` 组合、`PromptTemplate`、`StructuredOutputParser`、工具调用封装。在 Agent 节点内部使用，不直接暴露给 UI                                                                                                   |
| **Vercel AI SDK** (`ai`)               | ① 统一多模型接入，`generateObject` 生成 Lesson / Scene / Action 的结构化 JSON（用 zod schema 校验） ② `streamText` 流式生成讲稿 ③ `useChat` / `useCompletion` 前端 hooks 直接接 SSE ④ 工具调用（web search、检索）            |
| **Provider 包**                        | `@ai-sdk/anthropic` (默认，Claude Sonnet/Opus 4.6) / `@ai-sdk/openai` / `@ai-sdk/google` (Gemini) / `@ai-sdk/deepseek` / `@ai-sdk/openai-compatible`（本地 vLLM / Ollama / LM Studio）                                        |
| **Prompt 管理**                        | `packages/prompts/`，每个 prompt 一个 `.ts` 文件带 `version` 常量；配合 `LangChain PromptTemplate` 或 AI SDK 直接拼接                                                                                                         |
| **向量检索** (Phase 2+)                | `@lancedb/lancedb` 本地或 `pgvector`，用于用户上传资料的 RAG                                                                                                                                                                  |

### 4.3 默认模型

| 用途                              | 默认 provider / 模型                                     |
| --------------------------------- | -------------------------------------------------------- |
| 大纲生成（重编排）                | Anthropic · `claude-opus-4-6`                            |
| Scene / Action 生成（量大、要快） | Anthropic · `claude-sonnet-4-6`                          |
| 讨论 / 课堂内对话                 | Anthropic · `claude-sonnet-4-6`                          |
| 测验评分                          | Anthropic · `claude-haiku-4-5-20251001`                  |
| 备选                              | `gpt-5`、`gemini-2.5-pro`、`deepseek-chat`，以及本地模型 |

用户可在首页"模型配置"弹窗 (`01-首页-配置模型.png`) 覆盖默认值。

## 5. TTS / ASR

| 技术                         | 用在什么功能上                                        |
| ---------------------------- | ----------------------------------------------------- |
| **自写 `packages/tts`** 抽象 | 统一 TTSProvider/ASRProvider 接口，业务只依赖接口     |
| **Web Speech API** (MVP)     | Phase 1 免费占位；`SpeechAction` 的朗读、用户语音输入 |
| **OpenAI TTS / MiniMax TTS** | Phase 2 接入，走流式 audio chunk                      |
| **Whisper** / **OpenAI ASR** | Phase 2 用户举手提问的语音识别                        |

## 6. 工具链

| 项        | 选择                                            | 备注                                    |
| --------- | ----------------------------------------------- | --------------------------------------- |
| Lint      | **ESLint 9** flat config + `@typescript-eslint` |                                         |
| Format    | **Prettier 3** + `prettier-plugin-tailwindcss`  |                                         |
| 单元测试  | **Vitest**                                      | 数据模型转换、播放状态机、prompt parser |
| 组件测试  | **Testing Library**                             | UI 叶子组件                             |
| E2E       | **Playwright**                                  | Phase 2 接入，覆盖「生成 → 播放」主流程 |
| Git hooks | **simple-git-hooks** + `lint-staged`            |                                         |
| CI        | GitHub Actions                                  | Phase 2 接入                            |

## 7. 目录与命名约定

- 文件名：组件 PascalCase.tsx，其他 kebab-case.ts
- 一个组件一个文件；`index.ts` 只做 re-export
- 业务逻辑放 `features/<domain>/`，通用 UI 放 `packages/ui/`
- 所有跨包共享类型走 `packages/types/`
- `"use client"` 仅打在真正需要交互的叶子组件

## 8. 依赖治理

- 新增依赖必须：
  1. 先改本文件说明理由 + 标注"用在什么功能上"
  2. PR 中 commit `pnpm-lock.yaml`
  3. 前端依赖 gzip > 100KB 必须写明豁免理由（ECharts、ProseMirror、@xyflow/react 已豁免，因为它们是核心可视化依赖）
- **禁止加的东西**（无豁免理由不准）：
  - 其他 CSS 方案（styled-components / emotion / CSS Modules）
  - 其他状态库（Redux / Jotai / MobX / Recoil）—— Zustand + Immer 已足够
  - 其他富文本编辑器（Slate / Lexical / Quill）—— 统一 Tiptap（ProseMirror）
  - 直接 import `prosemirror-view` / `prosemirror-state` 等底层包到业务代码 —— 必须走 `@tiptap/react`，PM 扩展点放 `packages/ui/src/editor/`
  - 其他图表库（Chart.js / Recharts / Visx）—— 统一 ECharts
  - 其他流程图库（React Flow 旧包 / GoJS / mermaid-react）—— 统一 @xyflow/react
  - 自写的 LLM provider 客户端 —— 统一走 Vercel AI SDK
  - ORM 之外的 DB client（raw pg / mysql2）
  - Moment.js（用 `date-fns`）
  - Lodash（用原生 + 少量自写 util）

## 9. 环境变量

`.env.local`（开发）/ `.env.production`。所有 env 必须在 `apps/web/src/env.ts` 用 `zod` 声明 + 校验。

```
# LLM providers (Vercel AI SDK 会自动读取对应环境变量)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
DEEPSEEK_API_KEY=
# 本地模型（openai-compatible）
LOCAL_LLM_BASE_URL=
LOCAL_LLM_API_KEY=

# TTS
OPENAI_TTS_KEY=
MINIMAX_API_KEY=

# App
NEXT_PUBLIC_APP_NAME=AIClassRoom
NEXT_PUBLIC_DEFAULT_LOCALE=zh-CN
```

**原则**：前端可见的 env 必须以 `NEXT_PUBLIC_` 开头；Key 类从不出现在客户端 bundle。

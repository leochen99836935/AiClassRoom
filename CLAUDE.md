# AIClassRoom — Claude Code 工作手册

本项目是**文档驱动（Doc-Driven / Vibe Coding）**的企业级 AI 互动课堂产品。所有代码最终都由 AI 基于 `docs/` 下的规范生成与维护。**文档是唯一真相来源，代码是文档的投影。**

## 黄金规则

1. **先读文档，再写代码**。在动任何代码之前，先阅读本文件 + `docs/PRD.md` + `docs/ARCHITECTURE.md` + `docs/data-model.md`，以及相关模块的 `docs/specs/*.md`。
2. **先写规范，再写实现**。新功能必须先在 `docs/specs/<feature>.md` 写清楚：用户故事、输入/输出、数据结构、状态机、验收标准。规范合并后才能写代码。
3. **代码必须可追溯到规范**。每个模块/函数的 doc comment 头部写 `@spec docs/specs/<feature>.md#<anchor>`。
4. **规范变更优先级高于代码**。发现代码与规范不一致时，先改规范、再改代码；不要反过来。
5. **不做规范外的"改进"**。想加功能？先去提 spec PR。

## 项目结构

```
AIClassRoom/
├── CLAUDE.md                # 本文件，项目工作手册
├── docs/                    # 文档即规范（Source of Truth）
│   ├── PRD.md               # 产品需求
│   ├── ARCHITECTURE.md      # 架构、模块、数据流
│   ├── data-model.md        # Lesson / Scene / Action 等核心数据结构
│   ├── tech-stack.md        # 技术栈选型与约定
│   ├── PLAN.md              # 分阶段开发计划
│   └── specs/               # 每个功能的详细规范
│       ├── _template.md
│       └── ...
├── .claude/
│   ├── images/              # 产品参考图（设计稿/线框）
│   └── commands/            # 项目级 slash commands（后续添加）
├── apps/
│   └── web/                 # Next.js 16 主应用
├── packages/                # 共享包（UI / types / agents / prompts）
└── ...
```

## 技术栈（权威列表见 docs/tech-stack.md）

**前端全栈**

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5 strict** + **Tailwind CSS 4**
- **Radix UI** + **shadcn/ui**（通用组件） + **lucide-react** + **framer-motion**
- **ProseMirror（统一通过 Tiptap 封装：`@tiptap/react` + `@tiptap/pm` + `@tiptap/starter-kit`）** —— 笔记/讲稿/Scene 编辑器富文本；业务代码**禁止直接 import `prosemirror-*`**，所有入口走 `@tiptap/react`，底层扩展集中在 `packages/ui/src/editor/`
- **ECharts** —— Slide 数据图表、用量看板
- **@xyflow/react** —— 课程大纲流程图、Agent trace DAG、Scene 结构编辑器
- **Zustand + Immer** —— 跨页面状态（lesson/playback/settings/trace）
- **Dexie (IndexedDB)** —— 本地持久化：草稿、角色库、API Key 加密存储、TTS 缓存
- **react-hook-form + zod** —— 表单与 schema 校验
- **next-intl** —— i18n（zh-CN / en-US）

**AI Agent 核心**

- **LangGraph** + **LangChain Core** —— 多 Agent 状态图编排（outline / scene / action / discuss）
- **Vercel AI SDK (`ai`)** —— 统一多 provider LLM 接入层（`generateObject` / `streamText`）
- Providers: `@ai-sdk/anthropic` (默认, Claude Sonnet/Opus 4.6) / `@ai-sdk/openai` / `@ai-sdk/google` / `@ai-sdk/deepseek` / `@ai-sdk/openai-compatible`（本地模型）
- 所有 LLM 调用必须走 `packages/llm`，**禁止业务代码直接 import `@ai-sdk/*`**
- 所有 prompt 走 `packages/prompts`，**禁止内联长 prompt**

**基础设施**

- **pnpm workspaces** monorepo
- 语音：`packages/tts` 抽象（MVP Web Speech API → Phase 2 OpenAI TTS / MiniMax）

## 工作流（Claude Code 在本仓库中的默认动作）

**当收到一个需求时：**

1. 判断是否已有对应 spec（`docs/specs/`）。
   - 有 → 按 spec 实现，遇到歧义停下来问用户。
   - 无 → 先用 `docs/specs/_template.md` 生成 spec draft，等用户确认后再写代码。
2. 代码变更前运行 `pnpm lint && pnpm typecheck`（配置好之后），变更后再跑一次。
3. 每完成一个 spec，在 `docs/PLAN.md` 的对应阶段勾选。
4. 不要一次性做跨多个 spec 的大改动；一个 PR 对应一个 spec。

## 代码约定

- **严格 TypeScript**：`strict: true`，禁止 `any`（只能用 `unknown` + 类型守卫）。
- **服务端与客户端边界清晰**：`"use client"` 只加在最小必要的叶子组件上。
- **状态管理**：跨页面状态 → Zustand store（放 `apps/web/src/stores/`）；局部状态 → `useState`。
- **Prompt 作为代码管理**：所有 LLM prompt 放 `packages/prompts/` 并带版本号，禁止在业务代码里内联长 prompt。
- **数据结构定义**：核心领域类型（Lesson/Scene/Action 等）统一放 `packages/types/`，前后端共享。
- **API 路由**：使用 Next.js Route Handlers，放 `apps/web/src/app/api/`，每个 handler 在文件顶部注释 `@spec`。
- **UI 文本国际化**：用 `next-intl`（或规范中指定的方案），默认支持 `zh` / `en`。
- **禁止**：未经规范批准的第三方依赖；绕过 `strict` 的类型断言；在 UI 组件里直接调 LLM。

## 与文档/图纸协作

- 线框稿/UI 参考在 `.claude/images/`，文件名已按页面编号。
- 实现 UI 前先读对应图（例如 `01-首页.png`），并在 spec 里贴出图片路径。
- 发现图与 PRD 文字描述不一致时 → 停下来问，不要自行决定。

## 不要做的事

- 不要猜测 API Key 或把 Key 写进代码/commit。
- 不要自作主张引入新框架（Redux / tRPC / Prisma / 等等）。如需引入，先改 `docs/tech-stack.md`。
- 不要一次 refactor 多个不相关模块。
- 不要写 README 式的注释堆砌；注释只写"为什么"，"是什么"让类型和命名讲。
- 不要在没跑过 typecheck 的情况下声称任务完成。

## 记忆与上下文

- 用户长期偏好写进 `~/.claude/projects/.../memory/`（已启用 auto memory）。
- 本项目特有的决策写进 `docs/`，不要放 memory。
- 临时任务分解用 TodoWrite，不要写进 docs。

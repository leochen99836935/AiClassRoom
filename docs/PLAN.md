# AIClassRoom — 分阶段开发计划

> 本计划按"能跑的最小闭环 → 能看的 demo → 能用的产品 → 能卖的企业版"四阶段推进。
> **每条任务都必须先写 spec，再写代码**。任务表中的 `Spec` 列就是这个 spec 在仓库里的路径。
> 每阶段有明确的 **Exit Criteria**，没达标不允许进入下一阶段。

---

## 目录

1. [阶段总览](#阶段总览)
2. [Phase 0 — Foundations](#phase-0--foundations)
3. [Phase 1 — MVP: Generate + Play](#phase-1--mvp-generate--play)
4. [Phase 2 — 丰富交互与多 Agent](#phase-2--丰富交互与多-agent)
5. [Phase 3 — 编辑、持久化、导出](#phase-3--编辑持久化导出)
6. [Phase 4 — 企业级](#phase-4--企业级)
7. [Spec 索引](#spec-索引)
8. [跨阶段依赖图](#跨阶段依赖图)
9. [落地规则 & 任务字段约定](#落地规则--任务字段约定)

---

## 阶段总览

| 阶段        | 主题                           | 关注点                                                                | 产出                                                   |
| ----------- | ------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------ |
| **Phase 0** | Foundations                    | 工具链、领域类型、LLM/存储/状态基石、一条贯通的 Hello Claude 烟囱     | 能 `pnpm dev` 启动、能从 UI 按钮调通 Claude 并渲染响应 |
| **Phase 1** | MVP: Generate + Play           | 首页输入 → 生成大纲/scene/action → 播放只含 `SPEECH`+`SLIDE` 的极简课 | 用一句话变一节可播放的课                               |
| **Phase 2** | Rich Interaction + Multi-Agent | `WRITE` / `FOCUS` / `INTERACT` / `DISCUSS`，真 TTS / ASR，用户提问    | 完整多智能体课堂体验                                   |
| **Phase 3** | Edit & Persist & Export        | 服务端持久化、Scene/Action 编辑器、PPTX/HTML 导出                     | 可交付的产品                                           |
| **Phase 4** | Enterprise                     | SSO、RBAC、审计、成本看板、容器化                                     | 可售卖的企业版                                         |

---

## 任务字段约定

每条任务是一行，字段如下：

| 字段           | 说明                                       |
| -------------- | ------------------------------------------ |
| **ID**         | 如 `P0.A-1`，阶段+子阶段+序号              |
| **Title**      | 一句话任务名                               |
| **Spec**       | 对应的 spec 文件路径（任务开工前必须写好） |
| **Deps**       | 前置任务 ID                                |
| **Artifacts**  | 这条任务完成后新增/修改的关键文件          |
| **Acceptance** | 可验证的完成标准（Given/When/Then 形式）   |
| **Risk**       | 低/中/高 + 简注                            |

---

# Phase 0 — Foundations

> **目标**：把"仓库能跑 + 调得通 Claude + 数据类型正确 + 本地能存东西"这一圈打通。完成后任何新功能都能在稳定地基上写。

## 0.A · 工具链与 monorepo

| ID            | Title                                        | Spec                                       | Deps           | Artifacts                                                                                         | Acceptance                                                                                                | Risk |
| ------------- | -------------------------------------------- | ------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---- |
| ✅ **P0.A-1** | 初始化 pnpm workspaces + 根配置              | `docs/specs/P0.A-1-monorepo-init.md`       | —              | `package.json` / `pnpm-workspace.yaml` / `.gitignore` / `.npmrc` / `.nvmrc`                       | `pnpm install` 成功，workspace 包互相可解析                                                               | 低   |
| ✅ **P0.A-2** | TypeScript strict 基线                       | `docs/specs/P0.A-2-typescript-baseline.md` | P0.A-1         | `packages/config/tsconfig.base.json` / 6 个 `packages/*/tsconfig.json` + `apps/web/tsconfig.json` | `pnpm -r typecheck` 全绿；6 个 packages 跑 `tsc --noEmit`，apps/web 暂为 `echo skip`（P0.C-1 切换）       | 低   |
| ✅ **P0.A-3** | ESLint 9 flat + Prettier + 规则集            | `docs/specs/P0.A-3-lint-format.md`         | P0.A-2         | `eslint.config.mjs` / `.prettierrc.json` / `.prettierignore` / `.editorconfig`                    | `pnpm lint` + `pnpm format:check` 全绿；`no-explicit-any` 与 `consistent-type-imports` 反向验收通过       | 低   |
| ✅ **P0.A-4** | Vitest 基线（Testing Library 延后到 P0.C-1） | `docs/specs/P0.A-4-vitest-baseline.md`     | P0.A-2         | 根 `vitest.config.ts` / 6 个 `packages/*/src/index.test.ts` smoke 测试                            | `pnpm -r test` 全绿（6 个包 1 passed / 2 skip）；反向验收 AC-3（断言失败）+ AC-4（`passWithNoTests`）通过 | 低   |
| **P0.A-5**    | `pnpm check` 聚合命令 + Git hooks            | `docs/specs/P0.A-5-check-and-hooks.md`     | P0.A-3, P0.A-4 | `package.json` scripts / `simple-git-hooks` + `lint-staged` 配置                                  | 一条 `pnpm check` 串起 lint+typecheck+test                                                                | 低   |

## 0.B · 核心 packages 骨架

| ID         | Title                                                        | Spec                                      | Deps   | Artifacts                                                                                 | Acceptance                                                                                                          | Risk                       |
| ---------- | ------------------------------------------------------------ | ----------------------------------------- | ------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **P0.B-1** | `packages/types` — 按 data-model.md 落地所有领域类型         | `docs/specs/P0.B-1-domain-types.md`       | P0.A-2 | `packages/types/src/{lesson,role,scene,slide,action,trace,playback}.ts` + `index.ts`      | 所有 `data-model.md` 中的 interface 都有 TS 对应；`pnpm typecheck` 全绿                                             | 中（类型是后续一切的地基） |
| **P0.B-2** | `packages/prompts` — 目录约定 + 版本常量 + 第一条示例 prompt | `docs/specs/P0.B-2-prompts-convention.md` | P0.A-2 | `packages/prompts/src/_convention.md` + `hello.ts`                                        | 每个 prompt 文件导出 `{version, template}`；禁止内联业务长 prompt                                                   | 低                         |
| **P0.B-3** | `packages/llm` — Vercel AI SDK 薄封装                        | `docs/specs/P0.B-3-llm-sdk-wrapper.md`    | P0.B-1 | `packages/llm/src/{resolveModel,generateStructured,stream,trace}.ts`                      | 暴露 `resolveModel(cfg)` / `generateStructured(schema,prompt,cfg)` / `stream(messages,cfg)`；每次调用写 TraceRecord | **中** — 这层写歪后面全歪  |
| **P0.B-4** | `packages/ui` — shadcn/ui 初始组件集                         | `docs/specs/P0.B-4-ui-kit.md`             | P0.A-3 | `packages/ui/src/components/{button,input,dialog,popover,tabs,toast}.tsx` + Tailwind 预设 | 至少 6 个基础组件可被 `apps/web` 引用                                                                               | 低                         |

## 0.C · Web 应用骨架 + Hello Claude 烟囱

| ID         | Title                                                | Spec                                    | Deps           | Artifacts                                                                                                                                                                                       | Acceptance                                                                                                                | Risk                               |
| ---------- | ---------------------------------------------------- | --------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **P0.C-1** | Next.js 16 空站 + Tailwind 4 + shadcn                | `docs/specs/P0.C-1-nextjs-bootstrap.md` | P0.B-4         | `apps/web/src/app/{layout.tsx,page.tsx,globals.css}` / `next.config.ts` / `tailwind.config.ts`；**把 `apps/web/package.json` 的 `typecheck` 从 `echo skip` 切到 `tsc --noEmit`**（P0.A-2 欠账） | `pnpm dev` 启动，`/` 渲染 "AIClassRoom"；暗黑模式 toggle 可用；`pnpm --filter web typecheck` 全绿                         | 低                                 |
| **P0.C-2** | `env.ts` zod 校验 + settings Zustand store 骨架      | `docs/specs/P0.C-2-env-and-settings.md` | P0.C-1         | `apps/web/src/env.ts` + `apps/web/src/stores/settings-store.ts`                                                                                                                                 | 缺 env 启动即报错；settings store 能读写默认值                                                                            | 低                                 |
| **P0.C-3** | Dexie 本地 DB schema v1                              | `docs/specs/P0.C-3-dexie-schema.md`     | P0.C-1         | `apps/web/src/lib/db.ts` 含表：`drafts` / `lessons` / `apiKeys` / `traces`                                                                                                                      | 打开页面后 IndexedDB 中可见空表；升级脚手架就位                                                                           | 低                                 |
| **P0.C-4** | `POST /api/hello` + `/hello` 页面 —— **端到端烟囱**  | `docs/specs/P0.C-4-hello-claude.md`     | P0.B-3, P0.C-2 | `apps/web/src/app/api/hello/route.ts` + `apps/web/src/app/hello/page.tsx`                                                                                                                       | **Given** 填好 `ANTHROPIC_API_KEY`，**When** 点按钮，**Then** 页面流式显示 Claude 回复 + trace panel 显示一条 TraceRecord | **中** — 第一次跑通 ai-sdk + trace |
| **P0.C-5** | Zustand stores 占位（lesson / playback / trace）     | `docs/specs/P0.C-5-stores-skeleton.md`  | P0.B-1, P0.C-2 | `apps/web/src/stores/{lesson-store,playback-store,trace-store}.ts`                                                                                                                              | 每个 store 有完整 TypeScript shape + 空 action；配合 Immer middleware                                                     | 低                                 |
| **P0.C-6** | `pnpm check` + `pnpm dev` 在 CI 冒烟（本地等价脚本） | `docs/specs/P0.C-6-local-ci.md`         | P0.A-5, P0.C-4 | `scripts/ci-local.sh`                                                                                                                                                                           | 本地跑 `./scripts/ci-local.sh` 全绿                                                                                       | 低                                 |

## Phase 0 Exit Criteria

- [ ] `pnpm install && pnpm dev` 能跑起来；`/` 显示 AIClassRoom 首页占位
- [ ] `/hello` 页面可调通 Claude，UI 流式展示回复，trace panel 显示调用元信息
- [ ] `pnpm check` 全绿（lint + typecheck + 至少 3 个单测：types 校验、trace 收集、env 校验）
- [ ] `packages/types` 完整表达 `data-model.md`；`packages/llm` 是业务代码访问 LLM 的唯一入口
- [ ] Dexie 本地表已建立，API Key 可加密存入（Phase 1 再实现 UI）

## Phase 0 风险

| 风险                                                     | 应对                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Next.js 16 + React 19 + Tailwind 4 + shadcn 版本兼容问题 | `P0.C-1` spec 里锁死版本号，发现问题立刻回退到上一个工作组合              |
| Vercel AI SDK 与 LangGraph JS 版本不兼容                 | Phase 0 **不**接入 LangGraph；仅 AI SDK。LangGraph 留到 Phase 1 的 P1.B-3 |
| Dexie 在 SSR 下初始化踩坑                                | DB 只在 `"use client"` 组件中动态 import                                  |

---

# Phase 1 — MVP: Generate + Play

> **目标**：从首页输入一句话，经过"生成大纲 → 生成 scene → 生成 action"三步流水线，得到一节仅含 `SPEECH` + `SLIDE` 两种 Action 的极简课，并能在课堂页顺序播放（Web Speech API 朗读）。
>
> **不在 Phase 1 范围**：白板、讨论、测验、FOCUS、云 TTS、导出、持久化上传、用户系统、自定义角色。

## 1.A · 首页与设置

| ID         | Title                                    | Spec                                  | Deps                   | Artifacts                                                                                | Acceptance                                                           | Risk |
| ---------- | ---------------------------------------- | ------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---- |
| **P1.A-1** | 首页布局（输入框 + 右上角工具栏占位）    | `docs/specs/P1.A-1-home-layout.md`    | P0.C-1                 | `apps/web/src/features/home/*` 参考图：`01-首页.png`                                     | 页面居中大 logo + 输入框；提交事件透传到 store                       | 低   |
| **P1.A-2** | 语言切换 zh-CN / en-US                   | `docs/specs/P1.A-2-i18n-switch.md`    | P1.A-1                 | `messages/zh-CN.json` + `messages/en-US.json` + `next-intl` 配置                         | 切换后页面文案刷新；localStorage 保留选择                            | 低   |
| **P1.A-3** | 主题切换 light / dark                    | `docs/specs/P1.A-3-theme-switch.md`   | P1.A-1                 | `theme-provider.tsx` + Tailwind theme tokens                                             | 切换后页面配色变化；跟随系统选项                                     | 低   |
| **P1.A-4** | 设置弹窗 — 模型配置                      | `docs/specs/P1.A-4-settings-model.md` | P1.A-1, P0.C-2, P0.C-3 | `features/home/settings/model-config.tsx` 参考图：`01-首页-配置模型.png`                 | 能选 provider+model+填 key，存进 Dexie 加密存储，settings store 同步 | 中   |
| **P1.A-5** | 设置弹窗 — 语音配置（MVP 仅 Web Speech） | `docs/specs/P1.A-5-settings-voice.md` | P1.A-4                 | `features/home/settings/voice-config.tsx` 参考图：`01-首页-语音配置.png`                 | 下拉可选浏览器音色；保存到 settings store                            | 低   |
| **P1.A-6** | 设置弹窗 — 角色选择（固定角色库）        | `docs/specs/P1.A-6-role-picker.md`    | P1.A-1                 | `features/home/roles/role-library.ts` + `role-picker.tsx` 参考图：`01-首页-角色选择.png` | 可勾选 5 位（1 老师 + 4 学生）；默认一组；存 settings store          | 低   |

## 1.B · 生成流水线

| ID         | Title                                                                                                                 | Spec                                           | Deps              | Artifacts                                                                        | Acceptance                                                                                                                                                                            | Risk                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **P1.B-1** | `/api/generate/outline` Route Handler（SSE）                                                                          | `docs/specs/P1.B-1-api-outline.md`             | P0.B-3, P0.B-1    | `apps/web/src/app/api/generate/outline/route.ts`                                 | 流式返回符合 `Lesson` schema 的骨架（含 N 个空 Scene）；zod 校验通过                                                                                                                  | 中                                   |
| **P1.B-2** | `outline_agent` 最小版                                                                                                | `docs/specs/P1.B-2-outline-agent.md`           | P1.B-1            | `packages/agents/src/outline/*` + `packages/prompts/src/outline.ts`              | 节点：plan → draft → finalize；产出 `{title, description, scenes:[{title,summary,learningGoals}]}`；可复现（相同输入结果稳定）                                                        | **高** — prompt 工程是生成质量的关键 |
| **P1.B-3** | 引入 LangGraph JS + 状态图封装                                                                                        | `docs/specs/P1.B-3-langgraph-setup.md`         | P1.B-2            | `packages/agents/src/graph.ts`                                                   | outline_agent 跑在 LangGraph 里；每个节点产出写入 trace                                                                                                                               | 中                                   |
| **P1.B-4** | `/api/generate/scene` + `scene_agent` 最小版（单 scene 一个 slide + 一段讲稿）                                        | `docs/specs/P1.B-4-scene-agent.md`             | P1.B-3            | `apps/web/src/app/api/generate/scene/route.ts` + `packages/agents/src/scene/*`   | 给一个 Scene 产出 1 个 Slide（title + bullet list）+ 1 段 draft 讲稿                                                                                                                  | 高                                   |
| **P1.B-5** | `/api/generate/action` + `action_agent` 最小版                                                                        | `docs/specs/P1.B-5-action-agent.md`            | P1.B-4            | `apps/web/src/app/api/generate/action/route.ts` + `packages/agents/src/action/*` | 产出 `[SlideAction(show), SpeechAction(text)]` 合法序列，通过 invariants 校验                                                                                                         | 高                                   |
| **P1.B-6** | 生成进度页 — 大纲 & 动作两步 loading                                                                                  | `docs/specs/P1.B-6-generation-loading.md`      | P1.B-1, P1.B-5    | `features/generate/outline-loading.tsx`, `action-loading.tsx` 参考图：`03`/`04`  | 状态条 + "查看详情"展开 trace                                                                                                                                                         | 低                                   |
| **P1.B-7** | 角色确认页（展示从角色库取出的 5 位，**不做 AI 生成**）                                                               | `docs/specs/P1.B-7-role-confirmation.md`       | P1.A-6, P1.B-2    | `features/generate/role-confirmation.tsx` 参考图：`02-课堂角色.png`              | 横向 5 张卡展示本次课堂角色（来源：用户在 P1.A-6 勾选 / 默认组）；"继续"按钮进下一步；Phase 1 无 AI 生成按钮                                                                          | 低                                   |
| **P1.B-8** | 生成流水线编排：**渐进式进入课堂**（home 提交 → outline → 第 1 个 Scene 就绪即跳转 → 剩余 Scene 后台并发生成 + 推流） | `docs/specs/P1.B-8-generation-orchestrator.md` | P1.B-1..7, P1.C-2 | `features/generate/orchestrator.ts` + `features/generate/background-stream.ts`   | **Given** 用户在首页提交，**When** outline + 首个 Scene action 就绪，**Then** 跳转课堂；剩余 Scene 在后台 SSE 持续推送到 `lessonStore`；任一阶段失败弹错误 + 重试按钮；保留已生成部分 | 高                                   |

## 1.C · 课堂播放

| ID         | Title                                                          | Spec                                          | Deps           | Artifacts                                                                                            | Acceptance                                                                                                                                                                             | Risk                             |
| ---------- | -------------------------------------------------------------- | --------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **P1.C-1** | 课堂页布局骨架                                                 | `docs/specs/P1.C-1-classroom-layout.md`       | P0.C-1         | `apps/web/src/app/(app)/classroom/[id]/page.tsx` + `features/classroom/layout.tsx` 参考图：`05`/`06` | 左 scene 列表 / 中 slide + 字幕 / 底部控制 / 右 tab                                                                                                                                    | 中                               |
| **P1.C-2** | `playback-store` reducer + 状态机                              | `docs/specs/P1.C-2-playback-state-machine.md` | P0.C-5, P0.B-1 | `apps/web/src/stores/playback-store.ts` + `*.test.ts`                                                | 状态转换：idle→loading→ready→playing⇄paused→finished；Vitest 覆盖所有转换                                                                                                              | 中                               |
| **P1.C-3** | Playback Engine 骨架 + executor 注册表 + **未就绪 Scene 占位** | `docs/specs/P1.C-3-playback-engine.md`        | P1.C-2         | `features/classroom/playback/engine.ts` + `executors/index.ts`                                       | 支持注册 `ActionExecutor`，tick 按序执行；空 Action 列表不 crash；遇到 `Scene.status === "pending" \| "generating"` 时显示"生成中…"占位并轮询；`failed` 显示"重试"；`ready` 后无缝继续 | 中                               |
| **P1.C-4** | `SpeechAction` executor（Web Speech API）+ 字幕                | `docs/specs/P1.C-4-speech-executor.md`        | P1.C-3         | `features/classroom/playback/executors/speech.ts` + `components/subtitle.tsx`                        | 播放时 TTS 朗读 + 字幕同步高亮；暂停/继续有效                                                                                                                                          | **中** — Web Speech API 平台差异 |
| **P1.C-5** | `SlideAction` executor + Slide 渲染组件                        | `docs/specs/P1.C-5-slide-executor.md`         | P1.C-3         | `features/classroom/slide/slide-renderer.tsx` + `executors/slide.ts`                                 | `show` / `next` / `prev` / `goto` 都工作；支持 `title` / `content` 两种 layout                                                                                                         | 低                               |
| **P1.C-6** | 播放控制条（prev / play / next / speed）                       | `docs/specs/P1.C-6-playback-controls.md`      | P1.C-3         | `features/classroom/playback/controls.tsx`                                                           | 按钮事件正确转发到 playback store；倍速影响 TTS rate                                                                                                                                   | 低                               |
| **P1.C-7** | Scene 列表侧边栏 + 跳转 + **生成状态徽章**                     | `docs/specs/P1.C-7-scene-sidebar.md`          | P1.C-1         | `features/classroom/sidebar/scene-list.tsx`                                                          | 点击任一 ready scene 立刻 seek 到其首个 action；pending scene 显示进度旋转图标且禁用点击；failed scene 显示"重试"按钮                                                                  | 低                               |

## 1.D · 健壮性与观测

| ID         | Title                                                      | Spec                                    | Deps                   | Artifacts                              | Acceptance                                       | Risk |
| ---------- | ---------------------------------------------------------- | --------------------------------------- | ---------------------- | -------------------------------------- | ------------------------------------------------ | ---- |
| **P1.D-1** | Trace panel — 开发模式默认展开                             | `docs/specs/P1.D-1-trace-panel.md`      | P0.B-3, P0.C-5         | `features/dev/trace-panel.tsx`         | 每次 LLM 调用实时追加一条；可展开看 input/output | 低   |
| **P1.D-2** | 生成失败 UI + 自动重试（指数退避 2 次）                    | `docs/specs/P1.D-2-generation-retry.md` | P1.B-8                 | `features/generate/error-boundary.tsx` | 显示错误原因 + "查看 trace" + "换模型重试"       | 中   |
| **P1.D-3** | 核心单测：data-model 不变量 / playback 状态机 / trace 收集 | `docs/specs/P1.D-3-core-tests.md`       | P0.B-1, P1.C-2, P0.B-3 | `*.test.ts`                            | 至少 15 个测试用例；`pnpm test` 全绿             | 低   |
| **P1.D-4** | Demo 录屏归档                                              | —                                       | 所有上述任务           | `docs/demos/phase1.mp4`                | 一条 < 2 分钟的端到端演示                        | 低   |

## Phase 1 Exit Criteria

- [ ] 输入「量子计算入门」（中文）或 "Intro to quantum computing"（英文），**60 秒内**进入课堂（"进入课堂"= 大纲完成 + 第 1 个 Scene 的 actions 已就绪可播）
- [ ] 进入课堂后剩余 Scene 在后台**继续生成**，已就绪的 Scene 在侧边栏即点即播；未就绪的 Scene 显示生成进度
- [ ] 课堂能按顺序自动播放 ≥ 3 个 Scene，每个 Scene 有 slide + TTS 讲解
- [ ] 播放控制：暂停/继续/上一步/下一步/倍速（0.5x/1x/1.5x/2x）全部工作
- [ ] 所有 agent 调用在 trace panel 可见
- [ ] `pnpm check` 全绿
- [ ] 至少一条 demo 视频归档

> **关于 60 秒预算**：90s → 60s 的关键差别不是"模型变快"，而是"不再等所有 Scene 都生成完才进课堂"。
> P1.B-8 的 orchestrator 必须实现**渐进式进入**：outline 完成 → 第 1 个 Scene 的 action 完成 → 立刻跳转到 `/classroom/[id]`，剩余 Scene 在 background fetch 持续推送。
> 这同时降低了感知耗时和"卡在 loading 屏"的失败风险。

## Phase 1 风险

| 风险                                        | 应对                                                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| LLM 生成质量不稳定（结构化输出偏离 schema） | 所有 agent 出口用 `generateObject` + zod 校验；失败自动重试；prompt 迭代在 spec 中记录版本                |
| 60s 预算过紧                                | 渐进式进入课堂（P1.B-8）+ scene_agent 并发；模型默认走 sonnet 而非 opus；首屏只等 outline + 第 1 个 Scene |
| 后台生成失败导致用户播到一半卡住            | playback engine 遇未就绪 Scene 时显示 "生成中…" 占位 + 自动重试；P1.D-2 错误边界可手动重试                |
| Web Speech API 在某些浏览器不可用           | P1.C-4 做降级：纯字幕模式                                                                                 |
| LangGraph JS API 不稳                       | 如卡住超过 2 天，改成自写 sequential runner；LangGraph 延后到 P2                                          |

---

# Phase 2 — 丰富交互与多 Agent

> **目标**：把 Action 系统从 2 种扩到 7 种，接入真 TTS/ASR，支持用户举手提问，完善角色系统与资料上传。

## 2.A · Action 系统扩展

| ID         | Title                                             | Spec                                    | Deps   |
| ---------- | ------------------------------------------------- | --------------------------------------- | ------ |
| **P2.A-1** | `FocusAction` executor + Slide 元素聚焦动画       | `docs/specs/P2.A-1-focus-action.md`     | P1.C-5 |
| **P2.A-2** | SVG 白板组件 + `WriteAction` 笔画动画             | `docs/specs/P2.A-2-whiteboard.md`       | P1.C-3 |
| **P2.A-3** | `InteractAction` quiz / open_question / poll UI   | `docs/specs/P2.A-3-interact-quiz.md`    | P1.C-3 |
| **P2.A-4** | `InteractAction` AI 评分（通过 `generateObject`） | `docs/specs/P2.A-4-interact-grading.md` | P2.A-3 |
| **P2.A-5** | `DiscussAction` 多 agent 顺序对话                 | `docs/specs/P2.A-5-discuss-action.md`   | P1.B-3 |
| **P2.A-6** | `WaitAction` + 节奏控制                           | `docs/specs/P2.A-6-wait-action.md`      | P1.C-3 |

## 2.B · 生成升级

| ID         | Title                                               | Spec                                     | Deps            |
| ---------- | --------------------------------------------------- | ---------------------------------------- | --------------- |
| **P2.B-1** | `action_agent` 升级到产出全 7 种 Action             | `docs/specs/P2.B-1-action-agent-v2.md`   | P1.B-5, P2.A-\* |
| **P2.B-2** | scene_agent 并发流水线（outline → 并发 N 个 scene） | `docs/specs/P2.B-2-scene-parallel.md`    | P1.B-8          |
| **P2.B-3** | 用户上传资料：PDF / MD / URL → Scene 上下文         | `docs/specs/P2.B-3-materials-upload.md`  | P1.B-4          |
| **P2.B-4** | Prompt 版本化 + A/B switch                          | `docs/specs/P2.B-4-prompt-versioning.md` | P0.B-2          |

## 2.C · 语音

| ID         | Title                                            | Spec                                   | Deps           |
| ---------- | ------------------------------------------------ | -------------------------------------- | -------------- |
| **P2.C-1** | `packages/tts` 正式抽象接口                      | `docs/specs/P2.C-1-tts-abstraction.md` | P1.C-4         |
| **P2.C-2** | OpenAI TTS / MiniMax TTS 实现 + 流式播放         | `docs/specs/P2.C-2-cloud-tts.md`       | P2.C-1         |
| **P2.C-3** | ASR：Web Speech → Whisper（云端）切换            | `docs/specs/P2.C-3-asr.md`             | P2.C-1         |
| **P2.C-4** | 用户举手提问 → Role 回答 → 嵌入当前 Scene 对话流 | `docs/specs/P2.C-4-raise-hand.md`      | P2.C-3, P2.A-5 |

## 2.D · UI/UX 完善

| ID         | Title                                   | Spec                                    | Deps   |
| ---------- | --------------------------------------- | --------------------------------------- | ------ |
| **P2.D-1** | 角色介绍浮层                            | `docs/specs/P2.D-1-role-popover.md`     | P1.B-7 |
| **P2.D-2** | 右侧"笔记 / 对话 / 任务" Tab            | `docs/specs/P2.D-2-right-panel-tabs.md` | P1.C-1 |
| **P2.D-3** | 用 `@xyflow/react` 展示 agent trace DAG | `docs/specs/P2.D-3-trace-dag.md`        | P1.D-1 |
| **P2.D-4** | 用 `@tiptap/react` 实现笔记编辑器       | `docs/specs/P2.D-4-notes-editor.md`     | P2.D-2 |

## Phase 2 Exit Criteria

- [ ] 一节完整课程包含 ≥ 1 次白板书写、≥ 1 次测验、≥ 1 次多 agent 讨论、≥ 2 次 FOCUS
- [ ] 用户可用语音举手提问，AI 老师能上下文相关地回答
- [ ] 支持 ≥ 3 家 LLM provider（Anthropic / OpenAI / Google 或 DeepSeek）+ 本地模型
- [ ] 端到端生成 P50 < 90s

---

# Phase 3 — 编辑、持久化、导出

## 3.A · 持久化

| ID         | Title                                    | Spec                                  | Deps   |
| ---------- | ---------------------------------------- | ------------------------------------- | ------ |
| **P3.A-1** | Drizzle + SQLite 初始化，Lesson/Trace 表 | `docs/specs/P3.A-1-drizzle-sqlite.md` | —      |
| **P3.A-2** | `/api/lessons` CRUD                      | `docs/specs/P3.A-2-lessons-api.md`    | P3.A-1 |
| **P3.A-3** | Dexie → 服务端迁移；离线层保留           | `docs/specs/P3.A-3-offline-sync.md`   | P3.A-2 |
| **P3.A-4** | "我的课程"列表页                         | `docs/specs/P3.A-4-lesson-list.md`    | P3.A-2 |

## 3.B · 编辑器

| ID         | Title                                                              | Spec                                      | Deps   |
| ---------- | ------------------------------------------------------------------ | ----------------------------------------- | ------ |
| **P3.B-1** | Scene 结构编辑器（`@xyflow/react` 流程图）                         | `docs/specs/P3.B-1-scene-graph-editor.md` | P2.D-3 |
| **P3.B-2** | Action timeline 编辑器                                             | `docs/specs/P3.B-2-action-timeline.md`    | P3.B-1 |
| **P3.B-3** | Slide WYSIWYG 编辑器（`@tiptap/react` 文本 + ECharts 图表 + 图片） | `docs/specs/P3.B-3-slide-editor.md`       | P2.D-4 |
| **P3.B-4** | 局部 regenerate：单个 Scene / 单个 Action                          | `docs/specs/P3.B-4-partial-regenerate.md` | P3.B-2 |

## 3.C · 导出

| ID         | Title                    | Spec                               | Deps   |
| ---------- | ------------------------ | ---------------------------------- | ------ |
| **P3.C-1** | PPTX 导出（`pptxgenjs`） | `docs/specs/P3.C-1-pptx-export.md` | P3.B-3 |
| **P3.C-2** | 单文件 HTML 离线导出     | `docs/specs/P3.C-2-html-export.md` | P3.B-3 |

## Phase 3 Exit Criteria

- [ ] 生成 → 编辑 → 保存 → 重开仍一致
- [ ] PPTX 可在 PowerPoint / Keynote 打开
- [ ] HTML 双击离线播放

---

# Phase 4 — 企业级

> 当产品能卖时再展开细化。当前只列主题。

| 组     | 任务主题                                                      |
| ------ | ------------------------------------------------------------- |
| 身份   | next-auth（邮箱/OAuth/SAML/SSO）                              |
| 权限   | Team / Workspace / RBAC / 审批流                              |
| 安全   | API Key 后端 KMS 加密、请求签名、防滥用                       |
| 审计   | 操作日志、导出记录、合规报表                                  |
| 观测   | OpenTelemetry + 后端 trace 持久化、成本看板（用 **ECharts**） |
| 部署   | Dockerfile、docker-compose、k8s manifest、Helm chart          |
| 多租户 | 数据隔离、配额、计费                                          |

**Exit Criteria**：通过内部安全评审 + 能在客户 VPC 单机部署 + 有运行中的审计与成本面板。

---

# Spec 索引

> 每条 PLAN 任务对应一个 spec 文件。Phase 2+ 的 spec 会在进入该阶段前细化。下面是 **Phase 0 + Phase 1 需要创建的全部 spec 文件**。

## Phase 0 specs (15)

- `docs/specs/P0.A-1-monorepo-init.md`
- `docs/specs/P0.A-2-typescript-baseline.md`
- `docs/specs/P0.A-3-lint-format.md`
- `docs/specs/P0.A-4-vitest-baseline.md`
- `docs/specs/P0.A-5-check-and-hooks.md`
- `docs/specs/P0.B-1-domain-types.md`
- `docs/specs/P0.B-2-prompts-convention.md`
- `docs/specs/P0.B-3-llm-sdk-wrapper.md`
- `docs/specs/P0.B-4-ui-kit.md`
- `docs/specs/P0.C-1-nextjs-bootstrap.md`
- `docs/specs/P0.C-2-env-and-settings.md`
- `docs/specs/P0.C-3-dexie-schema.md`
- `docs/specs/P0.C-4-hello-claude.md`
- `docs/specs/P0.C-5-stores-skeleton.md`
- `docs/specs/P0.C-6-local-ci.md`

## Phase 1 specs (25)

- `docs/specs/P1.A-1-home-layout.md`
- `docs/specs/P1.A-2-i18n-switch.md`
- `docs/specs/P1.A-3-theme-switch.md`
- `docs/specs/P1.A-4-settings-model.md`
- `docs/specs/P1.A-5-settings-voice.md`
- `docs/specs/P1.A-6-role-picker.md`
- `docs/specs/P1.B-1-api-outline.md`
- `docs/specs/P1.B-2-outline-agent.md`
- `docs/specs/P1.B-3-langgraph-setup.md`
- `docs/specs/P1.B-4-scene-agent.md`
- `docs/specs/P1.B-5-action-agent.md`
- `docs/specs/P1.B-6-generation-loading.md`
- `docs/specs/P1.B-7-role-confirmation.md`
- `docs/specs/P1.B-8-generation-orchestrator.md`
- `docs/specs/P1.C-1-classroom-layout.md`
- `docs/specs/P1.C-2-playback-state-machine.md`
- `docs/specs/P1.C-3-playback-engine.md`
- `docs/specs/P1.C-4-speech-executor.md`
- `docs/specs/P1.C-5-slide-executor.md`
- `docs/specs/P1.C-6-playback-controls.md`
- `docs/specs/P1.C-7-scene-sidebar.md`
- `docs/specs/P1.D-1-trace-panel.md`
- `docs/specs/P1.D-2-generation-retry.md`
- `docs/specs/P1.D-3-core-tests.md`

> Phase 2/3 的 spec 路径已在任务表中列出，会在进入对应阶段前由用户+Claude Code 共同起草。

---

# 跨阶段依赖图

```
             ┌───────────────────────────────────────┐
             │ Phase 0 · Foundations                  │
             │ 0.A tooling → 0.B core pkgs → 0.C web │
             │ Exit: Hello Claude 端到端烟囱          │
             └──────────────────┬────────────────────┘
                                │
                ┌───────────────┼────────────────┐
                │               │                │
                ▼               ▼                ▼
           1.A Home      1.B-1..7 Gen      1.C-1..7 Play
          (settings /   (outline/scene/   (layout/engine/
           role picker)  action agents)    executors/store)
                │               │                │
                │               │      ┌─────────┘
                │               │      │ (虚线：1.C-2 playback-store
                │               │      │  就绪后，orchestrator 才能
                │               │      │  往里推流式 Lesson 状态)
                │               ▼ ─ ─ ─▼
                │         ┌──────────────────────┐
                │         │ 1.B-8 Orchestrator   │
                │         │ (渐进式入课堂收口)    │
                │         │  deps: 1.B-1..7 +    │
                │         │        1.C-2         │
                │         └──────────┬───────────┘
                │                    │
                └────────────────────┼────────────────┐
                                     ▼                │
                             1.D Observability ◄──────┘
                                     │
                                     ▼
         ┌──────────────────────────────────────┐
         │ Phase 1 Exit: 一句话生成一节可播放的课 │
         └──────────────────┬───────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
      2.A Actions      2.C Voice          2.B Generation
         │                  │                  │
         └──────────────────┼──────────────────┘
                            ▼
                       2.D UI polish
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │ Phase 2 Exit: 完整多 agent 课堂体验   │
         └──────────────────┬───────────────────┘
                            │
                            ▼
              3.A Persist → 3.B Edit → 3.C Export
                            │
                            ▼
              Phase 4 Enterprise (auth/audit/...)
```

---

# 落地规则 & 任务字段约定

### 每条任务的工作流（**不准跳过任何一步**）

1. **写 spec**
   - 复制 `docs/specs/_template.md` 到任务 ID 对应的 spec 路径
   - 填写用户故事、数据、验收标准、失败模式
   - 找用户 review，状态从 `draft → approved`
2. **确认数据模型**
   - 如涉及新类型/字段，**先**更新 `docs/data-model.md`，再同步到 `packages/types`
3. **写实现**
   - 严格按 spec 写代码；遇到 spec 没写清楚的 → 停下来回去改 spec，不要自由发挥
   - 每个新建文件头部写 `@spec <spec 路径>`
4. **写测试**
   - 每个 spec 的 Acceptance Criteria 至少对应一个 Vitest 用例
5. **跑检查**
   - `pnpm check` 全绿才能算完成
6. **勾选 PLAN**
   - 回到本文件把对应任务的 checkbox 勾上，附 commit hash

### 不允许

- 跨 spec 的大 refactor
- 未经 spec 批准引入新依赖
- 绕过 `strict` 的类型断言
- 把"暂时能跑"当完成标准

### 允许灵活的部分

- 同一子阶段内任务可按依赖自由排序
- 在 spec 里 **明确声明** 的 TODO/Out of Scope 不算欠账

---

**下一步**：逐条 review 本计划 → 确认后进入 Phase 0.A，从第一个 spec `P0.A-1-monorepo-init.md` 开始写。

# Spec: <Feature Name>

> Copy this file to `docs/specs/<kebab-feature-name>.md` and fill it in **before** writing any code. The code must trace back to this file via `@spec` comments.

| 字段          | 值                                                      |
| ------------- | ------------------------------------------------------- |
| **Spec ID**   | `S-XXXX`                                                |
| **状态**      | draft / reviewing / approved / implemented / deprecated |
| **所属阶段**  | Phase 0 / 1 / 2 / 3 / 4                                 |
| **负责人**    | @user                                                   |
| **关联 PR**   | (填 commit hash 或 PR URL)                              |
| **依赖 spec** | (列出前置 spec ID)                                      |
| **参考图**    | `.claude/images/XX-xxx.png`                             |

---

## 1. 背景与动机

这个功能解决什么问题？为什么现在做？不做会怎样？

## 2. 用户故事

> 作为 `<角色>`, 我想要 `<做什么>`, 以便 `<获得什么价值>`。

列 1-3 条核心故事。

## 3. 范围

### 3.1 In Scope

- 明确列出本 spec 覆盖的行为

### 3.2 Out of Scope

- 明确列出 **不** 做的东西，避免后续 scope creep

## 4. UI / 交互

- 关键页面/组件的位置
- 贴上参考图路径
- 描述异常态：空态、加载态、错误态

## 5. 数据与 API

### 5.1 涉及的数据类型

引用 `docs/data-model.md`，如果需要新增/修改类型，先在本节写清楚，然后同步到 data-model.md。

### 5.2 API 端点

| 方法 | 路径       | 请求    | 响应       | 说明 |
| ---- | ---------- | ------- | ---------- | ---- |
| POST | `/api/xxx` | `{...}` | SSE stream |      |

### 5.3 Zustand store 改动

列出新增/修改的 slice、action、selector。

## 6. 算法 / 状态机

用伪代码或状态图说明核心逻辑。Action executor、生成 agent、播放状态转换等必须写清楚。

```
state_a --event_x--> state_b
state_b --event_y--> state_c
```

## 7. Prompt（如涉及 LLM）

指向 `packages/prompts/<name>.ts`；本节写 prompt 的意图 + 关键变量 + 期望输出 schema（zod）。

## 8. 失败模式

| 场景     | 系统行为                                            |
| -------- | --------------------------------------------------- |
| LLM 超时 | 重试 2 次指数退避，最终失败 → 显示 trace + 重试按钮 |
| 用户取消 | 立即停止上游 fetch，保留已生成部分                  |
| 数据无效 | 拒绝执行并标红对应 action                           |

## 9. 验收标准 (Acceptance Criteria)

用 Given / When / Then 格式，必须可自动化验证：

- **AC-1**: Given `<前置条件>`, When `<操作>`, Then `<可观察结果>`
- **AC-2**: ...

## 10. 测试计划

- Vitest 单测覆盖的函数
- 组件测试
- E2E 场景（如果有）

## 11. 非功能要求

- 性能预算
- 可访问性
- i18n 要求
- 可观测（trace / log 打点）

## 12. 迁移与兼容

涉及数据/ API 变动时写：旧数据如何迁移、是否向后兼容、要不要 feature flag。

## 13. 开放问题

列出还没确定的问题，等 review 时拉上用户定。

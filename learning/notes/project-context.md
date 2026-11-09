# 实际项目背景与学习切入点

核对日期：2026-11-10。用途：让后续 Lynx 教学贴近本人已有的 H5 / Web 工作。

## 已确认的经历边界

本人明确说明：音色列表与 Agent 主要在 H5 和 Web 开发。已有 App 内嵌 H5 与 JSBridge 协作经历，具体职责仍应按功能说明；不由目录名称、代码存在或页面在 App 内显示推定原生 UI / 原生模块开发经历。

本次找到了两个本机工程，位于 `Desktop/DFproject/`，不是当前 MyCV 仓库的子目录：

| 工程 | 阅读时 HEAD | 当前核对范围 |
| --- | --- | --- |
| `dreamface-web` | `55ca8c359` | Nuxt / Vue 依赖声明、PC / H5 Agent 共享组件、会话管理、选音与表单提交入口、事件与历史归并、相关测试条目 |
| `dreamface-mobile` | `2afcc5550` | Vue 2.7 H5 依赖声明、Agent 页面与会话恢复、共享音色选择器、网页播放器、部分 Bridge 接口 |

依据当前本地源码定向阅读；没有运行应用或测试，没有全面审计工程，也未按 Git 作者逐一确认个人贡献。下方路径均相对于各自工程根目录，供本机后续定位；文件名与细节以实际工作区为准。

## 1. 工程与运行环境

- `dreamface-web/package.json` 声明 Nuxt 3.13、Vue 3.5；PC 业务位于 `pageComponents/`，移动端 Web 实现位于 `mobile/`。这里的 TSX 是 Vue 组件写法。
- `dreamface-mobile/src/package.json` 声明 Vue 2.7；`src/src/pages/` 下是多页面 H5 入口。它包含与宿主 App 协作的代码，业务 UI 仍是网页实现。
- Web 工程内的 `mobile/` 与独立 mobile 工程分别定位。本次读取的两条 Agent 链路结构不同，不能预设功能、状态或协议处理完全一致。

## 2. Web Agent 音色卡片

阅读入口：

| 文件 | 学习用途 |
| --- | --- |
| `pageComponents/iWant/ChatStream/VoiceSelectionCard/index.tsx` | Vue 状态、展示计算、HTML audio 试听、选择事件与卸载清理 |
| `pageComponents/iWant/ChatStream/VoiceSelectionCard/useAssistantVoiceCards.ts` | 从消息读取卡片，将选择事件交给聊天上下文 |
| `pageComponents/iWant/lib/useIWantExclusiveAudio.ts` | 多个试听 / 结果播放器的互斥与注销 |
| `mobile/pageComponents/IWantMobile/ChatStream/AssistantMessage.tsx` | 移动端 Web 复用同一选音组件，并传入 mobile 展示变体 |
| `pageComponents/iWant/chat/useIWantChatContext.ts` | Vue provide / inject 的上下文依赖 |
| `pageComponents/iWant/chat/useIWantChatPage.ts` | 页面业务上下文与多会话管理的衔接 |
| `pageComponents/iWant/chat/IWantChatSessionManager.ts` | 将操作交给当前会话 |
| `pageComponents/iWant/chat/IWantChatSession.ts` | 组装选音续跑请求与更新交互状态 |

已核对的关键区别：

- 点击音色行触发网页试听，组件使用 HTML audio 的播放 / 暂停能力。
- 点击 Use 发出选择事件，由上层会话处理提交；点击 Auto Select 则提交另一种操作。
- 正在试听的音色与已确认选用的音色分别记录。点击一次行并不等于服务端已确认选择。
- PC、移动端 Web 和 Canvas 使用展示变体；共享组件不意味着所有布局与按钮行为相同。

第二课以这些状态为起点，先解释实际行为，再对照 ReactLynx 的状态更新。提问在学习中穿插，当前不要求先完成独立问答摸底。

## 3. Web / H5 问题卡片与 Agent 续跑

已阅读：

- `pageComponents/iWant/ChatStream/InteractionContents.tsx`：根据交互状态选择对应展示，将提交、跳过和重试交给会话。
- `mobile/pageComponents/IWantMobile/ClarifyQuestionCard/index.tsx`：逐题选择、自定义回答、已受理后的只读回显。
- `pageComponents/iWant/chat/IWantChatSession.ts`：交互操作入口、表单提交标识复用与续跑相关片段。
- `pageComponents/iWant/chat/applyStreamEventToRow.ts`：事件到消息状态的归并入口。
- `pageComponents/iWant/chat/voiceCardRows.ts`：历史内容中的卡片与续写展示分段。

适合教学的问题：组件收集答案、会话提交答案、服务端受理、继续输出，分别在哪一层发生？HTTP / SSE 传输状态与业务任务状态如何区分？

这些是源码阅读结论，未验证真实服务的幂等、扣费或执行保证。

## 4. mobile 工程的 H5 通用音色选择器

已阅读：

- `src/src/components/VoicePicker/index.vue`：本地选择、试听入口、确认后向上层发出结果。
- `src/src/components/VoicePicker/composables/useVoicePicker.ts`：列表数据、筛选、最近使用、缓存与用户信息读取。
- `src/src/components/VoicePicker/components/VoiceList.vue`：列表展示与选择 / 播放状态反馈。
- `src/src/hooks/useAudioPlayer.ts`：使用 Howler 的 HTML5 音频模式进行试听。

这个选择器与 Web Agent 卡片的确认流程不同：试听动作会同时记录本地选择，确认后再向上层发出选择结果。不能将它的行为直接套到 Agent 交互卡上。

这里确有 Bridge 读取用户信息、共享存储等调用，但不能据此将整份列表或试听都归为原生实现。

## 5. mobile 工程的 Agent 与宿主协作

| 文件 | 已核对的职责 |
| --- | --- |
| `src/src/pages/iWant/views/Home/index.vue` | 页面组合、可见性变化与清理入口 |
| `src/src/pages/iWant/views/Chat/composables/useAgentChatPage.ts` | 页面业务编排；区分用户停止与页面离开时断开本地连接 |
| `src/src/pages/iWant/views/Chat/composables/useAgentChat.ts` | 会话状态、历史与流式输出聚合的入口 |
| `src/src/pages/iWant/views/Chat/composables/useAgentChatResume.ts` | 前后台与连接故障后的恢复控制 |
| `src/src/dataSource/index/agentChatApi.ts` | 请求、SSE 回调与续传游标接入片段 |
| `src/src/utils/sse/` | SSE 连接模块入口与类型位置 |
| `src/src/utils/clientBridge.ts` | Bridge 接入、App 内路由与系统浏览器外跳等独立能力 |

本次未在上述 mobile Agent 入口确认到与 Web 相同的选音 / 问题表单实现；这只限定本次阅读结论，不能用于判断其他分支、版本或页面不存在该功能。

## 6. 补充阅读：异步顺序与 Canvas

- mobile：`src/src/pages/lipSync/components/VoiceSelect/latestRequestGuard.ts` 及调用点和对应测试，按已接纳的响应顺序防止旧结果覆盖新结果；不能将它机械理解为新请求一发出就丢弃所有旧响应。
- Web：`features/canvas/core/commands/CanvasCommand.ts` 将文档操作与编辑器状态操作分类，命令类型与 DOM / 输入事件分离。
- Web：`features/canvas/persistence/queue/CanvasSaveQueue.ts` 的队列、保存批次、后端操作量切分、重试批次与防抖入口。
- Web：`composables/canvas/project/useCanvasProjectSession.ts` 和 `composables/canvas/workflow/useCanvasGenerationFlow.ts` 的项目装配与 session token 检查。
- Web：相关选音与问题卡测试中的断言，包括等待用户操作时连接结束不等于任务完成、表单受理后仍等待业务完成。仅阅读测试内容，没有执行。

这些补充形成 [代码基线](../assessment.md)，用于安排机制讲解和后续项目深挖，不用于确认个人作者归属或给个人能力打分。

## 7. 教学方式调整

九节课继续按学习路线推进，每次从熟悉的 Vue 场景开始，解释一个问题，再用个人简化示例迁移到 ReactLynx。

1. 用试听与确认学习状态：先区分播放状态、本地草稿、服务端确认。
2. 用卡片向上层通知学习组件通信与职责。
3. 用停止试听、卸载与回前台恢复学习生命周期和异步清理。
4. 用事件更新、用户提交、任务续跑学习状态机与协议边界。
5. 用真正的外跳 / 存储调用学习 Bridge 与 Native Module。

学员对抽象术语的判断不替代代码理解评估。后续减少脱离实际项目的标签分类题，优先结合具体操作、状态变化和短代码讨论。当前按代码基线继续教学，在学习中收集回答和练习证据并动态调整计划，不单独发起问答摸底。

## 验证范围

仅做源码、依赖声明与现有测试条目的阅读。找到了 Web 音色、问题卡片与续跑相关测试入口，但没有执行；没有启动服务、浏览器操作、真实接口或原生代码验证。两个业务仓库未修改；MyCV 仅记录概括、阅读索引与学习安排。

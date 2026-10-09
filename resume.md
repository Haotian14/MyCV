# 骆皓天（Hart Luo）

**前端开发工程师** · React / Vue 3 / TypeScript · AIGC 产品 · 无限画布

📧 luohaotian0616@gmail.com · GitHub: [Haotian14](https://github.com/Haotian14) · 作品集: [haotian14.github.io/Portfolio](https://haotian14.github.io/Portfolio/) · LinkedIn: [hart-luo-919866392](https://www.linkedin.com/in/hart-luo-919866392)

---

## 个人简介

UNSW 计算机科学本科 + 信息技术硕士，现于同花顺担任前端开发工程师，负责海外 AIGC 产品 DreamFace 的 Web 端与管理后台。擅长复杂交互与状态建模（无限画布、文档协议、增量保存与撤销），重视可验证的工程质量（测试、性能基准、根因排查）。日常以 Claude Code + Codex 双 Agent 按任务类型分工协作，并行 review，稳定高产出（2026 年 8 月 96 个非合并提交）。

---

## 工作经历

### 同花顺 · 前端开发工程师 ｜ DreamFace（海外 AIGC 头像 / 视频 / 图片生成产品） &nbsp;&nbsp; 2026.04 – 至今

技术栈：Vue 3 · TypeScript · Woven Canvas · 管理后台 · 埋点体系 · Sonar

**无限画布（AIGC-3469）— 从可行性验证到上线的核心开发者**
- 立项前用 1 晚完成 `@woven-canvas/vue` 可行性 Demo，26 项验证得出“可用但有限制”的结论，支撑立项决策；随后从零搭建 `/canvas` 路由、画布工作区与可拖拽宽度的 Agent 对话面板。
- 设计并落地画布协议层：`CanvasDocument` 数据模型、增量 Command 更新协议、本地 History（Undo/Redo）方案及后端联调文档，共 4 份设计文档；将保存链路从 localStorage 切换为真正落库。
- 实现 `CanvasSaveQueue` 增量保存：防抖合并、请求幂等（重试复用 requestId）、revision 冲突重试、按权重切批以解决 300 节点批量操作超出后端单请求上限的问题。
- 定位并修复渲染引擎与业务文档之间的投影层异步问题：幽灵节点、选中态回弹、删除节点导致 tick 循环崩溃、断网冻结、300 资产无法渲染、跨机器缩放比异常（82% → 100%，根因为过期 localStorage）等。
- 完成缩放档位 / 键盘缩放 / 视口中心锚点、吸附、框选、等比缩放、镜像、拖拽上传、Safari 光标兼容等交互；产出代码讲解文档在团队内做技术分享。

**运营位与增长需求**
- 顶部通栏 Banner（AIGC-3332）：PC 端组件 + 管理后台配置，从接口分流、组件、埋点到提测一条龙，并推广至全部 PC 业务页。
- 首页活动弹窗（AIGC-3406）：图片 / 视频混合轮播弹窗 + 管理后台活动管理模块，从 mock 到联调上线。
- DreamVideo 3.0 / DreamAct 模型参数与默认值透传、avatar 额度按语种加权计算等业务需求。

**数据埋点与质量**
- 负责首页、画布、每日趋势、Persona、作品详情页等模块的曝光 / 点击埋点；逐条对照代码给出埋点可行性分析，识别“触发时机在代码中不存在”“埋点 ID 撞名”等需求缺陷并推动产品确认口径。
- 新旧埋点并行上报以保证改版前后数据可比；完成 AllTools 无障碍与 Sonar 告警整改。
- 疑难问题排查：PC 首帧闪 H5、Shift+Enter 换行失效、发布链路中线上引导弹窗未下线、npm 依赖与 dev server 启动死锁等。

---

## 项目经历（个人开源）

**infinite-canvas-core — 无头无限画布引擎** · TypeScript · Canvas2D · Vitest · Playwright · [GitHub](https://github.com/Haotian14/infinite-canvas-core)
- 相机、空间索引、视口裁剪与手势分层，核心不依赖 DOM，可在 Worker / Node 中运行，便于无头布局与服务端缩略图。
- 10 万节点下视口查询 48 µs（全量扫描 604 µs，**13×**）；全屏最坏场景通过绘制批处理 + 亚像素 LOD 从 44 ms 降至 13.8 ms（**3.2×**），基准可一键复现。

**德州扑克训练器 Texas Hold'em Trainer** · React · TypeScript · PWA · Playwright · [在线体验](https://texas-hold.luohaotian0616.workers.dev/)
- 完整 6-max 无限注引擎（边池 / 全下 / 筹码守恒）、6 种 AI 性格 + GTO 模式，基于范围感知 EV 决策；逐决策点复盘与 15 类长期漏洞报表。
- **985 个自动化测试**；牌型评估与参考实现对拍 10 万组；1 万手随机自对弈验证不变量；离线优先 PWA + IndexedDB。

**Nimbus Scheduler — 轻量级分布式任务调度系统** · Node.js · WebSocket · Vue 3 · Docker · [在线演示](https://haotian14.github.io/mini-scheduler/)
- Master 资源感知调度（预占、老化屏障、重试、掉线回收），Worker 执行并回传日志，Dashboard 通过 WebSocket 实时展示集群状态。
- 调度策略为纯函数便于单测；在线演示直接在浏览器中运行真实调度模块而非录像。

**RepoQuest — 把 GitHub 仓库变成可探索的像素世界** · React · TypeScript · Vite · Vitest · [在线体验](https://haotian14.github.io/RepoQuest/)
- 由文件树确定性生成 2D 地图，支持源码预览、提交任务化、Issue/PR “Boss 战”、PNG 导出；纯前端、无后端存储。

**sts2-mcp — 《杀戮尖塔 2》自动游玩 Agent** · Python · C# · C++（CoreCLR Profiler）· [GitHub](https://github.com/Haotian14/sts2-mcp)
- 不修改游戏文件，通过 CoreCLR Profiler IL 注入加载 HTTP 桥接层；战斗采用回合内束搜索，构筑基于约 190 万局社区统计数据估值。

**前端 / 算法面试手册** · React · MDX · Vite — 50 个前端专题（全文检索、学习依赖图、全站预渲染）；17 章 201 道 ML/LLM 高频题与可运行实现。

---

## 教育背景

**新南威尔士大学（UNSW Sydney）** · 信息技术硕士（Master of IT） &nbsp;&nbsp; 2024 – 2025  
机器学习与数据挖掘、推荐系统、图分析、大数据管理、信息检索；安全工程；人机交互；团队毕业设计（Capstone）。

**新南威尔士大学（UNSW Sydney）** · 计算机科学学士（B.Sc. Computer Science） &nbsp;&nbsp; 2021 – 2024  
数据结构与算法、操作系统与网络、数据库系统、软件工程、人工智能 / 深度学习 / 计算机视觉、Web 前端；团队毕业设计从立项到交付。

---

## 专业技能

- **前端**：React、Vue 3、TypeScript、JavaScript、Vite、Umi、Ant Design、ECharts、MDX、PWA / Service Worker、IndexedDB、Canvas2D
- **工程化**：Vitest、Playwright、GitHub Actions、Docker、Sonar、性能基准与 Profiling、无障碍（a11y）
- **后端 / 其他**：Node.js、WebSocket、Spring Boot、Python
- **AI 工程**：Claude Code + Codex 多 Agent 协作开发（subagent 并行 review、Figma MCP 对稿、Midscene.js UI 自动化调研）；LLM / 推荐系统基础
- **语言**：中文（母语）、英语（澳洲 UNSW 本硕全英文授课）

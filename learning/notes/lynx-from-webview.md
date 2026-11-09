# 从 WebView / JSBridge 理解 Lynx

适用背景：已有 Vue、H5、App WebView 和 JSBridge 经验，尚未实际用过 Lynx。

本笔记讲移动端原生集成时的主要模型。Lynx 还支持 Web 及其他渲染后端，不能把所有平台实现都概括成同一种原生控件映射。技术资料查阅于 2026-11-09。

2026-11-10 补充：本人主要在 H5 / Web 开发音色列表和 Agent，实际项目定位见 [阅读索引](project-context.md)。以下入门例子与当前业务实现分别理解：Web Agent 的试听走网页 audio，选择提交走会话请求；App 外跳、共享存储等场景另有 Bridge 调用。

## 1. 先分清你熟悉的两件事

**WebView 负责把网页显示在 App 中。** H5 的 HTML / CSS / JavaScript 运行在 WebView 提供的浏览器环境里，DOM、布局、绘制等由浏览器引擎处理。

**JSBridge 负责让网页与宿主 App 通信。** 例如 H5 告诉客户端打开系统浏览器，或请求原生检测视频首帧中的人脸。它解决能力调用与消息传递，网页本身仍由 WebView 渲染。

所以你现在的经验可以拆成：页面渲染、业务状态、与客户端的通信协议。学 Lynx 时，这三部分分别对应不同的迁移工作。

## 2. Lynx 改变的是界面运行与渲染环境

Lynx 提供跨端 UI 引擎及运行时。移动端 App 可以集成 Lynx，用前端式的组件、样式和脚本构建界面；ReactLynx 是官方提供的 React 风格框架。二者类似“运行平台”和“在上面编写 UI 的框架”的关系。[官方介绍](https://lynxjs.org/next/blog/lynx-unlock-native-for-more)

用文字把两种链路并排看：

```text
现有 App 内嵌 H5：
Vue 页面 -> WebView 浏览器引擎 -> 页面显示
页面业务 -> JSBridge -> 宿主 App -> 系统能力

移动端 Lynx 集成：
ReactLynx 组件 -> Lynx 引擎 / 平台渲染层 -> 页面显示
后台线程业务 -> Native Module -> 宿主 App -> 系统能力
```

这里的 Native Module 仍承担 JS 与原生交互。你过去对超时、回调、错误兜底和平台差异的理解可以迁移；具体接口、注册方式与线程约束则需要重新适配。[Native Modules](https://lynxjs.org/guide/use-native-modules.html)

## 3. 对照你已有的开发方式

| 问题 | WebView / JSBridge | 移动端 Lynx / ReactLynx |
| --- | --- | --- |
| UI 怎么写 | Vue 组件、HTML 元素、CSS | React 风格组件、Lynx 元素和 CSS |
| 谁渲染界面 | WebView 的浏览器引擎 | Lynx 引擎与平台渲染层 |
| 常用元素 | `div`、`span`、`img` 等 | `view`、`text`、`image` 等 |
| 怎样处理交互 | Web 事件与框架事件绑定 | Lynx 事件，例如 `bindtap` |
| 怎样访问原生能力 | 项目的 JSBridge 协议 | 宿主注册的 Native Modules 等集成接口 |
| 怎样访问页面节点 | DOM / 框架 ref | Lynx 提供的元素 API，需按运行环境适配 |
| 滚动与长列表 | 浏览器滚动、Web 虚拟列表方案 | `scroll-view`、`list` 等专用元素 |
| 业务模型能否复用 | 已有模型 | 不依赖 Vue / DOM 的纯 TS 逻辑更容易复用 |

这不是机械替换标签。比如 Lynx 的普通 `view` 不能像 Web 一样靠 `overflow: scroll` 获得滚动，需要专门的滚动容器。[元素](https://lynxjs.org/guide/ui/elements-components)、[滚动](https://lynxjs.org/guide/ui/scrolling.html)

## 4. 用你做过的音色卡片举例

已核对 `dreamface-web` 的共享 Agent 选音卡：点击音色行进行试听，点 Use 发出选择事件，再由会话层提交和恢复任务。页面中的“正在播放”和“已确认选择”有不同的状态来源，不能混为一个高亮值。

`dreamface-mobile` 的通用 VoicePicker 是另一种交互：试听时记录本地选择，确认后向上层发出结果。先确认正在讨论哪一个组件，再比较迁移方式。

为学习迁移，可把 Agent 选音场景简化成：

1. 接收服务端事件，知道当前任务需要用户选择音色。
2. 展示候选项和选中状态。
3. 用户提交，等待服务端确认。
4. 根据确认和后续事件更新卡片，继续原任务。

迁移时可按下面拆分。这是迁移建议；当前代码的已核对事实与阅读范围另见项目背景笔记。

| 部分 | 迁移判断 |
| --- | --- |
| 任务 / 卡片 ID、业务状态类型、事件归并规则 | 如果是纯 TS 且不依赖运行环境，优先复用 |
| Vue `ref` / `watch` / 组件模板 | 改为目标框架的状态和组件逻辑 |
| 点击、布局、列表与输入 | 用 Lynx 对应元素与事件重写或适配 |
| SSE / 网络客户端 | 先核对运行时与宿主能力，不能默认浏览器 `EventSource` 可用 |
| 音色试听、文件访问、外跳 | 确认运行时或宿主提供的能力，补接口与失败路径 |
| 项目切换后忽略迟到事件 | 业务规则可保留，订阅与清理接入新的生命周期 |

优先复用的是业务规则，而不是把整段 Vue 组件直接搬过去。

## 5. ReactLynx 的关键：两套线程运行环境

按照官方模型：

- 主线程负责初始界面渲染和后续 UI 更新，也可通过主线程脚本处理需要及时响应的交互。
- 后台线程承载完整的 React 运行逻辑，处理组件生命周期和业务副作用。
- 组件初次渲染代码可能在两侧执行，因此渲染函数应保持纯净。网络请求、监听器注册等副作用应放在对应的后台生命周期或事件处理里。

主线程脚本有明确的 API 和调用约束，适合小而及时的 UI 操作；大量计算仍然可能阻塞主线程。双线程也不会自动解决网络失败或业务事件乱序。[ReactLynx 线程规则](https://lynxjs.org/react/thinking-in-reactlynx)

对已有 Hybrid 经验，先记住两个实际问题：

1. “代码在哪里执行？”不能仅凭它是 JavaScript 判断；先确认线程和可用 API。
2. “任务为什么卡住？”要分别检查 UI、后台业务、宿主回调和服务端任务，不能只看连接是否还在。

## 6. 看一段最小组件

下面只是语法示例，尚未在本仓库创建应用或运行验证。它没有提交接口，也没有实现并发保护。

```tsx
import { useState } from '@lynx-js/react'

export function VoiceCard() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <view>
      <text>选择一个音色</text>
      <view bindtap={() => setSelected('voice-a')}>
        <text>{selected === 'voice-a' ? '已选择音色 A' : '音色 A'}</text>
      </view>
    </view>
  )
}
```

与你熟悉的 Vue 相比，先关注两点：使用 Hooks 管理组件状态；UI 元素和事件来自 Lynx。

然后学习 React 的状态快照与函数更新。异步回调可能拿着旧渲染中的值，不能把 `setState` 理解成就地修改当前变量。[React 状态快照](https://react.dev/learn/state-as-a-snapshot)

## 7. 你已有的 Bridge 经验如何深化

以“通知客户端打开外部页面”为例，学习时把接口拆成这些问题：

- 能力是否存在：宿主版本、平台、模块注册情况如何确认？
- 请求如何关联：调用 ID、返回值、错误结构和超时由谁维护？
- 回调是否可靠：不回调、重复回调、页面销毁后回调如何处理？
- 外跳后如何恢复：App 回到前台时需要重新查询哪个服务端状态？
- 哪些请求允许重试：查询通常可以安全重做；创建、支付、提交需要服务端幂等与状态查询配合。
- 接口允许做什么：校验参数、URL 和允许调用的能力，避免将任意宿主功能暴露给不可信页面。

尤其要区分：Bridge 调用成功、系统浏览器成功打开、充值 / 支付成功，是不同的事实。

在 Lynx 中声明 TypeScript 类型，并不会自动产生原生能力。官方 Native Module 还需要宿主实现、注册和集成，并受后台线程调用约束。[原生模块接入说明](https://lynxjs.org/guide/use-native-modules.html)

## 8. Canvas 迁移要单独判断

你个人引擎里的几何、空间索引、相机和历史逻辑独立于 DOM，这有助于跨运行环境复用。但 Canvas2D 渲染、DOM 输入事件、字体 / 图片处理和浏览器存储仍要分别核对。

“无头引擎的纯 TS 部分可以做兼容性验证”与“整个 Web 编辑器已经可以在 Lynx 运行”是两种不同程度的结论。先迁移卡片 / 任务 UI，通常比直接迁移整块画布更适合入门。后续再讨论渲染后端、手势、媒体组件与宿主组合方案。

## 9. 面试中怎样准确介绍当前状态

当前可以按事实说：

> 我主要做的是 Vue H5 在 App WebView 中运行，通过 JSBridge 接入原生能力，处理过外跳、平台差异、媒体检测和失败兜底。Lynx 还没有实际项目经验，目前正在从渲染环境、线程模型和原生模块接入学习，并计划用问题卡片验证业务状态与 UI 的分离。

实际完成练习后，再补充具体平台、实现和验证结果。不要提前写成“熟练 Lynx”或“完成跨端迁移”。

## 官方参考资料

- [Lynx 官方介绍](https://lynxjs.org/next/blog/lynx-unlock-native-for-more)：设计目标、引擎与框架的关系。
- [Quick Start / Explorer](https://lynxjs.org/guide/start/quick-start.html)：脚手架与预览流程。
- [元素与组件](https://lynxjs.org/guide/ui/elements-components)：Lynx 元素。
- [滚动与列表](https://lynxjs.org/guide/ui/scrolling.html)：`scroll-view` 与 `list`。
- [Thinking in ReactLynx](https://lynxjs.org/react/thinking-in-reactlynx)：双线程与副作用边界。
- [Native Modules](https://lynxjs.org/guide/use-native-modules.html)：原生模块的声明、实现与接入。
- [Networking](https://lynxjs.org/guide/interaction/networking.html)：网络能力及宿主适配。
- [Integrate with Existing Apps](https://lynxjs.org/guide/start/integrate-with-existing-apps.html)：嵌入现有应用。
- [React 状态快照](https://react.dev/learn/state-as-a-snapshot)：进入 ReactLynx 前的 React 基础。

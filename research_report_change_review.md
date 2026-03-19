## History Amazing 近期改动审查报告

### Executive Summary

这批改动的主体不是零碎修补，而是一次从纯前端时间线页面向小型全栈应用的升级：前端已经接上后端 API，服务端使用 SQLite 承载事件、检索和上下文查询，视图层新增了 `compare`、`TodayInHistory`、扩展事件与详情上下文等能力。从“开发态功能链路”看，主路径大体已经闭环；但从“一致性、稳定性和工程完备度”看，仍有几处明显未收口的问题，尤其是衍生事件污染上下文、服务端类型配置与跨目录导入冲突、以及前端状态同步与 `coreOnly` 语义不一致。

实际验证方面，前端 `build` 已通过，说明主要渲染链路没有断；但前端 `lint` 已出现多条真实问题，服务端 TypeScript 检查也已经报错，因此这批改动目前更适合定义为“功能基本可用，但尚未达到干净、稳定、可收敛的状态”。

### 一、功能完成度评估

#### 1. 已经形成闭环的部分

前后端数据链路已经接通。前端状态不再直接依赖本地静态数组，而是通过 `useTimelineState.ts` 调用 `app/src/lib/api.ts`，再访问 `server/src/index.ts` 暴露的 `/api/events`、`/api/stats`、`/api/events/:id/context` 等接口；开发环境下 `vite.config.ts` 已把 `/api` 代理到本地服务端。这说明“筛选 -> 请求 -> SQLite -> 返回 -> 页面渲染”的主链路已经成立。

多视图能力已经实际接上，不是只加了按钮。`App.tsx` 已按 `timeline`、`matrix`、`stats`、`compare` 四个视图分支渲染，`FilterPanel.tsx` 也具备对应切换入口。`CompareView.tsx` 与 `TodayInHistory.tsx` 不是占位组件，都有完整渲染与点击进入详情的路径。

事件详情能力也基本闭环。`EventCard.tsx`、`MatrixView.tsx`、`CompareView.tsx`、`TodayInHistory.tsx` 都能把事件送入 `App.tsx` 的 `selectedEvent`；`EventDetail.tsx` 会进一步调用上下文接口，展示同类、同时期与关联事件。即使部分源数据没有手写 `details`，`app/src/lib/event-detail.ts` 也会自动补全文案，因此详情页不是空壳。

“扩展事件 + 只看核心事件”机制已经通到了 UI。`events.ts` 通过 `event-expansion.ts` 把主事件扩展成多个阶段节点，`useTimelineState.ts` 通过 `isDerivedEvent()` 做前端过滤，`FilterPanel.tsx` 也已提供“只看核心事件”开关。从产品思路上看，这套设计已经落地，不只是数据层实验。

#### 2. 疑似半成品或未闭环的部分

`coreOnly` 语义没有覆盖到所有入口。主列表虽然会去掉衍生事件，但 `App.tsx` 给 `TodayInHistory` 传入的是 `state.allFilteredEvents`，不是最终显示用的 `state.filteredEvents`，所以用户即使开启“只看核心事件”，历史上的今天仍可能出现衍生节点。详情页的上下文接口也没有过滤衍生事件，因此这项能力目前只是“主列表闭环”，不是“全局体验闭环”。

`CompareView.tsx` 与筛选体系存在边界不一致。它只接受预定义的东西方地区集合，遇到 `global` 或非洲等地区时会直接跳过。这意味着某些筛选条件在 `timeline` 中有内容，切到 `compare` 后却可能显著变少甚至近似空白；由于视图内部没有明确空态说明，用户很容易把这理解成缺陷而不是设计限制。

`endYear` 更像一项预埋能力。前后端和若干组件已经支持持续事件字段，但实际数据层几乎没有系统性地提供这类数据，因此这部分目前更像为未来扩展准备的框架，而不是已经真正形成体验价值的功能。

工程层面的生产闭环还没完成。根目录 `build` 只构建前端，服务端没有自己的构建脚本，也没有在 `index.ts` 中托管前端静态资源。因此当前是“本地开发闭环成立”，但并不是“仓库内单命令生产部署闭环成立”。

### 二、高风险问题清单

#### 高风险 1：衍生事件污染详情页上下文

`event-expansion.ts` 在扩展主事件时，会把衍生节点加入主事件的 `relatedIds`，同时每个衍生节点又会反向关联主事件和其它衍生兄弟。`server/src/index.ts` 的 `/api/events/:id/context` 在查询同类、同时期和关联事件时，没有排除这些衍生节点。结果是：详情页很可能优先展示“同一主事件的多个扩展版本”，形成自引用、伪因果和伪同时期关系。这个问题语义上很严重，因为它会直接误导用户对历史脉络的理解，而且 UI 上看起来还像“数据很丰富”，很难靠肉眼第一时间识别。

#### 高风险 2：服务端 TypeScript 配置与跨目录导入冲突

服务端 `seed.ts` 通过 `../../app/src/data/events.js` 直接导入前端数据聚合层，而 `server/tsconfig.json` 的 `rootDir` 固定为 `src`。实际运行 `npm exec tsc -- --noEmit -p server/tsconfig.json` 后，已经出现多条 `TS6059`，明确指出 `app/src/data/*.ts` 不在 `rootDir` 下。这不是理论风险，而是当前就存在的真实工程问题。虽然 `tsx` 开发态还能跑，但类型检查层面说明服务端工程边界已经被打破，后续只要继续复用前端数据文件，构建和工具链问题会持续扩大。

#### 高风险 3：前端全量拉取叠加后端 N+1 关系查询，容易性能回退

`useTimelineState.ts` 每次筛选变化都会调用 `fetchAllEvents()`，而 `app/src/lib/api.ts` 会循环请求，把所有分页全部拉完。与此同时，服务端在列表接口返回前，又会对每个事件执行补关系逻辑。配合事件扩展机制把数据规模放大为多倍后，这种“前端全量拉取 + 后端逐条补关系”的组合很容易成为明显瓶颈。当前前端 `build` 虽然通过，但这类性能问题不会在构建阶段暴露，往往要到数据量和交互频率上来后才出现卡顿。

### 三、中风险问题清单

URL 状态同步是单向写入而非双向同步。`useTimelineState.ts` 只在初始化时解析 URL，之后用 `replaceState` 回写，但没有监听浏览器前进/后退，也没有对非法参数做充分校验。手动改地址栏或通过历史记录返回时，状态与界面出现偏差的概率不低。

“历史上的今天”与当前筛选语义不一致。它使用 `allFilteredEvents`，忽略了 `coreOnly` 的最终展示集，而且日期匹配本身是近似算法，因为原始事件只有年份没有月日。这不是程序崩溃型缺陷，但会显著影响用户对该功能“是否真的可信”的感知。

统计口径与当前展示口径也并不一致。主列表默认可能只显示核心事件，但 `stats.total` 来自服务端全量统计，因此用户会看到明显不匹配的计数。这种问题不会阻断使用，却会放大用户对其它功能异常的怀疑。

### 四、已通过验证与已暴露问题

前端 `npm --prefix app run build` 已通过，说明这批改动在生产构建层面没有直接断裂，新增视图和 API 接入都没有触发编译失败。

前端 `npm --prefix app run lint` 已暴露真实问题，至少包括两类：一类是 `App.tsx` 中 `handleRandomExplore` 的 `useCallback` 依赖与 React 编译器推断不一致；另一类是 `useTimelineState.ts` 在 `useEffect` 中同步 `setState`，已被 `react-hooks/set-state-in-effect` 规则直接标记。说明这批改动虽然能跑，但 React 语义与静态规则层面并不干净。

服务端 `npm exec tsc -- --noEmit -p tsconfig.json` 已报出跨 `rootDir` 导入错误，说明后端当前没有稳定通过自身的类型检查。这是最明确的工程层红灯之一。

### 五、结论

如果按“功能有没有接上”来判断，这次迭代大部分核心目标已经做成了，尤其是前后端打通、事件扩展、多视图和详情上下文这些主功能；如果按“是否已经可以放心继续叠功能”来判断，答案是否定的，因为当前至少还存在三条应优先收口的问题：一是清理衍生事件对上下文和次级入口的污染，二是修正服务端 `tsconfig` 与 seed 共享前端数据的工程方式，三是明确 `coreOnly`、统计、TodayInHistory、Compare 之间的统一语义。

更直白地说，这批代码现在处于“产品形态已经成型，但工程卫生和一致性还没跟上”的阶段。它已经不是半成品 Demo，但也还没到“可以无脑继续往上堆”的状态。

### References

1. [App.tsx](./app/src/App.tsx)
2. [useTimelineState.ts](./app/src/hooks/useTimelineState.ts)
3. [CompareView.tsx](./app/src/components/CompareView.tsx)
4. [EventDetail.tsx](./app/src/components/EventDetail.tsx)
5. [event-expansion.ts](./app/src/data/event-expansion.ts)
6. [api.ts](./app/src/lib/api.ts)
7. [index.ts](./server/src/index.ts)
8. [seed.ts](./server/src/seed.ts)
9. [server tsconfig](./server/tsconfig.json)
10. [root package.json](./package.json)

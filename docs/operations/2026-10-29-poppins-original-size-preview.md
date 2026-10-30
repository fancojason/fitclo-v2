# Fitclo 当前字体预览：保留原站字号，只替换 Poppins

日期：2026-10-29。状态：仅本地预览，未正式部署。本说明取代前一版“按角色重新调整字号”的预览方案。

## 本轮执行原则

用户选择保留原站各处字号，以原始源码快照 `91847dba81636e0204140affc8e1d89ee3355764` 的组件样式为基准，而不是以此前多轮预览的字号作为基准。

- 使用四档本地 Poppins；不加载 DM Sans。
- 撤销全部统一 H1/H2、卡片、正文、按钮、Footer 的字号覆盖，以及上一轮人为调整的字重、行高、字距、大小写规则。
- 唯一主动字号例外：导航使用 15px / 500，自然大小写，沿用用户已确认的样式。
- 原组件中的响应式字号继续生效，包括首页、博客、文章、知识中心、产品卡及详情、服务、市场、表单和语言页面。
- 不变更原文字、图片、配色、SEO 标签、路由或业务逻辑。

## 兼容处理

保留两条不改字号的局部适配：

1. 原本强制单行的 H2 允许正常换行，避免较宽的字型使长标题越界。
2. 很长的组合型号允许在复制按钮内换行，型号内容与复制逻辑未改。

没有为这些情况新增字号缩放。导航在 1024–1199px 的间距兼容规则继续保留。

## 原字号对比验证

在同一浏览器文档中暂时关闭/启用本地字体覆盖表，分别读取原组件与 Poppins 版本的计算字号。原始全局样式和组件代码保持原快照内容，因此可直接对比。

- 55 个实际页面 × 视口组合，覆盖 1440 / 768 / 390 / 320px 及相关语言样本。
- 合计 **43,724 次文本元素字号比较**（跨页面和视口累计，非去重内容数）。
- **导航以外字号变化：0。**
- 新增整页横向溢出：0；相对原模板新增的标题/按钮边界问题：0。
- 320px 时，首页和知识中心主标题有原模板已有的轻微内容边距越界，原模板也存在，文字仍在视口内；本轮记录此基线情况，保留用户要求的字号，没有据此全局缩字。
- 完整记录：`../typography-original-size-comparison.json`。

## 测试与文件

- `npm run build` 通过，生成 367 个 Astro 页面；完整结果见 `typography-build.log`。
- `node scripts/font-preview/check.mjs` 通过：15 个 HTTP 路由、4 个 Poppins 资源、本地 noindex、源 CSS 与构建 CSS 一致，以及 55 组字号比较记录。
- 检查脚本限制当前覆盖表只能存在一处 font-size 声明，即导航规则，防止再次引入通用标题字号覆盖。
- `node --check scripts/font-preview/server.mjs` 通过。项目没有独立 lint/typecheck 脚本，未声称完成这两项独立检查。
- 本次主要变更：`public/css/fitclo-typography.css`、`scripts/font-preview/server.mjs`、`scripts/font-preview/check.mjs`、本说明、验证 JSON 与运营日志。
- 字体替换通过独立 CSS 实现，没有使用 JavaScript 统一缩放页面字号。
- 上一轮方案已备份到 `docs/font-variants/poppins-role-audit-previous.css`，仅作为历史记录。

## 预览及运行

- 首页：http://127.0.0.1:4331/?preview=original-sizes
- 博客：http://127.0.0.1:4331/blogs/?preview=original-sizes
- 知识中心：http://127.0.0.1:4331/activewear-intelligence/?preview=original-sizes
- 产品：http://127.0.0.1:4331/products/?preview=original-sizes

隔离目录：`.release/typography-preview-20261029/`。需要重启时在此目录执行 `node scripts/font-preview/server.mjs`；需要重建时先 `npm run build`。服务器只监听本机 127.0.0.1，并向本地响应添加 noindex。源码来自归档，本轮无独立 Git 分支或 Commit。

## 发布与交接状态

生产分支 push/merge、生产部署、配置修改、GSC、Bing、sitemap 和 IndexNow 提交均未执行。正式站未改动，没有生产 CWV 或排名变化可报告。

交接摘要：按最新选择恢复原站组件字号，纯 Poppins，仅保留 15px / 500 自然大小写导航和两条换行适配。等待用户审核；不能自动部署。

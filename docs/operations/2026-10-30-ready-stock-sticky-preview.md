# Ready to Ship 吸顶筛选与 H1 局部优化（仅预览）

日期：2026-10-30，Asia/Shanghai。目标：`https://www.fitcloo.com/ready-to-ship/`。

状态：开发、构建、预览部署、线上桌面/手机验证完成。**正式网站尚未部署，等待用户审核。**

## 预览与版本

- 同一预览别名（已更新）：https://codex-ready-stock-compact-pr.fitclo-v2.pages.dev/ready-to-ship/
- 最新固定版本：https://7a04371b.fitclo-v2.pages.dev/ready-to-ship/
- 先前 `240781c3` 固定地址是旧版本；审核本次改动请使用上面两个地址。
- Cloudflare Pages 项目 `fitclo-v2`，预览分支 `codex-ready-stock-compact-preview`。
- 本地功能分支 `codex/ready-stock-compact-preview`。
- 实现提交：`1678ad0`；手机滚动锚点修复：`1315e1f`。未推送或合并 main。
- 只上传预览资产；最新 Wrangler 回执：3 个新文件、1894 个复用文件，deployment complete。未使用生产部署命令。

## 实现内容

1. 英文 Ready to Ship 工具栏采用目录内 `position: sticky`，由 ResizeObserver 测量现有固定导航高度。到达导航下方后开始吸顶，离开目录父容器后退出；没有复制第二套搜索栏，也没有改变主导航。
2. 手机小于 768px 时仅显示搜索框和 Filters；点击展开分类、Clear filters、Compact Browse。原有控件、状态及事件继续使用，提供 aria-expanded、aria-controls、focus-visible；Escape 收起并将焦点归还 Filters。
3. 工具栏收起高度 73px、展开高度 189px（390px 测量）；桌面为 77px，背景实色黑、细边框、按钮 500 字重。
4. 在已向下浏览且工具栏吸顶时，关键词/分类/清空操作返回结果区域顶部附近；初始进入页面或尚未到达筛选栏时不强制跳转。无结果也显示在可见区域。
5. 截图检查发现浏览器原生滚动锚定会使展开的手机筛选栏遮住首张结果；已禁用该目录区域的滚动锚定，并在吸顶状态展开/收起时保持原滚动位置。最终实测结果顶部 280.5px、工具栏底部 265px，无遮挡。
6. 仅该页首屏 H1 的一行 class 修改：原手机 43px/桌面70px、700字重、1.04行高，改为手机32px/平板40px/桌面50px、600字重、1.18行高。H1原文、其他文字、业务信息、图片、产品与 SEO 内容保持原样。
7. 限定英文目标页；共享组件的西语页面没有启用本次吸顶、手机折叠或字号改动。

## 变更文件

- `src/components/ReadyStockCatalog.astro`
- `src/pages/ready-to-ship.astro`（仅 H1 class 一行）
- `scripts/font-preview/ready-stock-sticky-check.js`
- 本报告、`docs/operations/CHANGELOG.md`
- `docs/ready-stock-sticky-qa-2026-10-30.json`
- `docs/screenshots/ready-stock-sticky-desktop.jpg`
- `docs/screenshots/ready-stock-sticky-mobile.jpg`
- `docs/screenshots/ready-stock-hero-refined.jpg`

## 构建与真实验证

- 最终 `npm run build` 通过，367 个 Astro 页面，58.60 秒；未编造项目未配置的 lint/typecheck 命令结果。
- `node --check scripts/font-preview/ready-stock-sticky-check.js` 通过。
- 既有字体预览检查通过：15 个 HTTP 路由、4 个字体资源、55 条已记录字号比较。该脚本未包含本次 Ready to Ship H1，故本次字号例外由新浏览器检查单独验证。
- 本地 320px 窄手机、390px 手机、1440px 桌面验证；最新 HTTPS 预览在390px、768px、1440px验证。原始结果保存在 JSON。
- 吸顶前在正常文档流；吸顶时 top=76px，与实际导航底部相等；离开目录后工具栏退出视口。三个线上宽度均无横向溢出。
- 深处搜索 BX6147 正确返回 1 款且图片起点不被工具栏遮挡；无结果提示、清空、手机展开和 Escape 收起通过。
- 手机 Filters 使用 Chrome UI 实际点击、搜索实际输入；最终滚动锚点修复另有自动化 DOM 回归和截图验证。测试使用真实249款数据，不是示例数据。
- 现有目录26项回归在最终线上桌面通过：搜索、组合分类、四快捷分类、计数、清空、Compact Browse恢复、全部249款的产品专属WhatsApp URL及49个详情页HTTP200。
- 本轮未真实发送 WhatsApp 消息或提交客户表单；没有声称实测独立 iOS Safari/Android 真机。
- Chrome设备模拟有两次导航超时，等待页面DOM加载完整后重跑通过；未将失败调用计为通过。最终检查未发现浏览器 console error/warn。

## 隔离与 SEO

- 最新预览实测 HTTP200，`X-Robots-Tag: noindex, nofollow`，canonical保持正式 `https://www.fitcloo.com/ready-to-ship/`。
- 生产部署记录核对仍为 `122f704f-49c8-4cc8-95e3-57a4b006209b`（2026-10-29T07:49:33.731762Z）；本轮仅预览上传。
- 源 sitemap、robots、title、meta、JSON-LD、URL 未修改。本轮无 GSC/Bing/IndexNow提交。
- 仍沿用此前 Poppins 预览准备脚本，只在预览 dist 注入字体与 noindex。后续生产上线必须正常接入字体，不能上传带预览 noindex 的产物。

## 后续

等待用户确认；不自动生产发布。批准后需核对期间生产分支变化，限定合入，重新构建并核对无预览 noindex，再执行生产验证和适用索引检查。未编造新转化率、排名或上线后行为数据。

请先打开预览地址检查效果。确认满意后，再授权 Codex 正式部署。请将本次完整中文执行报告复制回 Fitclo AI 独立站运营总监项目，供运营总监记录和后续跟进。

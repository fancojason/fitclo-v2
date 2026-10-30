# Fitclo Poppins 全站字重与询盘按钮优化——预览报告

日期：2026-10-30。状态：已开发、构建、验证并更新线上预览；**正式网站尚未部署**。

## 结论与实现

截图中的厚重感主要来自保留了旧字体的700等较重字重，另有675个构建标题带font-black。英文首页标语同时使用紧行高1.05和负字距-.04em。不是所有地方都需要放大或缩小字号，也不需要恢复旧字体。

继续使用Poppins，保留已确认字号，主要调整字重层级：

| 类型 | 当前预览 |
|---|---|
| 普通H1主标题 | 600 |
| H2–H6区块、博客卡片及产品名称 | 500 |
| 英文首页标语 | 保持64px桌面/36px手机，500字重、1.14行高、-.02em字距 |
| Ready to Ship已确认首屏H1 | 保持58px宽屏/36px手机、600字重 |
| Ready to Ship目录区块H2 | 保持50px桌面字号，500字重、1.22行高 |
| 桌面导航询盘按钮 | 13px/500、42px高、细边框、3px圆角、低饱和金色；原链接保留 |
| 其他导航文字 | 保持15px/500、自然大小写 |

嵌套的span、em、strong及标题内按钮继承标题字重，避免标题减重后子元素仍突出过粗。正文及其强调、Logo品牌字样不作统一减重。页脚语义标题也使用较轻层级。未加入DM Sans，未更换产品图片，未修改产品数据、询盘目的地址或业务文案。

## 审计与验证范围

- 静态扫描全部972个构建HTML（包含语言镜像，不等于972个独立Astro生成路由）：972个H1、6667个H2、7607个H3、4057个H4、28个H5。
- 发现12396个标题带font-bold、675个带font-black、2个带font-[700]。这些是构建HTML元素统计，不是独立组件或独立文案数量。
- 浏览器对比14条代表路由，23个页面/视口样本、2685次标题比较。前20个样本检查正文标题，后3个额外覆盖页脚标题。均未改变标题字号，未发现新的横向溢出，受检标题及嵌套文本未保留高于600的字重。
- 代表路由包括首页、Ready to Ship、产品目录、3366详情、博客列表、质量检查文章、Activewear Intelligence、Private Label、OEM、澳大利亚市场页、西语首页/指南、德语和葡语首页。手机390px检查6个代表页面。并非逐页人工浏览所有972份HTML。
- 1024px导航检查：Logo与导航未重叠，按钮42px高，导航右边缘984px，未超出视口。
- 最终`npm run build`通过，367个Astro生成页面、43.12秒。首次构建因Windows临时占用dist目录失败，重试成功；不是忽略构建错误。
- CSS最后补充页脚标题规则与标题内button继承后，同步public静态资产到dist，并在真实浏览器验证；没有引入新的构建依赖。
- `node --check scripts/font-preview/check-heading-weights.js`和`git diff --check`通过。
- 既有预览检查通过15个HTTP路由及4个字体资源；其中55条旧字号记录属于此前验证资料，不冒充本轮新执行的55次浏览器测试。
- 初始比较脚本遇到启停stylesheet后的浏览器样式异步生效问题，已等待两帧后复测；失败调用未记为通过。
- 项目没有配置独立lint/typecheck脚本，不虚报这两项通过。

## 线上预览

- 同一别名：https://codex-ready-stock-compact-pr.fitclo-v2.pages.dev/
- 最新固定版本：https://b08de27b.fitclo-v2.pages.dev/
- Ready to Ship：https://b08de27b.fitclo-v2.pages.dev/ready-to-ship/
- 博客：https://b08de27b.fitclo-v2.pages.dev/blogs/
- Cloudflare Pages项目fitclo-v2，非生产预览分支codex-ready-stock-compact-preview。Wrangler回执成功：3个新资产、1894个复用。
- 线上首页、Ready to Ship及博客均实测HTTP200、`X-Robots-Tag: noindex, nofollow`；字号和字重符合上表，无横向溢出。
- 线上手机Ready to Ship确认H1为36px/600、产品名500、筛选和Compact Browse控件存在；console无error/warn。

## 文件及版本

实现提交：`9fe08cf`，本地分支`codex/ready-stock-compact-preview`。未推送main。

- `public/css/fitclo-typography.css`：集中预览字重规则及询盘按钮样式。
- `src/components/Hero.astro`：只增加data-home-hero标识，英文首页标语定向应用；不改变内容或布局结构。
- `scripts/font-preview/check-heading-weights.js`：可在真实页面运行的前后样式对比。
- `scripts/font-preview/check.mjs`：识别导航及其CTA两个被授权的字号例外。
- `docs/poppins-weight-source-audit.json`、`docs/poppins-weight-browser-qa.json`：静态扫描与真实浏览器证据。
- `docs/FONT_PREVIEW_CURRENT.md`、本报告和运营日志：更新当前待审核方案。
- `docs/screenshots/home-lighter-poppins.jpg`、`ready-stock-lighter-names.jpg`、`blogs-lighter-poppins.jpg`：线上实际截图。

## 保留与待批准事项

本轮不改页面URL、业务数据、产品图、SEO文案、sitemap或正式robots设置。继续保留既有吸顶、手机展开筛选、型号复制、Compact Browse及产品询盘链接。未真实发送WhatsApp消息或提交客户询盘。

只部署预览，未执行GSC、Bing、IndexNow。生产发布仍须用户明确批准，且需将已选字体接入正常构建、排除预览noindex；不能把本次预览dist直接当生产产物上传。没有声称本轮带来真实流量、排名或转化提升。

请先打开预览地址检查效果。确认满意后，再授权 Codex 正式部署。请将本次完整中文执行报告复制回 Fitclo AI 独立站运营总监项目，供运营总监记录和后续跟进。

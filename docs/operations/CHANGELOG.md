# Fitclo 运营变更日志

## 2026-10-31 — 任务05-A V2.0：AI采购发现基线与私标单页（独立分支，未生产）

- 远程验收完成：代码253db542088b9cfeb7fe71a1d71a16d0328ab446，[Draft PR #6](https://github.com/fancojason/fitclo-v2/pull/6)，Preview1a62cbb6-019c-4c25-90f6-ecc2dbc5af0c build/deploy成功；30HTML/11资源200/MIME正确，1440/390、Quote锚点、新内链、WhatsApp参数、SEO均验证。浏览器证据JSON同目录。此补记为文档提交，不改变运行代码或生产。

- 最新main98176845，生产d3082f46成功；03-D已合并上线，后续字体/导航/现货浏览保留。任务04各成果保留在原分支，PR #4/#5仍未合并，本轮未操作；以下旧日志按历史保留。
- 实际读取GSC/GA4/Bing汇总：日期和证据见[05-A报告](2026-10-31-task05a-ai-growth.md)及同目录analytics JSON。ChatGPT/Claude没有可用登录会话，20条固定采购问题标“未直接验证”，不把GA4来源或Google搜索当推荐回答。
- robots最终响应允许搜索/用户检索，训练仍禁止；Cloudflare机器人检测统计无权限，不声称真实机器人已成功抓取。确认外站Fitclo链接自带ChatGPT UTM，提示归因边界。
- 仅英文private-label.astro新增企业/采购路线说明、三个真实型号入口、5项报价brief及既有内容内链；原Title/H1/schema/图片/商业声明/表单和导航保持。build/13 Node/core locales/ES产品/重点产品保护通过，972 HTML仅该页改变、CSS不变。
- 既有DE缩略图及非目标静态旧资源失败未扩修。新增发现的既有Header品类URL缺斜线，正式404，单列下一项限定修复。
- 本轮只允许Draft PR/非生产Preview，远程验收见报告补记；未合并main/部署生产/提交索引，没有自动回传ChatGPT。

## 任务03-C远程验收补记 — 2026-10-29（仍未生产）

- Preview1451089d-63a4-4c67-8bb3-6ddc9dce176f对应代码9e9a9ab6：EN/ES/DE桌面1440/手机390实际DOM六组通过；全部5图source/完整ALT/短caption/aria-pressed、5张缩略图保留与循环正常；原生鼠标/Tab+Enter/Space逐语言通过，Console无error/warn。
- 本地和远程各30HTML/11份Astro资源200、MIME正确，Sample及原CTA不变；证据见[03-C报告](2026-10-29-task03c-caption.md)及[浏览器JSON](2026-10-29-task03c-browser-evidence.json)。
- 03-B历史回归/误判记录保留。PR #2继续Draft；main仍e2fcdb62，未合并/生产部署，无搜索平台提交；日志仅PR分支。最终文档提交触发的Preview以PR记录为准。


## 2026-10-29 — 任务03-C：Caption选择器最小修复（Preview待验，未生产）

- 保留03-B拦截历史：f8a813f7英文图库按钮data-gallery-label与caption选择器冲突，第一次缩略图被清空，caption不更新；此前纯数据单元测试未覆盖真实DOM选择器，任务03全部通过结论已纠正。原阻塞记录提交23379e71保留，并复制报告归档。
- 仅将Capri caption选择器限定为figcaption [data-gallery-label]，三个语言实际DOM均唯一匹配文字span，不选按钮。无业务/SEO/图片/表单修改，继续复用既有资源binder。
- 增加源码选择器防退化Node测试与scripts/capri-gallery.browser.mjs真实DOM检查：初始化、第二张/全部五图、source/ALT/caption、aria-pressed、5张缩略图保留、循环、无溢出及Sample默认。旧Preview实际报image 2: short caption；修复本地三语言1440px/390px通过。
- build、13项Node测试、核心多语言、西语产品和任务01保护比较通过；972HTML仅三个Capri页变化，无新增缺失Astro资源。既有DE TZ2557-3缩略图失败保留。
- 更新PR #2非生产分支以生成Preview，远程验收结果随后补记。PR #2保持Draft，不merge；PR #1不操作；main仍e2fcdb62，无生产部署或搜索提交。本日志仅PR分支，main未同步。


## 2026-10-29 — 任务03：Capri图库ALT修复与SEO审查（独立分支，未上线）

- 重新fetch确认main为e2fcdb62，任务02-B已于上海10:53:24成功部署f93ae484-1c5d-460f-9722-83c78f5f3d5e；PR #1仍为未合并文档PR，未操作。
- 分离图库完整ALT与短caption，原图片、顺序、caption、业务参数与表单规则保留；复用构建机制仅补DE Capri资源绑定并添加ES/DE描述元数据。
- build、12项Node测试、核心多语言/西语产品/保护比较通过；972个HTML仅英西德Capri三页变化、无新增缺失资源引用；Preview30个HTML/11份Astro资源200/MIME正确，三语言5图与390px验证通过。
- 既有DE TZ2557-3缩略图检查失败保留；SEO已有覆盖，未强改Title/H1或新建重复页。
- [任务03报告](2026-10-29-task03-capri-gallery-seo.md)与[待审批询盘类型方案](2026-10-29-capri-inquiry-proposal.md)已记录；未改Sample默认、MOQ或正式业务规则。
- 本轮仅独立分支/待审查PR和预览，不推main、不生产部署、不提交索引；本日志不代表main已同步。

## 2026-10-28 — 任务 02：西语产品资源修复（本地完成，待部署）

- 保留任务01本地提交6562bd11与全部历史记录，未重置或覆盖用户工作。
- 新增Astro build:done集成，仅绑定西语Capri、Matching Sets、Sports Bras三页的当次构建CSS/JS入口，不改public正文、图片、ALT或业务规则。
- 正式旧CSS/JS重新请求404/MIME错误；Preview28个HTML、13份直接CSS/JS均200且MIME正确；图库、Quote、WhatsApp和手机布局验证通过。
- build、9项Node测试、核心多语言和8页西语产品检查通过；逐文件对比只改变三份目标构建HTML且仅资源地址变化。
- 全站缩略图检查未通过：既有德语TZ2557-3页，已证明本轮未改；另记favicon404与旧翻译问题待办，不扩大修复。
- [执行报告](2026-10-28-spanish-product-assets-fix.md)、[基准](SITE_BASELINE.md)、[待办](BACKLOG.md)已记录。
- 未部署、未push、未修改搜索平台或提交索引；等待老板批准生产发布。

## 2026-10-28 — 任务 01 V2.1：已有曝光的产品页面

- 审计 `/products/matching-sets/`、`/products/capri-workout-set/`、`/products/sports-bras/`，在 GSC 以精确 URL 复核 2026-09-28 至 2026-10-25 的查询/页面数据，并确认三页已有索引记录。
- 新增 `scripts/check-priority-product-pages.py` 和 [执行报告及审批方案](2026-10-28-product-search-audit.md)。
- 验证：build 通过（367 Astro 页面），现有 Node 测试 8/8 通过，核心多语言检查通过，三页保护快照比较一致；正式英语三页390px无横向溢出，Capri报价锚点/WhatsApp链接正常。
- 发现：对应西语静态页旧资源引用缺失；正式 Capri 西语旧 CSS/JS 返回404；Capri图库切换ALT缩短；报价表单默认Sample；Product富结果资格缺少经核实的报价/评价数据。
- 待审批：优先修复目标西语资源引用和构建资源检查，再同步处理Capri图库；MOQ/OEM单位与时间含义需商业确认。
- 未执行：生产页面修改、部署、GSC/Bing/IndexNow提交。受保护商业内容、图片、URL、Title/H1及schema事实保留。无真实WhatsApp消息或表单测试询盘。

## 2026-10-29 — Poppins + DM Sans 本地字体预览

- 状态：仅开发与预览，未部署生产、未推送或合并生产分支。
- 完成：Poppins 导航/标题/按钮，DM Sans 正文/FAQ/参数；保留 15px/500 自然大小写导航；本机 Original / New 对比控制。
- 预览：http://127.0.0.1:4331/?font=new
- 报告：docs/operations/2026-10-29-poppins-dm-sans-preview.md
- 检查：构建、代表页面响应式、五语字形覆盖、本地 HTTP 与资源检查；GSC/Bing/sitemap/IndexNow 均未执行。
- 后续：等待用户明确确认后再讨论正式接入与部署。

## 2026-10-29 — 按用户选择恢复纯 Poppins 预览
用户拒绝 DM Sans 组合，当前预览恢复纯 Poppins：导航 15px/500、自然大小写；恢复上一版 14px 产品卡标题、16px 指南正文等排版。关闭 DM 版比较控制，已验证页面没有 DM Sans 请求，桌面及 390px 手机无横向溢出。未部署生产。当前地址：http://127.0.0.1:4331/?version=poppins 。DM 方案仅作为历史记录保留。


## 2026-10-29 — 纯 Poppins 全站字号角色审计与修复（仅预览）

- 盘点 972 个 HTML；发现通用 H2 字号覆盖 612 个博客卡标题及 21 个知识分类卡标题的风险。
- 按组件职责修复：知识分类 16px、博客卡 20/18px、知识区块 22–26px、文章标题 28–36px；保留 15px/500 自然大小写导航。
- 修复长组合型号在卡片中的换行；不改型号、图片、文案、路由或复制逻辑。
- 80 个代表页面与视口组合最终通过容器边界和排版检查；未新增字体，未加载 DM Sans。
- 报告：docs/operations/2026-10-29-poppins-typography-role-audit.md
- 预览：http://127.0.0.1:4331/activewear-intelligence/?review=type-audit
- 未生产部署，未推送 main，未执行 GSC/Bing/sitemap/IndexNow 提交。
`n2026-10-29：当前预览改为保留原站字号，仅替换 Poppins；导航为 15px/500 自然大小写。55 组比较中导航以外字号变化为 0。报告：docs/operations/2026-10-29-poppins-original-size-preview.md。仅本地预览，未部署。


## 2026-10-29 Ready to Ship 局部优化（仅预览，未上线）

修复 hidden/flex 筛选冲突，移除英文 MOQ 筛选，加入 Compact Browse；保留 249 款产品及原始数据。组合已选 Poppins 原字号字体方案。Cloudflare preview 部署 240781c3 成功，手机/平板/桌面回归通过；未部署生产，未提交 GSC/Bing/IndexNow。报告：2026-10-29-ready-stock-compact-preview.md。预览：https://240781c3.fitclo-v2.pages.dev/ready-to-ship/ 。等待用户确认。


## 2026-10-30 Ready to Ship 吸顶筛选与 H1（仅预览，未上线）

目录内吸顶、手机紧凑搜索及 Filters 展开、深处筛选返回结果顶部；修复手机展开后的滚动锚点遮挡。仅该页 H1 调整为32/40/50px、600字重、1.18行高。367页构建通过，最新HTTPS预览390/768/1440px验证通过。预览别名不变，最新固定版本7a04371b，生产未部署、GSC/Bing/IndexNow未执行。报告：2026-10-30-ready-stock-sticky-preview.md。


## 2026-10-30 Ready to Ship H1 放大、不加粗（仅预览）

按用户反馈将H1调整为Poppins 36/44/52/58px、保持600字重、1.14行高，仅一行class改动。桌面1440px标题文字右边缘比说明多45.84px；手机320/390px无横向溢出，367页构建通过。预览别名不变，固定版本54fc395d；生产未部署。详见2026-10-30-ready-stock-hero-larger-poppins.md。


## 2026-10-30 Poppins全站字重与导航询盘按钮（仅预览）

保留已确认字号，主标题600、区块/产品名500；英文首页标语500并放松行距。导航CTA调整为13px/500、42px高和细边框。静态扫972个HTML，14代表路由23浏览器样本2685标题对比无字号变化或新增横向溢出。构建367页通过；预览b08de27b成功、别名不变；生产未部署，GSC/Bing/IndexNow未提交。报告：2026-10-30-poppins-weight-refinement.md。


## 2026-10-30 Poppins两版之间的中间值（仅预览）

按用户反馈将区块标题、卡片和产品名由500调至600；首页标语600，行高1.095、字距-.03em，取旧版与轻版之间；Ready to Ship目录标题行高1.15；导航询盘按钮14px/500。其余字号、图片、文案、功能不变。静态CSS改动，复用上一轮已通过构建的HTML；HTTP/字体资源检查通过，桌面首页/目录/博客和390px手机无横向溢出。实现提交3753ccf，仍仅非生产预览，待用户确认。

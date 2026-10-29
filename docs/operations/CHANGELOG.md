# Fitclo 运营变更日志

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

# Fitclo 任务 01：已有曝光产品页面审计与审批方案

## 1. 任务名称与执行日期

- 日期：2026-10-28（Asia/Shanghai）。
- 任务：执行用户提供的《已有搜索曝光的高价值产品页面 SEO / GEO / AEO 优化 V2.1》。
- 主要语言：英语；检查对应西语、德语路径及五语言核心页兼容性。
- 范围：`/products/matching-sets/`、`/products/capri-workout-set/`、`/products/sports-bras/`。
- 代码基准：`main` 提交 `ebfe8ad053ecdb825301e6bb2f8816b9fd5f0787`；工作分支 `codex/product-search-intent-audit`。

## 2. 执行状态

**审计与保护性验证完成；页面修复和生产发布待审批。**

没有修改生产页面、Title、H1、URL、canonical、主要正文、真实图片、商业数据或结构化数据中的事实。曾在本地试作 Capri 图库 ALT 修复，发现会改变打包脚本名称并影响静态德语页引用后，已撤回试作。最终页面源码相对基准没有差异。

暂停依据是用户本次文档第一节 H（可能影响询盘功能的修改须先提交方案）、第六节（大范围多语言同步须审批）和第七节（未另外批准不直接生产部署），不是缺少一般技术操作权限。

## 3. 实际完成的工作与证据

### 数据来源与范围

1. 用户任务文档的历史基线；本次又通过已登录 Chrome 的 GSC 界面复核。
2. GSC 属性 `https://www.fitcloo.com/`，搜索类型“网络”，时间 **2026-09-28 至 2026-10-25**，逐页使用“完全匹配的网址”过滤。
3. GSC 网址检查中的现有索引记录；未点击请求收录，也未运行实时测试。
4. 最新 main 代码、既有运营文档、Astro 构建、正式页面 DOM、HTTP 资源状态。
5. Google 官方 Product snippet 文档：https://developers.google.com/search/docs/appearance/structured-data/product-snippet 。

这些是已观测展示/点击，不是全球搜索量、采购人数、实时排名或效果预测。页面汇总与可见查询行不保证相加相等；部分查询可能不展示。未从这些词的自然语言形式推断流量来自 ChatGPT。

| 页面 | 展示 | 点击 | 平均排名（GSC 界面） | 已确认的查询证据 |
| --- | ---: | ---: | ---: | --- |
| Matching Sets | 148 | 1 | 4.0 | `fitclo` 107 展示、1 点击、排名约 1.7；`custom workout sets` 3 展示、0 点击、约 53.7；`which manufacturers can produce matching activewear sets in multiple sizes and colors?` 2 展示、0 点击、约 3.0 |
| Capri Workout Set | 93 | 1 | 9.0 | `capri workout set` 30 展示、0 点击、约 9.3；`brown capri gym set` 2 展示、0 点击、约 10；`workout set capri` 2 展示、0 点击、约 12；`capri workout sets` 1 展示、0 点击 |
| Sports Bras | 113 | 1 | 46.0 | `sports bra manufacturer` 23 展示、0 点击、约 79.9；`personalized sports bras` 7、0、约 9.3；`customizable sports bras` 6、0、约 16.5；`custom sports bra manufacturer` 3、0、约 7.3；`private label sports bras` 2、0、约 3.5 |

**解释：**Matching Sets 的平均排名受品牌词显著影响，不能用页面平均排名 4.0 宣称非品牌采购词排名第 4。Capri 有准确产品词且已有相应页面，应优先保住现有 URL。Sports Bras 的个性化/私标长尾词有信号，通用 manufacturer 词排名明显更靠后，不能只按总展示数判断优化方向。

### 不需要重复修改的现有实现

- Capri Title 已包含准确词组、TZ4549-6、Wholesale 与 Private Label；H1 已为 `Capri Workout Set`，本轮保留。
- 已有型号、面料双命名 `78% Nylon / 22% Spandex (78% Polyamide / 22% Elastane)`、尺码、现货/加标/OEM 路线、FAQ 与报价表单。
- Matching Sets 的目录已有 Capri 详情链接，未重复添加入口或新建近似产品页。
- Sports Bras 已有现货、私标、OEM 三路线说明，以及私标采购页和开发指南链接；本轮不重做这些模块。
- 三个英语页面均自 canonical、可索引、单一 H1、在 sitemap 中；本地链接与图片目标存在，JSON-LD 能解析，FAQ 问答与可见内容对应。
- 分类页使用 CollectionPage，详情页使用 Product；没有把分类页错误改成单一 Product。
- GSC 网址检查显示三个 URL 均已编入索引；Capri 同时有产品增强结果无效提示。

### 新增的保护性审计工具

新增 `scripts/check-priority-product-pages.py`，检查三个英语页面的元数据、JSON-LD/FAQ、BreadcrumbList、内部链接、图片、sitemap 和 hreflang 对应关系。可通过 `--snapshot` / `--compare` 对比正文、元数据、schema、图片属性和链接，防止本轮破坏既有内容。额外输出目标西语/德语静态资源缺失警告，不把这些警告伪装成全语言验证通过。

## 4. 修改文件与关键 URL

实际保留的修改只有：

- `scripts/check-priority-product-pages.py`
- `docs/operations/2026-10-28-product-search-audit.md`
- `docs/operations/CHANGELOG.md`

关键正式页面：

- https://www.fitcloo.com/products/matching-sets/
- https://www.fitcloo.com/products/capri-workout-set/
- https://www.fitcloo.com/products/sports-bras/
- https://www.fitcloo.com/es/products/capri-workout-set/
- https://www.fitcloo.com/de/products/capri-workout-set/

未创建线上预览、PR 或生产部署；本地提交编号见最终交接回复。正式 URL 用于检查既有状态，不代表本轮已更新上线。

## 5. 测试和验证结果

| 项目 | 结果及边界 |
| --- | --- |
| `npm run build` | 通过，367 个 Astro 页面生成；静态镜像随 public 复制，不包含在这个计数内 |
| 现有 Node 测试 | `node --test functions/submit.test.mjs functions/submit-attachments.test.mjs functions/product-selection-suppliers.test.mjs functions/product-selection-merge.test.mjs`：8 项通过，0 失败；测试使用模拟服务，不是真实客户询盘 |
| `node scripts/check-core-locales.mjs` | 通过：15 个 DE/NL/PT-BR 核心页，以及 EN/ES 对应路径的互链验证；不是全站五语言逐页 UI 通过 |
| 三个优先产品页审计 | 元数据、schema/FAQ、图片与内链、sitemap、hreflang 检查通过 |
| 修改前后内容保护比较 | 通过；三个页面的正文、Title、description、H1、schema、图片属性和链接完全一致 |
| 西语资源 | **发现已有缺陷**：三个目标西语页引用的旧资源不在当前构建中；线上 Capri 西语页的旧 CSS/JS 返回 404，见下一节 |
| 手机端 | 正式英语三页在 390px 下均为 `scrollWidth = innerWidth = 390`；Capri 图片正常，报价锚点到达表单；未运行全部设备和完整五语言 UI 矩阵 |
| 桌面端 | Capri 正式页在 1883px 下无横向溢出，主内容图片正常；不声称完成所有页面桌面视觉回归 |
| WhatsApp | 核对 href 和预填内容含 TZ4549-6；没有发送消息 |
| 表单 | 核对隐藏型号、字段和 `checkValidity()`；未填写或提交真实测试询盘。后端模拟测试通过不等于正式邮件已送达 |
| lint/typecheck/npm test | package.json 没有对应命名脚本，未声称运行通过；上述 Node 测试是单独运行 |
| 性能 | 暂无本轮 Lighthouse/CrUX 对比数据；不编造性能分数或提升比例 |

浏览器偶有导航超时；上述手机 DOM 尺寸是在页面完成加载、样式生效后读取。部分普通 HTTP 请求传输不完整，未把失败请求当作 200。GSC 原始截图和本地快照保存在执行机器临时目录，没有将账号画面提交到公开仓库。

## 6. 部署与搜索平台状态

- 生产：未部署，main 未改动。
- GSC：已只读核对三页的历史效果与索引记录；未请求重新索引，未提交 sitemap。
- Capri 最近索引记录的产品摘要提示：应指定 `offers`、`review` 或 `aggregateRating`；对应抓取时间显示 2026-10-23 12:39:38（按 GSC 界面原样记录）。页面本身已索引，BreadcrumbList 有效。
- Google Product snippet 的资格要求至少提供上述三种属性之一。本轮没有经核实、可公开的该产品价格或产品评价，不得添加虚构报价、零价、星级或评论消除错误。现有 Product 语义信息保留；不能宣称富媒体结果问题已修复。
- Bing：未读取 Bing 搜索数据，未提交 URL。
- sitemap：本地构建中确认三个目标 canonical 均在既有 sitemap；未修改 sitemap。
- IndexNow：本轮没有生产变更，未手工提交或触发生产发布工作流。

## 7. 发现的问题、审批方案与商业事实

### A — P1：目标西语页面旧资源引用（建议最先批准）

- 文件/URL：`public/es/products/{matching-sets,capri-workout-set,sports-bras}/index.html`；对应三个 `/es/products/.../` 正式 URL。生成脚本和资源同步方式须在修复时一并追踪，避免下次生成覆盖。
- 原内容：旧 CSS `/_astro/_page_.7HJlMvcy.css`、`/_astro/activewear-quality-control-inspection.CE6PqbRG.css`；Capri 旧 JS `/_astro/hoisted.DPRWvICc.js`；分类页另引用旧 `hoisted.UtB2yFpn.js`。
- 证据：前三个资源在正式请求中返回 HTTP 404；分类页旧 JS 在当前 dist 不存在，线上该文件状态尚未独立验证。不能把所有西语页面都宣布损坏。
- 建议修改：使用当次构建的有效对应资源替换引用，保留既有西语 HTML、元数据、文案和照片；将这三个页面的资源存在性纳入构建检查。先对受影响镜像做只读清单，若需要扩大到其他页面，应另报明确范围，不顺带重译内容。
- 原因/预计收益：恢复正确样式和交互加载，减少采购客户遇到失效 UI 的风险；不承诺流量增幅。
- 风险：错误映射 JS 可能改变语言、图库或表单；须测真实 DOM 与模块依赖，不能仅对资源路径做机械替换。
- 恢复方式：独立提交，可完整恢复原 HTML 和引用。
- 语言同步：至少这三个 ES 页面；EN、DE/NL/PT-BR 核心只做回归验证，不擅自扩大内容同步。

### B — P2：Capri 图片切换后丢失完整 ALT

- 文件/URL：`src/pages/products/capri-workout-set.astro`、对应 ES/DE 镜像；https://www.fitcloo.com/products/capri-workout-set/ 。
- 原内容：图库处理器从按钮 `aria-label` 取值，同时写入图片 ALT 与短 caption；选象牙色后 ALT 变成 `Ivory colorway`。
- 建议修改：按钮单独保存现有 `image.alt` 与 `image.label`；处理器分别写入 ALT 和 caption。象牙色图切换后 ALT 保留 `Ivory Capri Workout Set with layered halter neckline and fold-over dotted waistband`，caption 仍为 `Ivory colorway`。不改图片或主图顺序。
- 原因/预计收益：保留已有准确的图片说明，改善无障碍与机器理解；不新增产品参数。
- 风险：编译 JS 文件名变化会使静态镜像的旧引用失效，必须与 A 的资源检查一同处理。由于这个依赖，本轮没有留下运行时代码修改。
- 恢复方式：独立提交，可恢复按钮属性、处理器及镜像引用。
- 语言同步：该详情页 EN/ES/DE 精确对应项；NL/PT-BR 不存在对应详情时维持原回退，不伪造翻译页或 hreflang。

### C — P2：采购路线与询盘类型表达（需商业确认/审批）

- 文件：Capri 页面；若批准对应语言内容同步，范围应仅限该页面。
- 原内容：速览 `MOQ: 50 Sets`；FAQ 为 `The MOQ depends on the sourcing route... Full OEM production typically starts from 200 pcs per style/color within 4 sizes.`；现货段为 `MOQ depends on current stock; timing can be as fast as 7 days after confirmation.`
- 建议：在老板确认 TZ4549-6 的具体适用条件后，把速览标明 `Ready-stock MOQ: 50 sets`；FAQ 明确现货起订、加标条件与重新开发 MOQ 分别确认。OEM 的 `200 pcs` 是否以套计、按单件还是每款每色，必须先明确；现货 7 天是备货、出货还是运输时间，也须确认。本轮不替换这些数字或承诺。
- 表单原行为：点击 `Request Wholesale Quote` 后到达表单，但询盘类型仍默认 `Sample`。建议仅“样品”入口预选 Sample；“报价”入口显示中性选择或保留用户已选路线，避免默认误分类。选择中性项的准确文字、是否必填应先审核。
- 原因/收益：减少采购理解和询盘归类歧义，不扩展产品承诺。
- 风险：不正确的默认选项可能降低完成率或误标订单；MOQ 写法可能影响报价预期。
- 恢复方式：限定单页独立提交，可恢复原 FAQ、速览与表单行为。
- 语言同步：经确认后同步对应 ES/DE 单页，保持语义一致；不批量改全站 MOQ。

### D — P2：后续内容候选，当前不改 Title/H1

- Matching Sets 的现有 Title 为 `Custom Activewear Sets Manufacturer | FITCLO`；description 为 `Women’s yoga sets and men’s training sets developed as coordinated product capsules.`。建议在剔除品牌词后再评估需不需要改 meta description。候选文案：`Browse coordinated workout sets and send Fitclo your selected styles, colors, sizes and branding brief for ready-stock, private-label or OEM sourcing review.`。该字段来源为共享分类数据，实际实施应避免未经批准连带改写首屏正文。
- Sports Bras 的 Title/H1 和三路线说明已经覆盖 manufacturer/private label/OEM。本轮不重复重做。若后续数据持续支持 personalized/customizable，可审批添加一句采购澄清：`For B2B buyers searching for personalized or customizable sports bras, start with a listed style or a development brief and specify logo placement, labels, packaging, target sizes and quantity for review.` 不由此承诺单件零售定制。
- 收益：有机会提高采购语义清晰度；风险是过度重复、查询意图偏离或 CTR 波动。均可恢复；大范围翻译同步须另批。

受保护的“#1”、500+ 品牌、客户标识/评价、30–50%、工厂面积/员工/产能/库存、成立年份、证书、工厂照片等全部保留。本轮没有完成它们的真实性验证，也未生成任何新背书。该产品即时库存、当前样品费、交期、认证适用范围与可公开价格仍需业务资料确认。

## 8. 后续运营建议

1. 优先审批 A 的资源修复，再合并 B 的图库说明修复；先解决可复现的加载问题。
2. 向业务确认 C 中 MOQ 单位、现货/加标/OEM 条件和时间含义。之后只修改获批的单页文案。
3. 发布获批变更后，记录真实部署日期；核对正式 canonical 返回 200、资源 200、无 noindex、询盘链接、五语言核心回归，再按现有流程通知搜索平台。提交成功与已索引必须分别记录。
4. GSC 以发布后 28 天对前 28 天观察，并在 6–8 周复查；Matching Sets 分品牌/非品牌，Capri 分准确词和颜色词，Sports Bras 分 personalized/customizable/private-label/manufacturer。低展示词不凭一次波动作结论。
5. GA4 观察对应 landing page 的 `whatsapp_click`、`start_product_inquiry`、`generate_lead` / `quote_form_submit`，区分点击与真实成功提交；本轮没有读取 GA4 数值或验证客户收到邮件，不报告转化率提升。
6. Bing 后续检查抓取/索引和查询表现；本轮暂无数据。没有确认新采购意图缺口前，不新建重复文章或产品页。

## 9. 给运营总监的交接摘要

2026-10-28，任务 01 V2.1 已完成审计与保护验证，页面修复/生产发布待老板审批。GSC 精确网页过滤复核 2026-09-28—10-25：Matching Sets 148 展示/1 点击/均排4（其中品牌词 fitclo 107 展示）；Capri 93/1/9，核心词 capri workout set 30 展示/0点击/约9.3；Sports Bras 113/1/46，定制和私标长尾已有信号。三页均已索引。Capri Product snippet 因缺少 offers/review/aggregateRating 不满足富结果资格，本轮保留事实信息，不造价或造评。发现目标西语页旧构建资源缺失，Capri 西语旧 CSS/JS 正式请求返回404；另复现图库切换丢失完整ALT和报价入口默认Sample。新增可运行的三页保护审计脚本和运营日志；build、8项Node测试、核心多语言检查、原内容比较通过。无页面源码变更、无生产部署、无GSC/Bing/IndexNow提交。建议先审批西语资源修复，再同步处理图库，商业MOQ条件确认后再调整文案。请按证据复核后更新看板，不能标记为已上线优化。

# 任务05-A V2.0：AI供应商发现与 Private Label 单页 Preview

执行：2026-10-30 至 2026-10-31（Asia/Shanghai）。状态：研究、限定开发、Draft PR和非生产Preview验收完成；ChatGPT/Claude推荐实测、验证机器人日志和当前Google收录证据受权限限制。禁止生产发布。

## 1. 来源、边界与基线

- 重新 fetch main：9817684564c66682ef3340d015205958731eac25。独立分支 `codex/ai-supplier-discovery`。生产 Cloudflare Pages d3082f46-8d4e-4a0e-a7fc-ea6b10d947aa，github:push/main，对应此 SHA，deploy success（2026-10-30 查询）。项目 main 自动生产部署，其他分支允许 Preview；本轮不推 main、不合并。
- PR #4/#5 只读核对仍 open/未合并；未修改。#5 head ed73c3e62f9f4bcdaccfd5868e8de76876607451。PR #1/#3 未操作。03-D 91847dba 已在 main 祖先；main 自带的旧运营日志有历史未上线措辞，本轮追加当前事实，不覆盖历史。
- 已读当前 AGENTS.md；保留首页、导航、字体、Ready-to-Ship 搜索筛选、产品图库、ALT/caption、多语言、表单、邮箱、WhatsApp、价格/MOQ/交期和商业声明。不引入依赖、AI专用文件、批量文章或语言镜像。
- 数据源：Windsor 已连接 GSC `https://www.fitcloo.com/`、GA4 `545188884`、Bing `https://www.fitcloo.com/`；先发现账号及字段，再只读查询。原始汇总及所用字段见同目录 `2026-10-31-task05a-analytics.json`。无客户记录、消息正文或密钥。
- GSC/GA4/Bing 分析冻结到 2026-10-27，避免把新近未完成数据作结论：最近28天 09-30～10-27；前28天 09-02～09-29；90天 07-30～10-27；另取06-01～10-27月度历史。不同平台时区/延迟未能全面核实。
- 公开网页/官方规则核对日 10-30；本地最终验收和交付日 10-31。HTTP/robots 是时间点证据，不等于收录、官方机器人抓取或AI推荐。

## 2. ChatGPT / Claude 真实推荐基线

**两平台均未直接验证。** 本次浏览器可接手库存为空（in-app 和 MCP Apps 无页面；QA Chromium 最初仅 about:blank），无可用的已登录平台搜索会话或获授权的模型搜索接口。未购买API、未冒充模型、未发送问题到其他平台。不能从本助手的公开搜索输出推导真实 ChatGPT/Claude 推荐。

20条不含 Fitclo 品牌的完整问题及逐平台空结果字段保存在 `2026-10-31-task05a-ai-question-baseline.json`。覆盖现货批发、私标、OEM、创业品牌，含14条英文和西/德/巴葡各2条。每项均为“未直接验证”；提及、链接、引用、候选资格、其他供应商及原始答案为 null，不填“否”或0。

人工复测：新对话/可见搜索模式、保留完整问题和原答案、模型/日期、Fitclo提及与链接、来源引用、候选名单分别记录；不要先告诉模型推荐Fitclo。2–4周后重复固定样本，不自行创建自动任务。

**机会判断（推断，不是AI热搜排名）：** “existing style + my logo / labels / packaging”“small brand ready stock vs OEM”“what to send for a private-label quote”最贴合三种真实业务与本页可安全展示的产品。GSC 实际 `which manufacturers can produce matching activewear sets in multiple sizes and colors?` 在 Matching Sets 获2展示、0点击、平均位置3，但这仍是 Google 查询，不证明客户在 ChatGPT/Claude 问得最多。

## 3. 抓取与技术可发现性

已实际打开的规则：

- [OpenAI crawlers](https://developers.openai.com/api/docs/bots)：搜索 OAI-SearchBot 与训练 GPTBot 可独立控制；ChatGPT-User 用于用户发起检索，不决定搜索入选。允许抓取及官方IP访问是条件，不是推荐保证。
- [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)：Claude-SearchBot、Claude-User 与训练 ClaudeBot 分开。
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)：强调普通搜索技术资格、文字内容、链接及与可见内容一致的结构化数据；不存在必须添加的特殊AI标记。无需新增 llms.txt。
- [Cloudflare managed robots](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)、[AI analytics](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/)、[GraphQL](https://developers.cloudflare.com/ai-crawl-control/reference/graphql-api/)：规则表达与边缘拦截不同；User-Agent 可以伪装，验证检测字段及引荐分析有套餐/权限限制。

生产 `/robots.txt` 200，确认 Cloudflare Managed Content 前缀实际存在；其通用信号 `search=yes,ai-train=no,use=reference`，原站另有 `ai-input=yes`；OAI-SearchBot、ChatGPT-User、Claude-SearchBot、Claude-User、PerplexityBot/Perplexity-User、Googlebot、Bingbot 均允许 `/`。GPTBot/ClaudeBot 等训练仍禁止，本轮不修改。

私标页7种模拟 UA 均200并含正文，只能证明从本次请求网络未被该UA规则拦截。不能冒充真实爬虫IP验证。Cloudflare zones GET200、Free Website；bot_management、rulesets、robots setting、security_level GET403。GraphQL仅查询过去24小时汇总检测ID/状态码，HTTP200但返回 authz：该zone无 botDetectionIds 权限。**官方机器人实际成功/被WAF拦截：暂无数据，无权限验证；未修改任何设置。** 免费套餐不提供文档所述付费AI referrer图表；不升级、不购买。

实际生产200、自 canonical、index/follow、无 X-Robots-Tag noindex：`/`、`/about/`、`/contact/`、`/private-label/`、`/oem-activewear-manufacturer/`、`/ready-to-ship/`、`/products/matching-sets/`、`/products/sports-bras/`、`/products/leggings/`、`/products/capri-workout-set/` 及西/德/荷/巴葡现有 private-label 页。可读取服务端正文。Manufacturing 实际是 `/capabilities/`（200），测试时猜测的 `/manufacturing/` 404不是实际导航目标，**不作为应修复URL**。

现有 Organization 有统一 #organization、Fitclo、域名、销售邮箱、Guangzhou/Guangdong/CN 和服务信息；本轮保持。当前私标 Service schema 与既有目录语义保留，不增加虚构 offers/ratings/reviews 或新的FAQ schema。

## 4. 品牌、外部引用、同行与商业事实

已确认事实与未核实声明分开：

|分级|事实/声明|实际证据与处理|
|---|---|---|
|A 可使用|Fitclo，fitcloo.com，Guangzhou, China；现货/现有款私标/OEM三路线；logo/标签/吊牌/包装|老板本任务确认；现有页面及 businessFacts。新增文字只复述这些范围|
|A 可使用|3335、TZ4549-6、TZ2570-4及对应产品页/图片|现有产品源文件、可访问详情页；新增仅型号、款式和链接，不扩写参数或库存|
|B 部分证据|当前库存、逐SKU品牌工艺可行性、样品及报价条件|只有目录和通用业务说明；必须逐款确认，不发布库存保证|
|B 部分证据|公开第三方引用 Fitclo 专业文章|Elahi Vertex 页面实际HTML链接指向本站样品审批清单；只证明有外部引用，不能独立证明工厂能力、认证或客户关系|
|C 待老板核实|China's #1；500+ brands；2010成立；16,000㎡；500+ staff；450k月产；25+研发人员|Hero/Footer/About/Capabilities 当前网站自述；本轮未取得独立证明/老板材料。保留，不判真伪、不加强|
|C 待老板核实|Save 30–50%；ISO/SGS/GRS、100% QC、可持续包装等|现有Hero、About、Capabilities和私标页的声明；需要基准/有效证书及适用主体范围/检验流程材料；本轮不删改或新增|
|B/C 条件待确认|通用 businessFacts 20件特定现货试单、50常见参考、OEM150–250；Capri FAQ200；首页卡片2–7天与通用无定制2–3天|不同层级和条件，不可混用；保留原文，本轮不把任一数字扩大为全款统一承诺。只要求逐款确认|

老板最少需补材料：可公开的真实公司主体英文名/品牌关系、真实已运营LinkedIn/目录URL；可对外展示的有效证书及工厂/人员/产能/客户数字证明；具体可公开SKU品牌工艺与报价条件。**本轮新增内容不依赖这些强声明，因此无需等待材料才制作Preview。**

公开实体查询未找到足以确认归属的 LinkedIn/Europages/Kompass Fitclo资料URL；这不是“不存在”的证明。Footer 的 LinkedIn/Instagram 实际为 `#`，不能当真实外部资料，也不添入 sameAs。

外部样品审批引用：[Elahi Vertex](https://elahivertexinternational.com/streetwear-sample-approval/)。用原始HTTP HTML再次确认实际href：`https://www.fitcloo.com/blogs/activewear-sample-approval-checklist/?utm_source=chatgpt.com`。因此第三方点击也可能携带 ChatGPT UTM；不能仅凭GA4来源标签证明来自AI回答。未知该外站所有权、独立编辑审核和该链接贡献的具体访问量，不作背书。

三家同行均打开实际官网，以下仅比较其公开内容，不认证其商业声明、不推断流量：

|同行/来源|可核实的页面表达|Fitclo可借鉴与差异|
|---|---|---|
|[YogaSew private label](https://www.yogasew.com/customize/private-label)|公司主体和地点、既有版型/定制区别、样品与数量单位、明确不做现货|把采购边界写清楚比长口号更有用；Fitclo确有现货路线，但不能套用对方MOQ和工艺承诺|
|[YOUMEGA](https://iyoumega.com/)|区分stock/logo与OEM、具体logo/标签/包装项目、产品目录与采购问题|可用可识别SKU和完整报价输入连接内容与询盘；不能复制其设备/认证/时效数据|
|[Seam Apparel sportswear](https://seamapparel.com/sports-apparel-manufacturer/)|目标买家、面料类型、分步骤样品/生产流程、采购FAQ|可展示采购步骤；其性能和美国制造定位不转用于Fitclo|

外部供应商提及的独立证据没有在本轮对三家逐一验证，不能声称同行被AI推荐更多。Fitclo机会是把现货、SKU和品牌加工选择连接到一个可比较的采购 brief，而不是堆叠“最佳工厂”。

## 5. GSC / Bing / GA4 真实基线

|GSC期间|点击|展示|CTR|平均位置（展示加权）|
|---|---:|---:|---:|---:|
|近28天09-30～10-27|141|2,603|5.42%|14.38|
|前28天09-02～09-29|130|2,135|6.09%|15.27|
|90天07-30～10-27|354|7,319|4.84%|20.95|

近28天点击较前期+8.5%，展示+21.9%，CTR下降；小样本/查询及页面组合变化不能归因于某次改版。GSC06/07/08/09月点击40/72/75/150，展示224/981/2491/2300；10月仅1～27日121点击/2438展示，不与完整月作同长度比较。没有证据支持“6月后持续下降”，也不从月度汇总编造原因。

近28天 `/private-label/` 43展示/0点击/平均位置25.65，前28天22/1/2.64；90天67/1/17.46。关键词组合变化很大，不能把平均位置差直接判定同一词下跌。90天可见查询 `custom logo activewear`、`private label gym clothing`、`private label fitness apparel manufacturers` 各1展示/0点击，均属微小样本，不是搜索量排名。

同近28天 `/ready-to-ship/`18展示/0点击，`/oem-activewear-manufacturer/`2/0；三者比较后选私标：有较多现存展示、明确私标问题匹配、已具备路线内容、改动风险低。**不是因为已验证它被AI推荐最多。**

近28天真实 `sports bra manufacturer`26展示0点击/平均76.77，相关supplier词已有 `/products/sports-bras/` 承接，不建议新建同义页面。澳洲批发/英国私标查询有零星展示，优先现页，不一律新建国家页。国家点击/展示：西班牙35/234、美国24/918、澳洲9/99、墨西哥6/103、英国3/98、德国2/66、荷兰2/17、巴西1/91。国家不等于询盘所在地或资格。

GSC连接返回 sitemap-index（提交/下载10-30）967 submitted、0 errors、0 warnings；本轮未提交。该数量不是索引数量，也不能证明所有页已收录。连接器没有 URL Inspection/未收录原因接口，当前收录状态及Google选择canonical：**暂无数据**。展示证明历史搜索展现，不替代当前URL检查。构建与HTTP canonical/hreflang通过另列，不冒称Google已认定。

Bing90天查询汇总58展示/4点击。连接字段只提供普通query/clicks/impressions，无AI Performance引用页、引用数或Grounding Queries，因此 **Bing AI Performance暂无数据**，不冒充ChatGPT/Claude引用。

GA4 请求90天实际返回首日09-08，只有50天有活动行，06月以来查询也只返回09/10活动；更早采集完整性未知。近28天 ChatGPT 来源：`chatgpt.com / ai-assistant`701 sessions，加 `chatgpt.com / (none)`4，共705；前28天535+2=537（仅22天有行，比较有覆盖偏差）。90天1236+6=1242。Claude来源在返回数据中无行，**不代表Claude从未推荐或访问**。Copilot1、Perplexity1等不是这两平台推荐证据。

近28天 ChatGPT 标记来源 WhatsApp点击344+3=347；generate_lead8；quote_form_submit1。前期WhatsApp123+1=124，generate_lead10；两种表单成功事件不能相加当成9或11个客户。90天 ChatGPT标记私标落地页：英文6 sessions/3 WhatsApp点击，西语63 sessions/14 WhatsApp点击/2 generate_lead。访问、点击、成功事件、邮件到达、有效B2B询盘和订单分别计量。

当前代码 `src/lib/inquiry-client.ts`：只有 response.ok + success + id 才记录 generate_lead 及 quote_form_submit；WhatsApp click仅点击。归因在sessionStorage保留landing/referrer/UTM并传邮件/CRM。**未改事件语义或表单规则。**历史事件定义版本、内部访问过滤、UTM真实性、跨事件去重及采购资格未核实；不能按事件数宣称有效询盘或转化率。后续只建议用聚合来源+落地页观察并由Jason私下判断线索资格，不公开客户数据。

## 6. 本轮实际页面与前后对比

目标唯一URL：https://www.fitcloo.com/private-label/ （当前生产仍旧版）。运行代码只改 `src/pages/private-label.astro`。

|位置|之前|Preview改动|
|---|---|---|
|Hero之后|直接进入泛化私标定义/制造步骤|新增独立可读的Guangzhou供应商说明，区分现货/现有款品牌加工/OEM，强调逐款核对；锚点跳已有路线/新brief|
|既有三路线|已经完成，非本轮新开发|原文原链接保留，仅增加锚点和滚动留白|
|路线与表单之间|只有品类服务链接，没有该段SKU shortlist/具体brief|新增3335/TZ4549-6/TZ2570-4真实产品入口；5项询价输入：型号路线、数量单位、品牌范围、样品审批、目的地时间；链接既有标签包装页和样品清单，按钮到原表单|
|商业、SEO和功能|既有Title/H1/描述/schema/图片、表单与追踪|全部保持，不新增承诺数字/价格/库存/认证/评价；不增加FAQ和特殊AI文件|

此为服务端可读取文字和自然内链的改进假设，不代表AI一定引用。英文单页先Preview，ES/DE/NL/PT内容不机械复制；各语言原URL及互链保持。只复用现有样式；390px型号不拆行，新增锚点留出固定导航空间。

## 7. 验证及既有问题

已实际完成：main基线 build及修改后 build成功（367 Astro生成页，加静态镜像总972 HTML）；13项现有Node测试通过；core-locales15页通过；西语产品8 routes通过；3个重点英语产品的文字/图片/schema/SEO/链接与main基线完全一致。仓库没有 lint/typecheck/npm test脚本，未虚报这些脚本已跑。

972 HTML逐文件保护：只有 `private-label/index.html` 改变；CSS哈希未变，其他971 HTML未变。构建有两个不被HTML或其他JS引用的汇总入口包装文件名替换，不属于源码业务改动。已验证原私标正文、Title/H1、描述、schema、图片、header/footer、表单HTML和hreflang与基线一致，新增内链文件和锚点存在。

本地HTTP：30个重点HTML/11份直接CSS/JS均200、MIME正确。选页桌面1440/手机390浏览器已实际查看、新采购内容可见、390无横向溢出、Quote锚点到原表单；WhatsApp URL与预填及手机号保持，不发消息。未提交真实询盘、不触发真实客户邮件。最终远程Preview待下面补记。

已知失败/边界：全站缩略图检查仍在DE TZ2557-3失败；非目标ES/DE静态旧资源缺失是main既有问题，并非本轮新增。核心抽查资源200不代表全站所有静态资源通过，不将此包装为全站通过。

静态扫描具体发现600份既有HTML含缺失旧Astro资源引用；其页面与CSS均与本轮main基线相同，不是本轮新产生。此为构建扫描计数，**没有逐一验证600页的生产浏览器影响**。已保存聚合和示例，不为凑本轮通过而批量重建语言页。

本轮新发现的既有线上重要问题：Header `productsPath='/products'` 与 `${productsPath}${slug}/` 拼接，生成 `/productssports-bras/` 等错误品类链接。原始生产HTML包含该链接，实际404，而正确 `/products/sports-bras/`200；此处与修改后header逐字相同，非本轮引入。影响客户进入产品，应作为下一项限定修复，不在本页PR夹带更改。

## 8. 未来30天仅3项任务

### P1／第1–3天：恢复采购品类入口（唯一最推荐下一任务）

- 目标：Header导向现有 `/products/sports-bras/`、`/products/leggings/`、`/products/matching-sets/` 等真实品类，所有采购客户。
- 问题/证据：实际生产缺斜线链接404，运动文胸已有真实采购查询展示。采购问题“supplier/manufacturer”的现页应可到达。
- 范围：只修URL拼接及相关原生链接回归，不改导航UI/产品事实/表单；不另造页面。无商业确认需求，需独立开发及Preview审批，不能连带发布05-A或PR4/5。
- 验收：桌面/390菜单、英西德荷巴葡链接、HTTP和锚点、原视觉与资源保护。指标：无效入口数量归零；观察发布后7/28天品类访问与WhatsApp/lead事件，不保证增长。
- 可复制提示词：`执行Fitclo下一项限定修复：核对最新main，修复Header现有产品品类URL拼接缺少斜线的问题，保留导航设计和所有业务内容。验证五语言桌面/390菜单的实际目标HTTP与锚点、资源及构建；独立分支、Draft PR和非生产Preview，不合并main、不部署生产、不操作PR #4/#5。记录前后证据及生产审批所需事项。`

### P1／第4–14天：审批私标单页与补真实品牌证据

- 目标：本轮 `/private-label/`；买家为现货加品牌的海外小品牌，问题“own logo/labels/packaging supplier”。
- 证据：微量GSC商业词、真实带AI来源标签访问、竞品清晰采购范围；已有外部样品文章引用但Footer社媒链接为#，企业归属外部证据不足。
- 方案/范围：先审阅本轮Draft/Preview再单独决定生产；老板提供真实英文主体/品牌关系及既有社媒目录URL后，只拟企业身份与适当sameAs修订；没资料不添假链接，不购买引用，不对外发布资料。需商业资料及独立发布批准。
- 验收：仅真实可公开资料、可见内容与schema一致；预览内链/表单/手机及保护比较。指标：固定20问题提及/引用/候选分开；私标落地访问与合格询盘由老板判断。上线后14/28天GSC查询页、GA4来源观察。
- 可复制提示词：`继续Fitclo私标增长：先复核任务05-A的Draft PR、Preview和真实证据，保留本轮单页边界。核对我提供的真实企业主体、品牌关系和社媒/目录URL，提出最小可见身份与schema一致性方案；未提供材料不编造、不外发。需要生产发布时先给具体范围和验收结论等我单独批准；不操作PR #4/#5，不修改商业数字、表单或训练抓取政策。`

### P2／第15–30天：私标AI归因与真实推荐复测

- 目标：`/private-label/`、`/es/private-label-activewear/` 及既有 `/blogs/activewear-sample-approval-checklist/`；美国/英国/澳洲和西语采购客户。
- 问题/证据：外站真实链接带ChatGPT UTM，GA4来源并不等于平台引用；当前没有真实平台回答、Bing AI Performance字段或URL Inspection证据。
- 方案：在用户已登录平台和只读分析权限可用后执行固定问题样本，保留原答案/引用；用只读聚合复核内访过滤、UTM与来源分布、同一成功事件去重口径，不访问客户正文、不改事件语义。必要追踪改动先出独立最小方案，不先实施。
- 验收：平台/模型/模式/日期完整，搜索引擎数据与平台数据分开；无权限明确缺失。指标：推荐候选率/引用页（样本非总体）、可信AI来源访问、WhatsApp点击、成功表单分别列；资格只由授权销售核对。不假定排名/推荐增长。
- 可复制提示词：`复测Fitclo任务05-A固定采购问题：使用我已登录且授权的ChatGPT/Claude搜索会话逐项记录模型、模式、原问题、原回答、Fitclo提及/链接/候选和真实引用；无权限标未直接验证。只读核对最近28天及前28天GSC/GA4，重点私标英西页及ChatGPT UTM污染、内访过滤和成功事件口径。Bing AI Performance单列；不创建自动任务、不买API、不改事件或生产配置。基于证据只提出下一项最有价值的改进。`

## 9. 运营总监交接

本轮有真实GSC/GA4/Bing普通搜索数据；没有真实ChatGPT/Claude推荐答案，不能宣称已被推荐或引用。搜索机器人robots与页面文字条件通过，Cloudflare验证机器人日志无权限，Bing AI Performance/当前GoogleURL收录检查暂无数据。选择 `/private-label/` 做限定可引用采购说明、真实SKU内链与brief，原商业内容及功能保持，等待Draft/Preview验收补记与老板单独生产批准。下一项建议修复已证实的Header品类404，避免采购流量进入无效入口；与现货目录已完成搜索/筛选不是同一任务。原PR4/5及所有main工作不变。

**是否修改生产网站：否。是否提交GSC/Bing/IndexNow：否，Preview不应提交搜索引擎。** 提交成功、抓取、索引、AI引用、访问、有效询盘和订单必须分别报告。没有自动回传ChatGPT项目。

## 远程Preview验收补记 — 2026-10-31

- 代码及研究提交：253db542088b9cfeb7fe71a1d71a16d0328ab446；[Draft PR #6](https://github.com/fancojason/fitclo-v2/pull/6)，不合并。后续验收日志是独立文档提交，不改变运行代码。
- Cloudflare Preview：1a62cbb6-019c-4c25-90f6-ecc2dbc5af0c；[预览选页](https://1a62cbb6.fitclo-v2.pages.dev/private-label/)。API确认environment=preview、source=253db542完整SHA、build/deploy success；完成时间2026-10-31 08:52:22 Asia/Shanghai。
- 远程30 HTML及11份直接CSS/JS200、MIME正确；选页3资源200，8个新增链接/锚点均正常，canonical仍指生产URL，六组原hreflang保持。表单唯一、原必填字段和WhatsApp参数不变，原生Quote点击进入#inquiry。无真实提交或消息。
- 1440桌面scrollWidth1440、390手机scrollWidth390，三卡单列358px，无横向溢出；导航高度76px不变；型号nowrap、锚点96px留白。远程Console无error/warn，真实截图已查看。详见 `2026-10-31-task05a-browser-evidence.json`。
- 后续验收日志提交仅记录这些结果；以上Preview验收明确针对代码253db542，不将其他文档提交的未验Preview冒称已验。生产main及Cloudflare生产部署未改，PR4/5未操作。

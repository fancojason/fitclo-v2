# 任务05-D：真实AI基线与品牌实体证据

日期：2026-10-31（Asia/Shanghai）。范围：只读研究 + 英文 About 极小改进；Draft PR/非生产 Preview，禁止生产发布。

## 基线与数据来源

- 最新 origin/main：0c931c0ae4abc1372afda392b14fd1137fa484fe；生产 Cloudflare 46eb031f-41de-4b82-b5b5-5c89b684bb3e 成功，PR7 Header 与 PR6 私标改进已上线。历史日志“整合中”是旧时点，不删除历史。
- 复用 task05a-ai-growth.md、task05a-ai-question-baseline.json、task05a-analytics.json；原数据时间 2026-09-30 至 10-27，本轮没有重新运行90天分析，没有新增销售确认的合格询盘证据。
- 10月31日公开HTTP核对：首页、/about/、/contact/、/private-label/、/capabilities/、/oem-activewear-manufacturer/、/ready-to-ship/ 均200。详细结构化证据见 task05d-public-evidence.json。
- 没有可用的已授权真实 ChatGPT Search/Claude Web Search会话：按任务要求立即停止平台尝试，不再调查权限。两平台均“未直接验证”，不是“没有推荐”。五条问题直接取原20题ID 1/7/6/5/12，不改题、不诱导；原题、十行记录表见 task05d-manual-test-pack.md 和 JSON。

## 品牌实体证据表

|项目|已确认事实|限制/待核实|
|---|---|---|
|品牌/官网|Fitclo/FITCLO；https://www.fitcloo.com/|不等同注册法律主体；Footer的 FITCLO APPAREL MFG 不是注册证明|
|地点/业务|官网一致指向 Guangzhou, China；女式运动服B2B，现货、现款加标、OEM/ODM|具体款库存、MOQ、交期逐单核对，不能全站泛化|
|联系|sales@fitcloo.com（老板04-F明确确认），官网WhatsApp +86 171 6083 7538|联系方式可核对，不等于已测试邮件投递；本轮未发送消息|
|Organization|既有name/alternateName/domain/city/contact/foundingDate|没有已验证legalName/sameAs；不新增虚构主体/社媒|
|社媒|所查页面Footer LinkedIn/Instagram实际href均为#|无有效企业资料入口；本轮不改全局Footer|
|行业目录|针对LinkedIn企业、Europages、Kompass搜索未确认归属本企业的URL|搜不到不等于不存在；需老板提供已有受控账号/档案URL|
|名称歧义|搜索出现同名个人服装帖与其他地区实体|没有官网/广州业务关联证明，不作sameAs或官方资料|
|第三方候选名单|https://www.chilat.com/blog/2096788147174543362 列出FITCLO，原始HTML确有fitcloo.com链接|文章标注2026-09-07；指标主要来自供应商自述，不是工厂审计；编辑独立性/归属未验证；不是AI推荐证据|
|第三方内容引用|https://elahivertexinternational.com/streetwear-sample-approval/ 链向本站样品审批文章|链接实际带utm_source=chatgpt.com；这能污染来源归因，不证明ChatGPT生成引用；不证明供应能力|

推断：当前最大短板是品牌、真实签约主体、外部企业档案及可验证能力材料之间的关联薄弱。现有公开文字可解释供应方向，但不能替代工商、认证与生产证明。

## 商业声明证据分级（保留原文，不擅自判假）

|出现位置|现有声明|本轮可取得证据|需老板确认与潜在影响|
|---|---|---|---|
|/ 首页Hero|China's #1 Activewear Manufacturer|页面自述，无比较口径/排名来源|需要排名依据；未经证实不能复制到新资料|
|共享Footer|500+ Global Brands|页面自述，无可核实客户证明|客户统计口径、授权案例|
|/about/、共享Stats/Organization|Founded 2010、16+ years|页面/Schema一致，非注册证据|主体成立、品牌/工厂历史关系|
|/about/、/capabilities/|16,000㎡、500+员工、450,000件/月；能力页25+研发|页面自述，无当期产能/人员报告或审计|统计日期、主体与工厂对应|
|/about/|Over 4,000,000 units stock for immediate delivery|无带日期SKU库存证明|现货时效及真实可售范围|
|/about/|SGS / ISO与证书拼图|图片存在，但不能清楚核对持证主体、编号、范围、有效期|原始证书/报告与发行方核验；检测机构名不等于体系认证|
|/about/证书拼图|OEKO-TEX图形|已查看原图，文字小且主体/编号/期限不可读|不能据图认定本企业所有产品获证|
|/capabilities/元数据及面料说明|GRS|页面自述，无对应材料/范围/链路证明|面料与工厂认证范围区分|
|所查About/Capabilities|BSCI|没有建立有效报告证据；不能由拼图推断认证|若要对外使用，需实际社会责任审核报告及有效状态|
|/about/、/capabilities/|100% inspection / zero defects|无可核对检验记录、标准/审计|质量流程和绝对承诺风险|
|/ 首页CTA|Save 30–50%|无可比成本口径/计算证据|比较基准与适用条件|

这些均标为待证实，不认定虚假。本轮不删除或修改，不复制到新增区块、FAQ、Schema、外部档案。原证书图片路径 public/images/migrated/third-party/hfd7099e6ab8a449db9590c84b4fdb066i-9cf3130d3c.webp，仅能确认图片存在。

## 唯一实施选择及范围

|方案|判断|
|---|---|
|A 现有About资料组织|选择：已有事实足够、低成本、复用现有高价值URL，集中官网/地点/产品/采购路线/联系/核验指南|
|B 外部企业资料|暂不实施：缺老板确认的真实账号与法律身份；不得擅自建立外部档案|
|C 新核验内容|不另建：已有 supplier-vetting-guide 及 sample-approval 内容，直接内链避免重复|

唯一运行文件 src/pages/about.astro：增加 fitclo-supplier-profile 区块；沿用现有样式与WhatsApp helper，不动Header/表单/Schema/商业数字/图片/SEO。目标 /about/#fitclo-supplier-profile。此改进提高可发现与核实便利，不代表已取得独立企业证明或AI推荐。

## 验证

- clean main与修改后 npm run build 均通过。972 HTML：只有 about/index.html改变，其余971份逐字相同；CSS/引用JS无变化。原Title/H1/meta/canonical/hreflang/JSON-LD/图片/Header/Footer/表单/商业正文一致，见 task05d-content-protection.json。
- 16 Node测试通过；15核心语言、8西语产品通过；3重点英语产品检查通过。已有DE matching-sets/sports-bras旧静态资源警告保留，未扩修。
- 本地真实浏览器1440与390：新资料可读，390 scrollWidth=390，无横向溢出；截图已检查。新联系链接/原表单仅检查，不发真实询盘。
- 项目未定义lint/typecheck/npm test脚本，未运行这三条不存在的命令；使用现有Node测试。
- Draft PR及远程Preview验收另附补记；本文件初次提交不代表已完成远程验收。
- 不合并main、不操作PR4/5，不发送邮件/客户消息，不改CRM，不购买工具。不提交GSC/Bing/IndexNow。

## 运营总监交接：后续30天最多三项（唯一下一步为P1）

1. P1 唯一下一步：老板提供真实签约法律主体、与Fitclo关系及允许公开范围，已有受控企业档案URL；只需提供希望强化的能力/认证原始证据。核对后制定最小身份一致性方案，另行审批发布，不猜legalName/sameAs。
2. P2 在真实ChatGPT Search/Claude Web Search新会话执行既有五题并保存回答/来源，分开记录提及、候选名单、真实引用，不将公开网页或UTM代替平台证据。
3. P2 若About获独立发布批准，记录上线基线并在2–4周观察该页真实引荐、WhatsApp点击、表单成功和销售确认线索；30天复测同题，不保证流量增长。

仍需老板的最少资料：法律主体/品牌关系与公开许可；实际控制的企业主页/目录URL（没有可明确说没有）；拟继续强化声明的可核验证据。无需银行账户资料。无新增收费。生产未修改。

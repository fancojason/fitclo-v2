# 任务03：Capri Workout Set 精准SEO与询盘体验

## 1. 日期、范围及基准

2026-10-29，TZ4549-6。主要页面 https://www.fitcloo.com/products/capri-workout-set/ ，同时验证ES/DE对应页及五语言核心页。

已重新fetch，main为任务02-B上线提交 `e2fcdb62936f31188ae3025415b09ebfb02f8a87`。任务02-B生产部署为 `f93ae484-1c5d-460f-9722-83c78f5f3d5e`，上海2026-10-29 10:53:24完成。PR #1为未合并的文档PR，本轮仅只读核对，没有合并、关闭或修改它。

## 2. 状态

已完成授权代码修复与本地构建/Preview验证；**任务03未部署生产**。报价类型业务规则仅提交方案，未实施。独立分支 `codex/capri-gallery-alt`；提交、待审查PR及可用远程预览链接见最终交接报告/PR检查。

## 3. 实际修改

- EN图库按钮分别保留既有完整ALT和短caption；切换时分别读取，修复原来从短aria-label推导ALT的问题。
- 抽取小型 `src/lib/product-gallery.mjs` 读取函数以便回归测试；点击、原有上一张/下一张、原有追踪和表单监听保留。
- 原象牙色ALT `Ivory Capri Workout Set with layered halter neckline and fold-over dotted waistband` 在切换后完整保留，caption仍为 `Ivory colorway`。
- 复用任务02现有构建资源机制，仅额外纳入 **DE Capri单页**；原ES三页机制保留，没有新增第二套资源系统。
- 构建ES/DE Capri时添加描述性ALT元数据：现有主图ALT逐字保留，其他描述是原英语图片说明的等义西/德文本，无新增产品事实。既有翻译caption及aria-label不改。
- 图片src、颜色、顺序、尺寸、静态主图ALT不变；没有编辑public中批准过的业务HTML。
- 12项Node测试包含完整ALT/短caption分离、旧标签兼容、ES/DE资源绑定、主图ALT保留、幂等及错误图片对应关系时停止构建。

## 4. 文件与页面

代码：`src/pages/products/capri-workout-set.astro`、`src/lib/product-gallery.mjs`、`scripts/spanish-product-assets.mjs`、`scripts/capri-gallery.test.mjs`。

记录：本报告、`2026-10-29-capri-inquiry-proposal.md`、`BACKLOG.md`、`CHANGELOG.md`。日志只在独立任务分支更新，不声称main已同步。

本地测试URL：

- http://127.0.0.1:4322/products/capri-workout-set/
- http://127.0.0.1:4322/es/products/capri-workout-set/
- http://127.0.0.1:4322/de/products/capri-workout-set/

测试服务可按 `npm run build` 后 `npm run preview -- --host 127.0.0.1 --port 4322` 复现。正式URL保持原样，不能将本地链接视为已上线修复。

## 5. SEO判断与测试

### 已核实基线与采购意图

沿用用户提供、任务01已核验的GSC历史范围2026-09-28至2026-10-25：页面93展示/1点击/均排约9；capri workout set 30展示/0点击/约9.33，页面已有索引。本轮未重新读取GSC或声称新排名。

| 词组/意图 | 页面现有覆盖 | 本轮判断 |
| --- | --- | --- |
| capri workout set | Title/H1、正文、SKU、Product与面包屑 | 保留准确现有词组 |
| capri workout set wholesale | Title的Wholesale、meta description、批发路线与Quote入口 | 已覆盖，不堆砌完整词串 |
| private label capri workout set | Title的Private Label、定制选项、路线及FAQ | 已覆盖，不重写Title/H1 |
| capri leggings set supplier | mid-calf leggings、面料、规格、现货/私标/OEM内容及询盘路径 | 语义已覆盖；该长尾仍为待验证采购词，不当成已有GSC搜索量 |

保留Title `Capri Workout Set TZ4549-6 | Wholesale & Private Label`、H1 `Capri Workout Set` 和现有meta description。没有新建页面或Blog，没有改大段正文。

Product的SKU、material、size和图片与可见规格一致；BreadcrumbList为Home→Products→Matching Sets→产品。规格表是服务端HTML，不依赖图库JS才能读取。FAQ与可见问答一致；不伪造offers/price/review/rating/stock来获得富结果。

Matching Sets已有通往Capri详情的产品链接，Capri有分类面包屑及三篇相关采购/趋势文章，不重复建设。现有其他Capri款式如knee-length-capri-leggings-workout-set与three-quarter-sleeve-capri-workout-set可作为日后相关产品候选，但本轮不新增模块、参数或重复产品页。

### 测试记录

- `npm run build`通过，367个Astro页面；日志确认原ES三页和新增DE Capri资源绑定。
- `node --test scripts/capri-gallery.test.mjs scripts/spanish-product-assets.test.mjs functions/submit.test.mjs functions/submit-attachments.test.mjs functions/product-selection-suppliers.test.mjs functions/product-selection-merge.test.mjs`：12/12通过。
- `node scripts/check-core-locales.mjs`、`node scripts/check-spanish-products.mjs`通过。
- `python scripts/check-priority-product-pages.py --compare <任务01快照>`通过：英语三页的正文、Title、description、H1、schema、图片属性、链接与基线一致。
- 全部972份HTML构建对比：只改变EN/ES/DE Capri三页；**新增缺失Astro引用为0**。其他旧镜像的已存在资源缺失没有被伪报为已解决。
- ES/DE去除资源URL与新ALT元数据后，与原public文件逐字一致；caption、表单和业务内容未改。
- 30个Preview HTML返回200，11份Astro入口CSS/JS返回200且MIME正确。EN/ES/DE三页自canonical、可索引、SKU和5个图库项目正常；已有sitemap与hreflang检查通过。
- 浏览器逐语言验证全部5图：ALT与独立描述一致、caption保持原行为、末张下一张回首张、首张上一张回末张；鼠标与Tab+Enter切换正常。
- EN/ES/DE在390px下均无横向溢出；英语桌面检查通过；没有相关Console error/warn。
- Quote到达原锚点，默认Sample仍保留；WhatsApp链接有效，EN/ES预填有型号。德语沿用既有通用预填文本，不声称本轮已新增德语型号上下文。
- `node scripts/check-product-thumbnails.mjs`仍因既有DE TZ2557-3 srcset缺失失败；该页哈希未变，本轮未扩修。
- package.json无lint/typecheck/npm test命名脚本；未虚构这些检查通过。没有正式表单或WhatsApp测试消息。

## 6. 部署与搜索平台

任务03未向main推送、未生产部署。任务02-B生产状态保留。独立PR/预览如创建，其状态必须与生产区分；PR #1仍未合并。

没有操作GSC/Bing设置、请求索引、提交sitemap或IndexNow。sitemap只做构建检查，没有新增canonical URL。

## 7. 待审批与风险

- [报价入口方案](2026-10-29-capri-inquiry-proposal.md)建议中性类型、样品入口预选Sample并保留手选，但未改运行规则；是否允许空类型或改为必填须明确批准。
- 本轮12项测试与局部资源检查通过不代表全站已无既有问题。favicon404、德语缩略图、旧翻译与其他镜像治理继续待办。
- 德语WhatsApp预填仍为既有通用文本；如需要SKU精确上下文，应单独确认后处理。
- ES/DE caption原有翻译表达保留，未顺带审校。ALT新增文本仅翻译原描述，不证明产品性能参数或库存已重新核实。
- 图片变更或构建入口结构改变将触发对应关系检查失败，需要更新审查，不能绕过保护强行发布。
- 所有关键营销数字、认证、工厂照片、MOQ/交期和业务承诺均保留。

## 8. 后续建议

先审查本轮ALT与单页资源依赖变更，批准后再按受控流程发布。报价类型方案单独审批，不与ALT修复捆绑。发布后7天观察资源/脚本错误，28天及6–8周观察GSC准确词展示/点击和GA4询盘开始、WhatsApp点击、成功提交；区分点击与有效采购询盘，不保证排名增长。

## 9. 运营总监交接摘要

2026-10-29任务03已完成独立分支代码修复与本地Preview测试，未部署生产，main保持任务02-B的e2fcdb62，PR #1未操作。Capri图库完整ALT与短caption分离，原图片/顺序/业务内容/SEO元数据不改；复用现有机制仅补DE Capri资源绑定，ES三页机制保留。12项Node测试、build、核心多语言和西语检查通过；972份HTML仅英西德Capri三页变化，新增缺失资源引用0；30个Preview HTML与11份Astro资源200/MIME正确，英西德全部5图ALT/caption、循环切换、键盘/鼠标和390px通过。已知DE TZ2557-3缩略图检查仍失败，未扩修。Title/H1与现有采购内容已覆盖，无新增重复页/Blog或虚假schema。报价类型中性选项/手选保留方案已提供，未实施；无GSC/Bing/IndexNow操作。请核对PR/预览证据后决定ALT修复部署与独立业务方案审批，不能将本轮记为已正式上线。

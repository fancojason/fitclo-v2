# 任务04-A：B2B报价分类审查与审批方案

日期2026-10-30，Asia/Shanghai。状态：审查完成，业务规则未实施，生产未修改。

## 数据与基线

重新fetch最新main=9817684564c66682ef3340d015205958731eac25，保留54024b0b字体/Ready Stock及98176845导航更新。生产列表显示Cloudflare d3082f46-8d4e-4a0e-a7fc-ea6b10d947aa，source9817684。03-D为已发布历史，不以91847dba作为当前main。分支codex/task04-inquiry-review从最新main创建，没有reset/覆盖。PR #1/#3未操作。本轮没有读取CRM实际界面、GA4报表或GSC数据；实际损失订单、误分类比例及转化影响：暂无数据。

正式浏览器只读取与本地交互（不submit）三页：
https://www.fitcloo.com/products/capri-workout-set/
https://www.fitcloo.com/es/products/capri-workout-set/
https://www.fitcloo.com/de/products/capri-workout-set/
三页结果一致：initial/quote/sample/reset均Sample；select.required=false；手选Full OEM后再点两个CTA仍Full OEM；5张缩略图保留。ES标签muestra/Stock listo/Marca privada/OEM completo，DE标签Probe/Bereiter Vorrat/Eigenmarke/Vollständiger OEM；业务value均为英语四值。浏览器只调用reset复核原生行为，不声称已做真实成功提交。

## 事实、风险推断与待核实

确认：Sample默认，Quote/Sample均锚点跳转，没有分类赋值；后端inquiry_type非必填/无枚举；字段透传邮件及CRM。推断：未手选的批发买家可能以Sample发送，存在误分类风险，不证明客户主观意图或量化损失。待核实：外部CRM的空值/第五类映射、展示、路由和报表；真实GA4转化配置是否同时计入多个成功事件。

## 完整数据流与代码证据

1. src/pages/products/capri-workout-set.astro:229–230 两CTA href=#product-inquiry，以data-product-track区分click_quote_cta/click_sample_cta。
2. 同页530起select name=inquiry_type，第一option Sample，无required。值Sample / Ready Stock / Private Label / Full OEM。直接访问即Sample。
3. 同页683起CTA监听只track；没有写select，无手选标记。当前不会覆盖手选，未来实现必须显式保护。
4. 同页700起submit preventDefault；邮箱/电话至少一个，form.reportValidity；姓名HTML required，email类型校验。已有后端没有同等邮箱格式校验。产品隐藏字段product_type/product_code/product_name/page_url保留。
5. 同页728调用submitInquiry(Object.fromEntries(new FormData(form).entries()))，按钮disabled防重复点击；失败恢复按钮、保留输入。成功条件response.ok && result.success，随后submit_product_inquiry、form.reset、重写page_url。成功按钮仍disabled且显示Inquiry Sent，非本轮改动；started标记未重置，不把reset等同可立即二次发送。
6. src/lib/inquiry-client.ts:86起添加language/page_path/page_url/source_page和会话归因；JSON POST /submit，30秒超时；附件如有则PNG/AI/PDF、10MB校验。network/timeout/http/provider错误触发form_submit_error。
7. functions/submit.js:117起检查JSON、所有普通字段必须字符串且<=5000；蜜罐website返回success但无id，不发邮件。name+(email或phone)+product_type必填；inquiry_type不必填，无枚举。不改共享接口以免影响其他表单。
8. 同文件138起Resend POST /emails，20秒超时，to sales@fitcloo.com；subject New {inquiry_type || Website} Inquiry，正文Inquiry Type空值Not provided，HTML转义。供应商失败返回502，无id也502；成功取得id才启动CRM。
9. 同文件37–94：CRM_WEBHOOK_URL+CRM_API_SECRET存在才调用new URL('/api/crm/leads/website',base)，5秒超时；inquiry_type映射inquiryType，SKU/语言/归因一并传递。缺配置跳过；失败记日志不影响邮件成功，waitUntil后台同步。邮件接受不是收件箱送达，也不是CRM成功。
10. functions/api/crm/[[path]].js：Bearer鉴权+KV，接收只检查联系方式，原payload存入inbox；没有询盘类型枚举或分类UI。这里只证明仓库接收契约，不证明实际外部CRM展示/分配正常。
11. inquiry-client.ts:119–120 只有response.ok && success && id才发generate_lead、quote_form_submit；两个不同事件表达同次接受，不应在GA4把两者相加当两条询盘。Capri另发submit_product_inquiry；CTA点击及view_product/start_product_inquiry不是成功。共享form_start每个表单WeakSet一次，form_submit_attempt在submit捕获，invalid单微任务去重。成功事件由共享模块保留，不在新CTA中补发。
12. 存在既有成功判定差异：共享模块要求id，页面调用方只要求success；正常后端已保证id，蜜罐success无id可能显示页面成功但不发generate_lead。这是既有边界，不在本轮扩修。

其他表单：src/pages/inquiry.astro:75已有两类不同业务value（Ready-stock wholesale / Custom / private label / OEM），默认前者、required；InquiryForm.astro有自己的产品/数量等选项与reset，不应全局改为Capri四类。全站没有已确认统一的四值枚举契约。

## A–H回答

A 是，默认Sample直接透传，存在风险，不能量化损失。
B 是，增加中性value=""会形成空字符串；缺字段与空字符串在JSON/CRM有区别。
C 页面目前没有第五类；当前后端会接受任意合规字符串（含Not Sure Yet），仓库CRM接收器可存储；不等于已支持其语义或外部CRM分类。第五类必须另批。
D 必填增加一步操作，是潜在摩擦；实际影响暂无数据，不应宣称必然降低完成率。
E 目前CTA不覆盖；新代码需记录人工change，保留四值以及人工回选空状态。
F 原生reset回Sample；失败不reset，成功后按钮仍disabled，不能承诺可立即再次提交。建议新方案成功reset回空并清人工标记，其他按钮行为不变。
G 不改字段名和值可保留映射；空值会变Website/Not provided及CRM空，需销售批准；成功事件和校验不要搬到CTA或前移。
H ES/DE为public静态镜像，共用EN构建JS与现有binder；仅改EN源码不足以同步option。须显式同步两个静态源HTML的占位option/提示且value不翻译；保留资源binder并检查五语言核心，不能直接修改dist或全站机械替换。

## 三方案比较与推荐

|维度|A 中性+必填四类|B 第五类Need Advice|C 四类+可跳过中性|
|---|---|---|---|
|理解|必须理解采购分类|不懂可选求建议|不懂可跳过，清楚者选|
|完成阻力|增加强制选择|多一选项，若必填仍一步|较低，不新增提交门槛|
|有效B2B线索|避免误Sample，但可能中断|容纳早期买家|容纳早期买家，销售后分流|
|CRM质量|字段完整但可能被迫乱选|新增真实第五类待映射|缺失显式可见，不伪归Sample|
|前后端|需审批新增必填；是否后端必填涉及全站|后端可透传，外部CRM未证实|现有接口允许空；外部路由待确认|
|多语言|占位+必填错误翻译|第五类标签翻译+value约定|占位+可选提示翻译，四value不变|
|开发/测试|中，含拦截逻辑|中高，需下游契约验证|低，限定三个页面与CTA|
|回滚|移除required和相关校验|撤销第五类但须保留历史线索|还原三页占位与监听即可|

推荐C：四类保留，中性默认可跳过，Sample CTA仅未手选时预选Sample，Quote仅未手选时回中性。分类是销售辅助，不应让不熟悉私标/OEM的有效买家必须先懂工艺才能联系。暂不引入第五类、不增加后端必填；不能把空值偷偷转换成Sample或Ready Stock。建议文案明确“可选；不确定可跳过”，将空值作为待销售判断状态，而非新增CRM枚举。若业务坚持所有线索必有类型，再批准B及CRM映射，优于强迫不懂的客户随便选四类。上述是基于流程的建议，不是转化数据结论。

## 精确待审批修改（以下代码均为方案，未应用）

文件范围：src/pages/products/capri-workout-set.astro；public/es/products/capri-workout-set/index.html；public/de/products/capri-workout-set/index.html；现有图库/资源测试扩展。以实际静态源路径复核后只编辑对应select和提示。src/lib/inquiry-client.ts、functions/submit.js、CRM接收器原则不修改。

原始：<select name="inquiry_type">首项<option value="Sample">Sample</option>；无required。
建议：保持select name及无required，在四option前加入<option value="" selected>Not sure? You can skip this</option>（不disabled，允许客户主动回选空）。加可选说明并用aria-describedby关联。

|value|EN|ES|DE|
|---|---|---|---|
|空字符串|Not sure? You can skip this|¿No lo tienes claro? Puedes omitirlo|Unsicher? Sie können dies überspringen|
|Sample|Sample|Muestra|Muster|
|Ready Stock|Ready Stock|Stock disponible|Lagerware|
|Private Label|Private Label|Marca propia|Eigenmarke|
|Full OEM|Full OEM|OEM completo|OEM-Fertigung|

四个业务值不变；现有标签若调整为表内更自然的术语也须随实施批准，不扩到其他页面。占位/字段旁提示分别标Optional/Opcional/Optional，不能声称增加服务承诺。

建议监听并入原有CTA track监听，避免重复事件；示意：
```js
const inquiryType = form?.querySelector('[name="inquiry_type"]');
let manuallySelectedType = false;
inquiryType?.addEventListener('change', () => { manuallySelectedType = true; });
// 原有data-product-track点击监听内，保留原track调用一次：
if (inquiryType && !manuallySelectedType) {
  if (eventName === 'click_sample_cta') inquiryType.value = 'Sample';
  else if (eventName === 'click_quote_cta') inquiryType.value = '';
}
// 原有成功分支form.reset()后，仅补：
manuallySelectedType = false;
```
自动Sample后再Quote回空；手选四值或空后任一CTA均保留。直接表单默认空。未选可提交，保持姓名/联系方式等现有校验；不人为设第五类。表单失败保留输入和标记；成功reset回占位、清标记、保留原page_url与按钮行为。邮件空值仍Website/Not provided，CRM仍inquiryType:""；不能把原映射改成新增业务值。不增加GA4成功事件，CTA事件仍只表示点击；现有generate_lead、quote_form_submit及id判定不变。

外部CRM实际展示/空值分配需老板或CRM负责人确认；如空值会丢弃或错误路由，先停实施，评估批准第五类，不用未核实映射强推。其他询盘页面无需一起调整，共享后端不增加四值白名单，以免拒绝其他页面已有值。

## 模拟证据与验收计划

可复跑node docs/operations/task04-inquiry-contract.mock.mjs：所有fetch全部替换为mock，只允许Resend及example.invalid两个预期地址，任何其他URL抛错，不读取生产凭证。7例：缺字段、空字符串、四个现有值、Not Sure Yet。均HTTP200，邮件fallback/CRM原值符合代码；12条方案纯函数断言验证Quote/Sample/手选四值及空。它不证明外部CRM实际接收，不是已上线逻辑。

另跑functions/submit.test.mjs及submit-attachments.test.mjs，覆盖CRM失败不影响邮件成功、KV接收、附件和供应商失败路径。前端GA4事件仅代码审查，未声称真实GA4入库；本轮未做浏览器submit或成功提交模拟。

后续实施必须：
1. EN/ES/DE各390px和桌面：直接/Quote为空、Sample自动Sample、重复CTA行为、手选四值和回空后保留。
2. 空类型可提交且无类型invalid；姓名空/联系空/邮件格式错误仍拦截；所有错误后输入/手选标记保留。
3. 拦截浏览器fetch，只mock /submit，禁止外网真实提交；成功带id/失败502/超时/无id/蜜罐均分别检查，成功reset为空、标记清除、按钮遵守原策略。
4. 后端mock四值/空/缺字段，邮件subject/正文和inquiryType逐项一致；若另批第五类，增加下游分类契约测试，并确认旧CRM不会丢弃新值。
5. stub gtag/dataLayer：CTA各一次，不提前发成功；只有provider接受并有id才发原有两个成功事件各一次；失败无成功事件。不把两个成功事件算两条lead；后台key-event配置人工复核。
6. CSS/JS 200和MIME、EN/ES/DE五图完整ALT/caption/缩略图保留、1440/390无溢出、Quote/WhatsApp、五语言核心和其他询盘页面回归。全站既有DE TZ2557-3失败单列。

## 回滚与审批

独立实施提交，只改三页与测试；回滚该提交恢复默认Sample及旧监听，不改历史CRM线索或删除任何记录。回滚触发业务上会再次默认Sample，须记录原因。Preview验证后另取生产授权；本任务没有部署批准。

需要批准：①空分类可提交并交销售判断；②仅未手选时Sample预选、Quote回空；③手选含回空永久优先至成功reset；④英西德占位及可选提示；⑤外部CRM空值展示/路由确认。不批准第五类、不增加后端必填、不全局统一其他表单类型。本轮预计风险为低范围前端更改，但空值路由和数据完整性需确认；完成率变化暂无数据。

## 运营交接

04-A审查完成、未实施。最新main98176845保留新字体/Ready Stock；正式EN/ES/DE确认默认Sample的误分类风险。建议C可跳过中性默认+四类不变+Sample明确入口预选+保留手选。后端mock证明空值及第五类可透传，但外部CRM实际分类仍未知。未修改生产/业务/后端/CRM值，无合并、main push、部署或GSC/Bing/IndexNow操作。后续须先批准业务规则与CRM空值处理，再限定三页面实施和Preview回归。不要声称转化已改善或CRM已同步成功。

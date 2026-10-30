# 任务04-B：方案C限定开发与Preview

日期2026-10-30，Asia/Shanghai。基线main9817684564c66682ef3340d015205958731eac25，保留字体/Ready Stock/导航。原04-A提交76f00a093e4a5c01b732759dc076e5ab3d89e5b3保留，从该提交复用既有报告和隔离Mock脚本，没有重建另一份04-A审计。PR #1/#3未操作。

授权范围仅Capri EN/ES/DE：中性空value、保留四值、不required；未手选Quote为空，Sample预选Sample；手选包含空后CTA不覆盖；成功reset空并清标记，失败保留。共享inquiry-client、submit.js及CRM业务映射不改，没有第五类，没有WhatsApp模板变化。

## CRM生产闸门

只验证浏览器空值、/submit接受、Mock邮件内容及Mock webhook字段。现有subject空值Website、正文Not provided；CRM inquiryType为空，不回填Sample或捏造意图。实际外部CRM创建/展示/路由仍未知，Mock成功不是生产CRM证据。本轮即使Preview全部通过也不推荐立即生产发布。

待审批生产解决方案：首先只读核验真实CRM字段契约/管理员配置，确认空值不会丢弃或误归类；否则另行审批持久化待同步队列（保留原始payload、待分类状态、幂等重试和失败告警）及销售可见处理流程，不新增未经批准枚举；邮件保留未指定内容不丢弃。现有后台同步失败仅日志且邮件成功独立，不把它宣称为外部CRM已可靠入库。不得在真实CRM创建测试客户来证明兼容。

## 测试记录

结果待执行后补记。原审计Mock7场景/12断言已复用，保留SKU/message新增断言；邮件/CRM/附件等13项Node通过。真实浏览器测试脚本拦截全部fetch且仅允许/submit，在页面stub gtag，不向外部创建线索。测试数据example.invalid及MOCK ONLY标记。本轮不合并、不部署生产、不提交GSC/Bing/IndexNow。


## 本地实际结果（远程待验）

更新构建完成367Astro页，原字体集成971HTML保留。13项Node通过，7项Mock类型场景保留产品型号/正文，12条审计策略断言通过。核心多语言15页及西语8产品通过。任务01比较器以本次最新main先生成基线；新增保护检查只允许英语中性占位文案，其他正文/metadata/schema/images/links一致。972HTML仅EN/ES/DE Capri改变，新增缺失资源0。原DE Matching Sets/Sports Bras两页旧CSS缺失警告在基线就存在；DE TZ2557-3缩略图仍失败，不扩修。

本地Chrome六组（EN/ES/DE分别1440和390px）图库检查与询盘Mock检查通过：中性、Quote/Sample、四类和人工回空保留、重复CTA、失败保留、空类型成功reset及标记清除；generate_lead/quote_form_submit只在Mock成功各一次。30HTML/11Astro资源200和MIME正确。图库DOM测试通过，原生键盘及远程Preview另记。没有真实提交。

运行文件：src/pages/products/capri-workout-set.astro、public/es/products/capri-workout-set/index.html、public/de/products/capri-workout-set/index.html。测试：scripts/capri-inquiry.browser.mjs、scripts/capri-gallery.browser.mjs（默认参数仍兼容旧Sample测试，当前分支显式传空）、scripts/check-capri-inquiry-protection.py、审计Mock脚本。共享inquiry-client/submit/CRM没有修改。无lint/typecheck/npm test独立命名脚本，未声称运行。


## 远程Preview验收补记

代码提交0135fd5f93dfd22fed8b6dd11e2d9068db2b6c09；Draft PR #4 https://github.com/fancojason/fitclo-v2/pull/4 。Cloudflare Preview部署49369fcd-d5f4-4c13-9c51-20a5eb5a03b8成功（2026-10-30上海17:37:50），https://49369fcd.fitclo-v2.pages.dev 。EN/ES/DE对应产品路径全部实际Chrome测试。

六组1440/390px真实DOM输出见2026-10-30-task04b-browser-evidence.json：Quote中性、Sample预选、四种手选及手动回空保留、重复CTA各一次事件、现有必填拦截、空类型失败/成功Mock、失败内容/手选标记保留、成功reset中性并清标记、SKU/message保留、generate_lead和quote_form_submit仅Mock成功各1次。每组只拦截2次/submit（模拟502及200），没有真实请求离开该tab。

三语言图库脚本均通过5图、full ALT/caption、首图保留、aria-pressed和循环；另做实际鼠标点击Ivory后Tab+Enter/Tab+Space，active4且缩略图5，ALT正确。三页Console无error/warn。390px无横向溢出。正式WhatsApp链接/模板未修改，也未发送消息。生产Sample行为仍应保留，另只读核对main未变。

CRM结论：浏览器空值、后端mock接受、mock邮件保留SKU/正文和未指定、mock webhook原样收到空值均已验证；外部CRM成功创建且正确分类未验证。真实线索有同步失败或路由未知风险，不能承诺不会丢失。保留邮件只是已核实的现有路径，不等于CRM持久可靠；生产阻塞继续，下一步先取得CRM只读契约/管理员确认，必要时另批持久队列/重试/告警，禁止自动归Sample或增加未经批准枚举。

本轮未改inquiry-client、submit或CRM后端、全站表单、字体和导航，无生产合并/部署或GSC/Bing/IndexNow提交。日志及证据仅独立分支；后续文档补记提交与代码提交运行内容一致，最终PR head见交接报告。已知DE TZ2557-3缩略图失败及DE非目标分类旧CSS警告保留。无独立lint/typecheck脚本，未声称执行。外部CRM真实兼容测试及生产发布均未完成，不能报告全链路生产通过。

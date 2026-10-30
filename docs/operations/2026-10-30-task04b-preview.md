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

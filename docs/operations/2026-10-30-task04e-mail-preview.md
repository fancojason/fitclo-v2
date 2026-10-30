# 04-E：邮件隔离验收与最小失败告警原型

2026-10-30，Asia/Shanghai。从干净main9817684564c66682ef3340d015205958731eac25建立codex/mail-failure-preview。04-A–04-D结论复用，04-D提交5ca7c077保留，未再次查消费者。PR #1/#3/#4不操作，PR #4中性表单代码未合入，本轮Capri仍Sample。

## 现有链路与状态边界

共享/submit的源码调用点见文末清单。包括主Inquiry、InquiryForm组件、CoreLocalePage及多个产品页；组件生成多语言/多路由，不把源码数当实际页面数。选款通知有独立函数，不属于共享/submit，未顺手修改。

后端name、email或phone、product_type必填，其他普通字段须字符串且<=5000；JSON/附件/字段错误400，超请求体413，无RESEND_API_KEY 503；供应商HTTP失败统一502、200无id也502；网络/超时/响应解析异常当前500。没有重设这些外部响应状态和必填业务要求。后端不枚举inquiry_type，空类型仅隔离测试，不等于批准PR #4。

客户端有姓名/类型等HTML校验与Capri联系方式校验；请求失败恢复按钮、保留内容，成功reset。共享模块仅response.ok && success && id发generate_lead和quote_form_submit；每次成功请求两种事件各一次，不应加总成两条线索。按钮点击/提交尝试/GA4成功/Resend接受/实际送达/销售阅读/CRM写入完全不同。CRM在邮件id成功后异步发送，失败不撤销邮件接受；04-C/04-D可靠性风险保留。

仓库未找到Resend投递Webhook接收器。Cloudflare通知策略只读GET返回403（无权限验证），不能说已有告警，也不能说账户没有告警。没有读取生产Resend/CRM密钥、客户邮箱或客户记录，无真实服务商POST。已有Wrangler身份仅用于只读部署/通知元数据；不是读取生产邮件凭证。Resend实际Webhook/仪表盘监控配置无权限验证。

## 本轮最小运行改动

仅functions/submit.js：用固定结构inquiry_failure日志替换供应商原错误正文、CRM响应正文和异常对象；只记录stage、固定category、供应商status。分类覆盖configuration、authorization、rate_limit、provider_http、missing_provider_id、timeout、provider_response、internal_or_transport及CRM失败。异常返回500改成通用友好重试提示，避免把任意异常正文回显给客户。成功邮件payload、收件人、id响应、CRM字段、附件、表单类型、GA4代码均不改。不添加真实通知调用、不改配置。

共享端点所有调用方都能收到相同成功/失败契约；唯一对客户的预期变化为500异常不再显示原始内部异常文字。前端脚本、HTML、语言架构完全未修改，避免改变静态镜像资源哈希。

## 隔离测试

functions/mail-reliability.test.mjs矩阵覆盖有效、姓名缺失、联系方式缺失、401/403、429、500/502、超时、网络异常、成功id、200无id、CRM失败、无密钥、空类型及原有类型；所有fetch严格stub，PII哨兵不得进入错误日志或异常响应；邮件SKU和正文保留。附件逻辑复用原测试，不重复实现。Node共15通过。

scripts/mail-form.browser.mjs在浏览器替换全部fetch，唯一允许/submit但仅返回Mock，stub gtag；错误邮箱拦截、失败/服务不可用/网络/超时四类、快速双击一次请求、失败保留与重试、成功reset及GA4各一次。使用example.invalid和MOCK ONLY，不产生真实线索。

本地390px九页（EN/ES/DE Capri、EN Inquiry、EN/ES/DE/NL/PT contact）邮件行为通过。DE Contact有clientWidth390/scrollWidth405的既有横向溢出；HTML与最新main基线逐字一致，非本轮引入，不扩修；测试输出明确记录client/scroll而不以innerWidth405掩盖。不能报全站手机布局全部通过。

build通过367Astro页；核心15本地化页、西语8产品、任务01保护比较对最新main基线均通过；972HTML全部哈希不变，新增缺失资源0。既有DE TZ2557-3缩略图失败，DE非目标分类页旧CSS警告保留。无独立lint/typecheck/npm test命名脚本，未虚报。远程Preview、图库及桌面另补记。

## 最小告警比较及选型

A 复用Cloudflare日志/指标/通知：最小代码/无需额外业务数据库，独立于Resend发送服务；但日志本身不是通知，现有策略权限403，任意日志条件能否绑定告警及当前套餐未知，不能把内建产品通知当已配置邮件错误告警。
B 独立服务通知：可在Resend故障时工作，需要批准目的地/凭证/额度及重试去重；禁止私自启用。不能用Resend自己作为唯一故障通知通道。
C 持久失败事件供管理员：有恢复和审计价值，但本轮不建D1/KV/队列，不把内存记录当持久告警。需要独立存储、查看权限和人工值守。

推荐优先A：在现有平台可支持并经管理员确认后，以脱敏结构化事件配置独立告警。若不支持所需自定义条件，再单独审批B，不立即建C大系统。真实生产告警没有启用。

scripts/mail-alert-prototype.mjs只导出测试原型，未被functions或页面导入；enabled默认false，无默认sink、无网络调用。测试显式enabled+内存sink，按stage/category/status去重5分钟、最多128键，去除所有未知/PII字段；sink失败返回sink_failed、不递归告警、不干扰邮件响应。单进程内存去重跨实例不可靠、重启不保留，不能当生产分布式或持久机制。未来生产需平台聚合去重、失败重试/死信或可查询事件，另行审批。

默认建议首次鉴权/配置异常即告警，5分钟同类聚合；供应商5xx/超时持续异常阈值由负责人审批。告警渠道失败应保留可查询脱敏事件并有独立健康检查/人工值守，不用同一坏渠道无限重发；本轮只有sink失败Mock。

## 成本与来源（2026-10-30）

Cloudflare Workers Logs官方当前Free为20万事件/天、保留3天；Paid包含2000万/月、超额0.60美元/百万、保留7天，官方说明2026-12-01计费将变化。日志是否适用于本Pages部署及是否已启用需单独确认；不将产品额度误当当前账号配置。平台通知类型依产品/套餐，自定义条件/独立服务可能有额外费用。无新增真实渠道或持续费用，本轮Mock无外部调用。实际账户用量/告警方案费用暂无数据，不保证将来免费。
https://developers.cloudflare.com/workers/observability/logs/workers-logs/
https://developers.cloudflare.com/notifications/notification-available/
https://resend.com/docs/webhooks/event-types

Resend email.sent表示API请求成功后尝试投递；email.delivered仅为交给收件邮件服务器，不证明已在收件箱或销售读到。没有启用Webhook或读取真实事件。

## 销售负责人确认清单（待确认，不主动联系）

- 实际接收网站询盘的邮箱？代码收件地址sales@fitcloo.com，需确认它是日常销售入口。
- 谁每天查看，是否有替班？
- 谁检查垃圾箱、过滤/转发及退信？
- 无预期询盘时由谁排查？
- 网站失败提示或后台告警由谁处理？
- WhatsApp/其他备用联系渠道谁值守？
- 是否批准独立告警目的地、权限、预算和非PII内容？

## 上线闸门及唯一下一任务

本轮Preview不是生产发布，Mock不是实际接受/投递，生产邮件/销售阅读/CRM消费者均未补证。PR #4保持Draft，仍不能建议上线。唯一下一任务：销售负责人确认接收与异常责任，并以只读管理权限核定现有平台告警条件/独立目的地，形成一次明确的部署审批包（不再重查消费者）。如需要通知密钥或付费，先审批；本轮未设置。

## 调用点清单

- src/components/CoreLocalePage.astro
- src/components/InquiryForm.astro
- src/pages/inquiry.astro
- src/pages/products/0636.astro
- src/pages/products/3708.astro
- src/pages/products/capri-workout-set.astro
- src/pages/products/knee-length-capri-leggings-workout-set.astro
- src/pages/products/premium-3-piece-yoga-set.astro
- src/pages/products/racerback-tennis-skirt-set.astro
- src/pages/products/three-quarter-sleeve-capri-workout-set.astro
- src/pages/products/tz2557-3.astro
- src/pages/products/tz2557-6.astro
- src/pages/products/tz2557-8.astro
- src/pages/products/tz2570-4.astro
- src/pages/products/tz2578-6.astro
- src/pages/products/tz4506-3.astro
- src/pages/products/tz4506-4.astro
- src/pages/products/tz4510-14.astro
- src/pages/products/tz4535-12.astro
- src/pages/products/tz5555-4.astro
- src/pages/products/tz5555-7.astro
- src/pages/products/tz5558-11.astro
- src/pages/products/tz5560-2.astro
- src/pages/products/tz9599-6.astro
- src/pages/products/tz9616-2.astro
- src/pages/products/wide-leg-workout-set.astro
- src/pages/products/womens-yoga-set.astro
- src/pages/products/wt6089-ny1401-yk1352.astro
- src/pages/products/yw572-kw441.astro


## 远程验收最终补记

Draft PR #5 https://github.com/fancojason/fitclo-v2/pull/5 。测试运行代码提交f66ac554b41fdfaadc3d9791c21a39be5b48ac58；Cloudflare非生产部署80c131c0-5c65-49cb-a33d-811084c2b286，deploy success，上海2026-10-30 20:41:52。https://80c131c0.fitclo-v2.pages.dev 。后续提交只更新本报告/证据/日志，运行代码相同。

真实Chrome远程390px九个页面全部完成邮件隔离功能检查，原始输出见2026-10-30-task04e-browser-evidence.json；每页Mock失败4次（provider502、service503、network、timeout）可重试且保留输入，快速两次点击仅1请求；错误email不发送；Mock成功1次，generate_lead及quote_form_submit各1。后端14场景与附件为本地Node执行，不把浏览器拦截当远程Function真实执行。没有向远程/submit真正POST。

EN/ES/DE Capri额外1440px邮件测试及1440/390图库完整5图、ALT/caption、首图/循环通过；Quote锚点及WhatsApp入口保留，Sample默认未变。三语言真实鼠标/Tab/Enter/Space切图至active4且5张缩略图保留。远程30HTML/11Astro资源200、MIME正确。

在Preview浏览器执行同一Mock告警纯函数，输出disabled、mock_recorded、suppressed、sink_failed，去除PII字段；没有通知目的地、无持久事件库、不是真正Cloudflare自动告警。

既有DE Contact clientWidth390/scrollWidth405问题在远程同样存在，其HTML与main基线完全相同；故邮件功能通过，但不宣称整个移动端/全站回归全部通过。全站DE缩略图及旧CSS问题仍保留，无本轮新增HTML/资源回归。原消费者/投递/销售日常使用未验证，PR #4继续Draft，暂不建议上线。

所有正式配置、main、PR #1/#3/#4未改，搜索平台未操作；真实投递、销售已读、CRM成功、真实自动告警均未验证或启用。下一步唯一任务为负责人完成清单确认及独立告警配置只读核定，选择经批准渠道后形成受控发布审批，不自动部署。

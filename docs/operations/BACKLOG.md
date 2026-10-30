# Fitclo 运营待办

## 2026-10-30 04-E：远程邮件功能/告警Mock验证完成，未生产

- Draft PR #5；测试代码f66ac554，Preview80c131c0-5c65-49cb-a33d-811084c2b286。九页390px邮件功能/重试/保留/GA4隔离通过，三语言Capri桌面及图库/原生输入通过；30HTML/11Astro资源200。
- 告警只为默认关闭的内存原型，Preview执行disabled/去重/隐私剔除/sink失败测试，未启用真实自动通知。通知配置GET403；投递、销售阅读、外部CRM未知。
- DE Contact既有390→405溢出及DE TZ2557-3等保留，不宣称全站回归通过。负责人清单/成本见[04-E报告](2026-10-30-task04e-mail-preview.md)。下一步先完成负责人和告警权限/目的地确认，PR #4仍不建议发布。
- 仅独立分支，main及PR #1/#3/#4不变，无生产部署或搜索提交。


## 2026-10-30 04-E：邮件失败脱敏及隔离验收，未生产

- 最新main98176845独立分支，未混入PR #4规则。仅共享submit失败日志结构化分类/去PII和异常友好提示；成功路径、字段、邮件/CRM业务不变。
- 新邮件矩阵和Mock告警，Node15通过；告警原型默认关闭，不连接真实渠道。Cloudflare通知配置GET403，实际监控未验证。
- build/多语言/西语/内容保护通过，972HTML哈希不变。本地9表单Mock通过；DE Contact既有390→405溢出、DE TZ2557-3失败及旧CSS警告保留，不能报全站全部通过。
- [04-E专项报告](2026-10-30-task04e-mail-preview.md)含负责人清单/成本/上线闸门，远程Preview待补。无真实发送、无生产配置或搜索修改。


## 任务03-C远程验收补记 — 2026-10-29（仍未生产）

- Preview1451089d-63a4-4c67-8bb3-6ddc9dce176f对应代码9e9a9ab6：EN/ES/DE桌面1440/手机390实际DOM六组通过；全部5图source/完整ALT/短caption/aria-pressed、5张缩略图保留与循环正常；原生鼠标/Tab+Enter/Space逐语言通过，Console无error/warn。
- 本地和远程各30HTML/11份Astro资源200、MIME正确，Sample及原CTA不变；证据见[03-C报告](2026-10-29-task03c-caption.md)及[浏览器JSON](2026-10-29-task03c-browser-evidence.json)。
- 03-B历史回归/误判记录保留。PR #2继续Draft；main仍e2fcdb62，未合并/生产部署，无搜索平台提交；日志仅PR分支。最终文档提交触发的Preview以PR记录为准。


## 任务03-C当前状态（独立PR分支）

- 03-B阻塞已作最小代码修复：caption选择器限定figcaption，真实DOM脚本在旧Preview失败、修复本地EN/ES/DE桌面及390px通过。远程Preview/鼠标键盘验收完成后补记。PR #2仍Draft，不部署生产。
- 生产仍e2fcdb62。保留03-B阻塞记录及其提交23379e71401e11d1cdbba764a8a87f54ae9f7bb3；不能把历史失败改写为从未发生。
- 待运营总监复核Preview后另行批准生产发布。报价分类与Sample默认规则、MOQ/交期、DE TZ2557-3缩略图、favicon、既有翻译、其他产品SEO均未实施。


## 发布与审批状态

- 已上线：任务02-B已于2026-10-29上海10:53:24部署e2fcdb62，部署f93ae484-1c5d-460f-9722-83c78f5f3d5e。原[任务02报告](2026-10-28-spanish-product-assets-fix.md)保留历史状态；发布记录PR #1仍未合并：https://github.com/fancojason/fitclo-v2/pull/1 。本轮未合并或关闭该PR。
- 待批准部署：任务03英西德Capri完整ALT修复及对应单页资源绑定，独立分支测试通过，未上线。见[任务03报告](2026-10-29-task03-capri-gallery-seo.md)。

## 保留，未经批准不修改

- P2：Capri图库切换ALT问题已在任务03独立分支修复并验证，等待部署批准；不能标为正式修复。
- P2：报价入口默认Sample的[中性选择与手选保留方案](2026-10-29-capri-inquiry-proposal.md)已提交，未经批准未改运行规则。
- P2：Capri现货MOQ、私标条件、OEM单位及时间含义待业务确认。
- P2：Product富媒体资格缺少经核实的offers/review/aggregateRating，不造价造评。
- P2：其他静态翻译镜像的资源生命周期治理，先清单与审批，不批量重建无关页面。
- P2：西语静态镜像既有品牌名/邮箱翻译及注释残文，先审校与业务确认，任务02未改。
- P3：全站缩略图检查在既有德语TZ2557-3页失败，页面本轮SHA-256未变。
- P3：Preview浏览器自动请求/favicon.ico产生404，主要产品资源正常；任务02未改。
- P2：德语Capri WhatsApp仍保留原有通用预填文本，若需型号上下文另行确认；任务03未扩修。

历史保护要求与任务01数据见[任务01报告](2026-10-28-product-search-audit.md)。

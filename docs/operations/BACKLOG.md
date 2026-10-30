# Fitclo 运营待办

## 2026-10-30 04-B：远程Preview通过，生产发布仍阻塞

- PR #4 Draft；代码0135fd5f，Preview49369fcd-d5f4-4c13-9c51-20a5eb5a03b8。EN/ES/DE各1440/390真实浏览器询盘与图库六组通过，原生鼠标/键盘通过，Console无error/warn。
- 空类型Mock失败保留、成功中性reset、手选保护、SKU/正文与成功事件各一次均通过；无真实邮件/CRM/WhatsApp发送。证据见[04-B报告](2026-10-30-task04b-preview.md)。
- 实际外部CRM空值创建/展示/路由尚未验证，生产条件不满足；保持Draft，先审批/核实契约或持久待同步方案，不因Mock通过解除阻塞。main/其他业务/PR #1/#3未改。


## 2026-10-30 04-B：方案C限定开发，本地通过，远程待验，生产阻塞

- 复用04-A报告，不重复审计；最新基线98176845和其他优化保留。
- 仅Capri EN/ES/DE新增可跳过中性选项及CTA/手选/reset规则；四值和共享后端、CRM、WhatsApp不变。
- build、13Node、七类Mock、核心多语言、西语产品、最新基线保护比较通过，972HTML仅三页改变无新增缺失资源；本地六组真实浏览器图库及Mock提交通过。
- 外部CRM空值创建/路由未确认，保持生产发布阻塞，不以Mock替代真实契约。详情见[04-B报告](2026-10-30-task04b-preview.md)。PR #1/#3未操作，main不推送，生产不部署，搜索不提交。


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

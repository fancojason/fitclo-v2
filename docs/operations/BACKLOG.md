# Fitclo 运营待办

## 2026-10-31 — 任务05-A当前记录（仅独立分支）

- 已完成真实搜索/引荐汇总和单页本地改进；[05-A报告](2026-10-31-task05a-ai-growth.md)含20问题记录、商业事实分级、30天3项计划。正式网站尚未改动，Draft/Preview证据另补。
- 唯一建议下一项：限定修复Header品类URL拼接缺斜线（生产 /productssports-bras/404，正确路径200），不重做导航、不重复现货筛选。
- 待独立审批：本轮私标页生产发布；真实公司主体/品牌关系及有效外部资料URL确认；之后固定问题平台实测及AI来源口径复测。未确认不造证书、排名、客户数字或sameAs。
- 数据限制：ChatGPT/Claude推荐未直接验证；Cloudflare检测ID无权限；Bing AI Performance和GSC URL Inspection无连接字段。GA4来源标签不等于推荐，外站已有ChatGPT UTM链接。
- main已包含03-D及字体/导航/现货浏览更新；旧待办的03上线措辞为历史，当前生产基准98176845。PR #4/#5未合并、未修改，04-F销售确认记录不在main，不重启CRM审计。
- 本轮不扩修既有DE TZ2557-3缩略图、旧静态资源及其他页面；不生产部署、不提交Preview到GSC/Bing/IndexNow。

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

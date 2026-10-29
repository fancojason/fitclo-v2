# 任务03-B：受控发布复核与停止记录

日期：2026-10-29，Asia/Shanghai。目标：EN/ES/DE Capri Workout Set TZ4549-6。

## 状态与版本

发布阻塞。生产未部署，未回滚。最新fetch main=e2fcdb62936f31188ae3025415b09ebfb02f8a87；目标PR #2仍为f8a813f74fef5770ef8007fa612882c753815821，Draft/Open。PR #1只读检查，保持Draft/Open/未合并。

已逐项核对8文件diff（图库页面、小型读取函数、既有资源binder、图库测试和4份运营文档）；询盘方案仅为文档，不在运行代码中。Cloudflare API确认main自动生产部署开启，npm run build输出dist，其他分支自动Preview。为避免已知故障上线，没有merge、main push或任何强制操作。

## 关键新回归与复现

本地build及远程Preview https://8cc37811.fitclo-v2.pages.dev/products/capri-workout-set/ 都复现：

1. 加载英文页；图库按钮新属性data-gallery-label与原span caption使用同名属性。
2. 原gallery.querySelector('[data-gallery-label]')返回第一个button，而非span。
3. 初始化selectGalleryImage对该button.textContent赋值，按钮中的img被移除。
4. 实际鼠标点击Ivory缩略图后，主图ALT为完整Ivory Capri Workout Set with layered halter neckline and fold-over dotted waistband；真正span caption仍为Matching series；第一个button文本变为Ivory colorway，button内没有img。
5. 五图依次点击：source/ALT均匹配，EN第2–5图caption失败、缩略图img总数4；ES/DE五图全部匹配且缩略图img总数5。

这是f8a813f7新引入的问题，不是DE TZ2557-3既有缺陷。此前任务03图库/caption通过结论不准确，本记录明确纠正。单元测试验证数据读取但未覆盖浏览器实际选择器冲突。

## 已运行测试

- npm run build通过，367 Astro页，四个指定资源binding成功。
- node --test scripts/capri-gallery.test.mjs scripts/spanish-product-assets.test.mjs functions/submit.test.mjs functions/submit-attachments.test.mjs functions/product-selection-suppliers.test.mjs functions/product-selection-merge.test.mjs：12通过/0失败，含模拟邮件失败用例，无真实客户发送。
- 构建完成后依次运行check-core-locales.mjs、check-spanish-products.mjs、check-priority-product-pages.py --compare任务01快照，均通过。首次与build并行启动的构建产物检查曾因dist尚未完整而失败；构建完成后已按依赖顺序重跑，结果以上述为准。
- 972HTML与任务03之前快照比较，仅三个Capri HTML变化，新增缺失Astro资源0，DE TZ2557-3页哈希不变。
- check-product-thumbnails.mjs仍在de/products/tz2557-3/index.html失败，明确为既有问题，未扩修。
- 本地真实鼠标点击Ivory复现上述错误；远程Preview EN/ES/DE全部五图DOM探针和390px检查：全部width=scrollWidth=390，默认Sample均保留，Quote仍#product-inquiry；WhatsApp链接原样保留，DE仍既有通用消息。
- 没有发送WhatsApp消息或提交询盘；无独立lint/typecheck/npm test脚本，未声称执行。发现关键阻塞后不继续完整键盘/正式发布验收，不虚报通过。

## 待审批最小修复

将原caption查询由 [data-gallery-label] 限定为 span[data-gallery-label]（或改用不冲突的metadata属性，但仅需一个最小方案）。新增真实DOM回归，断言初始化及每次切图后五个缩略图img仍存在、span caption随图更新、完整ALT正确，并测试键盘、鼠标、390px、ES/DE、构建资源依赖。只输出方案，本轮未修改目标代码/提交。

## 发布与搜索状态

生产维持e2fcdb62936f31188ae3025415b09ebfb02f8a87，Cloudflare原生产部署f93ae484-1c5d-460f-9722-83c78f5f3d5e。没有新部署ID。Preview8cc37811-5c62-45f6-80c0-a67ad5bdb1a0为此前任务03，不能记为正式修复上线。

本轮无main push，故未触发新的自动sitemap/IndexNow工作流；没有手动GSC/Bing/IndexNow请求或批量重复提交。canonical URL/站点地图未改变；不将提交或HTTP200当作Google收录。

## 交接

任务03-B因发布前英文图库关键回归而停止，生产未受影响。先审批选择器最小修复和真实DOM测试，然后重新执行受控验证与部署；业务规则、营销内容和PR #1继续保留。发布后再用7天错误观察、28天和6–8周GSC/GA4趋势复测，不承诺排名增长。本报告和BACKLOG/CHANGELOG仅本地独立文档分支，未push或同步main。

## 补充HTTP与资源验收证据

2026-10-29正式EN/ES/DE三个URL全部HTML200；各页引用的两份CSS及hoisted.D_jpDeEJ.js均200，Content-Type分别text/css和application/javascript。三页均self-canonical、无noindex、5个缩略图、无新ALT按钮元数据、默认Sample，证明生产仍为旧行为。既有Preview三页同样HTML/CSS/JS200，JS为hoisted.BNVeCloc.js，均有5个ALT元数据；HTTP正常不能抵消上述英文DOM回归。

PR #2描述已增加发布阻塞警示并纠正先前caption全部通过结论，仍Draft/Open，head未改。PR #1未修改。文档独立分支只本地保存，没有新远程Preview或生产部署。

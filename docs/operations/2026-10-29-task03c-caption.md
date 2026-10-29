# 任务03-C Caption选择器修复与真实DOM回归

2026-10-29，Asia/Shanghai。范围EN/ES/DE Capri TZ4549-6。老板仅批准代码与Preview，不批准main/生产。

## 根因、修复与保护

03-B发现的选择器冲突保留为真实历史，原提交23379e71401e11d1cdbba764a8a87f54ae9f7bb3未丢弃，阻塞报告已归档。本轮src/pages/products/capri-workout-set.astro仅一行从[data-gallery-label]改成figcaption [data-gallery-label]。实际三语言caption均为figcaption下唯一span；按钮metadata保留。未重写图库或翻译HTML，没有新依赖。

完整ALT、短caption、产品图片及顺序、Title/H1/meta、SKU、MOQ/价格/库存/交期、正文FAQ、关键营销声明、表单和CTA逻辑、canonical/hreflang/sitemap全部保留。既有resource binder自动把新JS绑定EN/ES/DE，原ES Matching Sets/Sports Bras机制不变。

## 自动化与本地证据

新增scripts/capri-gallery.browser.mjs（无依赖浏览器函数），在真实Chrome对构建页面运行checkCapriGallery，验证实际DOM/已有监听，不替换页面业务脚本。新增Node选择器防退化测试只作为静态护栏，不冒充端到端测试。

旧远程Preview8cc37811英语页运行同一检查报image 2: short caption，能捕获真实冲突；修复后本地三语言1440x1000与390x844全部五图通过，每次5张缩略图保留、source/ALT/caption/aria-pressed一致、首尾循环正常、caption位于主图下方、页面无横向溢出，Sample默认保留。西德SSR初始caption分别Serie a juego/Passende Serie，与点击后原有aria-derived caption存在既有差异，测试区分初始化和点击，不改翻译文案。

build通过（367Astro页）；Node13/13通过；核心多语言15页、西语产品8页、任务01三页内容保护通过。972份HTML仅三个Capri变化、新增缺失资源0。全站缩略图检查仍因既有DE TZ2557-3失败，不扩修。没有独立lint/typecheck/npm test脚本。

## 可复测方式

先npm run build，再npm run preview -- --host 127.0.0.1 --port 4322。浏览器加载三个对应页面后，将scripts/capri-gallery.browser.mjs中的checkCapriGallery函数在页面执行并await调用。每次测试从页面重载后的初始状态运行；分别在1440/390px执行。鼠标/原生Tab+Enter/Space另用浏览器输入工具验证，不以HTMLElement.click冒充原生键盘。

## 远程与发布

远程Preview验收待补记实际部署ID、URL与鼠标/键盘结果。PR #2保持Draft，PR #1未操作；main=e2fcdb62936f31188ae3025415b09ebfb02f8a87。本轮无main push、无生产部署、无GSC/Bing/IndexNow操作。日志在PR分支，main未同步。

## 远程Preview实际验收补记

代码提交9e9a9ab6d5b9da43de8059f8abe92fecc85dd578已正常push至codex/capri-gallery-alt，非main。Cloudflare Preview部署1451089d-63a4-4c67-8bb3-6ddc9dce176f，地址https://1451089d.fitclo-v2.pages.dev 。三个产品路径实际HTTP200。

实际Chrome自动化输出见[六组浏览器证据JSON](2026-10-29-task03c-browser-evidence.json)。EN/ES/DE分别在1440px与390px验证初始、第二图、全部5图、首尾循环；每次thumbnails=5，ALT/source/short caption及aria-pressed一致，width=scrollWidth，无图片/caption重叠。caption选择器唯一且在figcaption内；原初始短caption和切图后既有语言文字分别保留。三页Console error/warn均为空。

原生输入另测：真实鼠标点击Ivory，再Tab+Enter切换私标图，再Tab+Space切换仓储图；EN/ES/DE均保留5张缩略图，最终active=4，ALT/caption匹配。没有把HTMLElement.click当成原生键盘测试。Quote原锚点及WhatsApp原地址保留；Sample默认不变；未发送任何消息或提交询盘。DE WhatsApp仍为原通用预填，非本次修复范围。

本地及远程各检查30个HTML（含三页Capri、ES Matching Sets/Sports Bras及五语言核心），11份唯一Astro资源均200，CSS text/css、JS text/javascript或application/javascript。正式canonical保留。脚本不修改原站点URL。首次HTTP列表误用英文ready-stock-activewear/private-label-activewear导致测试URL404，按仓库现有映射修正为ready-to-ship/private-label后全部通过；该错误为测试清单错误，未改网站路由。

后续文档补记提交可能生成新的非生产Preview；如部署ID变化，以PR最终记录为准。运行代码未再修改。生产仍e2fcdb62936f31188ae3025415b09ebfb02f8a87，未merge或push main，无生产上线、无搜索平台操作，PR #2保持Draft。main运营日志未同步。

待办：运营总监复核后另行批准生产。DE TZ2557-3既有缩略图失败、favicon、旧翻译、报价规则及MOQ/交期继续保留，不保证全站无问题。上线后再观察7天资源/交互异常，28天及6–8周GSC准确词展示点击与GA4询盘行为，不承诺排名。

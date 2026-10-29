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

# 任务05-B：Header品类404限定修复

日期：2026-10-31，Asia/Shanghai。仅开发/测试/Draft PR/非生产Preview，禁止生产发布。远程信息见验收补记。

状态：限定修复、本地验证、Draft PR及非生产Preview验收已完成。正式网站未修改。

## 基线及范围

- fetch最新 main：9817684564c66682ef3340d015205958731eac25。从干净main新建 `codex/header-category-links`，没有携带05-A的页面改动。PR #4/#5/#6未操作，不合并任何PR。
- 05-A已证明生产Header `/productssports-bras/`404而正确页200。本轮复用证据，不重启AI/CRM/SEO研究。原源码 `productsPath='/products'` 与 `${productsPath}${slug}/` 少了分隔符；西语base自带尾斜线，原链接正确。
- BaseLayout对EN/ES使用Header.astro；DE/NL/PT核心页用CoreLocaleHeader.astro，不提供相同mega菜单；311个public/de静态镜像复制了旧英文Header，构建不会重新渲染组件。public/es镜像原品类路径正确，NL/PT没有这套public静态镜像。
- main构建972 HTML：325英文页与311德语镜像有此问题，共636页，每页40个href（11品类+29子分类）共25,440处。不代表636个页面URL或商业内容需要改造。

## 最小实现

1. `src/components/Header.astro`只把拼接改为 `${productsPath.replace(/\/$/, '')}/${slug}/`，保留Products根链接及西语tank-tops特殊映射。
2. `scripts/header-category-links.mjs`在build:done仅修复已复制HTML的Header href；白名单来自当次已生成的英文Header真实品类路径。只给 `/products{known-slug}/` 加分隔符，保留fragment、文字、样式、标签属性和其他区域；未知路径不擅改。它不翻译或重建镜像，不批改public源文件。
3. `astro.config.mjs`注册上述限定构建步骤；现有字体/资源绑定步骤保留。
4. `scripts/header-category-links.test.mjs`新增3项回归：边界/白名单/幂等和fragment保留；EN/ES真实目标及特殊映射；全部构建Header无原错误模式。

## URL前后清单

以下每项及其现有子分类fragment从错误前缀变为正常品类路径：

|修复前|修复后|
|---|---|
|/productssports-bras/|/products/sports-bras/|
|/productsgym-shorts/|/products/gym-shorts/|
|/productstraining-pants/|/products/training-pants/|
|/productsleggings/|/products/leggings/|
|/productst-shirts/|/products/t-shirts/|
|/productstank-tops/|/products/tank-tops/|
|/productsmatching-sets/|/products/matching-sets/|
|/productsjumpsuits/|/products/jumpsuits/|
|/productsjackets/|/products/jackets/|
|/productsdresses/|/products/dresses/|
|/productsskirts/|/products/skirts/|

40个具体URL及出现次数、全部目标/锚点结果见 `2026-10-31-task05b-link-evidence.json`。没有新增重定向或更改canonical URL。西语11个目标保持原路径，含 `/es/fabricante-de-tops-deportivos/`；没有生成双斜线。DE复制Header仍使用原英文目标，只修分隔符，不擅自换成不存在的德语品类页。CoreLocaleHeader的原导航不变。

## 构建与内容保护

- 原main基线build与修复后build都成功：367 Astro生成页，含静态镜像共972 HTML。
- 16 Node tests通过（原13+新增3）；核心多语言15页、西语产品8 routes、3重点产品审计通过。原DE Matching Sets/Sports Bras旧资源warning单列。
- 全972 HTML与main原始压缩快照逐字比较：差异恰好仅为白名单Header href修复。636 HTML变化（EN325/DE311），336 HTML完全不变。正文、图片、SEO metadata/schema/canonical/hreflang、表单、WhatsApp和所有视觉class逐字不变。详情见 `2026-10-31-task05b-protection.json`。
- CSS及所有被引用的JS/资源不变，没有新增资源404；两份未被HTML或其他JS引用的聚合包装入口文件名随构建替换，已验证不参与页面执行。不是新前端业务脚本。
- 没有修改主导航设计、字体、间距、颜色、语言切换器、Ready-to-Ship搜索筛选、图片、MOQ/报价/交期或表单。没有安装依赖。
- 仓库无lint/typecheck/npm test脚本，未声称运行这些不存在的命令。

## HTTP、锚点与浏览器

本地检查6个来源：五语言首页及DE复制的Capri页。22个不同品类目标（EN11/ES11）均HTTP200；58个不同子分类fragment逐一检查，55存在。

**三个既有缺失锚点**：`/es/fabricante-de-tops-deportivos/#womens`、`#mens`、`#racerback`。现有特殊映射与目标页面均未变；200不代表锚点存在，本轮没有改正文或编造分组来补齐。

本地6份直接CSS/JS200/MIME正确，另按既有30 HTML/11资源抽查验证。桌面1440已原生hover展开英文Products，菜单opacity1/pointer-events auto，点击Sports Bras到正确页；西语Productos展开后点击Tank Tops到原特殊映射页。移动390五语言均无横向溢出：EN/ES原布局只有Logo和语言控件、没有移动品类菜单，本轮不新增；DE/NL/PT核心页原多行导航仍可见。EN/ES Header76px，DE/NL/PT核心页手机111px均保持原值。远程真实浏览器结果另补。

## 已知问题与停止边界

- 既有DE TZ2557-3缩略图与非目标旧静态资源问题不修；全站资源未声称全部通过。
- 缺失ES三个fragment仅记录，不改变映射、页面或UI。现有EN/ES手机没有品类菜单是基线行为，不把未实现菜单说成已验证展开。
- 修复完成后不追加05-B1等审计，不重查CRM、机器人或Ready-to-Ship功能。

## 生产与后续交接

仅推送独立分支产生Preview，main不推、不合并，不生产部署、不请求GSC/Bing/IndexNow。日志只存在本分支。

唯一建议下一任务：老板审阅任务05-A的Draft PR #6与已通过的私标Preview，若接受限定内容改进，给出独立受控生产发布审批。05-A代码/Preview已有验收，未发现必须重新开展全套研究的阻塞；本轮不据此自行合并。之后恢复AI供应商发现、真实品牌可信度和采购内容增长工作。本任务的已知非目标问题不自动排在增长前面。

## 远程验收补记

- 代码提交：fca9f3f9111b356f517a7a54e905ba912dfd15ab；[Draft PR #7](https://github.com/fancojason/fitclo-v2/pull/7)。后续验收文档提交不修改运行代码。
- Preview部署c824f82a-b49a-42d2-b40c-65060bfac7fb：[英文首页](https://c824f82a.fitclo-v2.pages.dev/)、[复制德语Capri](https://c824f82a.fitclo-v2.pages.dev/de/products/capri-workout-set/)。Cloudflare API确认environment=preview、source为完整代码SHA、deploy success；完成时间2026-10-31 09:46:29（Asia/Shanghai）。
- 远程22品类目标全部200；58子分类锚点55存在，原有ES Tops三缺失与本地一致。另抽查30重点HTML/11份直接CSS/JS200/MIME正确；未把这些结果扩大为全站资源通过。
- 真实桌面1440：Products hover菜单可见并原生点击Leggings；德语复制Header原生展开Produkte并点击Matching Sets到原定英文目标；西语Productos点击Tank Tops保持特殊映射。英文菜单截图已实际查看。
- 五语言390远程均scrollWidth390；EN/ES76px、DE/NL/PT核心111px高度保持，未创建原先没有的手机品类菜单。巴葡语言菜单原生打开aria-expanded=true、Esc关闭false；原生点击Marca própria到巴葡私标页正常。见preview/mobile证据JSON。
- 复制DE Capri浏览器发现既有favicon.ico404；定位资源后确认非本次CSS/JS错误。没有真实表单提交、邮件或消息。
- Cloudflare项目生产分支main、Preview all；当前生产仍d3082f46-8d4e-4a0e-a7fc-ea6b10d947aa/main98176845成功版。原PR4/5/6未修改。未部署生产/提交搜索平台，生产导航尚未应用本修复。
- 下一项仅建议PR6独立发布审批。若之后main先纳入05-B，PR6正式发布前须保留本修复并做必要集成回归，不强制捆绑两个PR，不重复05-A研究。

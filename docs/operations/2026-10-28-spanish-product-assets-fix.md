# 任务 02：西语产品页面 CSS/JS 404 修复

## 1. 任务名称与执行日期

2026-10-28（Asia/Shanghai）。修复三个西语产品页构建资源引用，并回归验证 EN/ES/DE/NL/PT-BR 核心页面。任务 01 的本地提交 `6562bd11`、审计脚本与运营日志均存在，已保留。它没有推送，所以此前不能在远程 GitHub 找到该提交。

目标路径：

- `/es/products/capri-workout-set/`
- `/es/products/matching-sets/`
- `/es/products/sports-bras/`

基准生产 main：`ebfe8ad053ecdb825301e6bb2f8816b9fd5f0787`。本地分支：`codex/product-search-intent-audit`。

## 2. 执行状态

**本地代码修复及测试完成，尚未部署。代码修复及测试已完成，目前等待批准部署。**

本任务没有运行生产部署、push main、删除路由、重译内容或修改搜索平台设置。没有将已修复的本地 Preview 说成生产环境已修复。

## 3. 复现、根因及实际修复

### 本轮重新请求的正式资源

| URL（均在 www.fitcloo.com 下） | HTTP | Content-Type |
| --- | ---: | --- |
| `/es/products/capri-workout-set/` | 200 | text/html |
| `/products/capri-workout-set/` | 200 | text/html |
| `/_astro/_page_.7HJlMvcy.css` | 404 | text/html |
| `/_astro/activewear-quality-control-inspection.CE6PqbRG.css` | 404 | text/html |
| `/_astro/hoisted.DPRWvICc.js` | 404 | text/html |

浏览器初次访问时两份旧 CSS 曾命中缓存显示200；以 ignoreCache 重载后出现严格 MIME 检查错误：HTML 不允许作为 stylesheet。旧 JS 在浏览器 Network 中仍为404。不能仅根据浏览器缓存200判断资源存在，也不能仅根据 public/_astro 不存在判断线上故障。

### 根因

`public/es/products/.../index.html` 是已有翻译静态镜像，包含生成时的 Astro 哈希 CSS/JS 文件名。Astro 将这些 HTML 原样复制到 `dist`，不会像编译 `.astro` 页面那样重新绑定资源。新构建的哈希变化后，静态镜像仍请求旧名字。检查未发现目标 URL 存在 `.astro`/public 重复路由覆盖；主要问题是静态镜像与编译资源的生命周期不一致。

### 修复方式

- 新增 `scripts/spanish-product-assets.mjs`，通过 `astro:build:done` 接入正常构建。
- 仅处理上述三个明确指定的西语页面；以每个页面对应的英语**当次构建 HTML**为依据，读取真实生成的 CSS/JS 入口。
- 按真实入口角色及数量匹配已有资源引用，不猜测哈希，不下载或保存旧脚本充数，不删除图库/表单。
- 校验源资源确实存在；若入口数量、角色或资源异常，构建失败，并在三页全部校验通过前不写入任何目标页面。
- 只修改 `dist` 中三页的资源地址，`public` 中批准过的文案保持原样。每次构建重新执行，下一次哈希变化也会绑定当前输出。
- 此补丁只针对已批准的三页，未扩展到全站镜像。结构变化导致入口匹配不再唯一时须进一步审查，不能静默复用错误脚本。

## 4. 修改文件和关键 URL

- `astro.config.mjs`：注册构建集成。
- `scripts/spanish-product-assets.mjs`：限定范围的构建资源绑定与检查。
- `scripts/spanish-product-assets.test.mjs`：保护性测试。
- `docs/operations/2026-10-28-spanish-product-assets-fix.md`：本报告。
- `docs/operations/CHANGELOG.md`：追加任务02记录。
- `docs/operations/SITE_BASELINE.md`：记录可复核基准。
- `docs/operations/BACKLOG.md`：保留任务01与本轮发现的待办。

正式待发布 URL：https://www.fitcloo.com/es/products/capri-workout-set/ 等三页。测试时使用 `http://127.0.0.1:4322/es/products/capri-workout-set/` 及另外两个同路径 Preview URL。本地服务停止后这些测试 URL 不再可访问，可用 `npm run build`、`npm run preview -- --host 127.0.0.1 --port 4322` 重现。

本轮没有远程 PR/部署链接；最终本地提交编号见交接回复。没有将本地提交声称为已推送。

## 5. 测试与保护验证

### 构建和自动检查

- `npm run build`：通过，367个 Astro 页面；build:done 输出三条绑定成功记录。
- `node --test scripts/spanish-product-assets.test.mjs functions/submit.test.mjs functions/submit-attachments.test.mjs functions/product-selection-suppliers.test.mjs functions/product-selection-merge.test.mjs`：9项通过、0失败。测试覆盖内容不变、无关页面不改、重复执行一致、异常时不部分写入，以及现有模拟询盘/导出功能。
- `node scripts/check-core-locales.mjs`：通过（15个 DE/NL/PT-BR 核心页，及 EN/ES 对应 hreflang 互链）。
- `node scripts/check-spanish-products.mjs`：通过（已有8个西语产品页的元数据、SKU、语言字段及 sitemap 检查）。
- `python scripts/check-priority-product-pages.py --compare <任务01基线快照>`：通过，三个英语优先页面内容与原基线一致；此前的目标西语资源缺失警告已消失。
- `node scripts/check-product-thumbnails.mjs`：**未通过**，现有 `dist/de/products/tz2557-3/index.html` 的缩略图缺少脚本期待的 srcset。该页面前后 SHA-256 完全相同，是无关既有问题，未扩大修复。
- lint/typecheck/npm test：package.json没有这些命名脚本；没有虚构PASS。Node测试为单独运行。

### 实际 Preview HTTP 与浏览器验证

- 28个 HTML URL：三个目标西语页，加五语言各5个核心页，全部200。
- 上述页面的13份唯一直接引用 CSS/JS 全部200；CSS为 `text/css`，JS为 `text/javascript`。
- Capri 当前直接资源：`/_astro/_page_.DQ4YutuP.css`、`/_astro/activewear-quality-control-inspection.Brx38vIn.css`、`/_astro/hoisted.D_jpDeEJ.js`，均200。这里只记录当次构建结果，代码不硬编码这些哈希。
- 分类页另外使用 `/_astro/products.D4ogAovK.css` 和 `/_astro/hoisted.G6fzIeIE.js`，均200。
- 浏览器 Network 额外确认 Capri 动态依赖 `hoisted.C0rOyzlh.js` 200；不止检查入口文件是否存在。
- Capri 在1883px桌面和390px手机下均无横向溢出；主图与缩略图加载正常；点击象牙色缩略图后 src更新、aria-pressed为true。
- 三个目标西语页390px下均 `scrollWidth = innerWidth = 390`；两个分类目录都成功初始化。
- Quote CTA到达 `#product-inquiry`；型号仍为TZ4549-6；询盘类型默认仍为Sample；空表单校验false。
- WhatsApp链接保持西语预填与TZ4549-6；没有发送消息或提交真实测试询盘。
- 未发现与修复资源有关的JS异常或CSS MIME报错。Capri Preview另有浏览器自动请求 `/favicon.ico` 的404，已记录为无关待办；Sports Bras 控制台无error/warn。没有宣称所有页面Console零错误。

### 内容保护与范围

构建前后逐文件比较全部HTML的SHA-256，只有指定的三份西语HTML改变；去除其Astro资源URL差异后，三个文件与原 `public` 文件**逐字一致**。其他页面HTML没有变化，公共源静态页也未修改。

因此正文、Title、H1、canonical、hreflang、JSON-LD商业事实、真实图片、ALT、表单默认值和商业声明均保留。没有重建或重新翻译数百个其他语言页面；正常Astro build仍会生成项目原有页面。

## 6. 部署和搜索平台状态

- 已检查 `wrangler.toml`：Cloudflare Pages输出目录为 `dist`，本集成在该输出目录内完成修复。
- 仓库 `deploy.cjs` 指向 `main`；现有搜索平台工作流配置在main push或计划任务触发。未运行deploy.cjs、Wrangler部署、push main或workflow_dispatch。
- 未读取Cloudflare云端项目设置，不能声称已验证云端生产分支的当前配置；因此本轮仅本地提交，不推送任何分支以触发未知部署。
- 生产修复尚未生效，线上仍可能存在旧资源失败。
- 未修改GSC/Bing设置，未提交sitemap、IndexNow或大批量收录请求。
- 待批准发布后应再次检查正式三页资源状态、MIME、图库、CTA、canonical和语言对应关系；提交成功也不能等同于索引成功。

## 7. 问题、风险与未完成事项

- 本次根因已在指定范围内修复。其他未指定静态镜像仍可能存在类似问题，不能把局部补丁说成全站镜像治理完成；扩大范围须审批。
- 既有全站缩略图检查失败、favicon404列入待办，未修改。
- 资源恢复后可看见静态西语镜像中的既有翻译问题，例如logo文本ENCAJAR、页面注释残文、联系邮箱翻译等。本任务禁止改业务和品牌内容，因此记录待审核，没有改写或替换。
- 任务01图库ALT缩短、表单默认Sample、MOQ路线/单位与时间含义、Product富媒体资格数据缺口继续保留。
- 没有虚构价格、库存、认证、评价或新的商业承诺。
- 修复可通过撤回本集成注册和两个脚本恢复；不会删除批准过的静态页面或业务数据。

## 8. 后续运营建议

批准部署后先做当日技术复测，确认旧资源引用不再出现在三页HTML、当前资源200且MIME正确。随后7天观察资源404和实际询盘错误；以28天为周期观察相关落地页GSC展示/点击及GA4 WhatsApp点击和成功提交。先保证正常加载，再评估SEO文案；不承诺排名或流量增幅。

## 9. 运营总监交接摘要

任务02于2026-10-28完成本地修复和测试，等待批准部署，未push/未生产发布。确认任务01本地提交6562bd11存在并保留。重新请求正式Capri西语旧CSS/JS均404、MIME为text/html，浏览器无缓存重载复现样式MIME错误和旧JS404。根因是public静态翻译HTML冻结旧Astro哈希。新增Astro build:done集成，仅将三个指定西语产品页绑定到对应英语页本次实际构建入口，不重译正文、不更改业务规则。build、9项Node测试、核心多语言与8页西语产品检查通过；Preview28个HTML和13份直接CSS/JS均200/MIME正确，图库与CTA正常。全部HTML对比只改变三个目标页，剔除资源地址后内容逐字一致。全站缩略图检查有未改动的德语TZ2557-3既有失败，另有favicon404/翻译问题待办，不能标为全站检查全通过。生产尚未修复，无GSC/Bing/IndexNow操作；请批准发布后再验证线上。

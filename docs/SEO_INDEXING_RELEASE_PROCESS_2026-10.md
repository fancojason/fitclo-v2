# Fitclo SEO 发布后索引通知（2026-10-21）

## 当前状态（2026-10-21）

差异检测脚本、验证端点和本文档已提交；GitHub 令牌缺少 workflow 写入范围，.github/workflows/notify-indexnow.yml 尚未加入远端，因此自动通知**未启用**。Cloudflare/GitHub 也尚未配置专用 INDEXNOW_KEY，线上验证端点返回 404。还没有向 IndexNow 发送请求。

## 当前实现

- 规范域名：`https://www.fitcloo.com/`。`/sitemap-index.xml` 指向 `/sitemap-0.xml`。生成的 sitemap 只列有尾斜杠的页面；构建后的 404、内部产品选择页、后台页和已重定向旧地址不列入。新工作流在发布前验证每个 sitemap URL 的生成 HTML、self-canonical 和非 noindex 状态；不一致即停止通知。
- `robots.txt` 允许 Googlebot、Bingbot 等抓取页面与资源，声明唯一的 sitemap index。故意屏蔽的 AI 训练爬虫策略不影响 Googlebot/Bingbot。
- `notify-indexnow.yml` 对 main 的页面变更运行：构建前后两个 Git 版本，比较 sitemap 中新增/删除的 URL 及现有 URL 的主要正文 HTML。仅通知变化项；超过 50 条时停止，需人工审查。发布后核对每条线上 URL 的 HTTP 状态和 key 文件，才向 IndexNow POST。200/202 仅是收到通知。
- 现有 Google Search Console sitemap 工作流沿用，不把 IndexNow 当成 Google 提交。没有普通内容页的自动 URL Inspection 索引请求。

## 一次性配置

1. 用密码生成器产生 8–128 位只含英文字母、数字和连字符的随机 key。不要用邮箱密码、API token 或已有密钥。
2. 在 Cloudflare Pages 项目的 **Production** 环境添加加密变量 `INDEXNOW_KEY`；同一个值在 GitHub 仓库 Actions secrets 添加 `INDEXNOW_KEY`。不要写入源码、PR、日志或客服消息。
3. 让 Cloudflare Pages 完成部署，再用内部工具验证 `https://www.fitcloo.com/indexnow-key.txt` 返回 200 且正文恰好是 key。该文件按 IndexNow 协议必须可公开访问，因此只使用专用随机 key，不复用任何真正的登录凭证。
4. GitHub Actions 中手动运行 **Notify IndexNow of changed pages**，或等待下一次页面内容部署。没有 `INDEXNOW_KEY` 时流程只报告候选 URL，不发送通知。首次运行需要存在前一个可构建的提交。
5. 工作流失败时检查 Cloudflare 部署时间、key 文件和 URL 状态；不要连续重试同一批 URL。删除页面若被重定向而非 404/410，需人工判断目标页后再通知，自动任务不会误报删除。

## Google Search Console 人工核验

- 打开 `https://search.google.com/search-console`，选择 `https://www.fitcloo.com/` 属性。
- 在“站点地图”确认 `https://www.fitcloo.com/sitemap-index.xml` 已读取且无错误。站点地图是发现 URL 的提示，不是收录保证。
- 对重要新页/实质修改页，在顶部输入完整规范 URL 使用“网址检查”。先看 Google 选择的规范 URL、上次抓取、是否允许索引及页面提取；必要时运行“测试实际网址”，再点“请求编入索引”。少量重要页即可，重复请求不会加快抓取。
- 未收录时在“网页索引编制”检查原因：被 robots 阻止、noindex、重定向、404、重复而 Google 选择另一规范页、已抓取但未编入索引、已发现但未抓取。先修相应根因，随后复测。
- 记录请求时间与 URL；数天到数周后复查状态，不把提交成功当作已收录，更不承诺排名提升。

官方参考：[IndexNow](https://www.indexnow.org/documentation)、[Google 重新抓取](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)、[Google 站点地图](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)。



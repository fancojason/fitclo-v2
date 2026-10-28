# Fitclo 站点运营基准

## 2026-10-28

- 正式站：https://www.fitcloo.com/；仓库：fancojason/fitclo-v2。
- 本轮代码基准main：`ebfe8ad053ecdb825301e6bb2f8816b9fd5f0787`。
- 任务01审计本地提交：`6562bd11`，未推送，原记录保留。
- 框架：Astro静态输出；`npm run build`；Cloudflare Pages输出目录`dist`。
- 多语言：EN、ES、DE、NL、PT-BR。部分页面由Astro直接生成，部分已翻译HTML在public中保存。
- 任务02确认静态镜像可能冻结旧哈希；仅批准修复三个西语产品页的构建资源绑定，不代表全站镜像重建获批。
- 已复现与本地验收证据见[任务02报告](2026-10-28-spanish-product-assets-fix.md)。生产发布待批准；不将本地测试当作正式环境修复。

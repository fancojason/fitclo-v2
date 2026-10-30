# 已批准的字体方案与生产接入

2026-10-30 用户已批准中间值版本上线：Poppins，标题和产品名600，导航15px/500；首页标语600、1.095行高、-.03em字距；Ready to Ship宽屏H1保留58px/600，目录H2为600/1.15行高，导航询盘按钮14px/500。

正式网址：https://www.fitcloo.com/
审核预览：https://codex-ready-stock-compact-pr.fitclo-v2.pages.dev/

生产通过astro.config.mjs的typographyAssets构建钩子加载带内容版本的样式文件，覆盖完整HTML及多语言镜像，保持原页面robots/canonical/schema。不得在生产运行prepare-cloudflare-preview.mjs，该脚本仅用于noindex预览。

此前各份preview报告是历史验证记录，实际部署结果以发布报告为准。资料源与产品图片不在本轮修改范围内。

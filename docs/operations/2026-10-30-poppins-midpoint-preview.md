# Poppins 中间值预览

按用户要求取较粗版与较细版之间的处理。只改静态预览CSS，未修改页面文案、产品数据、图片、功能或已确认的标题字号。

- 标题和产品名：700 / 500 两版之间采用600；普通H1保留600。
- 英文首页标语：保持64px桌面、36px手机，字重600；行高1.095、字距-.03em，分别是1.05/1.14、-.04em/-.02em的中间值。
- Ready to Ship目录标题：600字重、1.15行高；首屏58px/600保留。
- 导航询盘按钮：14px/500，介于15px和13px之间；其余导航15px/500不变。

实现提交3753ccf，记录提交a152b08；本地分支codex/ready-stock-compact-preview。仅预览上传，未推送main。

最新固定版本：https://4660749b.fitclo-v2.pages.dev/
同一预览别名：https://codex-ready-stock-compact-pr.fitclo-v2.pages.dev/

Wrangler确认部署成功，1个CSS资产更新、1896个复用。此轮复用上一轮已通过构建的HTML，没有谎称重新运行全量构建。预览检查脚本、HTTP路由及字体资源检查通过。

本地桌面首页、Ready to Ship、产品目录、博客及390px手机检查无横向溢出。线上预览别名实测CSS200、中间值规则存在；手机H1为Poppins 36px/600、39.42px行高、-1.08px字距；桌面H1为64px/600、70.08px行高、-1.92px字距，询盘按钮14px/500，无横向溢出。

固定部署地址曾出现浏览器网络错误，原预览别名重试访问正常；失败调用不计为通过。当前请优先使用预览别名。

截图：docs/screenshots/home-poppins-midpoint.jpg。

正式网站尚未部署，等待用户确认。未执行GSC/Bing/IndexNow；沿用预览noindex，不影响生产设置。

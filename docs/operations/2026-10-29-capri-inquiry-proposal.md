# Capri 报价入口方案：待商业审批，未接入页面

范围：TZ4549-6 的 EN/ES/DE 对应详情页。当前请求报价与样品CTA都到达同一表单，询盘类型初始为Sample。它可能使未主动修改下拉框的批发买家被归类为样品；当前暂无GA4/CRM数据量化这个比例。

## 建议的最小规则

| 场景 | 当前 | 建议（未实施） |
| --- | --- | --- |
| 直接到达表单，未选择类型 | Sample | 增加中性占位项Select inquiry type，value为空；是否允许空类型提交需老板确认 |
| Request Wholesale Quote，尚未手选 | 保持Sample | 显示中性项，不自动推断Ready Stock、Private Label或Full OEM |
| Order Sample，尚未手选 | Sample | 明确预选现有value=Sample |
| 客户已手选任何类型，再点击CTA | 原值 | 保留客户的手动选择，不静默覆盖 |
| 成功提交并重置表单 | 恢复原默认值 | 如批准中性默认，重置为空并清除“已手选”标记 |

受影响文件是 `src/pages/products/capri-workout-set.astro` 的表单选项与CTA监听；对应ES/DE静态镜像须同步。现有 `name=inquiry_type` 和四种有效业务值不重命名，不把所有询价统一归为现货。

## 保留校验与追踪

- 保留姓名required、邮箱/WhatsApp二选一和现有邮件格式校验，不新增数量或MOQ限制。
- 类型当前不是必填；将中性项设为必填会改变提交规则，必须另行明确批准。后端是否接受空类型也要在获批实现时用模拟测试确认。
- 保留 `click_quote_cta`、`click_sample_cta`、`start_product_inquiry` 和成功提交事件时机；点击CTA不得触发generate_lead/quote_form_submit。
- 不新增个人资料或搜索文本到GA4，不改变WhatsApp消息发送逻辑。
- 使用option的value而不是翻译标签匹配；EN/ES/DE共用相同的业务值，文案本地化。NL/PT-BR没有对应详情页时维持已有回退，不伪造新页面。

## 可测试的实现建议（独立示意，不是生产代码）

以下纯函数只表达待批准的选择策略；它未导入任何页面或构建脚本。

```js
import assert from 'node:assert/strict';
const chooseIntent = (entry, current, manuallySelected) =>
  manuallySelected ? current : entry === 'sample' ? 'Sample' : '';
assert.equal(chooseIntent('quote', 'Sample', false), '');
assert.equal(chooseIntent('sample', '', false), 'Sample');
assert.equal(chooseIntent('quote', 'Full OEM', true), 'Full OEM');
assert.equal(chooseIntent('sample', 'Private Label', true), 'Private Label');
assert.equal(chooseIntent('quote', 'Sample', true), 'Sample');
```

如获批，change事件设置“已手选”标记，成功提交后的form.reset清除标记；CTA监听只在未手选时调用策略。原追踪调用保持一次，不重绑或重复发送事件。

预期收益是减少默认Sample误分类；风险是中性空值影响报价归类、必填要求或完成率。可通过独立提交恢复原option与监听。实现后应分别验证鼠标/键盘/手机、手选保留、成功重置、校验及模拟成功/失败事件，不向正式表单发测试询盘。

**本轮代码仍保留Sample默认值，上述业务规则等待老板批准。**

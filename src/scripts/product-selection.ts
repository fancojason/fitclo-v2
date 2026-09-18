type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';
type Style = { id: number; styleNo: string; mainImage: string; availableSizes: Size[]; colorCharts: Array<{ id: number; url: string }> };
type Selection = { styleNo: string; color: string; availableSizes: Size[]; quantities: Record<Size, number>; total: number };
const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL'];
const selectionKey = 'fitclo-product-selection-v1';
const customerKey = 'fitclo-product-selection-customer-v1';
const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const searchForm = byId<HTMLFormElement>('style-search-form');
const searchInput = byId<HTMLInputElement>('style-search');
const searchStatus = byId<HTMLParagraphElement>('search-status');
const workspace = byId<HTMLElement>('style-workspace');
const addForm = byId<HTMLFormElement>('add-selection-form');
const colorInput = byId<HTMLInputElement>('selected-color');
const sizeContainer = byId<HTMLDivElement>('size-quantities');
const selectionError = byId<HTMLParagraphElement>('selection-error');
const addButton = byId<HTMLButtonElement>('add-selection-button');
const tableBody = byId<HTMLTableSectionElement>('selection-table-body');
const emptySelection = byId<HTMLParagraphElement>('empty-selection');
const clearButton = byId<HTMLButtonElement>('clear-selection');
const submissionForm = byId<HTMLFormElement>('submission-form');
const submissionStatus = byId<HTMLParagraphElement>('submission-status');
const submitButton = byId<HTMLButtonElement>('submit-selection');
const lightbox = byId<HTMLDialogElement>('chart-lightbox');
const lightboxImage = byId<HTMLImageElement>('lightbox-image');
let currentStyle: Style | null = null;
let editIndex: number | null = null;
let selections: Selection[] = [];

const track = (name: string, data: Record<string, string | number> = {}) => {
  const analytics = window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  const payload = { page_path: location.pathname, ...data };
  if (analytics.gtag) analytics.gtag('event', name, payload);
  else (analytics.dataLayer ||= []).push({ event: name, ...payload });
};

const safeInteger = (value: unknown) => Math.max(0, Math.min(1_000_000, Math.floor(Number(value) || 0)));
const emptyQuantities = (): Record<Size, number> => ({ XS: 0, S: 0, M: 0, L: 0, XL: 0 });
const persistSelections = () => localStorage.setItem(selectionKey, JSON.stringify(selections));

function loadSelections() {
  try {
    const stored = JSON.parse(localStorage.getItem(selectionKey) || '[]');
    if (!Array.isArray(stored)) return;
    selections = stored.slice(0, 100).map((item): Selection | null => {
      if (!item || typeof item.styleNo !== 'string' || typeof item.color !== 'string' || !Array.isArray(item.availableSizes)) return null;
      const availableSizes = sizes.filter((size) => item.availableSizes.includes(size));
      const quantities = emptyQuantities();
      sizes.forEach((size) => { quantities[size] = availableSizes.includes(size) ? safeInteger(item.quantities?.[size]) : 0; });
      const total = sizes.reduce((sum, size) => sum + quantities[size], 0);
      return total ? { styleNo: item.styleNo, color: item.color, availableSizes, quantities, total } : null;
    }).filter(Boolean) as Selection[];
  } catch { selections = []; }
}

function renderSelections() {
  byId('selection-count').textContent = `(${selections.length} item${selections.length === 1 ? '' : 's'})`;
  emptySelection.classList.toggle('hidden', selections.length > 0);
  clearButton.classList.toggle('hidden', selections.length === 0);
  tableBody.innerHTML = selections.map((item, index) => `<tr>
    <td class="font-bold">${escapeHtml(item.styleNo)}</td><td>${escapeHtml(item.color)}</td>
    ${sizes.map((size) => `<td>${item.availableSizes.includes(size) ? item.quantities[size] : '—'}</td>`).join('')}
    <td class="font-bold">${item.total}</td><td><div class="flex gap-2"><button type="button" class="selection-action" data-edit="${index}">Edit</button><button type="button" class="selection-action" data-remove="${index}">Remove</button></div></td>
  </tr>`).join('');
  persistSelections();
}

function escapeHtml(value: string) {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

function renderQuantities(style: Style, values = emptyQuantities()) {
  sizeContainer.innerHTML = style.availableSizes.map((size) => `<label class="block"><span class="mb-2 block text-center text-[12px] font-bold">${size}</span><span class="quantity-control"><button type="button" data-step="-1" data-size="${size}" aria-label="Decrease ${size}">-</button><input name="qty-${size}" type="number" inputmode="numeric" min="0" step="1" max="1000000" value="${safeInteger(values[size])}" aria-label="${size} quantity"><button type="button" data-step="1" data-size="${size}" aria-label="Increase ${size}">+</button></span></label>`).join('');
}

function showStyle(style: Style, values?: Selection) {
  currentStyle = style;
  byId<HTMLImageElement>('style-main-image').src = style.mainImage;
  byId<HTMLImageElement>('style-main-image').alt = `${style.styleNo} main product image`;
  byId('style-number').textContent = style.styleNo;
  byId('selected-style-number').textContent = style.styleNo;
  const charts = byId<HTMLDivElement>('color-charts');
  charts.style.gridTemplateColumns = `repeat(${Math.min(style.colorCharts.length, 3)}, minmax(0, 1fr))`;
  charts.innerHTML = style.colorCharts.map((chart, index) => `<button type="button" class="selection-chart" data-chart="${index}" aria-label="Enlarge color chart ${index + 1}"><img src="${chart.url}" alt="${style.styleNo} color chart ${index + 1}" loading="lazy"></button>`).join('');
  renderQuantities(style, values?.quantities);
  colorInput.value = values?.color || '';
  addButton.textContent = values ? 'Update Selection' : 'Add This Selection';
  workspace.classList.remove('hidden');
  workspace.classList.add('grid');
  selectionError.textContent = '';
  charts.querySelectorAll<HTMLButtonElement>('[data-chart]').forEach((button) => button.addEventListener('click', () => {
    const chart = style.colorCharts[Number(button.dataset.chart)];
    lightboxImage.src = chart.url;
    lightboxImage.alt = `${style.styleNo} enlarged color chart`;
    lightbox.showModal();
  }));
}

async function fetchStyle(styleNo: string) {
  const response = await fetch(`/api/product-selection/styles?style=${encodeURIComponent(styleNo.trim())}`, { headers: { Accept: 'application/json' } });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to find that style.');
  return result.style as Style;
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const styleNo = searchInput.value.trim();
  if (!styleNo) { searchStatus.textContent = 'Enter a style number.'; searchInput.focus(); return; }
  searchStatus.textContent = 'Searching...';
  try {
    const style = await fetchStyle(styleNo);
    editIndex = null;
    showStyle(style);
    searchStatus.textContent = '';
    track('product_selection_search', { product_code: style.styleNo, result: 'found' });
  } catch (error) {
    workspace.classList.add('hidden');
    workspace.classList.remove('grid');
    searchStatus.textContent = error instanceof Error ? error.message : 'Style not found.';
    track('product_selection_search', { product_code: styleNo, result: 'not_found' });
  }
});

sizeContainer.addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-step]');
  if (!button) return;
  const input = sizeContainer.querySelector<HTMLInputElement>(`input[name="qty-${button.dataset.size}"]`);
  if (input) input.value = String(safeInteger(Number(input.value) + Number(button.dataset.step)));
});
sizeContainer.addEventListener('input', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.type === 'number' && Number(input.value) < 0) input.value = '0';
});

addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!currentStyle || !colorInput.reportValidity()) return;
  const quantities = emptyQuantities();
  currentStyle.availableSizes.forEach((size) => {
    quantities[size] = safeInteger(sizeContainer.querySelector<HTMLInputElement>(`input[name="qty-${size}"]`)?.value);
  });
  const total = sizes.reduce((sum, size) => sum + quantities[size], 0);
  if (!total) { selectionError.textContent = 'Enter a quantity greater than 0 for at least one size.'; return; }
  const selection: Selection = { styleNo: currentStyle.styleNo, color: colorInput.value.trim(), availableSizes: [...currentStyle.availableSizes], quantities, total };
  if (editIndex === null) selections.push(selection); else selections[editIndex] = selection;
  const eventName = editIndex === null ? 'product_selection_add' : 'product_selection_edit';
  editIndex = null;
  renderSelections();
  colorInput.value = '';
  renderQuantities(currentStyle);
  addButton.textContent = 'Add This Selection';
  selectionError.textContent = '';
  track(eventName, { product_code: selection.styleNo, quantity: total });
});

tableBody.addEventListener('click', async (event) => {
  const target = (event.target as Element).closest<HTMLButtonElement>('button');
  if (!target) return;
  if (target.dataset.remove !== undefined) {
    const index = Number(target.dataset.remove);
    const removed = selections[index];
    selections.splice(index, 1);
    renderSelections();
    track('product_selection_remove', { product_code: removed?.styleNo || '' });
    return;
  }
  if (target.dataset.edit !== undefined) {
    const index = Number(target.dataset.edit);
    const item = selections[index];
    if (!item) return;
    try {
      const style = currentStyle?.styleNo.toLowerCase() === item.styleNo.toLowerCase() ? currentStyle : await fetchStyle(item.styleNo);
      editIndex = index;
      searchInput.value = item.styleNo;
      showStyle(style, item);
      workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) { searchStatus.textContent = error instanceof Error ? error.message : 'Unable to edit selection.'; }
  }
});

clearButton.addEventListener('click', () => {
  if (!confirm('Clear all product selections?')) return;
  selections = [];
  editIndex = null;
  renderSelections();
  track('product_selection_clear');
});

function saveCustomer() {
  const values = Object.fromEntries(new FormData(submissionForm).entries());
  localStorage.setItem(customerKey, JSON.stringify(values));
}
function loadCustomer() {
  try {
    const values = JSON.parse(localStorage.getItem(customerKey) || '{}');
    Object.entries(values).forEach(([name, value]) => {
      const field = submissionForm.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
      if (field && typeof value === 'string') field.value = value;
    });
  } catch { /* Ignore corrupt local data. */ }
}
submissionForm.addEventListener('input', saveCustomer);

submissionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!selections.length) { submissionStatus.textContent = 'Add at least one product selection before submitting.'; return; }
  if (!submissionForm.reportValidity()) return;
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';
  submissionStatus.textContent = '';
  const customer = Object.fromEntries(new FormData(submissionForm).entries());
  const idempotencyKey = sessionStorage.getItem('fitclo-selection-submit-key') || crypto.randomUUID();
  sessionStorage.setItem('fitclo-selection-submit-key', idempotencyKey);
  try {
    const response = await fetch('/api/product-selection/submissions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ customer, items: selections, idempotencyKey }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error || 'Unable to submit your selection.');
    byId('success-selection-id').textContent = result.selectionId;
    byId('customer-section').classList.add('hidden');
    byId('success-panel').classList.remove('hidden');
    selections = [];
    localStorage.removeItem(selectionKey);
    localStorage.removeItem(customerKey);
    sessionStorage.removeItem('fitclo-selection-submit-key');
    renderSelections();
    track('generate_lead', { inquiry_type: 'product_selection', selection_id: result.selectionId });
    byId('success-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    submissionStatus.textContent = error instanceof Error ? error.message : 'Unable to submit your selection.';
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Selection';
  }
});

byId('close-lightbox').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
loadSelections();
loadCustomer();
renderSelections();

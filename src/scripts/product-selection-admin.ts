type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';
type Style = { id: number; styleNo: string; mainImage: string; availableSizes: Size[]; active: boolean; colorCharts: Array<{ url: string }> };
const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL'];
const api = '/api/product-selection/admin';
const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const loginPanel = byId<HTMLElement>('login-panel');
const app = byId<HTMLElement>('admin-app');
const styleForm = byId<HTMLFormElement>('style-form');
const dialog = byId<HTMLDialogElement>('submission-dialog');
let styles: Style[] = [];

const escapeHtml = (value: unknown) => {
  const element = document.createElement('span');
  element.textContent = String(value ?? '');
  return element.innerHTML;
};
const request = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${api}/${path}`, { ...init, headers: { Accept: 'application/json', ...init?.headers } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(result.error || `Request failed (${response.status})`), { status: response.status });
  return result;
};

function showLogin() { loginPanel.classList.remove('hidden'); app.classList.add('hidden'); }
function showApp() { loginPanel.classList.add('hidden'); app.classList.remove('hidden'); }

byId<HTMLFormElement>('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector<HTMLButtonElement>('button')!;
  const status = byId('login-status');
  button.disabled = true; status.textContent = '';
  try {
    await request('login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
    form.reset(); showApp(); await Promise.all([loadStyles(), loadSubmissions()]);
  } catch (error) { status.textContent = error instanceof Error ? error.message : 'Unable to sign in.'; }
  finally { button.disabled = false; }
});

byId('logout').addEventListener('click', async () => { await request('logout', { method: 'POST' }).catch(() => null); showLogin(); });
document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.toggle('active', tab === button));
  byId('styles-panel').classList.toggle('hidden', button.dataset.tab !== 'styles');
  byId('submissions-panel').classList.toggle('hidden', button.dataset.tab !== 'submissions');
}));

async function loadStyles() {
  const result = await request('styles');
  styles = result.styles;
  const body = byId<HTMLTableSectionElement>('styles-body');
  byId('styles-empty').classList.toggle('hidden', styles.length > 0);
  body.innerHTML = styles.map((style) => `<tr>
    <td><strong>${escapeHtml(style.styleNo)}</strong></td><td><img src="${style.mainImage}" alt=""></td><td>${style.availableSizes.join(', ')}</td><td>${style.colorCharts.length}</td>
    <td><span class="badge ${style.active ? '' : 'disabled'}">${style.active ? 'Active' : 'Disabled'}</span></td>
    <td><div class="actions"><button type="button" class="secondary" data-edit="${style.id}">Edit</button><button type="button" class="secondary" data-toggle="${style.id}">${style.active ? 'Disable' : 'Enable'}</button><button type="button" class="secondary danger" data-delete="${style.id}">Delete</button></div></td>
  </tr>`).join('');
}

function resetStyleForm() {
  styleForm.reset();
  (styleForm.elements.namedItem('id') as HTMLInputElement).value = '';
  byId('style-form-title').textContent = 'Add Style';
  byId('cancel-edit').classList.add('hidden');
  byId('style-status').textContent = '';
}
byId('cancel-edit').addEventListener('click', resetStyleForm);

styleForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = (styleForm.elements.namedItem('id') as HTMLInputElement).value;
  const main = styleForm.elements.namedItem('mainImage') as HTMLInputElement;
  const charts = styleForm.elements.namedItem('colorCharts') as HTMLInputElement;
  const checked = styleForm.querySelectorAll<HTMLInputElement>('input[name="sizes"]:checked');
  const status = byId('style-status');
  if (!checked.length || (!id && !main.files?.length) || (!id && !charts.files?.length) || (charts.files?.length || 0) > 3) {
    status.textContent = 'Select sizes, add a main image and upload 1–3 color charts.'; return;
  }
  const button = byId<HTMLButtonElement>('save-style');
  button.disabled = true; button.textContent = 'Saving...'; status.textContent = '';
  try {
    await request(id ? `styles/${id}` : 'styles', { method: 'POST', body: new FormData(styleForm) });
    resetStyleForm(); await loadStyles();
  } catch (error) { status.textContent = error instanceof Error ? error.message : 'Unable to save style.'; }
  finally { button.disabled = false; button.textContent = 'Save Style'; }
});

byId('styles-body').addEventListener('click', async (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button');
  if (!button) return;
  if (button.dataset.edit) {
    const style = styles.find((item) => item.id === Number(button.dataset.edit));
    if (!style) return;
    resetStyleForm();
    (styleForm.elements.namedItem('id') as HTMLInputElement).value = String(style.id);
    (styleForm.elements.namedItem('styleNo') as HTMLInputElement).value = style.styleNo;
    styleForm.querySelectorAll<HTMLInputElement>('input[name="sizes"]').forEach((input) => { input.checked = style.availableSizes.includes(input.value as Size); });
    byId('style-form-title').textContent = `Edit ${style.styleNo}`;
    byId('cancel-edit').classList.remove('hidden');
    styleForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (button.dataset.toggle) {
    button.disabled = true;
    await request(`styles/${button.dataset.toggle}/toggle`, { method: 'POST' }).then(loadStyles).catch((error) => alert(error.message));
    return;
  }
  if (button.dataset.delete) {
    const style = styles.find((item) => item.id === Number(button.dataset.delete));
    if (!style || !confirm(`Permanently delete ${style.styleNo} and its uploaded images? Disable is recommended for normal use.`)) return;
    button.disabled = true;
    await request(`styles/${style.id}`, { method: 'DELETE' }).then(loadStyles).catch((error) => alert(error.message));
  }
});

async function loadSubmissions() {
  const result = await request('submissions');
  const submissions = result.submissions as Array<Record<string, string | number>>;
  byId('submissions-empty').classList.toggle('hidden', submissions.length > 0);
  byId('submissions-body').innerHTML = submissions.map((item) => `<tr>
    <td><strong>${escapeHtml(item.selection_id)}</strong></td><td>${escapeHtml(new Date(String(item.submitted_at).replace(' ', 'T') + 'Z').toLocaleString())}</td><td>${escapeHtml(item.customer_name)}</td><td>${escapeHtml(item.company)}</td><td>${escapeHtml(item.whatsapp)}</td><td>${escapeHtml(item.country)}</td><td>${item.styles}</td><td>${item.total_qty}</td><td><button type="button" class="secondary" data-view="${escapeHtml(item.selection_id)}">View</button></td>
  </tr>`).join('');
}

byId('submissions-body').addEventListener('click', async (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-view]');
  if (!button) return;
  try {
    const result = await request(`submissions/${button.dataset.view}`);
    const submission = result.submission;
    const items = result.items;
    byId('submission-detail').innerHTML = `<dl class="detail-grid">
      ${[['Selection ID', submission.selection_id], ['Name', submission.customer_name], ['Company / Brand', submission.company || '—'], ['WhatsApp', submission.whatsapp], ['Email', submission.email], ['Country / Region', submission.country], ['Submitted At', submission.submitted_at], ['Notes', submission.notes || '—']].map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}
    </dl><div class="table-wrap"><table><thead><tr><th>Style</th><th>Color</th>${sizes.map((size) => `<th>${size}</th>`).join('')}<th>Total</th></tr></thead><tbody>${items.map((item: Record<string, string | number | null>) => `<tr><td>${escapeHtml(item.style_no_snapshot)}</td><td>${escapeHtml(item.color_snapshot)}</td>${sizes.map((size) => `<td>${item[size.toLowerCase()] ?? '—'}</td>`).join('')}<td>${item.total}</td></tr>`).join('')}</tbody></table></div>
    <p style="margin-top:18px"><a class="button" href="${api}/submissions/${encodeURIComponent(submission.selection_id)}/export">Download Excel</a></p>`;
    dialog.showModal();
  } catch (error) { alert(error instanceof Error ? error.message : 'Unable to load submission.'); }
});

byId('close-dialog').addEventListener('click', () => dialog.close());
byId('refresh-styles').addEventListener('click', () => loadStyles().catch((error) => alert(error.message)));
byId('refresh-submissions').addEventListener('click', () => loadSubmissions().catch((error) => alert(error.message)));

request('session').then(async () => { showApp(); await Promise.all([loadStyles(), loadSubmissions()]); }).catch(showLogin);

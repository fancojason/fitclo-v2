(() => {
  const names = { en: 'English', es: 'Español', de: 'Deutsch', nl: 'Nederlands', 'pt-BR': 'Português (Brasil)' };
  const labels = { en: 'Choose language', es: 'Elegir idioma', de: 'Sprache wählen', nl: 'Kies taal', 'pt-BR': 'Escolher idioma' };
  const globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z"/></svg>';
  const chevron = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4"/></svg>';
  const check = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5"/></svg>';
  const codeOf = (option) => {
    const value = option.dataset.language || option.textContent.trim().toLowerCase();
    return value.toLowerCase() === 'pt-br' || value.startsWith('portugu') ? 'pt-BR' : value.slice(0, 2);
  };

  document.querySelectorAll('select[data-language-selector]').forEach((select, index) => {
    const options = Array.from(select.options).map((option) => ({ code: codeOf(option), value: option.value }));
    const current = options[select.selectedIndex] || options[0];
    if (!current || options.some(({ code }) => !names[code])) return;

    const wrapper = select.parentElement;
    wrapper.classList.add('language-menu');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'language-menu__trigger';
    trigger.setAttribute('aria-label', labels[document.documentElement.lang] || labels.en);
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<span class="language-menu__globe">${globe}</span><span class="language-menu__code">${current.code === 'pt-BR' ? 'PT' : current.code.toUpperCase()}</span><span class="language-menu__chevron">${chevron}</span>`;

    const menu = document.createElement('div');
    menu.id = `language-menu-${index}`;
    menu.className = 'language-menu__panel';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', trigger.getAttribute('aria-label'));
    menu.hidden = true;
    trigger.setAttribute('aria-controls', menu.id);
    const items = options.map(({ code, value }) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'language-menu__item';
      item.setAttribute('role', 'menuitemradio');
      item.setAttribute('aria-checked', String(code === current.code));
      item.dataset.language = code;
      item.innerHTML = `<span class="language-menu__item-code">${code === 'pt-BR' ? 'PT' : code.toUpperCase()}</span><span class="language-menu__item-name">${names[code]}</span>${code === current.code ? `<span class="language-menu__check">${check}</span>` : ''}`;
      item.addEventListener('click', () => {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      menu.append(item);
      return item;
    });
    const close = (restoreFocus = false) => {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus();
    };
    const open = (focusIndex = options.findIndex(({ code }) => code === current.code)) => {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      items[Math.max(0, focusIndex)]?.focus();
    };
    trigger.addEventListener('click', () => menu.hidden ? open() : close());
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        open(event.key === 'ArrowDown' ? 0 : items.length - 1);
      }
    });
    menu.addEventListener('keydown', (event) => {
      const currentIndex = items.indexOf(document.activeElement);
      const next = event.key === 'ArrowDown' ? (currentIndex + 1) % items.length
        : event.key === 'ArrowUp' ? (currentIndex - 1 + items.length) % items.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : -1;
      if (next >= 0) { event.preventDefault(); items[next].focus(); }
      if (event.key === 'Escape') { event.preventDefault(); close(true); }
      if (event.key === 'Tab') close();
    });
    document.addEventListener('pointerdown', (event) => { if (!wrapper.contains(event.target)) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !menu.hidden) close(true); });
    select.hidden = true;
    wrapper.append(trigger, menu);
  });
})();

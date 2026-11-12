(() => {
  const { SITE, CATS, FILTERS, PRODUCTS, PAGES, NAV, INFO } = window;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plural = (n, f) => f[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

  const track = $('#track'), progress = $('#progress'), overlay = $('#overlay'), modal = $('#modal');
  const mq = matchMedia('(max-width: 820px)');

  /* ───────── Шаблоны секций ───────── */
  const wordmark = () => `<div class="wordmark" aria-hidden="true">${[...SITE.brand].map((l) => `<span>${l}</span>`).join('')}</div>`;
  const hero = (img, title) => `
    <section class="hero">
      <div class="hero__media"><img src="${img}" alt=""></div>
      ${title ? `<h1 class="hero__title">${esc(title)}</h1>` : ''}
      ${wordmark()}
    </section>`;

  const action = (l, cls = '') => {
    if (l.panel) return `<button class="${cls}" data-panel="${l.panel}"><span>${esc(l.label)}</span></button>`;
    if (l.tg) return `<a class="${cls}" href="${SITE.telegram}" target="_blank" rel="noopener"><span>${esc(l.label)}</span></a>`;
    return `<a class="${cls}" href="${l.href}"><span>${esc(l.label)}</span></a>`;
  };

  const tile = (p, i) => `
    <a class="tile" href="#/product/${p.slug}" style="transition-delay:${Math.min(i, 12) * 45}ms">
      <img src="${p.images[0]}" alt="${esc(SITE.brand + ' ' + p.name)}" loading="lazy">
      <div class="tile__cap"><span>${esc(p.name)}</span></div>
    </a>`;

  const cta = (s) => `
    <section class="cta anim">
      <h2 class="cta__title">${esc(s.title)}</h2>
      <p class="cta__text">${esc(s.text)}</p>
      <div class="cta__btns">
        <button class="btn btn--dark" data-panel="partner"><span>Стать партнёром</span></button>
        <a class="btn btn--ghost" href="${SITE.telegram}" target="_blank" rel="noopener"><span>Написать в Telegram</span></a>
      </div>
    </section>`;

  const contactsGrid = () => `
    <div class="footer__grid">
      <div><h4>Контакты</h4>
        <a href="tel:${SITE.phone.replace(/\s/g, '')}">${SITE.phone}</a>
        <a href="mailto:${SITE.email}">${SITE.email}</a>
        <p>${esc(SITE.address)}</p></div>
      <div><h4>Партнёрам</h4>
        <button data-panel="partner">Стать партнёром</button>
        <a href="#/partners">Условия программы</a>
        <a href="#/regions">Регионы</a></div>
      <div><h4>Соцсети</h4>
        <a href="${SITE.telegram}" target="_blank" rel="noopener">Telegram</a>
        <a href="${SITE.vk}" target="_blank" rel="noopener">ВКонтакте</a></div>
      <div><h4>Инфо</h4>
        <a href="#/faq">Вопросы и ответы</a>
        <button data-panel="legal">Политика конфиденциальности</button>
        <p>Шоурум: ${esc(SITE.showroom)}</p></div>
    </div>`;

  const footer = () => `
    <footer class="footer anim">
      ${contactsGrid()}
      <a class="footer__mark" href="#/"><img src="assets/img/logo.png" alt="">${SITE.brand}</a>
    </footer>`;

  const SHAPES = ['big', '', '', 'tall', '', 'wide', '', '', 'big', '', 'tall', '', '', '', 'wide', ''];
  const section = (s) => {
    switch (s.type) {
      case 'col': return `
        <section class="col anim">
          <h2 class="col__title">${esc(s.title)}</h2>
          <div class="col__text">${s.text.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
          ${s.links ? `<div class="col__foot"><ul class="biglinks">${s.links.map((l) => `<li>${action({ ...l, label: '→ ' + l.label })}</li>`).join('')}</ul></div>` : ''}
        </section>`;
      case 'steps': return `
        <section class="steps ${s.numbered === false ? 'steps--plain' : ''} anim">${s.items.map(([t, d], i) => `
          <div class="step">
            ${s.numbered === false ? '' : `<div class="step__num">${String(i + 1).padStart(2, '0')}</div>`}
            <h3 class="step__title">${esc(t)}</h3><p class="step__text">${esc(d)}</p>
          </div>`).join('')}
        </section>`;
      case 'slider': return `<section class="slider anim">${s.images.map((src) => `<figure><img src="${src}" alt="" loading="lazy"></figure>`).join('')}</section>`;
      case 'gallery': return `
        <section class="tiles gallery">${s.images.map((src, i) => {
          const sh = SHAPES[i % SHAPES.length];
          return `<figure class="tile ${sh ? 'tile--' + sh : ''}" data-zoom="${src}" style="transition-delay:${(i % 9) * 45}ms"><img src="${src}" alt="Интерьер с покрытием OZARO" loading="lazy"></figure>`;
        }).join('')}</section>`;
      case 'list': return `<section class="list anim"><p class="col__kicker">${esc(s.kicker)}</p><ol>${s.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></section>`;
      case 'faq': return `
        <section class="faq anim"><h2 class="col__title">${esc(s.title)}</h2>
          ${s.items.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
        </section>`;
      case 'contacts': return `
        <section class="contacts anim">
          <div class="contacts__big">
            <a href="tel:${SITE.phone.replace(/\s/g, '')}">${SITE.phone}</a>
            <a href="${SITE.telegram}" target="_blank" rel="noopener">Telegram →</a>
            <a href="mailto:${SITE.email}">${SITE.email}</a>
          </div>
          <div class="footer__grid">
            <div><h4>Офис</h4><p>${esc(SITE.address)}</p></div>
            <div><h4>Шоурум</h4><p>${esc(SITE.showroom)}</p><p>Каталоги, живые выкрасы, пробники, подбор цвета и колеровка.</p></div>
          </div>
        </section>`;
      case 'cta': return cta(s);
    }
    return '';
  };

  /* ───────── Страницы ───────── */
  const filterState = { effect: new Set(), params: new Set() };
  let currentCat = null;
  const inCat = () => PRODUCTS.filter((p) => p.cat === currentCat);
  const matches = (p, st = filterState) => FILTERS.every((f) => !st[f.key].size || p[f.key].some((v) => st[f.key].has(v)));
  const filtered = () => inCat().filter((p) => matches(p));
  const tilesHTML = () => {
    const list = filtered();
    return list.length ? list.map(tile).join('') : '';
  };

  const pages = {
    home() {
      const c = (k) => PRODUCTS.filter((p) => p.cat === k).length;
      const panel = (k, icon) => `
        <a class="split" href="#/catalog/${k}">
          <div class="split__media"><img src="${k === 'plaster' ? 'assets/img/betone/1.jpg' : 'assets/img/vellato/0.jpg'}" alt=""></div>
          <div class="split__label">
            <div class="split__icon split__icon--${icon}"></div>
            <span class="split__title">${CATS[k].title}</span>
            <span class="split__count">${c(k)} ${plural(c(k), ['покрытие', 'покрытия', 'покрытий'])}</span>
          </div>
        </a>`;
      return `<section class="home">${panel('plaster', 'v')}${panel('paint', 'h')}${wordmark()}
        <p class="home__note"><b>OZARO в регионах России.</b><br>Покрытия, выкрасы и сопровождение объектов для дизайнеров и архитекторов.</p></section>`;
    },
    catalog(k) {
      const c = CATS[k]; if (!c) return pages.home();
      if (currentCat !== k) FILTERS.forEach((f) => filterState[f.key].clear());
      currentCat = k;
      const other = k === 'plaster' ? 'paint' : 'plaster';
      return `${hero(c.hero)}
        <section class="col anim">
          <h1 class="col__title">${c.title}</h1>
          <div class="col__text">${c.text.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
          <div class="col__foot">
            <p class="col__label">Фильтр по каталогу</p>
            <ul class="biglinks">${FILTERS.map((f) => `<li><button data-panel="filter"><i>${f.icon}</i>${f.title}<em data-fcount="${f.key}"></em></button></li>`).join('')}
              <li><a href="#/catalog/${other}"><i>→</i>${CATS[other].title}</a></li></ul>
            <a class="back" href="#/">Назад к категориям</a>
          </div>
        </section>
        <section class="tiles" id="tiles">${tilesHTML()}</section>
        ${cta({ title: 'Нужны выкрасы?', text: 'Отправим образцы выбранных покрытий в ваш город.' })}`;
    },
    product(slug) {
      const p = PRODUCTS.find((x) => x.slug === slug); if (!p) return pages.home();
      const related = PRODUCTS.filter((x) => x.slug !== slug).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat) || b.effect.filter((e) => p.effect.includes(e)).length - a.effect.filter((e) => p.effect.includes(e)).length).slice(0, 4);
      const attrs = [['Тип', p.kind], ...p.effect.map((e) => ['Эффект', e]), ...p.params.map((e) => ['Параметр', e])];
      return `${hero(p.images[0], p.name)}
        <section class="card anim">
          <div>
            <p class="card__kind">${esc(CATS[p.cat].title)}</p>
            <h2 class="card__lead">${esc(p.lead)}</h2>
            <p class="card__text">${esc(p.text)}</p>
            <dl class="card__attrs">${attrs.map(([a, b]) => `<dt>${a}</dt><dd>${esc(b)}</dd>`).join('')}</dl>
            <div class="card__btns">
              <button class="btn btn--light" data-panel="partner" data-interest="${esc(p.name)}"><span>Стать партнёром</span></button>
              <a class="btn btn--ghost" href="${SITE.telegram}" target="_blank" rel="noopener"><span>Написать в Telegram</span></a>
            </div>
            <a class="back" href="#/catalog/${p.cat}">Назад в каталог</a>
          </div>
          <dl class="card__specs">
            ${p.features.map(([t, d]) => `<div class="spec"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}
            <div class="spec"><dt>Подготовка основания</dt><dd>${esc(p.prep)}</dd></div>
          </dl>
        </section>
        ${p.images.length > 1 ? section({ type: 'slider', images: p.images.slice(1) }) : ''}
        <section class="col anim"><h2 class="col__title">Похожие покрытия</h2>
          <div class="col__text"><p>Подберём альтернативу под бюджет, основание и задачу проекта.</p></div>
          <div class="col__foot"><a class="back" href="#/catalog/${p.cat}">Все ${CATS[p.cat].short}</a></div></section>
        <section class="tiles">${related.map(tile).join('')}</section>`;
    },
    page(id) {
      const p = PAGES[id]; if (!p) return pages.home();
      return hero(p.hero, p.title) + p.sections.map(section).join('');
    }
  };

  /* ───────── Вертикальный скролл: параллакс героя и полоска прогресса ───────── */
  let heroImg = null;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (heroImg && y < innerHeight * 1.2) heroImg.style.translate = `0 ${y * 0.18}px`;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePanel(); closeModal(); closeLightbox(); } });

  /* ───────── Появление секций ───────── */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.04 });
  const observe = () => $$('.anim:not(.in), .tile:not(.in)', track).forEach((el) => io.observe(el));

  /* ───────── Роутер ───────── */
  let first = true;
  const parse = () => {
    const [, a = '', b = ''] = location.hash.split('/');
    if (!a) return { name: 'home', html: pages.home };
    if (a === 'catalog') return { name: 'catalog', html: () => pages.catalog(b) };
    if (a === 'product') return { name: 'product', html: () => pages.product(b) };
    return { name: PAGES[a] ? a : 'home', html: () => pages.page(a) };
  };
  const render = () => {
    const r = parse();
    document.body.dataset.route = r.name;
    track.classList.remove('is-ready');
    track.innerHTML = r.html() + footer();
    $$('[data-tg]').forEach((a) => (a.href = SITE.telegram));
    scrollTo(0, 0);
    heroImg = $('.hero__media img', track);
    $$('.nav__link').forEach((a) => {
      const n = NAV[a.dataset.i]; if (!n || n.modal) return;
      a.classList.toggle('is-active', n.match ? n.match.test(location.hash || '#/') : location.hash === n.href);
    });
    updateFilterUI();
    // setTimeout, а не rAF: в фоновой вкладке rAF не тикает, и страница осталась бы невидимой
    setTimeout(() => { track.classList.remove('is-leaving'); track.classList.add('is-ready'); observe(); onScroll(); }, 40);
  };
  const go = () => {
    closePanel(); closeModal();
    if (first) { first = false; return render(); }
    track.classList.add('is-leaving');
    setTimeout(render, 450);
  };
  addEventListener('hashchange', go);
  addEventListener('resize', () => { document.body.classList.toggle('mobile', mq.matches); onScroll(); });

  /* ───────── Навигация и меню ───────── */
  $('#navList').innerHTML = NAV.map((n, i) => `<li>${n.modal
    ? `<button class="nav__link" data-i="${i}" data-open-modal="info">${n.label}</button>`
    : `<a class="nav__link" data-i="${i}" href="${n.href}">${n.label}</a>`}</li>`).join('')
    + `<li class="nav__filter"><button class="nav__link" data-panel="filter">⌖ Фильтр по каталогу</button></li>`;

  const modalItem = (l) => `<li>${action(l)}</li>`;
  const openModal = (kind) => {
    const items = kind === 'info' ? INFO : [...NAV.filter((n) => !n.modal), ...INFO];
    $('#modalList').innerHTML = items.map(modalItem).join('');
    modal.classList.add('is-open');
    $('#burger').textContent = 'Закрыть';
    $$('.nav__link[data-open-modal]').forEach((b) => b.classList.add('is-active'));
  };
  function closeModal() { modal.classList.remove('is-open'); $('#burger').textContent = 'Меню'; $$('.nav__link[data-open-modal]').forEach((b) => b.classList.remove('is-active')); }
  $('#burger').addEventListener('click', () => (modal.classList.contains('is-open') ? closeModal() : openModal('all')));

  /* ───────── Панели ───────── */
  const openPanel = (id, src) => {
    closeModal();
    $$('.panel').forEach((p) => p.classList.toggle('is-open', p.id === 'panel-' + id));
    overlay.classList.add('is-open');
    if (id === 'partner') {
      const interest = src && src.dataset.interest || '';
      $('#partnerForm').elements.interest.value = interest;
      $('#formInterest').textContent = interest ? `Интересует покрытие: ${interest}` : '';
    }
    if (id === 'filter') updateFilterUI();
  };
  function closePanel() { overlay.classList.remove('is-open'); $$('.panel').forEach((p) => p.classList.remove('is-open')); }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-panel],[data-close-panel],[data-open-modal],[data-close-modal],[data-zoom],.modal a');
    if (!t) return;
    if (t.dataset.panel) return openPanel(t.dataset.panel, t);
    if ('closePanel' in t.dataset) return closePanel();
    if (t.dataset.openModal) return modal.classList.contains('is-open') ? closeModal() : openModal(t.dataset.openModal);
    if ('closeModal' in t.dataset) return closeModal();
    if (t.dataset.zoom) return openLightbox(t.dataset.zoom);
    if (t.closest('.modal')) closeModal();
  });

  /* ───────── Фильтр ───────── */
  const filterMain = $('#filterMain');
  function updateFilterUI() {
    if (!currentCat) return;
    const n = filtered().length;
    const word = plural(n, ['результат', 'результата', 'результатов']);
    $('#filterCount').textContent = `${n} ${word}`;
    $('#filterShow').textContent = `Показать ${n} ${word}`;
    filterMain.innerHTML = FILTERS.map((f) => {
      const opts = f.options.filter((o) => inCat().some((p) => p[f.key].includes(o)));
      return `<div class="fgroup"><h5>${f.title}</h5>${opts.map((o) => {
        const on = filterState[f.key].has(o);
        // Сколько останется, если включить этот вариант
        const test = { ...filterState, [f.key]: new Set([o]) };
        const avail = inCat().some((p) => matches(p, test));
        return `<button data-f="${f.key}" data-v="${esc(o)}" class="${on ? 'is-on' : ''}" ${!on && !avail ? 'disabled' : ''}>${esc(o)}</button>`;
      }).join('')}</div>`;
    }).join('');
    $$('[data-fcount]').forEach((el) => { const s = filterState[el.dataset.fcount].size; el.textContent = s ? `· ${s}` : ''; });
  }
  const applyFilter = () => {
    const tiles = $('#tiles'); if (!tiles) return;
    tiles.style.transition = 'opacity .3s'; tiles.style.opacity = 0;
    setTimeout(() => {
      const html = tilesHTML();
      tiles.className = html ? 'tiles' : 'tiles tiles--empty';
      tiles.innerHTML = html || 'Под такие фильтры ничего нет. Сбросьте часть условий.';
      tiles.style.opacity = 1;
      observe();
      tiles.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    updateFilterUI();
  };
  filterMain.addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]'); if (!b || b.disabled) return;
    const set = filterState[b.dataset.f];
    set.has(b.dataset.v) ? set.delete(b.dataset.v) : set.add(b.dataset.v);
    applyFilter();
  });
  $('#filterReset').addEventListener('click', () => { FILTERS.forEach((f) => filterState[f.key].clear()); applyFilter(); });

  /* ───────── Форма ───────── */
  const form = $('#partnerForm'), err = $('#formError');
  const roleEl = form.elements.role;
  roleEl.addEventListener('change', () => roleEl.classList.toggle('has-value', !!roleEl.value));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bad = [];
    ['name', 'city', 'phone'].forEach((n) => { const ok = form.elements[n].value.trim().length > 1; form.elements[n].classList.toggle('is-invalid', !ok); if (!ok) bad.push(n); });
    const phoneOk = form.elements.phone.value.replace(/\D/g, '').length >= 10;
    form.elements.phone.classList.toggle('is-invalid', !phoneOk);
    if (bad.length) return (err.textContent = 'Заполните имя, город и телефон.');
    if (!phoneOk) return (err.textContent = 'Проверьте номер телефона.');
    if (!form.elements.agree.checked) return (err.textContent = 'Нужно согласие на обработку персональных данных.');
    err.textContent = '';
    const data = Object.fromEntries(new FormData(form));
    if (SITE.formEndpoint) {
      try {
        const r = await fetch(SITE.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
      } catch (_) { return (err.textContent = 'Не получилось отправить. Напишите нам в Telegram — ответим быстрее.'); }
    }
    form.closest('.panel__main').classList.add('is-done');
    form.reset();
  });

  /* ───────── Лайтбокс ───────── */
  const lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = '<img alt="">'; document.body.append(lb);
  const openLightbox = (src) => { lb.firstChild.src = src; lb.classList.add('is-open'); };
  function closeLightbox() { lb.classList.remove('is-open'); }
  lb.addEventListener('click', closeLightbox);

  /* ───────── Старт ───────── */
  document.body.classList.toggle('mobile', mq.matches);
  go();
})();

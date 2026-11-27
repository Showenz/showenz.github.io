/* Логика сайта. Все настройки (услуги, цены, бот, примеры) — в config.js */
(function () {
  'use strict';

  const S = window.SITE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad2 = (n) => String(n).padStart(2, '0');
  const hasIO = 'IntersectionObserver' in window;

  /* ---------------- иконки (Lucide, ISC) ---------------- */
  const ICONS = {
    presentation: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
    doc: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    checks: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    notebook: '<path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/>',
    cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    calculator: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8"/><path d="M16 14v4"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    construction: '<rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
    warehouse: '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="12" height="12" x="6" y="10"/>',
    code: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    sheet: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 9v12"/><path d="M15 9v12"/>',
    usb: '<rect x="7" y="9" width="10" height="13" rx="2"/><path d="M9 9V2h6v7"/><path d="M11 5v1"/><path d="M13 5v1"/><path d="M10 14h4"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    play: '<path d="M6 3l14 9-14 9z"/>',
    pen: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>'
  };
  const svg = (name, cls = '') =>
    `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NF = new Intl.NumberFormat('ru-RU');
  const fmt = (n) => NF.format(Math.round(n));

  /* ---------------- данные из config.js ---------------- */
  const brand = S.brand || 'КАТОК';
  const tagline = S.tagline || 'учебные работы под ключ';
  const handle = (v) => String(v || '').replace(/^@/, '').trim();
  const okHandle = (v, placeholder) => /^[A-Za-z0-9_]{4,32}$/.test(v) && v !== placeholder;

  const botName = handle(S.bot);
  const botMissing = !okHandle(botName, 'your_bot');
  const botUrl = (start) => 'https://t.me/' + botName + (start ? '?start=' + encodeURIComponent(start) : '');
  const nick = handle(S.telegram);
  const tgMissing = !okHandle(nick, 'your_nick');
  const tgUrl = 'https://t.me/' + nick;

  const services = Array.isArray(S.services) ? S.services : [];
  const byId = {};
  services.forEach((s) => { byId[s.id] = s; });
  const cats = Array.isArray(S.categories) && S.categories.length ? S.categories : [{ id: 'all', title: 'Все' }];
  const realCats = cats.filter((c) => c.id !== 'all' && services.some((s) => s.cat === c.id));
  // price: 0 (или не указана) — цена «по договорённости», в минимальную цену не входит
  const priced = services.filter((s) => +s.price > 0);
  const minPrice = priced.length ? Math.min(...priced.map((s) => +s.price)) : 0;
  const DEAL = 'по договорённости';
  const urgentPct = (String(S.urgent || '').match(/(\d+)\s*%/) || [])[1];
  const urgentK = 1 + (urgentPct ? +urgentPct : 50) / 100;

  if (botMissing) console.warn('[' + brand + '] Впиши username бота в config.js (поле bot) — пока форма не может открыть бота.');

  document.title = brand + ' — ' + tagline;
  const setText = (sel, text) => $$(sel).forEach((el) => { el.textContent = text; });
  setText('[data-brand]', brand);
  setText('[data-tagline]', tagline);
  setText('[data-bot-handle]', '@' + (botName || 'your_bot'));
  setText('[data-tg-handle]', '@' + (nick || 'your_nick'));
  setText('[data-urgent]', S.urgent || '+50% к цене');
  setText('[data-promo]', S.promo || '');
  setText('[data-payment]', S.payment || '');
  setText('#year', new Date().getFullYear());

  function linkTo(a, url, missingMsg) {
    if (url) {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.href = '#';
      a.addEventListener('click', (e) => { e.preventDefault(); toast(missingMsg, 'alert'); });
    }
  }
  $$('[data-bot]').forEach((a) => linkTo(a, !botMissing ? botUrl() : !tgMissing ? tgUrl : '',
    'Бот ещё не подключён — впиши его username в config.js (поле bot)'));
  $$('[data-tg]').forEach((a) => linkTo(a, !tgMissing ? tgUrl : !botMissing ? botUrl() : '',
    'Ник Telegram ещё не указан — впиши его в config.js (поле telegram)'));

  // <i data-icon="..."> → настоящий svg
  $$('[data-icon]').forEach((el) => { el.outerHTML = svg(el.dataset.icon, el.className); });

  /* ---------------- всплывашка ---------------- */
  const toastEl = $('#toast');
  let toastT = 0;
  function toast(text, ico) {
    if (!toastEl) return;
    toastEl.innerHTML = svg(ico || 'check') + '<span>' + esc(text) + '</span>';
    toastEl.classList.add('is-show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-show'), 3600);
  }

  /* ---------------- копирование в буфер ---------------- */
  function copySync(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (e) { return false; }
  }
  function copyText(text) {
    if (copySync(text)) return Promise.resolve(true);
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true, () => false);
    }
    return Promise.resolve(false);
  }

  /* ---------------- бегущие строки ---------------- */
  function fillMarquee(el, words, cls, speed) {
    if (!el || !words.length) return;
    const one = words.map((t) => '<span class="' + cls + '">' + esc(t) + '</span>').join('');
    el.innerHTML = one;
    const unit = el.scrollWidth || 1;
    const reps = Math.max(1, Math.ceil((el.parentElement.offsetWidth + 200) / unit));
    const half = one.repeat(reps);
    el.innerHTML = half + half;
    el.style.animationDuration = ((unit * reps) / speed).toFixed(1) + 's';
  }
  const MARQUEES = [
    { el: $('#announce'), cls: 'announce__item', speed: 45,
      words: Array.isArray(S.announce) && S.announce.length ? S.announce : ['Принимаем заказы 24/7'] },
    { el: $('.tape--navy .tape__track'), cls: 'tape__item', speed: 55,
      words: ['Презентации', 'Курсовые', 'Дипломы', 'Чертежи AutoCAD', 'Дорожная одежда', 'Сметы и ППР', 'Геодезия', 'Логистика', 'Маршруты', 'Сайты', 'Базы SQL', 'Excel', 'Флешки'] },
    { el: $('.tape--orange .tape__track'), cls: 'tape__item', speed: 70,
      words: ['Укатаем любые долги', 'Сначала показ — потом оплата', 'Правки бесплатно', 'Срочно — от 2 часов', brand] }
  ];
  let marqueeW = 0;
  function fillMarquees(force) {
    const w = innerWidth;
    if (!force && marqueeW && Math.abs(w - marqueeW) < 40) return;
    marqueeW = w;
    MARQUEES.forEach((m) => fillMarquee(m.el, m.words, m.cls, m.speed));
  }

  /* ---------------- шапка, прогресс ---------------- */
  const nav = $('#nav');
  const progress = $('.progress span');
  let scrollQueued = false;
  function onScroll() {
    scrollQueued = false;
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 16);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    kickRoute();
  }
  addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------------- мобильное меню ---------------- */
  const burger = $('#burger');
  const menu = $('#menu');
  const isMenuOpen = () => document.body.classList.contains('menu-open');
  function setMenu(open) {
    if (open) menu.style.setProperty('--menu-top', Math.max(0, nav.getBoundingClientRect().bottom) + 'px');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', !open);
  }
  burger.addEventListener('click', () => setMenu(!isMenuOpen()));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isMenuOpen()) setMenu(false); });
  matchMedia('(min-width: 981px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  // ссылки на категории в меню и подвале
  const catLinks = realCats.map((c) => '<a href="#cat-' + esc(c.id) + '">' + esc(c.title) + '</a>');
  const menuCats = $('#menuCats');
  if (menuCats) menuCats.innerHTML = catLinks.join('');
  const footerCats = $('#footerCats');
  if (footerCats) footerCats.innerHTML = catLinks.map((a) => '<li>' + a + '</li>').join('');

  /* ---------------- анимации-«гифки»: запускаются, только когда видны ---------------- */
  const players = [];
  const playIO = hasIO ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const p = en.target._player;
      if (p) { p.inView = en.isIntersecting; syncPlayer(p); }
    });
  }, { threshold: 0.12 }) : null;

  function mountTpl(host, type) {
    const tpl = document.getElementById('tpl-' + type);
    if (!tpl || !host) return null;
    host.appendChild(tpl.content.cloneNode(true));
    const el = host.lastElementChild;
    $$('.wm', el).forEach((w) => { w.dataset.label = brand + ' · превью'; });
    return el;
  }
  function addPlayer(el, extra) {
    const p = Object.assign({
      el, inView: !playIO, on: false, loop: +(el.dataset && el.dataset.loop) || 0, iv: 0,
      slide: el.closest('.slide'), timer: $('[data-timer]', el), tIv: 0, elapsed: 0, since: 0,
      smil: null, video: null
    }, extra);
    el._player = p;
    el.classList.add('is-off');
    players.push(p);
    if (playIO) playIO.observe(el); else syncPlayer(p);
    return p;
  }
  function replay(el) {
    el.classList.remove('is-play');
    void el.getBoundingClientRect();
    el.classList.add('is-play');
  }
  function tickTimer(p) {
    const ms = p.elapsed + performance.now() - p.since;
    p.timer.textContent = '00:' + pad2(Math.floor(ms / 1000) % 9); // показ идёт по кругу 9 секунд
  }
  function syncPlayer(p) {
    const on = p.inView && !document.hidden && (!p.slide || p.slide.classList.contains('is-active'));
    if (on === p.on) return;
    p.on = on;
    p.el.classList.toggle('is-off', !on);
    if (p.loop) {
      clearInterval(p.iv);
      if (on) { replay(p.el); p.iv = setInterval(() => replay(p.el), p.loop); }
      else p.el.classList.remove('is-play');
    }
    if (p.timer) {
      clearInterval(p.tIv);
      if (on) { p.since = performance.now(); p.tIv = setInterval(() => tickTimer(p), 250); }
      else p.elapsed += performance.now() - p.since;
    }
    if (p.smil) { if (on) p.smil.unpauseAnimations(); else p.smil.pauseAnimations(); }
    if (p.video) {
      if (on) { const pr = p.video.play(); if (pr && pr.catch) pr.catch(() => {}); }
      else p.video.pause();
    }
  }
  document.addEventListener('visibilitychange', () => players.forEach(syncPlayer));

  // заглушки в слайдере
  $$('.frame[data-tpl]').forEach((frame) => {
    const el = mountTpl(frame, frame.dataset.tpl);
    if (el) addPlayer(el);
  });

  // фоновая стройка
  $$('[data-worksite]').forEach((host) => {
    const el = mountTpl(host, 'worksite');
    if (!el) return;
    if (reduce && el.pauseAnimations) el.pauseAnimations();
    addPlayer(el, { smil: !reduce && el.pauseAnimations ? el : null });
  });

  /* ---------------- «долги» зачёркивает каток ---------------- */
  const strike = $('#strike');
  let strikeAt = 0, strikeT = 0;
  function runStrike() {
    if (!strike) return;
    strike.classList.remove('is-go');
    void strike.offsetWidth; // перезапуск анимации
    strike.classList.add('is-go');
    strikeAt = performance.now();
  }
  if (strike) {
    const again = () => { if (performance.now() - strikeAt > 2600) runStrike(); };
    strike.addEventListener('mouseenter', again);
    strike.addEventListener('click', again);
  }

  /* ---------------- слайдер ---------------- */
  const hero = $('#hero');
  const slides = hero ? $$('.slide', hero) : [];
  const barsBox = $('#slideBars');
  const bars = barsBox ? $$('button', barsBox) : [];
  const slideNow = $('#slideNow');
  const SLIDE_MS = 8000;
  let cur = 0;

  function go(i, initial) {
    const n = slides.length;
    if (!n) return;
    i = (i + n) % n;
    const prev = cur;
    cur = i;
    slides.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle('is-active', on);
      s.inert = !on;
      s.setAttribute('aria-hidden', !on);
    });
    bars.forEach((b, k) => {
      b.classList.remove('is-current');
      b.classList.toggle('is-done', k < i);
      b.setAttribute('aria-current', k === i);
    });
    if (bars[i]) { void bars[i].offsetWidth; bars[i].classList.add('is-current'); }
    if (slideNow) slideNow.textContent = pad2(i + 1);

    clearTimeout(strikeT);
    if (i === 0) strikeT = setTimeout(runStrike, reduce ? 0 : initial ? 1200 : 900);
    else if (prev === 0 && strike) strikeT = setTimeout(() => strike.classList.remove('is-go'), 800);

    players.forEach(syncPlayer);
  }

  if (hero && slides.length) {
    hero.style.setProperty('--dur', SLIDE_MS / 1000 + 's');
    if (reduce) hero.classList.add('no-auto');

    // автолистание: следующий слайд, когда полоска дозаполнилась
    barsBox.addEventListener('animationend', (e) => {
      if (e.animationName !== 'barFill' || hero.classList.contains('no-auto')) return;
      if (e.target.closest('button') === bars[cur]) go(cur + 1);
    });
    bars.forEach((b, k) => b.addEventListener('click', () => go(k)));
    $('#slidePrev').addEventListener('click', () => go(cur - 1));
    $('#slideNext').addEventListener('click', () => go(cur + 1));
    $('.hero__ui', hero).addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(cur + 1);
      if (e.key === 'ArrowLeft') go(cur - 1);
    });

    // пауза: курсор на картинке, фокус с клавиатуры, слайдер не виден, вкладка скрыта
    const pauses = new Set();
    const pause = (why, on) => {
      if (on) pauses.add(why); else pauses.delete(why);
      hero.classList.toggle('is-paused', pauses.size > 0);
    };
    if (canHover) {
      $$('.slide__art, .hero__ui', hero).forEach((el) => {
        el.addEventListener('pointerenter', () => pause('hover', true));
        el.addEventListener('pointerleave', () => pause('hover', false));
      });
    }
    hero.addEventListener('focusin', (e) => { if (e.target.matches(':focus-visible')) pause('focus', true); });
    hero.addEventListener('focusout', (e) => { if (!hero.contains(e.relatedTarget)) pause('focus', false); });
    if (hasIO) new IntersectionObserver(([en]) => pause('view', !en.isIntersecting), { threshold: 0.2 }).observe(hero);
    document.addEventListener('visibilitychange', () => pause('hidden', document.hidden));

    // свайп на телефоне
    let tx = 0, ty = 0, touching = false;
    hero.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) { touching = false; return; }
      touching = true;
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    }, { passive: true });
    hero.addEventListener('touchend', (e) => {
      if (!touching) return;
      touching = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - tx, dy = t.clientY - ty;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });

    go(0, true);
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-ready')));
  }

  /* ---------------- каталог: категории и карточки ---------------- */
  const grid = $('#grid');
  const filters = $('#filters');
  const totalEl = $('#totalCount');
  if (totalEl) totalEl.textContent = services.length;

  grid.innerHTML = services.map((s, i) =>
    '<article class="card" data-cat="' + esc(s.cat) + '" style="view-transition-name:card-' + i + '">' +
      '<div class="card__media">' +
        '<span class="card__num">' + pad2(i + 1) + '</span>' +
        (s.tag ? '<span class="card__tag">' + esc(s.tag) + '</span>' : '') +
        '<span class="card__art">' + svg(s.icon) + '</span>' +
        '<span class="card__road" aria-hidden="true"></span>' +
        (s.items && s.items.length
          ? '<div class="card__over"><b>Что входит</b><ul>' + s.items.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul></div>'
          : '') +
      '</div>' +
      '<div class="card__info">' +
        '<h3>' + esc(s.title) + '</h3>' +
        '<p>' + esc(s.desc) + '</p>' +
        '<div class="card__meta">' +
          (+s.price > 0
            ? '<span class="card__price">от <b data-price="' + (+s.price) + '">' + fmt(+s.price) + '</b> ₽</span>'
            : '<span class="card__price card__price--deal"><b>' + DEAL + '</b></span>') +
          (s.term ? '<span class="card__term">' + svg('clock') + esc(s.term) + '</span>' : '') +
        '</div>' +
        '<button class="card__btn" type="button" data-order="' + esc(s.id) + '" aria-label="Заказать: ' + esc(s.title) + '">Заказать <span aria-hidden="true">+</span></button>' +
      '</div>' +
    '</article>'
  ).join('');
  const cards = $$('.card', grid);

  filters.innerHTML = cats.map((c) => {
    const n = c.id === 'all' ? services.length : services.filter((s) => s.cat === c.id).length;
    if (c.id !== 'all' && !n) return '';
    return '<button class="chip" type="button" role="tab" data-cat="' + esc(c.id) + '">' + esc(c.title) + '<sup>' + n + '</sup></button>';
  }).join('');
  const chips = $$('.chip', filters);
  let curCat = null;

  function applyFilter(cat) {
    const useVT = !!document.startViewTransition && !reduce && curCat !== null;
    const update = () => {
      let k = 0;
      cards.forEach((c) => {
        const show = cat === 'all' || c.dataset.cat === cat;
        if (show && c.hidden) {
          c.style.setProperty('--d', k * 45 + 'ms');
          if (!useVT && c.classList.contains('settled')) c.classList.add('pop');
        }
        c.hidden = !show;
        if (show) k++;
      });
    };
    if (useVT) document.startViewTransition(update); else update();
  }
  function centerChip(b) {
    if (filters.scrollWidth <= filters.clientWidth + 2) return;
    const fr = filters.getBoundingClientRect(), br = b.getBoundingClientRect();
    filters.scrollTo({ left: filters.scrollLeft + br.left - fr.left - (fr.width - br.width) / 2, behavior: reduce ? 'auto' : 'smooth' });
  }
  function openCat(id, scroll) {
    if (!chips.some((b) => b.dataset.cat === id)) id = 'all';
    chips.forEach((b) => {
      const on = b.dataset.cat === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      if (on && curCat !== null) centerChip(b);
    });
    if (id !== curCat) { applyFilter(id); curCat = id; }
    if (scroll) $('#services').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  const setHash = (id) => { try { history.replaceState(null, '', id === 'all' ? '#services' : '#cat-' + id); } catch (e) { /* file:// */ } };
  openCat('all', false);

  filters.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b || b.classList.contains('is-active')) return;
    openCat(b.dataset.cat, false);
    setHash(b.dataset.cat);
  });
  filters.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = chips.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const next = chips[(i + (e.key === 'ArrowRight' ? 1 : -1) + chips.length) % chips.length];
    next.focus();
    next.click();
  });
  // любые ссылки вида #cat-road открывают нужную категорию
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#cat-"]');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('href').slice(5);
    openCat(id, true);
    setHash(id);
  });
  const catFromHash = () => {
    const m = /^#cat-([\w-]+)$/.exec(location.hash);
    if (m) openCat(m[1], true);
  };
  addEventListener('hashchange', catFromHash);

  // плавный счётчик цены
  function countUp(el, delay) {
    const to = el ? +el.dataset.price : 0;
    if (reduce || !to) return;
    const dur = 1100;
    el.textContent = '0';
    setTimeout(() => {
      const t0 = performance.now();
      const step = (t) => {
        const p = clamp((t - t0) / dur, 0, 1);
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
  }
  cards.forEach((c) => c.addEventListener('animationend', (e) => {
    if (e.target !== c) return;
    if (e.animationName === 'cardIn') c.classList.add('settled');
    if (e.animationName === 'pop') c.classList.remove('pop');
  }));

  // «Заказать» на карточке → форма с выбранной услугой
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-order]');
    if (btn) pickService(btn.dataset.order);
  });

  /* ---------------- примеры работ ---------------- */
  const exTrack = $('#exTrack');
  const EX = Array.isArray(S.examples) ? S.examples : [];
  const MOCKS = ['deck', 'cad', 'site', 'sql'];
  const isVideo = (src) => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(src);

  exTrack.innerHTML = EX.map((x, i) =>
    '<article class="ex" data-reveal style="--d:' + (i * 0.08).toFixed(2) + 's">' +
      '<div class="ex__media"></div>' +
      '<div class="ex__info"><span class="ex__num">' + pad2(i + 1) + '</span><h3>' + esc(x.title) + '</h3>' +
        (x.tag ? '<span class="ex__tag">' + esc(x.tag) + '</span>' : '') + '</div>' +
    '</article>'
  ).join('');
  const exItems = $$('.ex', exTrack);

  exItems.forEach((item, i) => {
    const x = EX[i];
    const media = $('.ex__media', item);
    const src = String(x.src || '').trim();
    if (src && isVideo(src)) {
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.setAttribute('aria-label', x.title || 'Пример работы');
      // картинка, пока видео грузится (и если телефон в режиме экономии не даёт автозапуск)
      if (x.poster) v.poster = String(x.poster);
      v.src = src;
      media.appendChild(v);
      addPlayer(media, { video: v });
    } else if (src) {
      const img = new Image();
      img.alt = x.title || 'Пример работы';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      img.src = src;
      media.appendChild(img);
    } else {
      const el = mountTpl(media, MOCKS.includes(x.type) ? x.type : MOCKS[i % MOCKS.length]);
      if (el) addPlayer(el);
    }
  });

  const exNow = $('#exNow');
  const exTotal = $('#exTotal');
  if (exTotal) exTotal.textContent = pad2(exItems.length);
  const exPad = () => parseFloat(getComputedStyle(exTrack).paddingLeft) || 0;
  const exAtEnd = () => exTrack.scrollLeft + exTrack.clientWidth >= exTrack.scrollWidth - 4;
  function exAligned() {
    const base = exTrack.getBoundingClientRect().left + exPad();
    let best = 0, bd = Infinity;
    exItems.forEach((it, i) => {
      const d = Math.abs(it.getBoundingClientRect().left - base);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }
  function goEx(i) {
    const n = exItems.length;
    if (!n) return;
    const it = exItems[(i + n) % n];
    const left = exTrack.scrollLeft + it.getBoundingClientRect().left - exTrack.getBoundingClientRect().left - exPad();
    exTrack.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
  }
  function exCounter() {
    if (exNow) exNow.textContent = pad2((exAtEnd() && exItems.length ? exItems.length - 1 : exAligned()) + 1);
  }
  $('#exPrev').addEventListener('click', () => { const c = exAligned(); goEx(c === 0 ? exItems.length - 1 : c - 1); });
  $('#exNext').addEventListener('click', () => { goEx(exAtEnd() ? 0 : exAligned() + 1); });
  let exQueued = false;
  exTrack.addEventListener('scroll', () => {
    if (exQueued) return;
    exQueued = true;
    requestAnimationFrame(() => { exQueued = false; exCounter(); });
  }, { passive: true });

  // на компьютере ленту можно тянуть мышью
  if (canHover) {
    let drag = null;
    exTrack.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: exTrack.scrollLeft, moved: false, id: e.pointerId };
    });
    exTrack.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        exTrack.setPointerCapture(drag.id);
        exTrack.classList.add('is-drag');
      }
      if (drag.moved) exTrack.scrollLeft = drag.left - dx;
    });
    const endDrag = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      if (!moved) return;
      exTrack.classList.remove('is-drag');
      goEx(exAligned());
    };
    exTrack.addEventListener('pointerup', endDrag);
    exTrack.addEventListener('pointercancel', endDrag);
  }

  /* ---------------- маршрут: каток прокладывает дорогу ---------------- */
  const route = $('#route');
  const routeSvg = $('#routeSvg');
  const roller = $('#roller');
  const routePaths = route ? $$('[data-route]', route) : [];
  const maskPath = route ? $('.route__mask', route) : null;
  const steps = route ? $$('.step', route) : [];
  const R = { ready: false, L: 0, H: 0, samples: [], stepLen: [], cur: 0, raf: 0, rw: 0, rh: 0 };

  function lenAtY(y) {
    const s = R.samples;
    if (!s.length || y <= s[0].y) return 0;
    if (y >= s[s.length - 1].y) return R.L;
    let lo = 0, hi = s.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (s[mid].y < y) lo = mid; else hi = mid;
    }
    const a = s[lo], b = s[hi];
    return a.l + (b.l - a.l) * ((y - a.y) / (b.y - a.y || 1));
  }

  function layoutRoute() {
    if (!route || !steps.length) return;
    const rr = route.getBoundingClientRect();
    const W = route.clientWidth, H = route.clientHeight;
    routeSvg.setAttribute('width', W);
    routeSvg.setAttribute('height', H);
    routeSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    const pts = steps.map((st) => {
      const b = $('.step__pin', st).getBoundingClientRect();
      return { x: b.left + b.width / 2 - rr.left, y: b.top + b.height / 2 - rr.top };
    });
    let d = 'M' + pts[0].x + ' 0 L' + pts[0].x + ' ' + pts[0].y;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], my = (b.y - a.y) / 2;
      d += ' C' + a.x + ' ' + (a.y + my) + ',' + b.x + ' ' + (b.y - my) + ',' + b.x + ' ' + b.y;
    }
    d += ' L' + pts[pts.length - 1].x + ' ' + H;
    routePaths.forEach((p) => p.setAttribute('d', d));

    R.L = maskPath.getTotalLength();
    R.H = H;
    R.samples = [];
    const N = 400;
    for (let i = 0; i <= N; i++) {
      const l = (R.L * i) / N;
      R.samples.push({ l, y: maskPath.getPointAtLength(l).y });
    }
    R.stepLen = pts.map((p) => lenAtY(p.y));
    maskPath.style.strokeDasharray = R.L + ' ' + (R.L + 20);
    R.rw = roller.offsetWidth;
    R.rh = roller.offsetHeight;
    R.cur = Math.min(R.cur, R.L);
    R.ready = true;
    route.classList.add('is-ready');
    drawRoute();
    kickRoute();
  }

  function drawRoute() {
    const c = R.cur;
    maskPath.style.strokeDashoffset = R.L - c;
    const p = maskPath.getPointAtLength(c);
    const a = maskPath.getPointAtLength(Math.max(0, c - 2));
    const b = maskPath.getPointAtLength(Math.min(R.L, c + 2));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
    roller.style.transform = 'translate(' + (p.x - R.rw / 2).toFixed(1) + 'px,' + (p.y - R.rh / 2).toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg)';
    steps.forEach((st, i) => st.classList.toggle('is-active', c >= R.stepLen[i] - 4));
  }

  function tickRoute() {
    R.raf = 0;
    const rr = route.getBoundingClientRect();
    const target = lenAtY(clamp(innerHeight * 0.55 - rr.top, 0, R.H));
    const diff = target - R.cur;
    R.cur = reduce || Math.abs(diff) < 0.4 ? target : R.cur + diff * 0.12;
    drawRoute();
    if (R.cur !== target) R.raf = requestAnimationFrame(tickRoute);
  }
  function kickRoute() {
    if (R.ready && !R.raf) R.raf = requestAnimationFrame(tickRoute);
  }

  /* ---------------- вопросы ---------------- */
  const qas = $$('.qa');
  qas.forEach((qa) => {
    $('.qa__q', qa).addEventListener('click', () => {
      const open = !qa.classList.contains('is-open');
      qas.forEach((o) => {
        o.classList.toggle('is-open', o === qa && open);
        $('.qa__q', o).setAttribute('aria-expanded', o === qa && open);
      });
    });
  });

  /* =========================================================
     ФОРМА ЗАЯВКИ → Telegram-бот
     1) пробуем отправить заявку боту (/api/order) — бот вернёт ссылку
        t.me/<бот>?start=o_<код>, человек жмёт «Старт», заявка у нас;
     2) если бот недоступен (сайт на обычном хостинге) — показываем текст
        заявки, копируем его и открываем бота: там его достаточно вставить.
     ========================================================= */
  const form = $('#orderForm');
  const formBody = $('#formBody');
  const formDone = $('#formDone');
  const fService = $('#fService');
  const fTopic = $('#fTopic');
  const fDeadline = $('#fDeadline');
  const fUrgent = $('#fUrgent');
  const fDetails = $('#fDetails');
  const fName = $('#fName');
  const fSum = $('#fSum');
  const fSubmit = $('#fSubmit');
  const doneTitle = $('#doneTitle');
  const doneText = $('#doneText');
  const doneLink = $('#doneLink');
  const doneCopy = $('#doneCopy');
  const donePre = $('#donePre');

  const orphans = services.filter((s) => !realCats.some((c) => c.id === s.cat));
  const opt = (s) => '<option value="' + esc(s.id) + '">' + esc(s.title) + ' — ' + (+s.price > 0 ? 'от ' + fmt(s.price) + ' ₽' : DEAL) + '</option>';
  fService.innerHTML = '<option value="" disabled selected>Выбери работу</option>' +
    realCats.map((c) => '<optgroup label="' + esc(c.title) + '">' + services.filter((s) => s.cat === c.id).map(opt).join('') + '</optgroup>').join('') +
    '<optgroup label="Другое">' + orphans.map(opt).join('') + '<option value="other">Другая работа — опишу ниже</option></optgroup>';

  const isoDate = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  const ruDate = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso); return m ? m[3] + '.' + m[2] + '.' + m[1] : iso; };
  fDeadline.min = isoDate(new Date());
  fTopic.setAttribute('aria-describedby', 'fTopicErr');

  function updateSum() {
    const s = byId[fService.value];
    const k = fUrgent.checked ? urgentK : 1;
    fSum.textContent = s ? (+s.price > 0 ? 'от ' + fmt(s.price * k) + ' ₽' : DEAL)
      : fService.value === 'other' ? 'по заданию'
      : 'от ' + fmt(minPrice * k) + ' ₽';
  }
  updateSum();

  const setErr = (el, on) => {
    const f = el.closest('.field');
    if (f) f.classList.toggle('is-error', on);
    el.setAttribute('aria-invalid', on);
  };
  fService.addEventListener('change', () => { setErr(fService, false); updateSum(); });
  fUrgent.addEventListener('change', updateSum);
  fTopic.addEventListener('input', () => { if (fTopic.value.trim().length >= 2) setErr(fTopic, false); });

  function showForm() {
    formDone.hidden = true;
    formBody.hidden = false;
  }
  function pickService(id) {
    if (!byId[id]) return;
    showForm();
    fService.value = id;
    setErr(fService, false);
    updateSum();
    $('#order').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (canHover) setTimeout(() => fTopic.focus({ preventScroll: true }), reduce ? 0 : 700);
    toast('Выбрано: ' + byId[id].title);
  }

  function collect() {
    return {
      service: fService.value,
      topic: fTopic.value.trim().slice(0, 200),
      deadline: fDeadline.value || '',
      urgent: fUrgent.checked,
      details: fDetails.value.trim().slice(0, 2000),
      name: fName.value.trim().slice(0, 60)
    };
  }
  function orderText(d) {
    const s = byId[d.service];
    const lines = [
      'Заявка с сайта ' + brand,
      'Услуга: ' + (s ? s.title + (+s.price > 0 ? ' (от ' + fmt(s.price) + ' ₽)' : ' (' + DEAL + ')') : 'Другая работа'),
      'Тема: ' + d.topic
    ];
    if (d.deadline || d.urgent) lines.push('Срок: ' + (d.deadline ? ruDate(d.deadline) : 'как можно скорее') + (d.urgent ? ' · срочно' : ''));
    if (d.name) lines.push('Имя: ' + d.name);
    if (d.details) lines.push('Подробности: ' + d.details);
    return lines.join('\n');
  }

  async function sendToBot(d) {
    const base = String(S.api || '').trim().replace(/\/+$/, '');
    if (!base && !/^https?:$/.test(location.protocol)) return null; // открыт как файл — бота рядом нет
    const ctrl = 'AbortController' in window ? new AbortController() : null;
    const t = setTimeout(() => { if (ctrl) ctrl.abort(); }, 6000);
    try {
      const r = await fetch(base + '/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
        credentials: 'omit',
        signal: ctrl ? ctrl.signal : undefined
      });
      if (!r.ok) return null;
      const j = await r.json();
      if (j && j.ok && typeof j.link === 'string' && /^https:\/\/t\.me\/[A-Za-z0-9_]{4,32}\?start=[A-Za-z0-9_-]{1,64}$/.test(j.link)) return j;
      return null;
    } catch (e) {
      return null;
    } finally {
      clearTimeout(t);
    }
  }

  let sending = false;
  let lastText = '';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    const okService = !!fService.value;
    const okTopic = fTopic.value.trim().length >= 2;
    setErr(fService, !okService);
    setErr(fTopic, !okTopic);
    if (!okService || !okTopic) {
      (okService ? fTopic : fService).focus();
      toast(okService ? 'Напиши тему работы' : 'Выбери, какая работа нужна', 'alert');
      return;
    }

    const d = collect();
    lastText = orderText(d);
    sending = true;
    fSubmit.classList.add('is-loading');
    fSubmit.setAttribute('aria-busy', 'true');
    const res = botMissing ? null : await sendToBot(d);
    sending = false;
    fSubmit.classList.remove('is-loading');
    fSubmit.removeAttribute('aria-busy');

    formBody.hidden = true;
    formDone.hidden = false;
    doneLink.hidden = false;

    if (res) {
      // заявка уже у бота — осталось нажать «Старт»
      doneTitle.textContent = 'Осталось нажать «Старт»';
      doneText.textContent = 'Открываем Telegram-бота. Нажми в нём «Старт» — и заявка сразу уйдёт исполнителям.';
      donePre.hidden = true;
      doneCopy.hidden = true;
      doneLink.href = res.link;
      setTimeout(() => { location.href = res.link; }, reduce ? 200 : 900);
    } else {
      donePre.value = lastText;
      donePre.hidden = false;
      doneCopy.hidden = false;
      const copied = await copyText(lastText);
      if (botMissing) {
        doneTitle.textContent = 'Почти готово';
        doneText.textContent = 'Бот ещё не подключён (впиши его username в config.js). ' +
          (copied ? 'Текст заявки уже скопирован — ' : 'Скопируй текст заявки и ') + 'отправь его нам в Telegram.';
        if (tgMissing) doneLink.hidden = true; else doneLink.href = tgUrl;
      } else {
        doneTitle.textContent = 'Заявка готова';
        doneText.textContent = (copied ? 'Текст уже скопирован. ' : 'Скопируй текст ниже. ') +
          'Открой бота, нажми «Старт» и отправь этот текст одним сообщением.';
        doneLink.href = botUrl('s_' + (byId[d.service] ? d.service : 'other'));
      }
    }
    const top = form.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight * 0.6) form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  doneCopy.addEventListener('click', () => {
    copyText(lastText).then((ok) => {
      if (ok) toast('Текст заявки скопирован');
      else { donePre.focus(); donePre.select(); toast('Выдели текст и скопируй вручную', 'alert'); }
    });
  });
  $('#doneAgain').addEventListener('click', () => {
    form.reset();
    setErr(fService, false);
    setErr(fTopic, false);
    updateSum();
    showForm();
    if (canHover) fTopic.focus({ preventScroll: true });
  });

  /* ---------------- появление при прокрутке ---------------- */
  const revealEls = $$('[data-reveal]');
  if (hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => io.observe(el));

    const cardIO = new IntersectionObserver((entries) => {
      let k = 0;
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const c = en.target;
        const delay = k++ * 70;
        c.style.setProperty('--d', delay + 'ms');
        c.classList.add('is-in');
        countUp($('[data-price]', c), delay + 150);
        cardIO.unobserve(c);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -4% 0px' });
    cards.forEach((c) => cardIO.observe(c));
  } else {
    revealEls.concat(cards).forEach((el) => el.classList.add('is-in'));
  }

  /* ---------------- пересчёт размеров ---------------- */
  function relayout(force) {
    fillMarquees(force === true);
    layoutRoute();
    exCounter();
  }
  relayout(true);
  onScroll();
  requestAnimationFrame(catFromHash);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => relayout(true));
  addEventListener('load', () => relayout(true));
  if ('ResizeObserver' in window && route) {
    let rq = 0;
    new ResizeObserver(() => {
      cancelAnimationFrame(rq);
      rq = requestAnimationFrame(relayout);
    }).observe(route);
  }
  let resizeT = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(relayout, 120);
  });
})();

/* VogMerveille — interactions (vanilla JS, aucune dépendance). */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const euro = (n) => `${n.toLocaleString('fr-FR')} €`;

  /* ------------------------------------------------------------ data */
  const COLLAGE = { src: 'Image/7merveilles-du-monde.png', w: 712, h: 400 };

  const WONDERS = [
    { id: 'muraille', name: 'Grande Muraille de Chine', era: 'actuelle', place: 'Chine', crop: [9, 9, 224, 169], text: 'Plus de 20 000 km de remparts bâtis sur deux millénaires pour protéger l’empire du Milieu. Marchez sur ses chemins de ronde au lever du soleil.' },
    { id: 'colisee', name: 'Colisée', era: 'actuelle', place: 'Rome, Italie', crop: [243, 9, 225, 169], text: 'L’amphithéâtre de 50 000 places inauguré en 80 apr. J.-C. Assistez à une journée de jeux reconstituée depuis les gradins impériaux.' },
    { id: 'chichen', name: 'Chichén Itzá', era: 'actuelle', place: 'Mexique', crop: [479, 9, 224, 169], text: 'La pyramide de Kukulcán, calendrier de pierre maya où l’ombre d’un serpent descend les marches aux équinoxes.' },
    { id: 'petra', name: 'Pétra', era: 'actuelle', place: 'Jordanie', crop: [9, 189, 224, 201], text: 'La cité nabatéenne taillée dans le grès rose. Traversez le Siq jusqu’au Trésor, à la lueur des lanternes.' },
    { id: 'taj', name: 'Taj Mahal', era: 'actuelle', place: 'Agra, Inde', crop: [243, 189, 138, 201], text: 'Le mausolée de marbre blanc élevé par Shah Jahan par amour pour Mumtaz Mahal, reflété dans ses bassins.' },
    { id: 'christ', name: 'Christ Rédempteur', era: 'actuelle', place: 'Rio de Janeiro, Brésil', crop: [391, 189, 128, 201], text: 'Trente mètres de béton et de stéatite au sommet du Corcovado, les bras ouverts sur la baie de Rio.' },
    { id: 'machu', name: 'Machu Picchu', era: 'actuelle', place: 'Pérou', crop: [530, 189, 173, 201], text: 'La citadelle inca perchée à 2 430 m, entre pics andins et mer de nuages.' },
    { id: 'babylone', name: 'Jardins suspendus de Babylone', era: 'disparue', place: 'Mésopotamie', image: 'Image/disparu.png', text: 'Les terrasses végétalisées légendaires de Nabuchodonosor II. Nos reconstitutions immersives leur redonnent vie.' },
    { id: 'phare', name: 'Phare d’Alexandrie', era: 'disparue', place: 'Égypte', glyph: 'Φ', text: 'Haut de plus de 100 m, il guida les marins pendant seize siècles avant d’être abattu par les séismes.' },
    { id: 'colosse', name: 'Colosse de Rhodes', era: 'disparue', place: 'Grèce', glyph: 'Ρ', text: 'La statue de bronze du dieu Hélios, veillant sur le port de Rhodes — debout à peine 54 ans.' },
    { id: 'artemis', name: 'Temple d’Artémis', era: 'disparue', place: 'Éphèse, Turquie', glyph: 'Α', text: 'Un temple de marbre aux 127 colonnes, reconstruit plusieurs fois, admiré par tous les voyageurs antiques.' },
    { id: 'mausolee', name: 'Mausolée d’Halicarnasse', era: 'disparue', place: 'Bodrum, Turquie', glyph: 'Μ', text: 'Le tombeau monumental du roi Mausole, si célèbre qu’il a donné son nom à tous les mausolées.' },
    { id: 'zeus', name: 'Statue de Zeus à Olympie', era: 'disparue', place: 'Grèce', glyph: 'Ζ', text: 'Chef-d’œuvre chryséléphantin de Phidias : un Zeus d’or et d’ivoire de douze mètres, assis sur son trône.' },
  ];

  const PACKAGES = [
    {
      id: 'merveilles',
      name: 'Les 7 Merveilles',
      tag: 'Family Package',
      age: 'Dès 3 ans',
      price: 1290,
      image: COLLAGE.src,
      text: 'Un voyage inoubliable à travers les 7 merveilles du monde, où chaque escale révèle un trésor d’histoire et de culture.',
      perks: ['7 escales guidées', 'Activités adaptées aux enfants', 'Hébergement 4★ à bord'],
    },
    {
      id: 'disparus',
      name: 'Les Disparus',
      tag: 'Teenagers Package',
      age: 'Dès 8 ans',
      price: 1590,
      image: 'Image/disparu.png',
      text: 'Un voyage fascinant au cœur des civilisations oubliées : des Jardins suspendus de Babylone au Phare d’Alexandrie.',
      perks: ['6 merveilles reconstituées', 'Récits et jeux d’enquête', 'Soirée spectacle antique'],
    },
    {
      id: 'premium',
      name: 'Premium Travel',
      tag: 'Expert Package',
      age: 'Dès 12 ans',
      price: 3490,
      image: 'Image/PremiumTravel.png',
      featured: true,
      text: 'L’exploration complète : merveilles disparues et actuelles, là où le passé et le présent s’entremêlent.',
      perks: ['13 merveilles, deux époques', 'Guide expert dédié', 'Suite panoramique & spa inclus'],
    },
  ];

  const REVIEWS = [
    { text: 'Une expérience inoubliable, entre détente et découverte. Les guides sont incroyables !', who: 'Clara, Paris' },
    { text: 'Une plongée fascinante dans l’histoire. Mes enfants ont adoré !', who: 'Mehdi, Lyon' },
    { text: 'Voir le Phare d’Alexandrie éclairer la nuit… je n’ai pas de mots.', who: 'Jeanne, Bordeaux' },
    { text: 'Organisation parfaite, du départ au retour. On repart l’an prochain.', who: 'Thomas, Lille' },
    { text: 'Le dîner d’antan à Rome vaut à lui seul le voyage.', who: 'Sofia, Marseille' },
  ];

  const OPTIONS = { spa: { label: 'Spa & piscines', perPerson: 120 }, dinner: { label: 'Dîner d’antan', perPerson: 80 }, guide: { label: 'Guide privé', flat: 250 } };

  /* ------------------------------------------------------------ helpers */
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'style') Object.assign(node.style, v);
      else node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) if (c) node.append(c);
    return node;
  }

  /** Crops one tile of the collage, keeping its native aspect ratio. */
  function cropMedia([x, y, w, h], alt) {
    const img = el('img', { src: COLLAGE.src, alt, loading: 'lazy', decoding: 'async' });
    img.style.width = `${(COLLAGE.w / w) * 100}%`;
    img.style.left = `${(-x / w) * 100}%`;
    img.style.top = `${(-y / h) * 100}%`;
    img.style.setProperty('--ox', `${((x + w / 2) / COLLAGE.w) * 100}%`);
    img.style.setProperty('--oy', `${((y + h / 2) / COLLAGE.h) * 100}%`);
    return el('div', { class: 'crop', style: { aspectRatio: `${w} / ${h}` } }, img);
  }

  function wonderMedia(w) {
    if (w.crop) return cropMedia(w.crop, w.name);
    if (w.image) {
      const img = el('img', { src: w.image, alt: w.name, loading: 'lazy' });
      img.style.cssText = 'position:static;width:100%;aspect-ratio:16/10;object-fit:cover';
      return el('div', { class: 'crop' }, img);
    }
    return el('div', { class: 'wonder__art', 'aria-hidden': 'true', text: w.glyph });
  }

  let toastTimer;
  function toast(message) {
    const t = $('#toast');
    t.textContent = message;
    t.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-visible'), 3200);
  }

  /* ------------------------------------------------------------ nav */
  const nav = $('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('.nav__burger');
  const mobileMenu = $('#mobile-menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    mobileMenu.hidden = !open;
  };
  burger.addEventListener('click', () => setMenu(mobileMenu.hidden));
  mobileMenu.addEventListener('click', (e) => e.target.closest('a, button') && setMenu(false));

  const navLinks = $$('.nav__links a');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  $$('main section[id]').forEach((s) => sectionObserver.observe(s));

  /* ------------------------------------------------------------ reveal + counters */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  $$('.reveal').forEach((n, i) => {
    n.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObserver.observe(n);
  });

  $$('[data-count]').forEach((node) => {
    const target = Number(node.dataset.count);
    if (reduced) return (node.textContent = String(target));
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / 1600);
      node.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    setTimeout(() => requestAnimationFrame(step), 500);
  });

  // Soft light following the pointer on feature cards.
  $$('.feature').forEach((card) =>
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }),
  );

  /* ------------------------------------------------------------ modals */
  const detailModal = $('#detail-modal');
  const loginModal = $('#login-modal');
  const openModal = (m) => (typeof m.showModal === 'function' ? m.showModal() : m.setAttribute('open', ''));
  const closeModal = (m) => (typeof m.close === 'function' ? m.close() : m.removeAttribute('open'));
  $$('.modal').forEach((m) => {
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('[data-close]')) closeModal(m);
    });
  });

  function showDetail({ kicker, title, text, media }) {
    $('#detail-kicker').textContent = kicker;
    $('#detail-title').textContent = title;
    $('#detail-text').textContent = text;
    $('#detail-media').replaceChildren(media);
    openModal(detailModal);
  }

  /* ------------------------------------------------------------ gallery */
  const gallery = $('#gallery');
  WONDERS.forEach((w, i) => {
    const card = el('button', { type: 'button', class: 'wonder', 'data-era': w.era }, [
      wonderMedia(w),
      el('div', { class: 'wonder__body' }, [
        el('span', { class: 'wonder__tag', text: w.era === 'actuelle' ? `Actuelle · ${w.place}` : `Disparue · ${w.place}` }),
        el('h3', { text: w.name }),
        el('p', { text: w.text.split('.')[0] + '.' }),
      ]),
    ]);
    card.style.animationDelay = `${i * 40}ms`;
    card.addEventListener('click', () =>
      showDetail({ kicker: `${w.era === 'actuelle' ? 'Merveille actuelle' : 'Merveille disparue'} · ${w.place}`, title: w.name, text: w.text, media: wonderMedia(w) }),
    );
    gallery.append(card);
  });

  $$('.chip[data-filter]').forEach((chip) =>
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      $$('.chip[data-filter]').forEach((c) => {
        c.classList.toggle('is-active', c === chip);
        c.setAttribute('aria-pressed', String(c === chip));
      });
      $$('.wonder', gallery).forEach((card, i) => {
        const show = f === 'all' || card.dataset.era === f;
        card.hidden = !show;
        if (show) {
          card.style.animation = 'none';
          void card.offsetWidth; // restart the entrance animation
          card.style.animation = '';
          card.style.animationDelay = `${i * 30}ms`;
        }
      });
    }),
  );

  /* ------------------------------------------------------------ packages */
  const packagesRoot = $('#packages');
  const select = $('#sim-package');
  PACKAGES.forEach((p) => {
    const cta = el('a', { class: `btn ${p.featured ? 'btn--gold' : 'btn--ghost'}`, href: '#reserver', text: 'Choisir' });
    cta.addEventListener('click', () => {
      select.value = p.id;
      updateSim(true);
    });
    const media = el('div', { class: 'package__media' }, [el('img', { src: p.image, alt: p.name, loading: 'lazy' }), el('span', { class: 'package__age', text: p.age })]);
    media.addEventListener('click', () => {
      const img = el('img', { src: p.image, alt: p.name });
      img.style.cssText = 'width:100%;max-height:340px;object-fit:cover';
      showDetail({ kicker: `${p.tag} · ${p.age}`, title: p.name, text: p.text, media: img });
    });
    packagesRoot.append(
      el('article', { class: `package reveal${p.featured ? ' package--featured' : ''}` }, [
        media,
        el('div', { class: 'package__body' }, [
          el('p', { class: 'eyebrow', text: p.tag }),
          el('h3', { text: p.name }),
          el('p', { text: p.text }),
          el('ul', {}, p.perks.map((perk) => el('li', { text: perk }))),
          el('div', { class: 'package__price' }, [el('span', {}, [el('small', { text: 'à partir de ' }), el('strong', { text: euro(p.price) })]), cta]),
        ]),
      ]),
    );
    select.append(el('option', { value: p.id, text: `${p.name} — ${euro(p.price)} / adulte` }));
  });
  $$('.package.reveal').forEach((n) => revealObserver.observe(n));

  /* ------------------------------------------------------------ simulator */
  const sim = $('#simulator');
  const dateInput = sim.elements.date;
  const today = new Date();
  today.setDate(today.getDate() + 7);
  dateInput.min = today.toISOString().slice(0, 10);

  function clampInput(input) {
    const v = Math.round(Number(input.value) || 0);
    input.value = String(Math.min(Number(input.max), Math.max(Number(input.min), v)));
    return Number(input.value);
  }

  function computeQuote() {
    const pkg = PACKAGES.find((p) => p.id === select.value) ?? PACKAGES[0];
    const adults = clampInput(sim.elements.adults);
    const children = clampInput(sim.elements.children);
    const people = adults + children;
    const lines = [[`${adults} adulte${adults > 1 ? 's' : ''} × ${euro(pkg.price)}`, adults * pkg.price]];
    if (children) lines.push([`${children} enfant${children > 1 ? 's' : ''} (−40 %)`, Math.round(children * pkg.price * 0.6)]);
    for (const [key, opt] of Object.entries(OPTIONS)) {
      if (!sim.elements[key].checked) continue;
      lines.push([opt.flat ? opt.label : `${opt.label} × ${people}`, opt.flat ?? opt.perPerson * people]);
    }
    return { pkg, lines, total: lines.reduce((s, [, v]) => s + v, 0) };
  }

  function updateSim(bump = false) {
    const { pkg, lines, total } = computeQuote();
    $('#sum-title').textContent = pkg.name;
    $('#sum-lines').replaceChildren(...lines.map(([label, v]) => el('li', {}, [el('span', { text: label }), el('span', { text: euro(v) })])));
    const totalNode = $('#sum-total');
    totalNode.textContent = euro(total);
    if (bump && !reduced) {
      totalNode.classList.remove('bump');
      void totalNode.offsetWidth;
      totalNode.classList.add('bump');
      setTimeout(() => totalNode.classList.remove('bump'), 300);
    }
  }

  sim.addEventListener('input', () => updateSim(true));
  sim.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    const input = sim.elements[btn.dataset.step];
    input.value = String(Number(input.value) + Number(btn.dataset.delta));
    updateSim(true);
  });
  sim.addEventListener('submit', (e) => {
    e.preventDefault();
    const error = $('#sim-error');
    if (!dateInput.value || dateInput.value < dateInput.min) {
      dateInput.classList.add('is-invalid');
      error.textContent = 'Choisissez une date de départ (au moins 7 jours à l’avance).';
      dateInput.focus();
      return;
    }
    dateInput.classList.remove('is-invalid');
    error.textContent = '';
    const { pkg, total } = computeQuote();
    const date = new Date(dateInput.value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    toast(`✦ Voyage « ${pkg.name} » du ${date} pré-réservé — ${euro(total)} (démo)`);
  });
  updateSim();

  /* ------------------------------------------------------------ reviews */
  const track = $('.reviews__track');
  [...REVIEWS, ...REVIEWS].forEach((r, i) =>
    track.append(
      el('figure', { class: 'review', 'aria-hidden': i >= REVIEWS.length ? 'true' : null }, [
        el('div', { class: 'stars', text: '★★★★★', 'aria-label': '5 étoiles sur 5' }),
        el('blockquote', { text: `« ${r.text} »` }),
        el('figcaption', { text: `— ${r.who}` }),
      ]),
    ),
  );
  $$('.review[aria-hidden="null"]').forEach((n) => n.removeAttribute('aria-hidden'));

  /* ------------------------------------------------------------ forms */
  function validate(form) {
    let ok = true;
    $$('input, textarea', form).forEach((input) => {
      const valid = input.checkValidity();
      input.classList.toggle('is-invalid', !valid);
      if (!valid && ok) {
        input.focus();
        ok = false;
      }
    });
    return ok;
  }

  $('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const status = $('.form-status', form);
    if (!validate(form)) return (status.textContent = 'Merci de compléter correctement tous les champs.');
    status.textContent = `Merci ${form.elements.name.value.split(' ')[0]} ! Nous vous répondons sous 48 h (démo).`;
    form.reset();
  });

  $('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const status = $('.form-status', form);
    if (!validate(form)) return (status.textContent = 'Email valide et mot de passe de 8 caractères minimum requis.');
    status.textContent = 'Connexion simulée — bienvenue à bord ✦';
    setTimeout(() => closeModal(loginModal), 1200);
  });

  $('.password__toggle').addEventListener('click', (e) => {
    const input = e.currentTarget.previousElementSibling;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    e.currentTarget.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
  });

  /* ------------------------------------------------------------ chatbot */
  const chat = $('#chat');
  const messages = $('#chat-messages');
  const ANSWERS = [
    { keys: ['info', 'activ', 'formule', 'voyage'], reply: 'Nous proposons 3 formules : Les 7 Merveilles (dès 3 ans), Les Disparus (dès 8 ans) et Premium Travel (dès 12 ans). Tout est détaillé dans la section Formules.', link: '#formules' },
    { keys: ['prix', 'tarif', 'coût', 'cout', 'combien'], reply: 'À partir de 1 290 € par adulte, −40 % pour les moins de 12 ans. Le simulateur calcule votre total en direct.', link: '#reserver' },
    { keys: ['sécur', 'secur', 'danger', 'risque'], reply: 'Sécurité avant tout : technologies avancées, équipes spécialisées et retour garanti dans votre époque.' },
    { keys: ['enfant', 'âge', 'age', 'famille'], reply: 'La formule Les 7 Merveilles est pensée pour les familles, dès 3 ans, avec des activités adaptées.' },
    { keys: ['réserv', 'reserv', 'date'], reply: 'Rendez-vous dans la section Réservation : choisissez formule, voyageurs, date et options.', link: '#reserver' },
    { keys: ['contact', 'appeler', 'email', 'mail'], reply: 'Utilisez le formulaire de contact, notre équipe répond sous 48 h.', link: '#contact' },
    { keys: ['bonjour', 'salut', 'hello', 'coucou'], reply: 'Bonjour et bienvenue à bord ! Que souhaitez-vous savoir ?' },
  ];

  function addMessage(text, who, link) {
    const msg = el('div', { class: `msg msg--${who}`, text });
    if (link) {
      const a = el('a', { href: link, text: ' → y aller' });
      a.addEventListener('click', () => (chat.hidden = true));
      msg.append(a);
    }
    messages.append(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function answer(question) {
    addMessage(question, 'user');
    const q = question.toLowerCase();
    const found = ANSWERS.find((a) => a.keys.some((k) => q.includes(k)));
    const typing = el('div', { class: 'msg msg--bot msg--typing', 'aria-label': 'L’assistant écrit' });
    messages.append(typing);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => {
      typing.remove();
      if (found) addMessage(found.reply, 'bot', found.link);
      else addMessage('Je ne connais pas encore la réponse à cette question. Essayez « info », « prix » ou « sécurité ».', 'bot');
    }, 650);
  }

  ['Infos', 'Prix', 'Sécurité', 'Enfants'].forEach((label) => {
    const b = el('button', { type: 'button', text: label });
    b.addEventListener('click', () => answer(label));
    $('#chat-chips').append(b);
  });

  $('#chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#chat-input');
    const value = input.value.trim();
    if (!value) return;
    input.value = '';
    answer(value);
  });

  function toggleChat(open = chat.hidden) {
    chat.hidden = !open;
    if (open) {
      if (!messages.childElementCount) addMessage('Bonjour ! Posez-moi une question ou choisissez un sujet ci-dessous.', 'bot');
      $('#chat-input').focus();
    }
  }
  $('[data-close-chat]').addEventListener('click', () => toggleChat(false));

  /* ------------------------------------------------------------ openers */
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (!opener) return;
    e.preventDefault();
    if (opener.dataset.open === 'login') openModal(loginModal);
    if (opener.dataset.open === 'chat') toggleChat(opener.classList.contains('chat-fab') ? chat.hidden : true);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chat.hidden) toggleChat(false);
  });
})();

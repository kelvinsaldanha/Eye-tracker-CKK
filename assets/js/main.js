(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  const safeUrl = value => {
    if (!value || typeof value !== 'string') return null;
    try { const url = new URL(value, document.baseURI); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null; } catch { return null; }
  };
  const link = (text, url, className) => {
    const a = el('a', className, text); const href = safeUrl(url);
    if (href) { a.href = href; if (new URL(href).origin !== location.origin && !href.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } }
    return a;
  };
  const links = values => { const box = el('div', 'member-links'); (values || []).forEach(item => { if (safeUrl(item.url)) box.append(link(item.label + ' ↗', item.url)); }); return box; };
  const themeButton = $('#themeButton');
  let theme = 'dark';
  try { theme = localStorage.getItem('mouseocular-theme') === 'light' ? 'light' : 'dark'; } catch { /* Theme works when storage is blocked. */ }
  const applyTheme = () => { document.documentElement.dataset.theme = theme; themeButton.setAttribute('aria-label', `Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`); themeButton.firstElementChild.textContent = theme === 'dark' ? '☼' : '☾'; };
  applyTheme();
  themeButton.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; applyTheme(); try { localStorage.setItem('mouseocular-theme', theme); } catch {} });
  const menuButton = $('#menuButton'), nav = $('#mainNav');
  const closeNav = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir navegação'); };
  menuButton.addEventListener('click', () => { const open = !nav.classList.contains('open'); nav.classList.toggle('open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação'); });
  $$('a', nav).forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeNav(); menuButton.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeNav(); });
  const demoData = {
    menu: { tiles: [['▦', 'Configurações'], ['◎', 'Perfis'], ['⌖', 'Calibração'], ['⌁', 'Desempenho']], note: '' },
    perfis: { profiles: [['Pré-determinado', 'Base protegida contra sobrescrita e exclusão.', 'PROTEGIDO'], ['Seu perfil pessoal', 'Crie, selecione e salve os seus ajustes.', 'PESSOAL']], note: 'Excluir um perfil pessoal exige confirmação e cria uma cópia de segurança.' },
    calibracao: { tiles: [['⌖', 'Recentralização'], ['⌃', 'Sobrancelha']], note: 'Acesse pelo menu. Para recentralizar, olhe para o centro desejado e confirme com o gesto de clique.' }
  };
  const tabs = $$('.demo-tabs [role=tab]');
  const selectTab = tab => {
    tabs.forEach(t => { const active = t === tab; t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; });
    const panel = $('#demo-panel'); panel.setAttribute('aria-labelledby', tab.id); panel.replaceChildren();
    const data = demoData[tab.dataset.panel];
    if (data.tiles) { const grid = el('div', 'demo-tile-grid'); data.tiles.forEach(([icon, text], index) => { const tile = el('div', 'demo-tile' + (index === 0 ? ' selected' : '')); tile.append(el('span', '', icon), document.createTextNode(text)); grid.append(tile); }); panel.append(grid); }
    if (data.profiles) data.profiles.forEach(([name, desc, label]) => { const row = el('div', 'demo-profile'); row.append(el('span', 'pill', label), el('b', '', name), el('small', '', desc)); panel.append(row); });
    if (data.note) panel.append(el('p', 'demo-profile-note', data.note));
  };
  tabs.forEach((tab, i) => { tab.addEventListener('click', () => selectTab(tab)); tab.addEventListener('keydown', event => { let next; if (event.key === 'ArrowRight') next = (i + 1) % tabs.length; if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length; if (event.key === 'Home') next = 0; if (event.key === 'End') next = tabs.length - 1; if (next !== undefined) { event.preventDefault(); tabs[next].focus(); selectTab(tabs[next]); } }); });
  selectTab(tabs[0]);
  function renderGestures(gestures) {
    let filter = 'Todos';
    const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const render = () => {
      const search = normalize($('#gestureSearch').value.trim());
      const matches = gestures.filter(g => (filter === 'Todos' || g.contexto === filter) && normalize(`${g.gesto} ${g.acao} ${g.detalhe}`).includes(search));
      const grid = $('#gestureGrid'); grid.replaceChildren();
      matches.forEach(g => { const card = el('article', 'gesture-card'); card.append(el('span', '', g.contexto), el('h3', '', g.acao), el('p', 'gesture-name', g.gesto), el('p', '', g.detalhe)); grid.append(card); });
      if (!matches.length) grid.append(el('p', 'empty-results', 'Nenhum gesto encontrado. Tente outra palavra ou selecione “Todos”.'));
      $('#gestureCount').textContent = `${matches.length} gestos encontrados.`;
    };
    $$('.filter-group button').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; $$('.filter-group button').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); }); render(); }));
    $('#gestureSearch').addEventListener('input', render); render();
  }
  function renderVideo(config) {
    const source = safeUrl(config.url); if (!source || !['https:', 'http:'].includes(new URL(source).protocol)) return;
    const container = $('#videoContainer');
    if (config.type === 'youtube') {
      const u = new URL(source); let id;
      if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(u.hostname)) id = u.searchParams.get('v') || u.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1];
      if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
      if (!/^[a-zA-Z0-9_-]{11}$/.test(id || '')) return;
      const iframe = el('iframe'); iframe.src = `https://www.youtube-nocookie.com/embed/${id}`; iframe.title = config.title || 'MouseOcular em funcionamento'; iframe.loading = 'lazy'; iframe.referrerPolicy = 'strict-origin-when-cross-origin'; iframe.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen'; iframe.allowFullscreen = true; container.replaceChildren(iframe);
    } else if (config.type === 'mp4') {
      const video = el('video'); video.controls = true; video.preload = 'metadata'; video.playsInline = true; video.setAttribute('aria-label', config.title || 'MouseOcular em funcionamento'); if (safeUrl(config.poster)) video.poster = safeUrl(config.poster);
      video.src = source;
      if (safeUrl(config.captionsUrl)) { const track = el('track'); track.kind = 'captions'; track.srclang = 'pt-BR'; track.label = 'Português'; track.src = safeUrl(config.captionsUrl); video.append(track); }
      video.append(link('Abrir o vídeo', source)); container.replaceChildren(video);
      video.addEventListener('error', () => { container.replaceChildren(el('p', 'video-empty', 'Não foi possível carregar o vídeo.')); container.firstChild.append(document.createTextNode(' '), link('Abrir arquivo de vídeo ↗', source)); });
    }
  }
  function renderDownload(config) {
    $('#downloadPlatform').textContent = config.platform; $('#releaseVersion').textContent = `v${config.version}`; $('#releaseSize').textContent = config.size; $('#releaseDate').textContent = config.date;
    const primaryZip = !safeUrl(config.url) && safeUrl(config.zipUrl);
    const displayHash = primaryZip ? config.zipSha256 : config.sha256;
    if (primaryZip) { $('#releaseSize').textContent = config.zipSize || config.size; $('.hash-details summary').textContent = 'Integridade do pacote ZIP · SHA-256'; }
    $('#installerHash').textContent = displayHash || 'Hash ainda não informado.';
    $('#copyHash').hidden = !displayHash;
    const source = safeUrl(config.url) || safeUrl(config.zipUrl);
    if (source && ['https:', 'http:'].includes(new URL(source).protocol)) { const a = link(primaryZip ? 'Baixar pacote ZIP ↓' : 'Baixar para Windows ↓', source, 'button full'); a.download = primaryZip ? '' : (config.filename || ''); $('#downloadAction').replaceChildren(a); $('#downloadStatus').textContent = primaryZip ? 'Extraia o pacote ZIP e execute o instalador contido nele.' : 'Instalador Windows · versão beta para avaliação.'; }
    if (safeUrl(config.zipUrl) && !primaryZip) { const a = $('#zipDownload'); a.href = safeUrl(config.zipUrl); a.download = ''; a.hidden = false; if (!source) $('#downloadStatus').textContent = 'O pacote ZIP está disponível no link abaixo. Extraia-o para acessar o instalador.'; }
    $('#copyHash').addEventListener('click', async () => { try { await navigator.clipboard.writeText(displayHash); $('#hashFeedback').textContent = 'Hash copiado.'; } catch { $('#hashFeedback').textContent = 'Selecione o hash acima e copie com Ctrl+C.'; } });
  }
  async function init() {
    const response = await fetch('data/site-data.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Não foi possível carregar o conteúdo.');
    const data = await response.json();
    for (const group of data.funcionalidades) { const article = el('article'); article.append(el('h3', '', group.titulo)); const list = el('ul'); group.itens.forEach(text => list.append(el('li', '', text))); article.append(list); $('#featureStatus').append(article); }
    data.tecnologias.forEach(t => $('#technologies').append(el('strong', '', t.nome)));
    renderGestures(data.gestos); renderVideo(data.video); renderDownload(data.downloads);
    data.history.forEach(item => { const article = el('article'); article.append(el('time', '', item.date), el('h3', '', item.title), el('p', '', item.text)); $('#historyList').append(article); });
    data.roadmap.forEach(item => { const article = el('article', 'roadmap-card'); article.append(el('span', '', item.status), el('h3', '', item.categoria)); const ul = el('ul'); item.itens.forEach(text => ul.append(el('li', '', text))); article.append(ul); $('#roadmapGrid').append(article); });
    data.equipe.forEach(member => { const article = el('article', 'team-card'), photo = el('div', 'team-photo'), img = el('img'); img.src = safeUrl(member.foto); img.alt = `Foto de ${member.nome}`; img.loading = 'lazy'; img.width = 400; img.height = 380; img.addEventListener('error', () => { photo.replaceChildren(el('span', '', member.nome.split(' ').filter(Boolean).map(n => n[0]).slice(0,2).join(''))); }); photo.append(img); const body = el('div', 'team-content'); body.append(el('h3', '', member.nome), el('p', 'role', member.funcao), el('p', '', member.descricao), links(member.links)); article.append(photo, body); $('#teamGrid').append(article); });
    data.orientadores.forEach((advisor, index) => { const article = el('article', 'advisor'), photo = el('img'); photo.src = `assets/images/team/${index === 0 ? 'alexandre.jpg' : 'talita.png'}`; photo.alt = `Foto de ${advisor.nome}`; photo.loading = 'lazy'; photo.addEventListener('error', () => photo.hidden = true); const body = el('div'); body.append(el('span', '', advisor.papel), el('h3', '', advisor.nome), el('p', '', advisor.descricao), links([{label:'E-mail',url:`mailto:${advisor.email}`},...(advisor.linkedin ? [{label:'LinkedIn',url:advisor.linkedin}] : [])])); article.append(photo, body); $('#advisors').append(article); });
    data.referencias.forEach(ref => { const article = el('div', 'reference-item'); article.append(link(ref.titulo + ' ↗', ref.url), el('p', '', ref.descricao)); $('#references').append(article); });
  }
  init().catch(error => { console.error(error.message); $('#dataError').hidden = false; });
})();

const dataUrl = "data/site-data.json";
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[char]));

const list = (items = "") => Array.isArray(items) ? items : [items].filter(Boolean);
const statusClass = (status = "") => {
  const normalized = status.toLowerCase();
  if (normalized.includes("funciona")) return "status-ok";
  if (normalized.includes("planejado")) return "status-plan";
  if (normalized.includes("protótipo")) return "status-proto";
  return "status-dev";
};

function sectionShell(id, eyebrow, title, text) {
  const root = qs(`#${id}`);
  root.innerHTML = `<div class="container"><div class="section-head"><div class="eyebrow">${escapeHtml(eyebrow)}</div><h2>${escapeHtml(title)}</h2>${text ? `<p>${escapeHtml(text)}</p>` : ""}</div><div data-section-body></div></div>`;
  return qs("[data-section-body]", root);
}

function cardGrid(items, columns, renderer) {
  return `<div class="grid grid-${columns}">${(items || []).map(renderer).join("")}</div>`;
}

function linkButton(url, label, kind = "btn-secondary") {
  if (!url) return "";
  return `<a class="btn ${kind}" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
}

function downloadButton(download, label = "BAIXAR AGORA") {
  if (!download?.download_url) return `<span class="btn btn-primary btn-disabled" aria-disabled="true">${escapeHtml(label)}</span>`;
  return `<a class="btn btn-primary" href="${escapeHtml(download.download_url)}" download>${escapeHtml(label)}</a>`;
}

function avatar(person) {
  if (person.photo) {
    return `<img class="profile-photo" src="${escapeHtml(person.photo)}" alt="Foto de ${escapeHtml(person.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'team-photo',textContent:'${escapeHtml((person.name || "?").slice(0, 1))}'}))">`;
  }
  return `<div class="team-photo" aria-hidden="true">${escapeHtml((person.name || "?").slice(0, 1))}</div>`;
}

function mockupSvg() {
  return `
    <svg viewBox="0 0 560 430" role="img" aria-label="Ilustração de webcam rastreando olhos e cursor">
      <rect x="54" y="48" width="452" height="292" rx="28" fill="var(--surface)" stroke="var(--line)" />
      <rect x="84" y="78" width="392" height="220" rx="18" fill="var(--card)" stroke="var(--line)" />
      <circle cx="280" cy="116" r="22" fill="var(--secondary)" />
      <circle cx="288" cy="108" r="6" fill="#fff" />
      <path d="M156 214s40-54 124-54 124 54 124 54-40 54-124 54-124-54-124-54Z" fill="var(--bg)" stroke="var(--line)" stroke-width="3" />
      <circle cx="280" cy="214" r="34" fill="#2563eb" />
      <circle cx="292" cy="200" r="9" fill="#fff" />
      <path d="M378 278l52 76 14-34 36-5-78-48-8 42-16-31Z" fill="#0f172a" />
      <path d="M146 128c36-30 82-45 134-45s98 15 134 45M142 300c42 26 88 39 138 39s96-13 138-39" fill="none" stroke="#2563eb" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 14" />
      <rect x="218" y="340" width="124" height="28" rx="14" fill="var(--line)" />
      <rect x="184" y="368" width="192" height="26" rx="13" fill="#2563eb" opacity=".22" />
    </svg>`;
}

function renderHero(data) {
  const mainDownload = data.downloads?.[0] || {};
  qs("#inicio").innerHTML = `
    <div class="container hero-grid">
      <div class="hero-copy">
        <div class="eyebrow">${escapeHtml(data.hero.eyebrow)}</div>
        <h1>${escapeHtml(data.hero.title)}</h1>
        <p>${escapeHtml(data.hero.subtitle)}</p>
        <p>${escapeHtml(data.project.description)}</p>
        <div class="hero-actions">
          ${downloadButton(mainDownload, data.hero.primaryCta)}
          <a class="btn btn-secondary" href="#demonstracao">${escapeHtml(data.hero.secondaryCta)}</a>
        </div>
      </div>
      <div class="mockup">${mockupSvg()}</div>
    </div>`;
}

function renderAbout(data) {
  const body = sectionShell("sobre", "Sobre o projeto", "Tecnologia assistiva com propósito", "Uma visão rápida do problema, solução e impacto do Eye Tracker CK².");
  body.innerHTML = cardGrid(data.about, 3, (item) => `<article class="card"><div class="icon-pill">•</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`);
}

function renderInstitution(data) {
  const i = data.institution;
  const body = sectionShell("instituicao", "Instituição", "Desenvolvido no CEFET-MG", "Contexto acadêmico do projeto e da apresentação na META.");
  body.innerHTML = `<article class="card institution-card"><h3>${escapeHtml(i.name)}</h3><div class="info-list">
    <span>${escapeHtml(i.event)}</span><span>${escapeHtml(i.campus)}</span><span>${escapeHtml(i.course)}</span><span>${escapeHtml(i.class)}</span><span>${escapeHtml(i.department)}</span>
  </div></article>`;
}

function renderHistory(data) {
  const body = sectionShell("historia", "História", "Como surgiu o Eye Tracker CK²", "A origem do projeto contada em etapas curtas.");
  body.innerHTML = `<div class="timeline">${data.history.map((item) => `<article class="timeline-item"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("")}</div>`;
}

function renderImpact(data) {
  const body = sectionShell("impacto", "Impacto social", "Acessibilidade com baixo custo", data.socialImpact.summary);
  body.innerHTML = `
    ${cardGrid(data.socialImpact.topics, 5, (topic) => `<article class="card compact-card"><h3>${escapeHtml(topic)}</h3></article>`)}
    <div class="tag-cloud" aria-label="Público-alvo">${data.socialImpact.audiences.map((item) => `<span class="badge">${escapeHtml(item)}</span>`).join("")}</div>`;
}

function renderHowItWorks(data) {
  const body = sectionShell("funcionamento", "Como funciona", "Do rosto ao comando", "Fluxo simples para entender o caminho entre a webcam e a ação no computador.");
  body.innerHTML = `<div class="workflow workflow-wide">${data.howItWorks.map((step, index) => `<article class="card flow-step"><div class="step-chip">${index + 1}</div><h3>${escapeHtml(step)}</h3></article>`).join("")}</div>`;
}

function renderFeatures(data) {
  const body = sectionShell("funcionalidades", "Funcionalidades", "O que o software faz e o que vem depois", "Cada recurso tem um status claro para não prometer o que ainda está em desenvolvimento.");
  body.innerHTML = cardGrid(data.features, 3, (feature) => `<article class="card feature-card"><h3>${escapeHtml(feature.name)}</h3><span class="badge ${statusClass(feature.status)}">${escapeHtml(feature.status)}</span></article>`);
}

function renderGestures(data) {
  const body = sectionShell("gestos", "Gestos", "Comandos por expressões faciais", "Mapa dos gestos previstos e suas ações correspondentes.");
  body.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Gesto</th><th>Ação</th><th>Status</th></tr></thead><tbody>${data.gestures.map((g) => `<tr><td>${escapeHtml(g.gesture)}</td><td>${escapeHtml(g.action)}</td><td><span class="badge ${statusClass(g.status)}">${escapeHtml(g.status)}</span></td></tr>`).join("")}</tbody></table></div>`;
}

function renderVideos(data) {
  const body = sectionShell("demonstracao", "Demonstrações", "Vídeos do projeto", "Espaço pronto para vídeo geral e tutorial de instalação.");
  body.innerHTML = cardGrid(data.videos, 2, (video) => `<article class="card video-card"><h3>${escapeHtml(video.title)}</h3><p>${escapeHtml(video.description)}</p>${video.url ? `<iframe title="${escapeHtml(video.title)}" src="${escapeHtml(video.url)}" loading="lazy" allowfullscreen></iframe>` : `<div class="media-placeholder small-placeholder"><div><strong>Vídeo em breve</strong><p>Adicione o link no JSON.</p></div></div>`}</article>`);
}

function renderStats(data) {
  const body = sectionShell("resultados", "Métricas", "Resultados sem números inventados", "Os campos ficam preparados para dados reais de FPS, precisão, MAE, RMSE, R² e validação.");
  body.innerHTML = cardGrid(data.stats, 4, (stat) => `<article class="card"><div class="stat-value">${escapeHtml(stat.value)}</div><h3>${escapeHtml(stat.label)}</h3><p>${escapeHtml(stat.note)}</p></article>`);
}

function renderTimeline(data) {
  const body = sectionShell("desenvolvimento", "Desenvolvimento", "Linha do tempo", "A timeline conta a história do projeto. O roadmap mostra o futuro.");
  body.innerHTML = `<div class="timeline">${data.timeline.map((item) => `<article class="timeline-item"><span class="badge">${escapeHtml(item.date)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("")}</div>`;
}

function renderRoadmap(data) {
  const body = sectionShell("roadmap", "Roadmap", "Próximos passos", "Melhorias planejadas para precisão, experiência de uso, testes e novas integrações.");
  body.innerHTML = cardGrid(data.roadmap, 4, (item) => `<article class="card compact-card"><h3>${escapeHtml(item)}</h3></article>`);
}

function renderTechnologies(data) {
  const body = sectionShell("tecnologias", "Tecnologias", "Base técnica", "Descrição curta para evitar poluir visualmente a página.");
  body.innerHTML = cardGrid(data.technologies, 3, (tech) => `<article class="card"><div class="icon-pill">{ }</div><h3>${escapeHtml(tech.name)}</h3><p>${escapeHtml(tech.description)}</p></article>`);
}

function renderDownloads(data) {
  const body = sectionShell("downloads", "Download oficial", "Baixe a versão mais recente", "Preparado para múltiplas versões e histórico de releases.");
  body.innerHTML = `
    <div class="hardware-check card">
      <div><h3>Será que roda no meu computador?</h3><p>O navegador consegue estimar memória e núcleos, mas não informa o modelo exato do processador.</p></div>
      <button class="btn btn-secondary" type="button" data-hardware-check>Verificar este computador</button>
      <p class="hardware-result" data-hardware-result></p>
    </div>
    ${data.downloads.map((d) => `<article class="card download-card">
      <div>
        <h3>${escapeHtml(d.name)}</h3>
        <div class="download-meta">
          <span class="badge">Versão ${escapeHtml(d.version)}</span><span class="badge">${escapeHtml(d.status)}</span><span class="badge">${escapeHtml(d.date)}</span><span class="badge">${escapeHtml(d.size)}</span><span class="badge">${escapeHtml(d.license)}</span>
        </div>
        <p><strong>Compatibilidade:</strong> ${escapeHtml(d.compatibility)}</p>
        <p><strong>Requisitos:</strong> ${escapeHtml(d.requirements)}</p>
        <ul class="release-notes">${d.releaseNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
      </div>
      <div>${downloadButton(d)}</div>
    </article>`).join("")}`;
}

function renderInstallation(data) {
  const body = sectionShell("instalacao", "Instalação e uso", "Primeiros passos", "Área preparada para prints e tutorial em vídeo.");
  const tutorial = data.videos?.find((video) => video.title.toLowerCase().includes("instala"));
  body.innerHTML = `
    ${tutorial?.url ? `<div class="media-placeholder"><iframe title="Tutorial de instalação" src="${escapeHtml(tutorial.url)}" loading="lazy" allowfullscreen></iframe></div>` : `<div class="media-placeholder"><div><h3>Tutorial em vídeo em breve</h3><p>Adicione o link do YouTube no JSON quando estiver pronto.</p></div></div>`}
    <div class="grid steps">${data.installation.map((step) => `<article class="card step"><span class="step-number" aria-hidden="true"></span><div><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.description)}</p></div><div class="thumb" role="img" aria-label="Espaço para print do passo"></div></article>`).join("")}</div>`;
}

function renderOpenSource(data) {
  const o = data.opensource;
  const body = sectionShell("opensource", "Open source", "Código-fonte e colaboração", "O projeto será público após a conclusão e revisão da equipe.");
  body.innerHTML = `<article class="card open-card"><h3>Licença ${escapeHtml(o.license)}</h3><p>${escapeHtml(o.contributions)}</p><div class="cta-row">${linkButton(o.repository, "Repositório GitHub") || `<span class="btn btn-secondary btn-disabled">GitHub em breve</span>`}${linkButton(o.documentation, "Documentação") || `<span class="btn btn-secondary btn-disabled">Documentação em breve</span>`}${linkButton(o.issues, "Issues") || `<span class="btn btn-secondary btn-disabled">Issues em breve</span>`}</div></article>`;
}

function renderBibliography(data) {
  const refs = data.references || { main: [], bibliography: [] };
  const body = sectionShell("referencias", "Referências", "Materiais de pesquisa", "Estrutura pronta para referências principais e bibliografia completa, sem poluir a página.");
  const renderRef = (ref) => `<li><strong>${escapeHtml(ref.title)}</strong>${ref.author ? `, ${escapeHtml(ref.author)}` : ""}${ref.year ? ` (${escapeHtml(ref.year)})` : ""}${ref.link ? ` - <a href="${escapeHtml(ref.link)}" target="_blank" rel="noopener">abrir</a>` : ""}</li>`;
  body.innerHTML = `<div class="grid grid-2">
    <details class="card faq-item" open><summary>Referências principais</summary><ul>${refs.main.length ? refs.main.map(renderRef).join("") : "<li>Adicionar referências principais no JSON.</li>"}</ul></details>
    <details class="card faq-item"><summary>Bibliografia e materiais consultados</summary><ul>${refs.bibliography.length ? refs.bibliography.map(renderRef).join("") : "<li>Adicionar bibliografia ou link de pasta compartilhada quando definido.</li>"}</ul>${refs.driveFolder ? linkButton(refs.driveFolder, "Abrir pasta de materiais") : ""}</details>
  </div>`;
}

function renderInspirations(data) {
  const body = sectionShell("inspiracoes", "Projetos inspiradores", "Referências que ajudaram a direção do projeto", "");
  body.innerHTML = cardGrid(data.inspirations, 2, (item) => `<article class="card"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p>${linkButton(item.link, "Abrir projeto")}</article>`);
}

function renderFaq(data) {
  const body = sectionShell("faq", "FAQ", "Dúvidas frequentes", "Respostas rápidas sobre download, requisitos, uso e contribuição.");
  body.innerHTML = `<div class="grid">${data.faq.map((item) => `<details class="card faq-item"><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join("")}</div>`;
}

function renderTeam(data) {
  const body = sectionShell("equipe", "Equipe", "Integrantes", "Cartões no estilo perfil profissional, com contatos vindos do JSON.");
  body.innerHTML = cardGrid(data.team, 3, (member) => `<article class="card profile-card">${avatar(member)}<h3>${escapeHtml(member.name)}</h3><span class="badge">${escapeHtml(member.role)}</span><p>${escapeHtml(member.description)}</p><div class="tag-cloud">${list(member.secondaryRoles).map((role) => `<span class="badge">${escapeHtml(role)}</span>`).join("")}</div><div class="profile-links">${linkButton(`mailto:${member.email}`, "E-mail")}${linkButton(member.github, "GitHub")}${linkButton(member.linkedin, "LinkedIn")}</div></article>`);
}

function renderAdvisors(data) {
  const body = sectionShell("orientadores", "Orientadores", "Acompanhamento acadêmico", "Perfis acadêmicos com papel no projeto e área de atuação.");
  body.innerHTML = cardGrid(data.advisors, 2, (advisor) => `<article class="card profile-card">${avatar(advisor)}<h3>${escapeHtml(advisor.name)}</h3><span class="badge">${escapeHtml(advisor.role)}</span><p><strong>${escapeHtml(advisor.title)}</strong></p><p>${escapeHtml(advisor.bio)}</p><p><strong>Área:</strong> ${escapeHtml(advisor.area)}</p><p><strong>Papel no projeto:</strong> ${escapeHtml(advisor.projectRole)}</p><div class="profile-links">${linkButton(`mailto:${advisor.email}`, "E-mail institucional")}${linkButton(advisor.linkedin, "LinkedIn")}</div></article>`);
}

function renderAcknowledgements(data) {
  const body = sectionShell("agradecimentos", "Agradecimentos", "Apoios e reconhecimento", "");
  body.innerHTML = cardGrid(data.acknowledgements, 3, (item) => `<article class="card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`);
}

function renderContact(data) {
  const body = sectionShell("contato", "Contato", "Fale com os integrantes", "Sem formulário falso: apenas canais reais disponíveis.");
  body.innerHTML = cardGrid(data.contact.contacts, 3, (contact) => `<article class="card"><h3>${escapeHtml(contact.label)}</h3><div class="profile-links">${linkButton(`mailto:${contact.email}`, "E-mail")}${linkButton(contact.github, "GitHub")}${linkButton(contact.linkedin, "LinkedIn")}</div></article>`);
}

function renderFooter(data) {
  qs("[data-footer]").innerHTML = `<div class="container footer-grid"><div><strong>${escapeHtml(data.project.name)}</strong><br>Versão ${escapeHtml(data.project.version)} · ${escapeHtml(data.institution.shortName)} · © ${escapeHtml(data.project.year)}</div><div><a href="#downloads">Download</a> · <a href="#opensource">Open source</a> · <a href="#contato">Contato</a></div></div>`;
}

function renderStructuredData(data) {
  qs("#structured-data").textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "name": data.institution.name, "url": data.project.siteUrl },
      { "@type": "Project", "name": data.project.name, "description": data.project.description, "url": data.project.siteUrl },
      { "@type": "SoftwareApplication", "name": data.project.shortName, "applicationCategory": "AccessibilityApplication", "operatingSystem": "Windows", "softwareVersion": data.project.version, "license": data.opensource.license, "description": data.project.description }
    ]
  });
}

function initHardwareCheck(data) {
  const button = qs("[data-hardware-check]");
  const result = qs("[data-hardware-result]");
  if (!button || !result) return;
  button.addEventListener("click", () => {
    const memory = navigator.deviceMemory;
    const cores = navigator.hardwareConcurrency;
    const memoryOk = memory ? memory >= data.hardware.minimum.memoryGb : null;
    const coresOk = cores ? cores >= 4 : null;
    const verdict = memoryOk === false || coresOk === false ? "Pode rodar com limitações." : "Seu computador parece compatível com os requisitos iniciais.";
    result.textContent = `${verdict} Memória detectada: ${memory ? `${memory} GB` : "não informada pelo navegador"}. Núcleos detectados: ${cores || "não informado"}.`;
  });
}

function render(data) {
  document.title = `${data.project.name} | Portal oficial`;
  qs("[data-project-name]").textContent = data.project.shortName;
  renderHero(data);
  renderAbout(data);
  renderInstitution(data);
  renderHistory(data);
  renderImpact(data);
  renderHowItWorks(data);
  renderFeatures(data);
  renderGestures(data);
  renderVideos(data);
  renderStats(data);
  renderTimeline(data);
  renderRoadmap(data);
  renderTechnologies(data);
  renderDownloads(data);
  renderInstallation(data);
  renderOpenSource(data);
  renderBibliography(data);
  renderInspirations(data);
  renderFaq(data);
  renderTeam(data);
  renderAdvisors(data);
  renderAcknowledgements(data);
  renderContact(data);
  renderFooter(data);
  renderStructuredData(data);
  initHardwareCheck(data);
}

function initTheme() {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = stored || (prefersDark ? "dark" : "light");
  qs("[data-theme-toggle]").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

function initNav() {
  const toggle = qs("[data-nav-toggle]");
  const links = qs("[data-nav-links]");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  qsa(".nav-links a").forEach((link) => link.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

async function boot() {
  initTheme();
  initNav();
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error("Não foi possível carregar data/site-data.json");
    render(await response.json());
  } catch (error) {
    qs("main").innerHTML = `<section class="section"><div class="container"><h1>Erro ao carregar o site</h1><p>${escapeHtml(error.message)}</p></div></section>`;
  }
}

boot();

(function() {
    'use strict';

    // ============================================================
    // 1. CARREGAR DADOS DO JSON (site-data.json)
    // ============================================================
    let data = null;
    const dataScript = document.getElementById('siteData');
    if (dataScript) {
        try {
            data = JSON.parse(dataScript.textContent);
        } catch (_) {
            console.warn('Erro ao parsear site-data.json');
        }
    }
    if (!data) {
        // Fallback mínimo para não quebrar a página
        data = {
            tecnologias: [],
            funcionalidades: [],
            gestos: [],
            roadmap: [],
            equipe: [],
            orientadores: [],
            referencias: []
        };
    }

    // ============================================================
    // 2. UTILITÁRIOS
    // ============================================================
    function createElement(tag, cls, content) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (content !== undefined) {
            if (typeof content === 'string') el.innerHTML = content;
            else if (Array.isArray(content)) el.append(...content);
            else el.appendChild(content);
        }
        return el;
    }

    function renderContainer(containerId, items, renderFn) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        if (!items || items.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum dado disponível.</p>';
            return;
        }
        items.forEach(item => {
            container.appendChild(renderFn(item));
        });
    }

    // ============================================================
    // 3. RENDERIZAÇÃO: TECNOLOGIAS
    // ============================================================
    function renderTecnologia(item) {
        const div = document.createElement('div');
        div.className = 'tecnologia__item';
        div.innerHTML = `
            <span class="tecnologia__item-icon">${item.icon || '🔧'}</span>
            <span class="tecnologia__item-name">${item.nome}</span>
            <span class="tecnologia__item-desc">${item.descricao || ''}</span>
        `;
        return div;
    }

    // ============================================================
    // 4. RENDERIZAÇÃO: FUNCIONALIDADES
    // ============================================================
    function renderFuncionalidades(groups) {
        const container = document.getElementById('funcionalidadesGroups');
        if (!container) return;
        container.innerHTML = '';
        if (!groups || groups.length === 0) return;

        groups.forEach(group => {
            const div = document.createElement('div');
            div.className = 'funcionalidades__group';
            const statusMap = {
                'funcionando': 'ok',
                'refinamento': 'wip',
                'planejado': 'planned'
            };
            const statusLabel = {
                'funcionando': '✓ Funciona',
                'refinamento': '🔄 Em desenvolvimento',
                'planejado': '📋 Planejado'
            };
            let listHtml = '<ul class="funcionalidades__group-list">';
            group.itens.forEach(item => {
                const statusClass = statusMap[group.tipo] || 'planned';
                listHtml += `
                    <li>
                        <span>${item}</span>
                        <span class="funcionalidades__status funcionalidades__status--${statusClass}">${statusLabel[group.tipo] || group.tipo}</span>
                    </li>
                `;
            });
            listHtml += '</ul>';
            div.innerHTML = `
                <div class="funcionalidades__group-title">${group.titulo}</div>
                ${listHtml}
            `;
            container.appendChild(div);
        });
    }

    // ============================================================
    // 5. RENDERIZAÇÃO: GESTOS (tabela + cards)
    // ============================================================
    function renderGestos(gestos) {
        const tbody = document.getElementById('gestosTableBody');
        const cardsContainer = document.getElementById('gestosCards');
        if (!tbody || !cardsContainer) return;
        tbody.innerHTML = '';
        cardsContainer.innerHTML = '';

        if (!gestos || gestos.length === 0) return;

        gestos.forEach(g => {
            // Tabela
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${g.gesto}</td>
                <td>${g.acao}</td>
                <td>${g.status}</td>
            `;
            tbody.appendChild(tr);

            // Cards (mobile)
            const card = document.createElement('div');
            card.className = 'gestos__card';
            card.innerHTML = `
                <span class="gestos__card-gesto">${g.gesto}</span>
                <span class="gestos__card-acao">${g.acao}</span>
                <span class="gestos__card-status">${g.status}</span>
            `;
            cardsContainer.appendChild(card);
        });
    }

    // ============================================================
    // 6. RENDERIZAÇÃO: ROADMAP
    // ============================================================
    function renderRoadmap(items) {
        const container = document.getElementById('roadmapGrid');
        if (!container) return;
        container.innerHTML = '';
        if (!items || items.length === 0) return;

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'roadmap__item';
            let listHtml = '<ul class="roadmap__item-list">';
            (item.itens || []).forEach(i => {
                listHtml += `<li>${i}</li>`;
            });
            listHtml += '</ul>';
            div.innerHTML = `
                <span class="roadmap__item-category">${item.categoria}</span>
                ${listHtml}
            `;
            container.appendChild(div);
        });
    }

    // ============================================================
    // 7. RENDERIZAÇÃO: EQUIPE
    // ============================================================
    function renderEquipe(membros) {
        const container = document.getElementById('equipeGrid');
        if (!container) return;
        container.innerHTML = '';
        if (!membros || membros.length === 0) return;

        membros.forEach(m => {
            const div = document.createElement('div');
            div.className = 'equipe__member';
            // Fallback para foto
            const imgSrc = m.foto || 'assets/images/team/placeholder.jpg';
            const linksHtml = (m.links || []).map(l => {
                return `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a>`;
            }).join(' ');
            div.innerHTML = `
                <img src="${imgSrc}" alt="Foto de ${m.nome}" class="equipe__member-photo" loading="lazy" decoding="async" />
                <div class="equipe__member-name">${m.nome}</div>
                <div class="equipe__member-role">${m.funcao || ''}</div>
                <div class="equipe__member-desc">${m.descricao || ''}</div>
                <div class="equipe__member-links">${linksHtml}</div>
            `;
            container.appendChild(div);
        });
    }

    function renderOrientadores(orientadores) {
        const container = document.getElementById('orientadoresContainer');
        if (!container) return;
        container.innerHTML = '';
        if (!orientadores || orientadores.length === 0) return;

        orientadores.forEach(o => {
            const div = document.createElement('div');
            div.className = 'equipe__orientador';
            div.innerHTML = `
                <div class="equipe__orientador-name">${o.nome}</div>
                <div class="equipe__orientador-role">${o.papel || ''}</div>
                <div class="equipe__orientador-desc">${o.descricao || ''}</div>
                <div class="equipe__member-links">
                    ${o.email ? `<a href="mailto:${o.email}">${o.email}</a>` : ''}
                    ${o.linkedin ? `<a href="${o.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
                </div>
            `;
            container.appendChild(div);
        });
    }

    // ============================================================
    // 8. RENDERIZAÇÃO: REFERÊNCIAS
    // ============================================================
    function renderReferencias(lista) {
        const container = document.getElementById('referenciasList');
        if (!container) return;
        container.innerHTML = '';
        if (!lista || lista.length === 0) return;

        lista.forEach(ref => {
            const div = document.createElement('div');
            div.className = 'referencias__item';
            div.innerHTML = `
                <div class="referencias__item-title">${ref.titulo || 'Referência'}</div>
                <div class="referencias__item-desc">${ref.descricao || ''}</div>
                ${ref.url ? `<a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="referencias__item-link">${ref.url}</a>` : ''}
            `;
            container.appendChild(div);
        });
    }

    // ============================================================
    // 9. INICIALIZAÇÃO DOS RENDERIZADORES
    // ============================================================
    function initRender() {
        // Tecnologias
        if (data.tecnologias) {
            renderContainer('tecnologiaGrid', data.tecnologias, renderTecnologia);
        }

        // Funcionalidades (agrupadas)
        if (data.funcionalidades) {
            renderFuncionalidades(data.funcionalidades);
        }

        // Gestos
        if (data.gestos) {
            renderGestos(data.gestos);
        }

        // Roadmap
        if (data.roadmap) {
            renderRoadmap(data.roadmap);
        }

        // Equipe
        if (data.equipe) {
            renderEquipe(data.equipe);
        }

        // Orientadores
        if (data.orientadores) {
            renderOrientadores(data.orientadores);
        }

        // Referências
        if (data.referencias) {
            renderReferencias(data.referencias);
        }
    }

    // ============================================================
    // 10. MENU MOBILE
    // ============================================================
    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const nav = document.getElementById('mainNav');
        if (!toggle || !nav) return;

        function toggleMenu(expanded) {
            const isOpen = expanded !== undefined ? expanded : nav.getAttribute('aria-expanded') === 'false';
            nav.setAttribute('aria-expanded', isOpen);
            toggle.setAttribute('aria-expanded', isOpen);
            toggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        }

        toggle.addEventListener('click', () => toggleMenu());

        // Fechar ao clicar em link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 820) {
                    toggleMenu(false);
                }
            });
        });

        // Fechar com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
                toggleMenu(false);
                toggle.focus();
            }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 820) {
                const isClickInside = nav.contains(e.target) || toggle.contains(e.target);
                if (!isClickInside && nav.getAttribute('aria-expanded') === 'true') {
                    toggleMenu(false);
                }
            }
        });
    }

    // ============================================================
    // 11. DARK MODE
    // ============================================================
    function initDarkMode() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        const icon = toggle.querySelector('.header__theme-icon');

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            icon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }

        // Preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const stored = localStorage.getItem('theme');
        if (stored) {
            setTheme(stored);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }

        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ============================================================
    // 12. ANO AUTOMÁTICO NO FOOTER
    // ============================================================
    function setFooterYear() {
        const el = document.getElementById('footerYear');
        if (el) el.textContent = new Date().getFullYear();
    }

    // ============================================================
    // 13. HERO CANVAS (efeito visual sutil)
    // ============================================================
    function initHeroCanvas() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w = canvas.parentElement.clientWidth;
        let h = canvas.parentElement.clientHeight;

        function resize() {
            w = canvas.parentElement.clientWidth;
            h = canvas.parentElement.clientHeight;
            canvas.width = w;
            canvas.height = h;
        }
        window.addEventListener('resize', resize);
        resize();

        // Pontos flutuantes
        const points = [];
        const count = 40;
        for (let i = 0; i < count; i++) {
            points.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: 1.5 + Math.random() * 2.5,
            });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#1a4b8c';
            ctx.globalAlpha = 0.4;

            points.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Linhas entre pontos próximos
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#1a4b8c';
            ctx.lineWidth = 0.8;
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ============================================================
    // 14. INIT
    // ============================================================
    document.addEventListener('DOMContentLoaded', function() {
        initRender();
        initMobileMenu();
        initDarkMode();
        setFooterYear();
        initHeroCanvas();

        // Smooth scroll para links internos (fallback)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    });

})();

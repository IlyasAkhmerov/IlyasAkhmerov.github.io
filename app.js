(function() {
    "use strict";

    // ----- DOM -----
    var homeScreen = document.getElementById('homeScreen');
    var loginScreen = document.getElementById('loginScreen');
    var dashboardScreen = document.getElementById('dashboardScreen');
    var level2Screen = document.getElementById('level2Screen');
    var level3Screen = document.getElementById('level3Screen');

    var loginForm = document.getElementById('loginForm');
    var loginError = document.getElementById('loginError');
    var usernameInput = document.getElementById('usernameInput');
    var passwordInput = document.getElementById('passwordInput');

    var level2List = document.getElementById('level2List');
    var level2Title = document.getElementById('level2Title');
    var level2Url = document.getElementById('level2Url');
    var l2BreadcrumbSection = document.getElementById('l2BreadcrumbSection');

    var level3Title = document.getElementById('level3Title');
    var level3Url = document.getElementById('level3Url');
    var level3Content = document.getElementById('level3Content');
    var l3BreadcrumbSection = document.getElementById('l3BreadcrumbSection');
    var l3BreadcrumbSub = document.getElementById('l3BreadcrumbSub');
    var backToLevel2FromL3 = document.getElementById('backToLevel2FromL3');

    // ----- ДАННЫЕ: 3 раздела × 3 подстраницы -----
    var sections = {
        products: {
            id: 'products',
            name: 'Продукты',
            icon: '📘',
            url: '/products',
            subs: {
                household: {
                    slug: 'household',
                    title: 'Товары для дома',
                    url: '/products/household',
                    content: '<p><strong>Товары для дома</strong> — мебель, текстиль, посуда и декор.</p><p>Экологичные материалы, современный дизайн, доступные цены.</p><p>Мягкая мебель, светильники, ковры, шторы, аксессуары.</p>'
                },
                electronics: {
                    slug: 'electronics',
                    title: 'Электроника',
                    url: '/products/electronics',
                    content: '<p><strong>Электроника</strong> — смартфоны, ноутбуки, наушники, умные устройства.</p><p>Только проверенные бренды с гарантией. Быстрая доставка.</p><p>Акции и рассрочка на популярные модели.</p>'
                },
                clothing: {
                    slug: 'clothing',
                    title: 'Одежда и аксессуары',
                    url: '/products/clothing',
                    content: '<p><strong>Одежда и аксессуары</strong> — коллекции для мужчин, женщин и детей.</p><p>Натуральные ткани, стильные решения для повседневной жизни.</p><p>Сумки, часы, украшения, головные уборы.</p>'
                }
            }
        },
        services: {
            id: 'services',
            name: 'Услуги',
            icon: '📗',
            url: '/services',
            subs: {
                repair: {
                    slug: 'repair',
                    title: 'Ремонт и отделка',
                    url: '/services/repair',
                    content: '<p><strong>Ремонт и отделка</strong> под ключ. Квартиры, офисы, коммерческие пространства.</p><p>Дизайн-проект, подбор материалов, контроль качества.</p><p>Гарантия на все виды работ до 5 лет.</p>'
                },
                consulting: {
                    slug: 'consulting',
                    title: 'Консалтинг',
                    url: '/services/consulting',
                    content: '<p><strong>Консалтинг</strong> для бизнеса: стратегия, оптимизация, маркетинг, управление.</p><p>Опытные эксперты, индивидуальный подход, измеримые результаты.</p><p>Конфиденциальность и полная поддержка.</p>'
                },
                it: {
                    slug: 'it',
                    title: 'IT-решения',
                    url: '/services/it',
                    content: '<p><strong>IT-решения</strong> — разработка сайтов, мобильных приложений, CRM.</p><p>Современные технологии, гибкая методология, интеграция.</p><p>Техническая поддержка и сопровождение.</p>'
                }
            }
        },
        company: {
            id: 'company',
            name: 'О компании',
            icon: '📕',
            url: '/company',
            subs: {
                history: {
                    slug: 'history',
                    title: 'История',
                    url: '/company/history',
                    content: '<p><strong>История компании</strong> началась в 2015 году с небольшого стартапа.</p><p>За 10 лет выросли в надёжного партнёра, расширили направления.</p><p>Сегодня нас более 120 сотрудников, офисы в 5 городах.</p>'
                },
                team: {
                    slug: 'team',
                    title: 'Команда',
                    url: '/company/team',
                    content: '<p><strong>Команда</strong> — профессионалы с опытом в своих областях.</p><p>Инженеры, дизайнеры, менеджеры, консультанты.</p><p>Ценим инициативу, уважаем друг друга, постоянно учимся.</p>'
                },
                contacts: {
                    slug: 'contacts',
                    title: 'Контакты',
                    url: '/company/contacts',
                    content: '<p><strong>Свяжитесь с нами</strong> любым удобным способом.</p><p>📧 Email: info@example.com<br>📞 Телефон: +7 (999) 555-11-22<br>📍 Адрес: г. Москва, ул. Новая, д. 10</p><p>Режим работы: пн–пт 9:00–20:00, сб 10:00–17:00.</p>'
                }
            }
        }
    };

    // ----- состояние -----
    var isAuth = false;
    var currentSectionId = null;
    var currentSubSlug = null;

    // ----- Роутер с History API -----
    function navigate(path) {
        // Убираем лишние слеши
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        // ---- ПУБЛИЧНЫЕ СТРАНИЦЫ ----
        if (path === '/' || path === '') {
            showHomeScreen();
            return;
        }

        if (path === '/login') {
            showLoginScreen();
            return;
        }

        // ---- ЗАЩИЩЕННЫЕ СТРАНИЦЫ ----
        if (!isAuth) {
            navigateTo('/login');
            return;
        }

        if (path === '/dashboard') {
            showDashboardScreen();
            return;
        }

        // ---- РАЗДЕЛЫ (уровень 2) ----
        if (path === '/products' || path === '/services' || path === '/company') {
            var sectionId = path.replace('/', '');
            if (sections[sectionId]) {
                showLevel2Screen(sectionId);
                return;
            }
        }

        // ---- ПОДСТРАНИЦЫ (уровень 3) ----
        var subMatch = path.match(/^\/(products|services|company)\/([^/]+)$/);
        if (subMatch) {
            var sectionSlug = subMatch[1];
            var subSlug = subMatch[2];
            if (sections[sectionSlug] && sections[sectionSlug].subs[subSlug]) {
                showLevel3Screen(sectionSlug, subSlug);
                return;
            } else {
                navigateTo('/' + sectionSlug);
                return;
            }
        }

        // неизвестный путь — на главную
        navigateTo('/');
    }

    function navigateTo(path) {
        if (path.charAt(0) !== '/') path = '/' + path;
        // Используем pushState без перезагрузки
        window.history.pushState({ path: path }, '', path);
        navigate(path);
    }

    // ----- функции переключения экранов -----
    function showScreen(screenElement) {
        var screens = [homeScreen, loginScreen, dashboardScreen, level2Screen, level3Screen];
        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.add('hidden');
        }
        screenElement.classList.remove('hidden');
    }

    function showHomeScreen() {
        showScreen(homeScreen);
        var dashboardLink = document.querySelector('[data-test-id="home-go-to-dashboard"]');
        if (dashboardLink) {
            dashboardLink.style.display = isAuth ? 'inline-flex' : 'none';
        }
        currentSectionId = null;
        currentSubSlug = null;
    }

    function showLoginScreen() {
        showScreen(loginScreen);
        loginError.classList.add('hidden');
        if (isAuth) {
            navigateTo('/dashboard');
        }
    }

    function showDashboardScreen() {
        if (!isAuth) { navigateTo('/login'); return; }
        showScreen(dashboardScreen);
        currentSectionId = null;
        currentSubSlug = null;
    }

    function showLevel2Screen(sectionSlug) {
        if (!isAuth) { navigateTo('/login'); return; }
        var section = sections[sectionSlug];
        if (!section) { navigateTo('/dashboard'); return; }

        currentSectionId = sectionSlug;
        currentSubSlug = null;

        level2Title.textContent = section.icon + ' ' + section.name;
        l2BreadcrumbSection.textContent = section.name;
        level2Url.textContent = section.url;

        var html = '';
        for (var subSlug in section.subs) {
            var subData = section.subs[subSlug];
            html += `
                <a href="${subData.url}" class="page-list-item" data-sub="${subSlug}" data-test-id="sub-${subSlug}" style="text-decoration: none; color: inherit;">
                    <span>📄 ${subData.title}</span>
                    <span class="sub-badge">${subData.url}</span>
                </a>
            `;
        }
        level2List.innerHTML = html;

        showScreen(level2Screen);
    }

    function showLevel3Screen(sectionSlug, subSlug) {
        if (!isAuth) { navigateTo('/login'); return; }
        var section = sections[sectionSlug];
        if (!section) { navigateTo('/dashboard'); return; }
        var sub = section.subs[subSlug];
        if (!sub) {
            navigateTo('/' + sectionSlug);
            return;
        }

        currentSectionId = sectionSlug;
        currentSubSlug = subSlug;

        level3Title.textContent = '📖 ' + sub.title;
        level3Url.textContent = sub.url;
        l3BreadcrumbSection.textContent = section.name;
        l3BreadcrumbSub.textContent = sub.title;

        level3Content.innerHTML = '<h3 style="margin-bottom:10px; color:#0b2a3f;" data-test-id="level3-page-title">' + sub
            .title + '</h3>' + sub.content;

        // Обновляем ссылки в хлебных крошках
        l3BreadcrumbSection.href = section.url;
        l3BreadcrumbSub.href = section.url;
        backToLevel2FromL3.href = section.url;

        showScreen(level3Screen);
    }

    // ----- Обработка кнопки "Назад" в браузере -----
    window.addEventListener('popstate', function(event) {
        var path = window.location.pathname;
        navigate(path);
    });

    // ----- Обработчики -----

    // ГЛАВНЫЙ ОБРАБОТЧИК: перехватываем ВСЕ клики по ссылкам
    document.addEventListener('click', function(e) {
        // Находим ссылку, на которую кликнули
        var link = e.target.closest('a');
        if (!link) return;

        // Проверяем, что это внутренняя ссылка
        var href = link.getAttribute('href');
        if (!href) return;

        // Пропускаем внешние ссылки (http, https, //)
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
            return;
        }

        // Пропускаем ссылки с target="_blank" или download
        if (link.target === '_blank' || link.hasAttribute('download')) {
            return;
        }

        // Пропускаем якоря (якорные ссылки)
        if (href.startsWith('#')) {
            return;
        }

        // Пропускаем ссылки на файлы с расширениями
        if (href.match(/\.(pdf|jpg|jpeg|png|gif|svg|mp4|mp3|zip|rar|exe|dmg)$/i)) {
            return;
        }

        // Предотвращаем стандартное поведение браузера
        e.preventDefault();

        // Навигация через SPA
        navigateTo(href);
    });

    // Авторизация
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var user = usernameInput.value.trim();
        var pass = passwordInput.value.trim();
        if (user === 'auditor' && pass === '123456') {
            loginError.classList.add('hidden');
            isAuth = true;
            navigateTo('/dashboard');
        } else {
            loginError.classList.remove('hidden');
        }
    });

    usernameInput.addEventListener('input', function() {
        loginError.classList.add('hidden');
    });
    passwordInput.addEventListener('input', function() {
        loginError.classList.add('hidden');
    });

    // ----- Обработка редиректа для GitHub Pages -----
    function handleRedirect() {
        var urlParams = new URLSearchParams(window.location.search);
        var redirectPath = urlParams.get('redirect');

        if (redirectPath) {
            // Убираем параметр redirect из URL без перезагрузки
            window.history.replaceState({}, '', redirectPath);
            return redirectPath;
        }
        return null;
    }

    // ----- Инициализация -----
    function init() {
        // Проверяем редирект от 404.html (для GitHub Pages)
        var redirectPath = handleRedirect();
        var initialPath = redirectPath || window.location.pathname || '/';

        // Обрабатываем начальный путь
        if (initialPath === '/' || initialPath === '') {
            navigate('/');
        } else {
            navigate(initialPath);
        }

        console.log('✅ Сайт с чистыми URL запущен');
        console.log('Логин: auditor / 123456');
        console.log('Доступные маршруты:');
        console.log('  /                      — главная');
        console.log('  /login                 — вход');
        console.log('  /dashboard             — панель');
        console.log('  /products              — Продукты');
        console.log('  /products/household    — Товары для дома');
        console.log('  /products/electronics  — Электроника');
        console.log('  /products/clothing     — Одежда');
        console.log('  /services              — Услуги');
        console.log('  /services/repair       — Ремонт');
        console.log('  /services/consulting   — Консалтинг');
        console.log('  /services/it           — IT-решения');
        console.log('  /company               — О компании');
        console.log('  /company/history       — История');
        console.log('  /company/team          — Команда');
        console.log('  /company/contacts      — Контакты');
    }

    init();
})();
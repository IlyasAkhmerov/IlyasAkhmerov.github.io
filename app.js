(function() {
    "use strict";

    // ----- DOM -----
    var homeScreen = document.getElementById('homeScreen');
    var loginScreen = document.getElementById('loginScreen');
    var dashboardScreen = document.getElementById('dashboardScreen');
    var level2Screen = document.getElementById('level2Screen');
    var level3Screen = document.getElementById('level3Screen');

    var goToLoginBtn = document.getElementById('goToLoginBtn');
    var goToDashboardBtn = document.getElementById('goToDashboardBtn');
    var backToHomeFromLogin = document.getElementById('backToHomeFromLogin');
    var backToHomeFromDashboard = document.getElementById('backToHomeFromDashboard');

    var loginForm = document.getElementById('loginForm');
    var loginError = document.getElementById('loginError');
    var usernameInput = document.getElementById('usernameInput');
    var passwordInput = document.getElementById('passwordInput');
    var logoutBtnDashboard = document.getElementById('logoutBtnDashboard');
    var logoutBtnL2 = document.getElementById('logoutBtnL2');
    var logoutBtnL3 = document.getElementById('logoutBtnL3');

    var level1List = document.getElementById('level1List');
    var level2List = document.getElementById('level2List');
    var level2Title = document.getElementById('level2Title');
    var level2Url = document.getElementById('level2Url');
    var l2BreadcrumbSection = document.getElementById('l2BreadcrumbSection');
    var l2BreadcrumbBack = document.getElementById('l2BreadcrumbBack');
    var backToDashboardFromL2 = document.getElementById('backToDashboardFromL2');

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

    // ----- Навигация с обновлением URL -----
    function navigateTo(path) {
        if (path.charAt(0) !== '/') path = '/' + path;
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
        goToLoginBtn.style.display = 'inline-flex';
        goToDashboardBtn.style.display = isAuth ? 'inline-flex' : 'none';
        currentSectionId = null;
        currentSubSlug = null;
        document.querySelector('[data-test-id="home-url"]').textContent = '/';
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
                <div class="page-list-item" data-sub="${subSlug}" data-test-id="sub-${subSlug}">
                    <span>📄 ${subData.title}</span>
                    <span class="sub-badge">${subData.url}</span>
                </div>
            `;
        }
        level2List.innerHTML = html;

        var items = level2List.querySelectorAll('.page-list-item');
        for (var i = 0; i < items.length; i++) {
            (function(item) {
                item.addEventListener('click', function() {
                    var subSlug = this.dataset.sub;
                    if (subSlug) {
                        navigateTo(section.url + '/' + subSlug);
                    }
                });
            })(items[i]);
        }

        showScreen(level2Screen);
    }

    function showLevel3Screen(sectionSlug, subSlug) {
        if (!isAuth) { navigateTo('/login'); return; }
        var section = sections[sectionSlug];
        if (!section) { navigateTo('/dashboard'); return; }
        var sub = section.subs[subSlug];
        if (!sub) { navigateTo('/' + sectionSlug); return; }

        currentSectionId = sectionSlug;
        currentSubSlug = subSlug;

        level3Title.textContent = '📖 ' + sub.title;
        level3Url.textContent = sub.url;
        l3BreadcrumbSection.textContent = section.name;
        l3BreadcrumbSub.textContent = sub.title;

        level3Content.innerHTML = '<h3 style="margin-bottom:10px; color:#0b2a3f;" data-test-id="level3-page-title">' + sub
            .title + '</h3>' + sub.content;

        l3BreadcrumbSection.onclick = function() {
            navigateTo(section.url);
        };
        l3BreadcrumbSub.onclick = function() {
            navigateTo(section.url);
        };

        showScreen(level3Screen);
    }

    // ----- Обработка кнопки "Назад" в браузере -----
    window.addEventListener('popstate', function(event) {
        var path = window.location.pathname;
        navigate(path);
    });

    // ----- Обработчики -----

    goToLoginBtn.addEventListener('click', function() {
        navigateTo('/login');
    });

    goToDashboardBtn.addEventListener('click', function() {
        navigateTo('/dashboard');
    });

    backToHomeFromLogin.addEventListener('click', function() {
        navigateTo('/');
    });

    backToHomeFromDashboard.addEventListener('click', function() {
        navigateTo('/');
    });

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

    logoutBtnDashboard.addEventListener('click', function() {
        isAuth = false;
        navigateTo('/');
    });
    logoutBtnL2.addEventListener('click', function() {
        isAuth = false;
        navigateTo('/');
    });
    logoutBtnL3.addEventListener('click', function() {
        isAuth = false;
        navigateTo('/');
    });

    var level1Items = level1List.querySelectorAll('.page-list-item');
    for (var i = 0; i < level1Items.length; i++) {
        (function(item) {
            item.addEventListener('click', function() {
                var slug = this.dataset.slug;
                if (slug && sections[slug]) {
                    navigateTo('/' + slug);
                }
            });
        })(level1Items[i]);
    }

    backToDashboardFromL2.addEventListener('click', function() {
        navigateTo('/dashboard');
    });
    l2BreadcrumbBack.addEventListener('click', function() {
        navigateTo('/dashboard');
    });

    backToLevel2FromL3.addEventListener('click', function() {
        if (currentSectionId) {
            navigateTo('/' + currentSectionId);
        } else {
            navigateTo('/dashboard');
        }
    });

    // ----- Обработка редиректа для GitHub Pages -----
    function handleRedirect() {
        var urlParams = new URLSearchParams(window.location.search);
        var redirectPath = urlParams.get('redirect');

        if (redirectPath) {
            // Убираем параметр redirect из URL
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

        // Если путь не корень и не содержит точку (не файл)
        if (initialPath !== '/' && !initialPath.match(/\.[a-zA-Z0-9]+$/)) {
            navigate(initialPath);
        } else {
            navigate('/');
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

    // Запускаем инициализацию
    init();
})();
(() => {
    const themes = ['system', 'light', 'dark'];
    const labels = {
        en: { appearance: 'Appearance', system: 'System', light: 'Light', dark: 'Dark' },
        fa: { appearance: 'نمایش', system: 'سیستم', light: 'روشن', dark: 'تیره' },
        ar: { appearance: 'المظهر', system: 'النظام', light: 'فاتح', dark: 'داكن' },
        zh: { appearance: '外观', system: '跟随系统', light: '浅色', dark: '深色' }
    };
    const builtInProfiles = [
        { icon: '🌐', names: ['Google DNS', 'گوگل DNS', 'Google DNS', 'Google DNS'], primary: '8.8.8.8', secondary: '8.8.4.4' },
        { icon: '☁️', names: ['Cloudflare', 'کلودفلر', 'Cloudflare', 'Cloudflare'], primary: '1.1.1.1', secondary: '1.0.0.1' },
        { icon: '🔓', names: ['Open DNS', 'اوپن DNS', 'Open DNS', 'Open DNS'], primary: '208.67.222.222', secondary: '208.67.220.220' },
        { icon: '🛡️', names: ['Quad 9', 'کواد ۹', 'Quad 9', 'Quad 9'], primary: '9.9.9.9', secondary: '149.112.112.112' },
        { icon: '🛡️', names: ['Cloudflare Malware Protection', 'کلادفلر - مسدودسازی بدافزار', 'Cloudflare لحظر البرمجيات الضارة', 'Cloudflare 恶意软件防护'], primary: '1.1.1.2', secondary: '1.0.0.2' },
        { icon: '👨‍👩‍👧‍👦', names: ['Cloudflare Family Protection', 'کلادفلر - محافظت خانواده', 'Cloudflare للحماية العائلية', 'Cloudflare 家庭防护'], primary: '1.1.1.3', secondary: '1.0.0.3' },
        { icon: '🧹', names: ['AdGuard DNS (ads and trackers)', 'AdGuard - مسدودسازی تبلیغات و ردیاب‌ها', 'AdGuard لحظر الإعلانات والمتتبعات', 'AdGuard 广告与跟踪器过滤'], primary: '94.140.14.14', secondary: '94.140.15.15' },
        { icon: '👨‍👩‍👧‍👦', names: ['AdGuard Family Protection', 'AdGuard - محافظت خانواده', 'AdGuard للحماية العائلية', 'AdGuard 家庭防护'], primary: '94.140.14.15', secondary: '94.140.15.16' },
        { icon: '🌐', names: ['AdGuard Non-filtering', 'AdGuard - بدون فیلتر', 'AdGuard بدون تصفية', 'AdGuard 无过滤'], primary: '94.140.14.140', secondary: '94.140.14.141' },
        { icon: '🛡️', names: ['CleanBrowsing Security Filter', 'CleanBrowsing - فیلتر امنیتی', 'CleanBrowsing للتصفية الأمنية', 'CleanBrowsing 安全过滤'], primary: '185.228.168.9', secondary: '185.228.169.9' },
        { icon: '👨‍👩‍👧‍👦', names: ['CleanBrowsing Family Filter', 'CleanBrowsing - فیلتر خانواده', 'CleanBrowsing للتصفية العائلية', 'CleanBrowsing 家庭过滤'], primary: '185.228.168.168', secondary: '185.228.169.168' },
        { icon: '🔞', names: ['CleanBrowsing Adult Filter', 'CleanBrowsing - فیلتر محتوای بزرگسالان', 'CleanBrowsing لتصفية محتوى البالغين', 'CleanBrowsing 成人内容过滤'], primary: '185.228.168.10', secondary: '185.228.169.11' },
        { icon: '🌐', names: ['Control D Free Unfiltered', 'Control D رایگان - بدون فیلتر', 'Control D المجاني بدون تصفية', 'Control D 免费版（无过滤）'], primary: '76.76.2.0', secondary: '76.76.10.0' },
        { icon: '🛡️', names: ['Control D Free Malware Filter', 'Control D رایگان - فیلتر بدافزار', 'Control D المجاني لحظر البرمجيات الضارة', 'Control D 免费版（恶意软件过滤）'], primary: '76.76.2.1', secondary: '76.76.10.1' },
        { icon: '🧹', names: ['Control D Free Ads and Tracking', 'Control D رایگان - تبلیغات و ردیاب‌ها', 'Control D المجاني لحظر الإعلانات والمتتبعات', 'Control D 免费版（广告与跟踪器过滤）'], primary: '76.76.2.2', secondary: '76.76.10.2' },
        { icon: '👨‍👩‍👧‍👦', names: ['Control D Free Family', 'Control D رایگان - خانواده', 'Control D المجاني للعائلة', 'Control D 免费版（家庭）'], primary: '76.76.2.4', secondary: '76.76.10.4' },
        { icon: '🌍', names: ['Control D Free Uncensored', 'Control D رایگان - بدون سانسور', 'Control D المجاني غير الخاضع للرقابة', 'Control D 免费版（无审查）'], primary: '76.76.2.5', secondary: '76.76.10.5' }
    ];
    const icons = [
        ['⚙️', 'settings', '<path d="M4 7h9m4 0h3M4 17h3m4 0h9"></path><circle cx="15" cy="7" r="2"></circle><circle cx="9" cy="17" r="2"></circle>'],
        ['🛡️', 'shield', '<path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z"></path><path d="m8.5 12 2.2 2.2 4.8-5"></path>'],
        ['🔐', 'lock', '<rect x="5" y="10" width="14" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"></path>'],
        ['🔒', 'lock', '<rect x="5" y="10" width="14" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>'],
        ['🌐', 'globe', '<circle cx="12" cy="12" r="9"></circle><path d="M3.5 12h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path>'],
        ['🌍', 'globe', '<circle cx="12" cy="12" r="9"></circle><path d="M3.5 12h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path>'],
        ['📋', 'document', '<rect x="5" y="4" width="14" height="17" rx="2"></rect><path d="M9 4V2h6v2M9 10h6m-6 4h6m-6 4h3"></path>'],
        ['📜', 'document', '<path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path><path d="M14 3v5h5M8 12h8m-8 4h8"></path>'],
        ['📊', 'chart', '<path d="M4 20h16M7 16v-5m5 5V5m5 11V9"></path>'],
        ['💾', 'storage', '<ellipse cx="12" cy="5" rx="8" ry="3"></ellipse><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"></path>'],
        ['📶', 'signal', '<path d="M3 8a14 14 0 0 1 18 0M6 11a9 9 0 0 1 12 0m-9 3a5 5 0 0 1 6 0m-3 4h.01"></path>'],
        ['🎮', 'game', '<path d="M7 8h10a4 4 0 0 1 3.8 2.8l1 3.5a2.5 2.5 0 0 1-4 2.7L15 15h-6l-2.8 2a2.5 2.5 0 0 1-4-2.7l1-3.5A4 4 0 0 1 7 8Z"></path><path d="M8 10v4m-2-2h4m7-1h.01m2 2h.01"></path>'],
        ['✨', 'sparkles', '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 11 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"></path>'],
        ['⌕', 'search', '<circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path>'],
        ['☆', 'star', '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path>'],
        ['🔧', 'settings', '<path d="M14 6a5 5 0 0 0-6.5 6.5L3 17l4 4 4.5-4.5A5 5 0 0 0 18 10l-3 3-4-4 3-3Z"></path>'],
        ['⚙', 'settings', '<path d="M4 7h9m4 0h3M4 17h3m4 0h9"></path><circle cx="15" cy="7" r="2"></circle><circle cx="9" cy="17" r="2"></circle>'],
        ['🌟', 'star', '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path>'],
        ['✅', 'check', '<path d="m5 12 4 4L19 6"></path>'],
        ['🚫', 'ban', '<circle cx="12" cy="12" r="9"></circle><path d="m5.6 5.6 12.8 12.8"></path>'],
        ['🔍', 'search', '<circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path>'],
        ['🔄', 'refresh', '<path d="M20 7v5h-5M4 17v-5h5"></path><path d="M5.5 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.5-3"></path>'],
        ['📧', 'mail', '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m4 7 8 6 8-6"></path>'],
        ['👤', 'user', '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>'],
        ['⚠️', 'warning', '<path d="M12 3 2.8 20h18.4L12 3Z"></path><path d="M12 9v5m0 3h.01"></path>'],
        ['⚠', 'warning', '<path d="M12 3 2.8 20h18.4L12 3Z"></path><path d="M12 9v5m0 3h.01"></path>'],
        ['🔗', 'link', '<path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7"></path><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"></path>'],
        ['🤝', 'people', '<path d="m8 12 2.5 2.5a2 2 0 0 0 2.8 0l4.2-4.2"></path><path d="m3 11 5-5 4 1 3-1 6 5-5 6m-9-5-4 4 3 3 3-3m6 1 3 3 3-3-3-3"></path>'],
        ['📞', 'phone', '<path d="M7 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3l-5-2-2 3a14 14 0 0 1-5-5l3-2-2-5Z"></path>'],
        ['📥', 'download', '<path d="M12 3v12m0 0 4-4m-4 4-4-4"></path><path d="M5 16v4h14v-4"></path>'],
        ['📸', 'image', '<rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="12" cy="12" r="3"></circle><path d="m7 5 1-2h8l1 2"></path>'],
        ['🚀', 'launch', '<path d="M12 15 9 12c1-5 4-8 11-9 0 7-4 10-8 11Z"></path><path d="m9 12-4 1-2 4 6-1m3-1 1 4 4 2-1-6M7 18l-2 3"></path>'],
        ['⚖️', 'scale', '<path d="M12 3v18m-7 0h14M5 7h14M7 7l-4 7h8L7 7Zm10 0-4 7h8l-4-7Z"></path>'],
        ['🐙', 'code', '<path d="M8 18v-4m4 4v-6m4 6v-4M5 12a7 7 0 1 1 14 0v7H5v-7Z"></path><path d="M9 9h.01M15 9h.01"></path>'],
        ['📝', 'document', '<path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path><path d="M14 3v5h5M8 12h8m-8 4h8"></path>'],
        ['☁️', 'cloud', '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1 0 8H7Z"></path>'],
        ['🔓', 'shield', '<path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z"></path><path d="m8.5 12 2.2 2.2 4.8-5"></path>'],
        ['📄', 'document', '<path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path><path d="M14 3v5h5M8 12h8m-8 4h8"></path>'],
        ['📦', 'box', '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 5v9l9 5 9-5V8m-9 5v9"></path>'],
        ['🌈', 'sparkles', '<path d="M4 19a8 8 0 1 1 16 0M8 19a4 4 0 1 1 8 0m-4-4v4"></path>']
    ];

    const stripIconPrefix = (text) => {
        const trimmed = text.trimStart();
        const icon = icons.find(([symbol]) => trimmed.startsWith(symbol));
        return icon ? trimmed.slice(icon[0].length).trimStart() : text;
    };

    const replaceLeadingIcon = (element) => {
        const textNode = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (!textNode) return;
        const original = textNode.textContent;
        const trimmed = original.trimStart();
        const icon = icons.find(([symbol]) => trimmed.startsWith(symbol));
        if (!icon) return;

        textNode.textContent = original.slice(0, original.length - trimmed.length) + trimmed.slice(icon[0].length).trimStart();
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.classList.add('site-icon', `site-icon-${icon[1]}`);
        svg.innerHTML = icon[2];
        element.insertBefore(svg, element.firstChild);
    };

    const applyTheme = (theme) => {
        const selectedTheme = themes.includes(theme) ? theme : 'system';
        document.documentElement.dataset.theme = selectedTheme;
        document.querySelectorAll('.site-theme-controls button').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.theme === selectedTheme));
        });
    };

    const readFallbackTheme = () => {
        try {
            const savedTheme = localStorage.getItem('dns-manager-theme');
            return themes.includes(savedTheme) ? savedTheme : 'system';
        } catch (error) {
            console.error('Could not read appearance preference:', error);
            return 'system';
        }
    };

    const setTheme = async (theme) => {
        if (!themes.includes(theme)) return;
        applyTheme(theme);
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ theme });
            } else {
                localStorage.setItem('dns-manager-theme', theme);
            }
        } catch (error) {
            console.error('Could not save appearance preference:', error);
        }
    };

    document.documentElement.dataset.theme = 'system';

    document.addEventListener('DOMContentLoaded', () => {
        document.title = stripIconPrefix(document.title);
        document.querySelectorAll('h1, h2, h3, .contrib-title, .security-title, .license-title, .preset-icon, a.btn, .footer-link').forEach(replaceLeadingIcon);

        document.querySelectorAll('.preset-grid[data-preset-language]').forEach(grid => {
            const languageIndex = { en: 0, fa: 1, ar: 2, zh: 3 }[grid.dataset.presetLanguage] || 0;
            const fragment = document.createDocumentFragment();
            builtInProfiles.forEach(profile => {
                const item = document.createElement('div');
                item.className = 'preset-item';

                const icon = document.createElement('div');
                icon.className = 'preset-icon';
                icon.textContent = profile.icon;

                const name = document.createElement('div');
                name.className = 'preset-name';
                name.textContent = profile.names[languageIndex];

                const servers = document.createElement('div');
                servers.className = 'preset-servers';
                servers.textContent = `${profile.primary}, ${profile.secondary}`;

                item.append(icon, name, servers);
                fragment.appendChild(item);
            });
            grid.replaceChildren(fragment);
        });

        const tabs = document.querySelectorAll('.lang-tab');
        const contents = document.querySelectorAll('.lang-content');
        const applyLanguageCopy = selectedLanguage => {
            const copy = document.querySelectorAll('[data-lang-copy-en]');
            copy.forEach(element => {
                const localizedText = element.getAttribute(`data-lang-copy-${selectedLanguage}`);
                if (localizedText !== null) element.textContent = localizedText;
            });

            const selectedLabels = labels[selectedLanguage] || labels.en;
            const themeGroup = document.querySelector('.site-theme-controls');
            if (themeGroup) {
                themeGroup.setAttribute('aria-label', selectedLabels.appearance);
                themeGroup.querySelector('.theme-caption').textContent = selectedLabels.appearance;
                themes.forEach(theme => {
                    const button = themeGroup.querySelector(`[data-theme="${theme}"]`);
                    if (button) button.textContent = selectedLabels[theme];
                });
            }
        };
        tabs.forEach(tab => {
            tab.setAttribute('aria-pressed', String(tab.classList.contains('active')));
            tab.addEventListener('click', () => {
                const selectedLanguage = tab.dataset.lang;
                tabs.forEach(item => {
                    const selected = item === tab;
                    item.classList.toggle('active', selected);
                    item.setAttribute('aria-pressed', String(selected));
                });
                contents.forEach(content => {
                    const selected = content.dataset.lang === selectedLanguage;
                    content.classList.toggle('active', selected);
                    if (selected) {
                        document.documentElement.lang = selectedLanguage;
                        document.documentElement.dir = ['fa', 'ar'].includes(selectedLanguage) ? 'rtl' : 'ltr';
                        applyLanguageCopy(selectedLanguage);
                    }
                });
            });
        });

        const language = (document.documentElement.lang || 'en').split('-')[0];
        const text = labels[language] || labels.en;
        const group = document.createElement('div');
        group.className = 'site-theme-controls';
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', text.appearance);

        const caption = document.createElement('span');
        caption.className = 'theme-caption';
        caption.textContent = text.appearance;
        group.appendChild(caption);

        themes.forEach(theme => {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.theme = theme;
            button.textContent = text[theme];
            button.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === theme));
            button.addEventListener('click', () => setTheme(theme));
            group.appendChild(button);
        });

        document.body.prepend(group);
        applyLanguageCopy(language);

        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['theme']).then(({ theme }) => applyTheme(theme)).catch(error => {
                console.error('Could not load appearance preference:', error);
                applyTheme(readFallbackTheme());
            });
            if (chrome.storage.onChanged) {
                chrome.storage.onChanged.addListener((changes, area) => {
                    if (area === 'local' && changes.theme) applyTheme(changes.theme.newValue);
                });
            }
        } else {
            applyTheme(readFallbackTheme());
        }
    });
})();

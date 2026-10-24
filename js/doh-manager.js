const CHROME_DOH_PROVIDERS = [
    { id: 'google', name: 'Google Public DNS', template: 'https://dns.google/dns-query' },
    { id: 'cloudflare', name: 'Cloudflare', template: 'https://cloudflare-dns.com/dns-query' },
    { id: 'cloudflare-security', name: 'Cloudflare Malware Protection', template: 'https://security.cloudflare-dns.com/dns-query' },
    { id: 'cloudflare-family', name: 'Cloudflare Family Protection', template: 'https://family.cloudflare-dns.com/dns-query' },
    { id: 'opendns', name: 'OpenDNS', template: 'https://doh.opendns.com/dns-query' },
    { id: 'quad9', name: 'Quad9', template: 'https://dns.quad9.net/dns-query' },
    { id: 'adguard', name: 'AdGuard DNS', template: 'https://dns.adguard-dns.com/dns-query' },
    { id: 'adguard-family', name: 'AdGuard Family Protection', template: 'https://family.adguard-dns.com/dns-query' },
    { id: 'adguard-unfiltered', name: 'AdGuard Non-filtering', template: 'https://unfiltered.adguard-dns.com/dns-query' },
    { id: 'cleanbrowsing-security', name: 'CleanBrowsing Security Filter', template: 'https://doh.cleanbrowsing.org/doh/security-filter/' },
    { id: 'cleanbrowsing-family', name: 'CleanBrowsing Family Filter', template: 'https://doh.cleanbrowsing.org/doh/family-filter/' },
    { id: 'cleanbrowsing-adult', name: 'CleanBrowsing Adult Filter', template: 'https://doh.cleanbrowsing.org/doh/adult-filter/' },
    { id: 'controld-unfiltered', name: 'Control D Free Unfiltered', template: 'https://freedns.controld.com/p0' },
    { id: 'controld-malware', name: 'Control D Free Malware', template: 'https://freedns.controld.com/p1' },
    { id: 'controld-ads', name: 'Control D Free Ads & Tracking', template: 'https://freedns.controld.com/p2' },
    { id: 'controld-family', name: 'Control D Free Family', template: 'https://freedns.controld.com/family' },
    { id: 'controld-uncensored', name: 'Control D Free Uncensored', template: 'https://freedns.controld.com/uncensored' },
    { id: 'mullvad', name: 'Mullvad DNS', template: 'https://dns.mullvad.net/dns-query' },
    { id: 'mullvad-adblock', name: 'Mullvad DNS Ad Block', template: 'https://adblock.dns.mullvad.net/dns-query' },
    { id: 'mullvad-base', name: 'Mullvad DNS Base', template: 'https://base.dns.mullvad.net/dns-query' },
    { id: 'mullvad-extended', name: 'Mullvad DNS Extended', template: 'https://extended.dns.mullvad.net/dns-query' },
    { id: 'mullvad-family', name: 'Mullvad DNS Family', template: 'https://family.dns.mullvad.net/dns-query' },
    { id: 'mullvad-all', name: 'Mullvad DNS All Filters', template: 'https://all.dns.mullvad.net/dns-query' }
];

const CHROME_SETTINGS_URL = 'chrome://settings/security';

function normalizeDohTemplate(value) {
    if (typeof value !== 'string') return null;
    const template = value.trim();
    if (!template || template.length > 2048 || /\s/.test(template)) return null;

    const suffix = '{?dns}';
    const endpoint = template.endsWith(suffix) ? template.slice(0, -suffix.length) : template;
    if (/[{}]/.test(endpoint) || (template.includes('{') && !template.endsWith(suffix))) return null;

    try {
        const url = new URL(endpoint);
        if (url.protocol !== 'https:' || !url.hostname || url.username || url.password || url.hash) {
            return null;
        }
    } catch (error) {
        return null;
    }

    return template;
}

class ChromeSecureDnsManager {
    constructor() {
        this.customProviders = [];
        this.selectedProviderId = 'google';
        this.providerList = document.getElementById('dohProviderList');
        this.form = document.getElementById('dohCustomForm');
        this.nameInput = document.getElementById('customDohName');
        this.templateInput = document.getElementById('customDohTemplate');
        this.feedback = document.getElementById('dohManagerFeedback');
    }

    getText(key) {
        const text = window.i18n && window.i18n.isReady()
            ? window.i18n.getText(`dohManager.${key}`)
            : key;
        return text && text !== `dohManager.${key}` ? text : this.fallbackText(key);
    }

    fallbackText(key) {
        const fallback = {
            title: 'Chrome Secure DNS',
            description: 'Choose a DNS-over-HTTPS provider. Profiles saved here do not change Chrome settings.',
            policyNote: 'Chrome settings or administrator policies control whether Secure DNS is enabled.',
            providersTitle: 'Provider templates',
            selected: 'Selected for setup',
            useProvider: 'Select',
            copyTemplate: 'Copy template',
            customTitle: 'Custom provider',
            customName: 'Provider name',
            customNamePlaceholder: 'My DNS provider',
            customTemplate: 'HTTPS URL or Chrome URL template',
            customTemplatePlaceholder: 'https://resolver-host/dns-query',
            templateHelp: 'Use an HTTPS resolver URL. Chrome URL templates may end with {?dns}; provider compatibility is not tested.',
            selectedSaved: 'Profile selected for setup; Chrome settings are unchanged.',
            saveProvider: 'Save provider',
            removeProvider: 'Remove',
            openSettings: 'Open Chrome Secure DNS settings',
            invalidTemplate: 'Enter a valid HTTPS resolver URL or URL template.',
            missingName: 'Enter a provider name.',
            saved: 'Custom provider saved.',
            removed: 'Custom provider removed.',
            copied: 'DoH address copied.',
            copyFailed: 'Could not copy the DoH address.',
            settingsOpened: 'Chrome Secure DNS settings opened.',
            settingsCopyFallback: 'Could not open settings; the settings address was copied instead.',
            settingsFailed: 'Could not open or copy the Chrome settings address.',
            loadFailed: 'Could not load saved DoH profiles.',
            saveFailed: 'Could not save the DoH profile.',
            removeFailed: 'Could not remove the DoH profile.'
        };
        return fallback[key] || key;
    }

    providers() {
        return [
            ...CHROME_DOH_PROVIDERS,
            ...this.customProviders.map(provider => ({
                id: provider.id,
                name: provider.name,
                template: provider.template,
                custom: true
            }))
        ];
    }

    async init() {
        this.bindEvents();
        try {
            const stored = await chrome.storage.local.get(['customDohProviders', 'selectedDohProvider']);
            this.customProviders = this.validateStoredProviders(stored.customDohProviders);
            const availableIds = this.providers().map(provider => provider.id);
            if (availableIds.includes(stored.selectedDohProvider)) {
                this.selectedProviderId = stored.selectedDohProvider;
            }
        } catch (error) {
            console.error('Could not load saved DoH profiles:', error);
            this.setFeedback('loadFailed', 'error');
        }

        this.render();
        if (chrome.storage.onChanged) {
            chrome.storage.onChanged.addListener((changes, area) => {
                if (area !== 'local' || (!changes.customDohProviders && !changes.selectedDohProvider)) return;
                if (changes.customDohProviders) {
                    this.customProviders = this.validateStoredProviders(changes.customDohProviders.newValue);
                }
                if (changes.selectedDohProvider) {
                    this.selectedProviderId = changes.selectedDohProvider.newValue || 'google';
                }
                this.render();
            });
        }

        const i18n = window.i18n;
        if (i18n && typeof i18n.applyLanguage === 'function') {
            const applyLanguage = i18n.applyLanguage.bind(i18n);
            i18n.applyLanguage = (...args) => {
                applyLanguage(...args);
                this.render();
            };
        }
    }

    validateStoredProviders(value) {
        if (!Array.isArray(value)) return [];
        return value.filter(provider => {
            const valid = provider
                && typeof provider.id === 'string'
                && provider.id.startsWith('custom-')
                && typeof provider.name === 'string'
                && provider.name.trim()
                && normalizeDohTemplate(provider.template);
            if (!valid) console.warn('Ignoring an invalid saved DoH profile.');
            return Boolean(valid);
        }).map(provider => ({
            id: provider.id,
            name: provider.name.trim().slice(0, 64),
            template: normalizeDohTemplate(provider.template)
        }));
    }

    bindEvents() {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            this.saveCustomProvider();
        });

        this.templateInput.addEventListener('input', () => {
            this.templateInput.setCustomValidity(
                !this.templateInput.value || normalizeDohTemplate(this.templateInput.value)
                    ? ''
                    : this.getText('invalidTemplate')
            );
        });

        document.getElementById('openChromeSettings').addEventListener('click', () => {
            this.openSettings();
        });
    }

    render() {
        this.setText('dohManagerTitle', 'title');
        this.setText('dohManagerDescription', 'description');
        this.setText('dohPolicyNote', 'policyNote');
        this.setText('dohProvidersTitle', 'providersTitle');
        this.setText('dohCustomTitle', 'customTitle');
        this.setText('dohCustomNameLabel', 'customName');
        this.setText('dohCustomTemplateLabel', 'customTemplate');
        this.setText('dohTemplateHelp', 'templateHelp');
        this.setText('saveCustomDoh', 'saveProvider');
        this.setText('openChromeSettings', 'openSettings');
        this.nameInput.placeholder = this.getText('customNamePlaceholder');
        this.templateInput.placeholder = this.getText('customTemplatePlaceholder');

        this.providerList.replaceChildren();
        this.providers().forEach(provider => {
            this.providerList.appendChild(this.createProviderCard(provider));
        });
    }

    setText(id, key) {
        const element = document.getElementById(id);
        if (element) element.textContent = this.getText(key);
    }

    createProviderCard(provider) {
        const card = document.createElement('article');
        const selected = provider.id === this.selectedProviderId;
        card.className = `doh-provider-card${selected ? ' is-selected' : ''}`;

        const name = document.createElement('h4');
        name.className = 'doh-provider-name';
        name.textContent = provider.name;

        const actions = document.createElement('div');
        actions.className = 'doh-provider-actions';
        if (selected) {
            const status = document.createElement('span');
            status.className = 'doh-provider-status';
            status.textContent = this.getText('selected');
            actions.appendChild(status);
        } else {
            const selectButton = document.createElement('button');
            selectButton.type = 'button';
            selectButton.className = 'btn btn-secondary';
            selectButton.textContent = this.getText('useProvider');
            selectButton.addEventListener('click', () => this.selectProvider(provider.id));
            actions.appendChild(selectButton);
        }

        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'btn btn-primary';
        copyButton.textContent = this.getText('copyTemplate');
        copyButton.addEventListener('click', () => this.copyTemplate(provider.template));
        actions.appendChild(copyButton);

        if (provider.custom) {
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'btn doh-remove-button';
            removeButton.textContent = this.getText('removeProvider');
            removeButton.addEventListener('click', () => this.removeCustomProvider(provider.id));
            actions.appendChild(removeButton);
        }

        const template = document.createElement('code');
        template.className = 'doh-provider-template';
        template.textContent = provider.template;

        card.append(name, actions, template);
        return card;
    }

    async selectProvider(id) {
        try {
            await chrome.storage.local.set({ selectedDohProvider: id });
            this.selectedProviderId = id;
            this.render();
            this.setFeedback('selectedSaved', 'success');
        } catch (error) {
            console.error('Could not save selected DoH profile:', error);
            this.setFeedback('saveFailed', 'error');
        }
    }

    async saveCustomProvider() {
        const name = this.nameInput.value.trim();
        const template = normalizeDohTemplate(this.templateInput.value);
        if (!name) {
            this.setFeedback('missingName', 'error');
            this.nameInput.focus();
            return;
        }
        if (!template) {
            this.setFeedback('invalidTemplate', 'error');
            this.templateInput.setCustomValidity(this.getText('invalidTemplate'));
            this.templateInput.reportValidity();
            return;
        }

        const provider = {
            id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: name.slice(0, 64),
            template
        };
        const nextProviders = [...this.customProviders, provider];
        try {
            await chrome.storage.local.set({
                customDohProviders: nextProviders,
                selectedDohProvider: provider.id
            });
            this.customProviders = nextProviders;
            this.selectedProviderId = provider.id;
            this.form.reset();
            this.templateInput.setCustomValidity('');
            this.render();
            this.setFeedback('saved', 'success');
        } catch (error) {
            console.error('Could not save custom DoH profile:', error);
            this.setFeedback('saveFailed', 'error');
        }
    }

    async removeCustomProvider(id) {
        const nextProviders = this.customProviders.filter(provider => provider.id !== id);
        const nextSelected = this.selectedProviderId === id ? 'google' : this.selectedProviderId;
        try {
            await chrome.storage.local.set({
                customDohProviders: nextProviders,
                selectedDohProvider: nextSelected
            });
            this.customProviders = nextProviders;
            this.selectedProviderId = nextSelected;
            this.render();
            this.setFeedback('removed', 'success');
        } catch (error) {
            console.error('Could not remove custom DoH profile:', error);
            this.setFeedback('removeFailed', 'error');
        }
    }

    async copyTemplate(template) {
        try {
            await this.copyText(template);
            this.setFeedback('copied', 'success');
        } catch (error) {
            console.error('Could not copy the DoH address:', error);
            this.setFeedback('copyFailed', 'error');
        }
    }

    copyWithFallback(value) {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) throw new Error('Clipboard copy was rejected.');
    }

    async openSettings() {
        try {
            await chrome.tabs.create({ url: CHROME_SETTINGS_URL });
            this.setFeedback('settingsOpened', 'success');
        } catch (error) {
            console.error('Could not open Chrome Secure DNS settings:', error);
            try {
                await this.copyText(CHROME_SETTINGS_URL);
                this.setFeedback('settingsCopyFallback', 'info');
            } catch (copyError) {
                console.error('Could not copy the Chrome settings address:', copyError);
                this.setFeedback('settingsFailed', 'error');
            }
        }
    }

    async copyText(value) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(value);
                return;
            } catch (error) {
                console.warn('Clipboard API copy failed; trying the document fallback:', error);
            }
        }
        this.copyWithFallback(value);
    }

    setFeedback(key, kind) {
        this.feedback.textContent = this.getText(key);
        this.feedback.dataset.kind = kind;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dohManager = new ChromeSecureDnsManager();
        window.dohManager.init();
    });
}

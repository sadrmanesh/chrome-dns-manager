if (new URLSearchParams(window.location.search).get('view') === 'tab') {
    document.documentElement.dataset.layout = 'tab';
}

const READY_DNS_PRESET_VERSION = 2;
const DEFAULT_READY_DNS_PRESETS = [
    { nameKey: 'google', icon: '🌐', primary: '8.8.8.8', secondary: '8.8.4.4', isPreset: true, timestamp: 1 },
    { nameKey: 'cloudflare', icon: '☁️', primary: '1.1.1.1', secondary: '1.0.0.1', isPreset: true, timestamp: 2 },
    { nameKey: 'opendns', icon: '🔓', primary: '208.67.222.222', secondary: '208.67.220.220', isPreset: true, timestamp: 3 },
    { nameKey: 'quad9', icon: '🛡️', primary: '9.9.9.9', secondary: '149.112.112.112', isPreset: true, timestamp: 4 },
    { nameKey: 'cloudflare_malware', icon: '🛡️', primary: '1.1.1.2', secondary: '1.0.0.2', isPreset: true, timestamp: 5 },
    { nameKey: 'cloudflare_family', icon: '👨‍👩‍👧‍👦', primary: '1.1.1.3', secondary: '1.0.0.3', isPreset: true, timestamp: 6 },
    { nameKey: 'adguard', icon: '🧹', primary: '94.140.14.14', secondary: '94.140.15.15', isPreset: true, timestamp: 7 },
    { nameKey: 'adguard_family', icon: '👨‍👩‍👧‍👦', primary: '94.140.14.15', secondary: '94.140.15.16', isPreset: true, timestamp: 8 },
    { nameKey: 'adguard_unfiltered', icon: '🌐', primary: '94.140.14.140', secondary: '94.140.14.141', isPreset: true, timestamp: 9 },
    { nameKey: 'cleanbrowsing_security', icon: '🛡️', primary: '185.228.168.9', secondary: '185.228.169.9', isPreset: true, timestamp: 10 },
    { nameKey: 'cleanbrowsing_family', icon: '👨‍👩‍👧‍👦', primary: '185.228.168.168', secondary: '185.228.169.168', isPreset: true, timestamp: 11 },
    { nameKey: 'cleanbrowsing_adult', icon: '🔞', primary: '185.228.168.10', secondary: '185.228.169.11', isPreset: true, timestamp: 12 },
    { nameKey: 'controld_unfiltered', icon: '🌐', primary: '76.76.2.0', secondary: '76.76.10.0', isPreset: true, timestamp: 13 },
    { nameKey: 'controld_malware', icon: '🛡️', primary: '76.76.2.1', secondary: '76.76.10.1', isPreset: true, timestamp: 14 },
    { nameKey: 'controld_ads', icon: '🧹', primary: '76.76.2.2', secondary: '76.76.10.2', isPreset: true, timestamp: 15 },
    { nameKey: 'controld_family', icon: '👨‍👩‍👧‍👦', primary: '76.76.2.4', secondary: '76.76.10.4', isPreset: true, timestamp: 16 },
    { nameKey: 'controld_uncensored', icon: '🌍', primary: '76.76.2.5', secondary: '76.76.10.5', isPreset: true, timestamp: 17 }
];

const PRESET_METADATA = {
    google: { category: 'standard', source: 'https://developers.google.com/speed/public-dns/docs/using', doh: 'https://dns.google/dns-query' },
    cloudflare: { category: 'standard', source: 'https://developers.cloudflare.com/1.1.1.1/', doh: 'https://cloudflare-dns.com/dns-query' },
    opendns: { category: 'standard', source: 'https://www.opendns.com/setupguide/', doh: 'https://doh.opendns.com/dns-query' },
    quad9: { category: 'security', source: 'https://www.quad9.net/service/service-addresses-and-features/', doh: 'https://dns.quad9.net/dns-query' },
    cloudflare_malware: { category: 'security', source: 'https://developers.cloudflare.com/1.1.1.1/setup/', doh: 'https://security.cloudflare-dns.com/dns-query' },
    cloudflare_family: { category: 'family', source: 'https://developers.cloudflare.com/1.1.1.1/setup/', doh: 'https://family.cloudflare-dns.com/dns-query' },
    adguard: { category: 'ads', source: 'https://adguard-dns.io/kb/general/dns-providers/', doh: 'https://dns.adguard-dns.com/dns-query' },
    adguard_family: { category: 'family', source: 'https://adguard-dns.io/kb/general/dns-providers/', doh: 'https://family.adguard-dns.com/dns-query' },
    adguard_unfiltered: { category: 'unfiltered', source: 'https://adguard-dns.io/kb/general/dns-providers/', doh: 'https://unfiltered.adguard-dns.com/dns-query' },
    cleanbrowsing_security: { category: 'security', source: 'https://cleanbrowsing.org/filters/', doh: 'https://doh.cleanbrowsing.org/doh/security-filter/' },
    cleanbrowsing_family: { category: 'family', source: 'https://cleanbrowsing.org/filters/', doh: 'https://doh.cleanbrowsing.org/doh/family-filter/' },
    cleanbrowsing_adult: { category: 'adult', source: 'https://cleanbrowsing.org/filters/', doh: 'https://doh.cleanbrowsing.org/doh/adult-filter/' },
    controld_unfiltered: { category: 'unfiltered', source: 'https://docs.controld.com/docs/free-dns', doh: 'https://freedns.controld.com/p0' },
    controld_malware: { category: 'security', source: 'https://docs.controld.com/docs/free-dns', doh: 'https://freedns.controld.com/p1' },
    controld_ads: { category: 'ads', source: 'https://docs.controld.com/docs/free-dns', doh: 'https://freedns.controld.com/p2' },
    controld_family: { category: 'family', source: 'https://docs.controld.com/docs/free-dns', doh: 'https://freedns.controld.com/family' },
    controld_uncensored: { category: 'uncensored', source: 'https://docs.controld.com/docs/free-dns', doh: 'https://freedns.controld.com/uncensored' }
};
const PRESET_METADATA_REVIEWED = '2026-10-24';

class DNSManager {
    constructor() {
        this.currentConfig = null;
        this.savedConfigs = [];
        this.readyDnsPresets = [];
        this.selectedPresetIds = new Set();
        this.init();
    }

    async init() {
        try {
            console.log('Initializing DNS Manager...');

            await this.loadThemePreference();
            
            // Wait for i18n to be ready first
            await this.waitForI18n();
            console.log('i18n system ready');
            
            // Load saved configurations
        await this.loadSavedConfigs();
            console.log('Saved configs loaded');
            
            // Load current DNS configuration from storage
            await this.loadCurrentConfigFromStorage();
            console.log('Current config loaded from storage');
            
            // Setup event listeners
        this.setupEventListeners();
        this.setupNetworkMonitor();
            console.log('Event listeners setup complete');
            
            // Update status and render
            await this.updateStatus();
        this.renderSavedConfigs();
            this.highlightActivePreset();
            console.log('Status updated and configs rendered');
            
            // Load custom DNS presets after saved configs are loaded
            setTimeout(() => {
                this.loadCustomDNSPresets();
                console.log('Custom DNS presets loaded');
            }, 100);
            
            // Update UI elements
            this.updateDNSPresetsVisibility();
            this.highlightActiveLanguage();
            console.log('UI elements updated');
            
            // Set initial privacy policy and terms of service links
            const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
            this.updatePrivacyPolicyLink(currentLang);
            this.updateTermsOfServiceLink(currentLang);
            console.log('Privacy and terms links updated');
            
            // Update the current DNS bar after initialization
            updateCurrentDnsBar();
            console.log('DNS bar updated');
            
            this.updateCopyDnsLabels();
            
            console.log('DNS Manager initialization complete');

            await this.loadReadyDnsPresets();
            this.renderReadyDnsPresets();
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    async waitForI18n() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        while (attempts < maxAttempts) {
            if (window.i18n && window.i18n.isReady()) {
                console.log('i18n is ready');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        console.warn('i18n not ready after 5 seconds');
    }

    updatePrivacyPolicyLink(language) {
        const privacyLink = document.getElementById('privacyPolicyLink');
        if (privacyLink) {
            // Map language codes to direct file names
            const languageFileMap = {
                'en': 'privacy-policy.html',
                'fa': 'privacy-policy-fa.html',
                'ar': 'privacy-policy-ar.html',
                'zh': 'privacy-policy-zh.html'
            };
            
            const fileName = languageFileMap[language] || 'privacy-policy.html';
            privacyLink.href = fileName;
        }
    }

    updateTermsOfServiceLink(language) {
        const termsLink = document.getElementById('termsOfServiceLink');
        if (termsLink) {
            // Map language codes to direct file names
            const languageFileMap = {
                'en': 'terms-of-service.html',
                'fa': 'terms-of-service-fa.html',
                'ar': 'terms-of-service-ar.html',
                'zh': 'terms-of-service-zh.html'
            };
            
            const fileName = languageFileMap[language] || 'terms-of-service.html';
            termsLink.href = fileName;
        }
    }

    setupEventListeners() {
        // Preset DNS buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                await this.selectPreset(e.target.closest('.preset-btn'));
            });
        });

        // Add event listeners for built-in copy buttons
        document.querySelectorAll('.preset-btn .copy-dns-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dns = btn.getAttribute('data-dns');
                const [primary, secondary] = dns.split(',');
                this.copyDnsToClipboardCustom(primary, secondary);
            });
        });

        // Add event listeners for built-in copy labels
        document.querySelectorAll('.preset-btn .copy-dns-label').forEach(label => {
            label.addEventListener('click', (e) => {
                e.stopPropagation();
                const btn = label.closest('.preset-btn').querySelector('.copy-dns-btn');
                if (btn) {
                    const dns = btn.getAttribute('data-dns');
                    const [primary, secondary] = dns.split(',');
                    this.copyDnsToClipboardCustom(primary, secondary);
                }
            });
        });

        // Custom DNS save button
        document.getElementById('saveCustom').addEventListener('click', () => {
            this.saveCustomDNS();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Apply DNS button
        document.getElementById('applyDNS').addEventListener('click', () => {
            this.applyCurrentDNS();
        });

        // Test DNS connection button (if exists)
        const testDNSBtn = document.getElementById('testDNS');
        if (testDNSBtn) {
            testDNSBtn.addEventListener('click', () => {
                this.testDNSConnection();
            });
        }

        // Reset DNS button
        document.getElementById('resetDNS').addEventListener('click', () => {
            this.resetToDefault();
        });

        // Refresh DNS status button
        document.getElementById('refreshDNS').addEventListener('click', () => {
            this.refreshDNSStatus();
        });

        // Check DNS connection button
        document.getElementById('checkDNS').addEventListener('click', () => {
            this.checkDNSConnection();
        });

        document.getElementById('presetSearch').addEventListener('input', () => this.applyPresetFilters());
        document.getElementById('presetCategory').addEventListener('change', () => this.applyPresetFilters());
        document.getElementById('favoritesOnly').addEventListener('change', () => this.applyPresetFilters());
        document.getElementById('compareSelectedPresets').addEventListener('click', () => {
            document.getElementById('presetComparison').hidden = false;
            this.renderPresetComparison();
        });
        document.getElementById('closePresetComparison').addEventListener('click', () => {
            document.getElementById('presetComparison').hidden = true;
        });
        document.getElementById('exportDnsProfiles').addEventListener('click', () => this.exportDnsProfiles());
        document.getElementById('importDnsProfiles').addEventListener('click', () => {
            document.getElementById('importDnsFile').click();
        });
        document.getElementById('importDnsFile').addEventListener('change', event => {
            const [file] = event.target.files || [];
            if (file) this.importDnsProfiles(file);
            event.target.value = '';
        });

        // Copy DNS button
        document.getElementById('copyDNS').addEventListener('click', () => {
            this.copyDNSToClipboard();
        });

        // Add click handler for status indicator to show detailed info
        document.getElementById('statusIndicator').addEventListener('click', () => {
            this.showDetailedDNSInfo();
        });

        // Input validation
        document.getElementById('primaryDNS').addEventListener('input', this.validateIPAddress);
        document.getElementById('secondaryDNS').addEventListener('input', this.validateIPAddress);

        // Language selector
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const language = e.target.closest('.lang-btn').dataset.lang;
                if (language) {
                    await this.changeLanguage(language);
                    this.updatePrivacyPolicyLink(language);
                    this.updateTermsOfServiceLink(language);
                }
            });
        });

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTheme(btn.dataset.theme);
            });
        });

        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local' && changes.theme) {
                this.applyTheme(changes.theme.newValue);
            }
        });
    }

    async loadThemePreference() {
        try {
            const { theme } = await chrome.storage.local.get(['theme']);
            this.applyTheme(['system', 'light', 'dark'].includes(theme) ? theme : 'system');
        } catch (error) {
            console.error('Could not load appearance preference:', error);
            this.applyTheme('system');
        }
    }

    setupNetworkMonitor() {
        const connection = navigator.connection;
        const refreshButton = document.getElementById('refreshNetworkMetrics');
        refreshButton.addEventListener('click', () => this.updateNetworkMetrics(connection));
        this.updateNetworkMetrics(connection);
        connection?.addEventListener('change', () => this.updateNetworkMetrics(connection));
    }

    updateNetworkMetrics(connection = navigator.connection) {
        const getText = key => window.i18n && window.i18n.isReady()
            ? window.i18n.getText(`popup.network.${key}`)
            : key;
        const unavailable = getText('notAvailable');
        const rtt = Number(connection?.rtt);
        const downlink = Number(connection?.downlink);
        const effectiveType = connection?.effectiveType || connection?.type;

        document.getElementById('networkRtt').textContent = Number.isFinite(rtt) && rtt > 0
            ? `~${Math.round(rtt)} ms`
            : unavailable;
        document.getElementById('networkDownlink').textContent = Number.isFinite(downlink) && downlink > 0
            ? `~${downlink.toFixed(1)} Mbps`
            : unavailable;
        document.getElementById('networkType').textContent = effectiveType || unavailable;
    }

    getText(key, fallback = key) {
        if (!window.i18n || !window.i18n.isReady()) return fallback;
        const value = window.i18n.getText(key);
        return value === key ? fallback : value;
    }

    setIcon(element, name) {
        const paths = {
            standard: '<circle cx="12" cy="12" r="9"></circle><path d="M3.5 12h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path>',
            security: '<path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z"></path><path d="m8.5 12 2.2 2.2 4.8-5"></path>',
            ads: '<circle cx="12" cy="12" r="9"></circle><path d="m8.5 8.5 7 7M15.5 8.5l-7 7"></path>',
            family: '<circle cx="9" cy="8" r="3"></circle><circle cx="17" cy="9" r="2.3"></circle><path d="M3.5 19a5.5 5.5 0 0 1 11 0m1-4.5a4.5 4.5 0 0 1 5 4.5"></path>',
            adult: '<circle cx="12" cy="12" r="9"></circle><path d="M8 10h.01M16 10h.01M8 15c1.1-1.3 2.4-2 4-2s2.9.7 4 2"></path>',
            unfiltered: '<circle cx="12" cy="12" r="9"></circle><path d="M7 12h10"></path>',
            uncensored: '<path d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6Z"></path><circle cx="12" cy="12" r="2.5"></circle>',
            custom: '<path d="M4 7h9m4 0h3M4 17h3m4 0h9"></path><circle cx="15" cy="7" r="2"></circle><circle cx="9" cy="17" r="2"></circle>',
            favorite: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path>',
            edit: '<path d="m14 5 5 5M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"></path>',
            delete: '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"></path>',
            copy: '<rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path>'
        };
        element.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.custom}</svg>`;
    }

    getPresetName(preset) {
        const key = `dns.presets.${preset.nameKey}.name`;
        return this.getText(key, preset.nameKey);
    }

    getPresetMetadata(preset, isCustom = false) {
        const metadata = !isCustom && PRESET_METADATA[preset.nameKey];
        return {
            category: metadata?.category || 'custom',
            source: metadata?.source || '',
            doh: metadata?.doh || '',
            reviewed: metadata ? PRESET_METADATA_REVIEWED : ''
        };
    }

    trackPresetComparison(id, checked) {
        if (checked && this.selectedPresetIds.size >= 3) {
            const checkbox = [...document.querySelectorAll('[data-compare-id]')].find(input => input.dataset.compareId === id);
            if (checkbox) checkbox.checked = false;
            this.showNotification(this.getText('notifications.errors.compareLimit', 'You can compare up to 3 profiles at a time.'), 'info');
            return;
        }
        if (checked) this.selectedPresetIds.add(id);
        else this.selectedPresetIds.delete(id);
        this.updateCompareButton();
        this.applyPresetFilters();
        if (!document.getElementById('presetComparison').hidden) this.renderPresetComparison();
    }

    updateCompareButton() {
        const button = document.getElementById('compareSelectedPresets');
        if (button) {
            button.textContent = `${this.getText('dns.discovery.compare', 'Compare selected')} (${this.selectedPresetIds.size}/3)`;
        }
    }

    applyPresetFilters() {
        const query = document.getElementById('presetSearch')?.value.trim().toLocaleLowerCase() || '';
        const category = document.getElementById('presetCategory')?.value || 'all';
        const favoritesOnly = document.getElementById('favoritesOnly')?.checked || false;
        let visibleCount = 0;

        document.querySelectorAll('#readyDnsGrid > .ready-preset-container, #readyDnsGrid > .custom-preset-container').forEach(container => {
            const isCustom = container.classList.contains('custom-preset-container');
            const name = container.querySelector('.preset-name')?.textContent || '';
            const servers = container.querySelector('.preset-servers')?.textContent || '';
            const profileCategory = container.dataset.category || (isCustom ? 'custom' : 'standard');
            const isFavorite = container.dataset.favorite === 'true';
            const haystack = `${name} ${servers} ${profileCategory}`.toLocaleLowerCase();
            const matches = (category === 'all' || profileCategory === category)
                && (!favoritesOnly || isFavorite)
                && (!query || haystack.includes(query));
            container.hidden = !matches;
            if (matches) visibleCount++;
        });

        const emptyState = document.getElementById('presetEmptyState');
        if (emptyState) emptyState.hidden = visibleCount > 0;
    }

    renderPresetComparison() {
        const content = document.getElementById('presetComparisonContent');
        if (!content) return;
        content.replaceChildren();

        const selected = [];
        this.readyDnsPresets.forEach(preset => {
            if (this.selectedPresetIds.has(`ready:${preset.timestamp}`)) {
                selected.push({ id: `ready:${preset.timestamp}`, preset, isCustom: false });
            }
        });
        this.savedConfigs.forEach(preset => {
            if (this.selectedPresetIds.has(`saved:${preset.timestamp}`)) {
                selected.push({ id: `saved:${preset.timestamp}`, preset, isCustom: true });
            }
        });

        if (selected.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'comparison-empty';
            empty.textContent = this.getText('dns.discovery.comparisonEmpty', 'Select up to 3 profiles using the comparison checkboxes.');
            content.appendChild(empty);
            return;
        }

        const table = document.createElement('table');
        table.className = 'comparison-table';
        const head = document.createElement('thead');
        const headRow = document.createElement('tr');
        const blankHeader = document.createElement('th');
        blankHeader.scope = 'col';
        headRow.appendChild(blankHeader);
        selected.forEach(item => {
            const header = document.createElement('th');
            header.scope = 'col';
            header.textContent = item.isCustom ? item.preset.name : this.getPresetName(item.preset);
            headRow.appendChild(header);
        });
        head.appendChild(headRow);

        const rows = [
            { label: 'comparisonCategory', value: item => this.getText(`dns.discovery.categories.${this.getPresetMetadata(item.preset, item.isCustom).category}`) },
            { label: 'comparisonServers', value: item => `${item.preset.primary}${item.preset.secondary ? `, ${item.preset.secondary}` : ''}` },
            { label: 'comparisonDoH', value: item => this.getPresetMetadata(item.preset, item.isCustom).doh || this.getText('dns.discovery.noDoh') },
            { label: 'comparisonSource', value: item => this.getPresetMetadata(item.preset, item.isCustom).source }
        ];
        const body = document.createElement('tbody');
        rows.forEach(row => {
            const tr = document.createElement('tr');
            const label = document.createElement('th');
            label.scope = 'row';
            label.textContent = this.getText(`dns.discovery.${row.label}`);
            tr.appendChild(label);
            selected.forEach(item => {
                const cell = document.createElement('td');
                const metadata = this.getPresetMetadata(item.preset, item.isCustom);
                const value = row.value(item);
                if (row.label === 'comparisonDoH' && metadata.doh) {
                    const link = document.createElement('a');
                    link.href = metadata.doh;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = metadata.doh;
                    cell.appendChild(link);
                } else if (row.label === 'comparisonSource' && metadata.source) {
                    const link = document.createElement('a');
                    link.href = metadata.source;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = this.getText('dns.discovery.source');
                    cell.appendChild(link);
                } else {
                    cell.textContent = value || this.getText('dns.discovery.sourceUnavailable');
                }
                tr.appendChild(cell);
            });
            body.appendChild(tr);
        });
        table.append(head, body);
        content.appendChild(table);
    }

    async setTheme(theme) {
        if (!['system', 'light', 'dark'].includes(theme)) {
            return;
        }

        try {
            this.applyTheme(theme);
            await chrome.storage.local.set({ theme });
        } catch (error) {
            console.error('Could not save appearance preference:', error);
            const message = window.i18n && window.i18n.isReady()
                ? window.i18n.getText('notifications.errors.themeStorage')
                : 'Could not save appearance preference';
            this.showNotification(message, 'error');
        }
    }

    applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        document.querySelectorAll('.theme-btn').forEach(btn => {
            const isSelected = btn.dataset.theme === theme;
            btn.classList.toggle('active', isSelected);
            btn.setAttribute('aria-pressed', String(isSelected));
        });
    }

    validateIPAddress(e) {
        const input = e.target;
        const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        
        input.classList.toggle('is-invalid', Boolean(input.value && !ipPattern.test(input.value)));
    }

    async selectPreset(btn) {
        try {
            // Remove active class and check from all preset buttons
            document.querySelectorAll('.preset-btn').forEach(b => {
                b.classList.remove('active');
                const check = b.querySelector('.preset-check');
                if (check) check.style.display = 'none';
            });
        
            // Add active class and check to selected button
        btn.classList.add('active');
            const check = btn.querySelector('.preset-check');
            if (check) check.style.display = 'inline-block';
        
        // Set current configuration
        const dnsServers = btn.dataset.dns.split(',');
        this.currentConfig = {
            name: btn.dataset.name,
            primary: dnsServers[0],
            secondary: dnsServers[1] || '',
                isPreset: true,
                timestamp: Date.now()
            };
            
            console.log('Selected DNS config:', this.currentConfig);
            
            // Apply DNS configuration
            const response = await chrome.runtime.sendMessage({
                action: 'applyDNS',
                config: this.currentConfig
            });
            
            if (response && response.success) {
                await this.updateStatus();
                updateCurrentDnsBar();
                this.showNotification(`${window.i18n.getText('notifications.success.dnsApplied')} ${this.currentConfig.name}`, 'success');
            } else {
                this.showNotification('Failed to save DNS settings', 'error');
                this.highlightActivePreset();
            }
        } catch (error) {
            console.error('Error applying DNS:', error);
            this.showNotification('Error applying DNS settings', 'error');
        }
    }

    highlightActivePreset() {
        chrome.storage.local.get(['currentConfig', 'currentDNSConfig'], (result) => {
            console.log('Loading saved config for highlighting:', result);
            
            // Clear all active states first
            document.querySelectorAll('.preset-btn').forEach(b => {
                b.classList.remove('active');
                const check = b.querySelector('.preset-check');
                if (check) check.style.display = 'none';
            });
            
            // Get the current config (try both keys)
            const currentConfig = result.currentConfig || result.currentDNSConfig;
            
            if (!currentConfig || !currentConfig.primary) {
                console.log('No saved DNS config found');
                return;
            }
            
            console.log('Found saved config:', currentConfig);
            
            // Highlight the matching preset button
            document.querySelectorAll('.preset-btn').forEach(b => {
                const dnsServers = b.dataset.dns.split(',');
                if (dnsServers[0] === currentConfig.primary) {
                    b.classList.add('active');
                    const check = b.querySelector('.preset-check');
                    if (check) check.style.display = 'inline-block';
                    console.log('Highlighted preset:', b.dataset.name);
                }
            });
        });
    }

    async saveCustomDNS() {
        const primary = document.getElementById('primaryDNS').value.trim();
        const secondary = document.getElementById('secondaryDNS').value.trim();
        const name = document.getElementById('dnsName').value.trim();
        const saveButton = document.getElementById('saveCustom');

        if (!primary || !name) {
            this.showNotification(window.i18n.getText('notifications.errors.primaryRequired'), 'error');
            return;
        }

        if (!this.isValidIP(primary) || (secondary && !this.isValidIP(secondary))) {
            this.showNotification(window.i18n.getText('notifications.errors.invalidIP'), 'error');
            return;
        }

        // Check if we're editing a Ready DNS preset
        const editingReadyId = saveButton.getAttribute('data-editing-ready-id');
        if (editingReadyId) {
            const idx = this.readyDnsPresets.findIndex(p => p.timestamp.toString() === editingReadyId);
            if (idx !== -1) {
                // Update the Ready DNS preset
                this.readyDnsPresets[idx].primary = primary;
                this.readyDnsPresets[idx].secondary = secondary;
                this.readyDnsPresets[idx].nameKey = name; // For custom names, store as nameKey
                await this.saveReadyDnsPresets();
                this.renderReadyDnsPresets();
                // Clear editing state
                saveButton.removeAttribute('data-editing-ready-id');
                saveButton.textContent = window.i18n && window.i18n.isReady() ? 
                    window.i18n.getText('dns.custom.saveButton') || 'Save Custom DNS' : 'Save Custom DNS';
                document.getElementById('cancelEdit').style.display = 'none';
                this.showNotification('Ready DNS updated successfully', 'success');
            }
            // Clear form
            document.getElementById('primaryDNS').value = '';
            document.getElementById('secondaryDNS').value = '';
            document.getElementById('dnsName').value = '';
            return;
        }

        // Check if we're editing an existing configuration
        const editingConfigId = saveButton.getAttribute('data-editing-config-id');
        
        if (editingConfigId) {
            // Update existing configuration
            const existingIndex = this.savedConfigs.findIndex(c => c.timestamp.toString() === editingConfigId);
            if (existingIndex !== -1) {
                // Remove old version from preset grid
                const oldConfig = this.savedConfigs[existingIndex];
                this.removeCustomDNSFromPresetGrid(oldConfig);
                
                // Update the configuration
                this.savedConfigs[existingIndex] = {
                    name: name,
                    primary: primary,
                    secondary: secondary,
                    isPreset: false,
                    timestamp: parseInt(editingConfigId)
                };
                
                await this.saveConfigsToStorage();
                this.renderSavedConfigs();
                
                // Add updated version to preset grid
                this.addCustomDNSToPresetGrid(this.savedConfigs[existingIndex]);
                
                // Clear editing state
                saveButton.removeAttribute('data-editing-config-id');
                saveButton.textContent = window.i18n && window.i18n.isReady() ? 
                    window.i18n.getText('dns.custom.saveButton') || 'Save Custom DNS' : 'Save Custom DNS';
                
                // Hide cancel button
                document.getElementById('cancelEdit').style.display = 'none';
                
                this.showNotification('DNS configuration updated successfully', 'success');
            }
        } else {
            // Create new configuration
        const config = {
            name: name,
            primary: primary,
            secondary: secondary,
            isPreset: false,
            timestamp: Date.now()
        };

        this.savedConfigs.push(config);
        await this.saveConfigsToStorage();
        this.renderSavedConfigs();
            
            // Add custom DNS to preset grid
            this.addCustomDNSToPresetGrid(config);
            
            // Set as current configuration and apply it
            this.currentConfig = config;
            
            // Apply the custom DNS configuration
            try {
                const response = await chrome.runtime.sendMessage({
                    action: 'applyDNS',
                    config: config
                });
                
                if (response && response.success) {
                    await this.updateStatus();
                    updateCurrentDnsBar();
                    this.showNotification(`${window.i18n.getText('notifications.success.dnsApplied')} ${config.name}`, 'success');
                } else {
                    this.showNotification('Failed to apply custom DNS settings', 'error');
                }
            } catch (error) {
                console.error('Error applying custom DNS:', error);
                this.showNotification('Error applying custom DNS settings', 'error');
            }
        }
        
        // Clear inputs
        document.getElementById('primaryDNS').value = '';
        document.getElementById('secondaryDNS').value = '';
        document.getElementById('dnsName').value = '';
    }

    addCustomDNSToPresetGrid(config) {
        const presetGrid = document.querySelector('.preset-grid');
        if (!presetGrid) {
            return;
        }

        // Create custom DNS container
        const customContainer = document.createElement('div');
        customContainer.className = 'custom-preset-container';
        customContainer.setAttribute('data-config-id', config.timestamp.toString());
        customContainer.dataset.category = 'custom';

        // Create custom DNS button
        const customButton = document.createElement('button');
        customButton.className = 'preset-btn custom-preset';
        customButton.setAttribute('data-dns', `${config.primary}${config.secondary ? ',' + config.secondary : ''}`);
        customButton.setAttribute('data-name', config.name);
        customButton.setAttribute('data-preset', 'custom');
        customButton.setAttribute('data-config-id', config.timestamp.toString());

        const presetIcon = document.createElement('div');
        presetIcon.className = 'preset-icon';
        this.setIcon(presetIcon, 'custom');
        const presetInfo = document.createElement('div');
        presetInfo.className = 'preset-info';
        const presetName = document.createElement('div');
        presetName.className = 'preset-name';
        presetName.textContent = config.name;
        const presetServers = document.createElement('div');
        presetServers.className = 'preset-servers ltr-text';
        presetServers.textContent = `${config.primary}${config.secondary ? ', ' + config.secondary : ''}`;
        const customLabel = document.createElement('div');
        customLabel.className = 'custom-label';
        customLabel.textContent = window.i18n && window.i18n.isReady()
            ? window.i18n.getText('dns.custom.customLabel') || 'Custom'
            : 'Custom';
        const presetCheck = document.createElement('span');
        presetCheck.className = 'preset-check';
        presetCheck.style.display = 'none';
        presetCheck.textContent = '✔️';
        presetInfo.append(presetName, presetServers, customLabel);
        customButton.append(presetIcon, presetInfo, presetCheck);

        // Add event listener for selection
        customButton.addEventListener('click', async (e) => {
            await this.selectPreset(customButton);
        });

        // Create action buttons container
        const actionButtons = document.createElement('div');
        actionButtons.className = 'custom-preset-actions';
        const editButton = document.createElement('button');
        editButton.className = 'edit-custom-btn';
        editButton.title = 'Edit DNS';
        editButton.dataset.configId = config.timestamp.toString();
        editButton.textContent = '✏️';
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-custom-btn';
        deleteButton.title = 'Delete DNS';
        deleteButton.dataset.configId = config.timestamp.toString();
        deleteButton.textContent = '🗑️';
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-dns-btn';
        copyButton.title = window.i18n && window.i18n.isReady()
            ? window.i18n.getText('dns.copyButton')
            : 'Copy DNS';
        copyButton.dataset.dns = `${config.primary}${config.secondary ? ',' + config.secondary : ''}`;
        this.setIcon(editButton, 'edit');
        this.setIcon(deleteButton, 'delete');
        this.setIcon(copyButton, 'copy');

        const compareLabel = document.createElement('label');
        compareLabel.className = 'compare-checkbox';
        const compareInput = document.createElement('input');
        compareInput.type = 'checkbox';
        compareInput.dataset.compareId = `saved:${config.timestamp}`;
        compareInput.setAttribute('aria-label', this.getText('dns.discovery.selectForCompare', 'Select to compare'));
        compareInput.checked = this.selectedPresetIds.has(compareInput.dataset.compareId);
        compareInput.addEventListener('change', () => this.trackPresetComparison(compareInput.dataset.compareId, compareInput.checked));
        compareLabel.appendChild(compareInput);
        actionButtons.append(editButton, deleteButton, copyButton, compareLabel);

        // Add event listeners for action buttons
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editCustomDNS(config);
        });

        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteCustomDNS(config);
        });

        // Add event listener for copy button
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.copyDnsToClipboardCustom(config.primary, config.secondary);
        });

        // Add button and actions to container
        customContainer.appendChild(customButton);
        customContainer.appendChild(actionButtons);

        // Add to preset grid
        presetGrid.appendChild(customContainer);
        this.applyPresetFilters();
    }

    editCustomDNS(config) {
        // Fill the custom DNS form with existing data
        document.getElementById('primaryDNS').value = config.primary;
        document.getElementById('secondaryDNS').value = config.secondary || '';
        document.getElementById('dnsName').value = config.name;
        
        // Change save button text to indicate editing
        const saveButton = document.getElementById('saveCustom');
        saveButton.textContent = window.i18n && window.i18n.isReady() ? 
            window.i18n.getText('dns.custom.updateButton') || 'Update DNS' : 'Update DNS';
        
        // Store the config being edited
        saveButton.setAttribute('data-editing-config-id', config.timestamp.toString());
        
        // Show cancel button
        document.getElementById('cancelEdit').style.display = 'inline-block';
        
        // Scroll to custom DNS section
        document.querySelector('.custom-dns').scrollIntoView({ behavior: 'smooth' });
        
        this.showNotification('DNS configuration loaded for editing', 'info');
    }

    async deleteCustomDNS(config) {
        if (confirm('Are you sure you want to delete this DNS configuration?')) {
            // Find and remove from saved configs
            const index = this.savedConfigs.findIndex(c => c.timestamp === config.timestamp);
            if (index !== -1) {
                this.savedConfigs.splice(index, 1);
                await this.saveConfigsToStorage();
                this.renderSavedConfigs();
                
                // Remove from preset grid
                this.removeCustomDNSFromPresetGrid(config);
                
                this.showNotification('DNS configuration deleted successfully', 'success');
            }
        }
    }

    cancelEdit() {
        // Clear form inputs
        document.getElementById('primaryDNS').value = '';
        document.getElementById('secondaryDNS').value = '';
        document.getElementById('dnsName').value = '';
        
        // Reset save button
        const saveButton = document.getElementById('saveCustom');
        saveButton.removeAttribute('data-editing-config-id');
        saveButton.textContent = window.i18n && window.i18n.isReady() ? 
            window.i18n.getText('dns.custom.saveButton') || 'Save Custom DNS' : 'Save Custom DNS';
        
        // Hide cancel button
        document.getElementById('cancelEdit').style.display = 'none';
        
        this.showNotification(window.i18n && window.i18n.isReady() ? 
            window.i18n.getText('notifications.success.editCancelled') || 'Edit mode cancelled' : 'Edit mode cancelled', 'info');
    }

    loadCustomDNSPresets() {
        // Load saved custom DNS configurations and add them to preset grid
        this.savedConfigs.forEach(config => {
            this.addCustomDNSToPresetGrid(config);
        });
    }

    refreshCustomDNSPresets() {
        // Remove all existing custom DNS containers
        const presetGrid = document.querySelector('.preset-grid');
        if (!presetGrid) return;

        const customContainers = presetGrid.querySelectorAll('.custom-preset-container');
        customContainers.forEach(container => {
            container.remove();
        });

        // Re-add all custom DNS configurations with updated labels
        this.savedConfigs.forEach(config => {
            this.addCustomDNSToPresetGrid(config);
        });
    }

    isValidIP(ip) {
        const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!ipPattern.test(ip)) return false;
        
        const parts = ip.split('.');
        return parts.every(part => {
            const num = parseInt(part);
            return num >= 0 && num <= 255;
        });
    }

    async loadSavedConfigs() {
        try {
            const result = await chrome.storage.local.get(['savedConfigs', 'currentConfig']);
            this.savedConfigs = result.savedConfigs || [];
            this.currentConfig = result.currentConfig || null;
        } catch (error) {
            console.error('Error loading saved configurations:', error);
        }
    }

    async saveConfigsToStorage() {
        try {
            await chrome.storage.local.set({
                savedConfigs: this.savedConfigs,
                currentConfig: this.currentConfig
            });
        } catch (error) {
            console.error('Error saving configurations:', error);
        }
    }

    async exportDnsProfiles() {
        if (!this.savedConfigs.length) {
            this.showNotification(this.getText('dns.backup.noProfiles'), 'info');
            return;
        }

        try {
            const backup = {
                format: 'chrome-dns-manager-profiles',
                schemaVersion: 1,
                exportedAt: new Date().toISOString(),
                profiles: this.savedConfigs.map(({ name, primary, secondary }) => ({ name, primary, secondary: secondary || '' }))
            };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `dns-profiles-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
            this.showNotification(this.getText('dns.backup.exported'), 'success');
        } catch (error) {
            console.error('Could not export DNS profiles:', error);
            this.showNotification(this.getText('notifications.errors.backupFailed', 'Could not read or save the profile backup.'), 'error');
        }
    }

    async importDnsProfiles(file) {
        const maxBytes = 1024 * 1024;
        if (file.size > maxBytes) {
            this.showNotification(this.getText('dns.backup.tooLarge'), 'error');
            return;
        }

        let backup;
        try {
            backup = JSON.parse(await file.text());
        } catch (error) {
            console.error('Could not read DNS profile backup:', error);
            this.showNotification(this.getText('dns.backup.invalidFile'), 'error');
            return;
        }

        if (backup?.format !== 'chrome-dns-manager-profiles'
                || backup.schemaVersion !== 1
                || !Array.isArray(backup.profiles)
                || backup.profiles.length === 0
                || backup.profiles.length > 100) {
            this.showNotification(this.getText('dns.backup.invalidFile'), 'error');
            return;
        }

        const imported = [];
        for (const entry of backup.profiles) {
            if (!entry || typeof entry.name !== 'string'
                || typeof entry.primary !== 'string'
                || (entry.secondary !== undefined && typeof entry.secondary !== 'string')) {
                this.showNotification(this.getText('dns.backup.invalidFile'), 'error');
                return;
            }
            const name = entry.name.trim();
            const primary = entry.primary.trim();
            const secondary = (entry.secondary || '').trim();
            if (!name || name.length > 64 || !this.isValidIP(primary)
                || (secondary && !this.isValidIP(secondary))) {
                this.showNotification(this.getText('dns.backup.invalidFile'), 'error');
                return;
            }
            imported.push({ name, primary, secondary, isPreset: false });
        }

        const existingKeys = new Set(this.savedConfigs.map(config =>
            `${config.name.trim().toLocaleLowerCase()}|${config.primary}|${config.secondary || ''}`
        ));
        const newProfiles = imported.filter(profile => {
            const key = `${profile.name.toLocaleLowerCase()}|${profile.primary}|${profile.secondary}`;
            if (existingKeys.has(key)) return false;
            existingKeys.add(key);
            return true;
        });
        if (!newProfiles.length) {
            this.showNotification(this.getText('dns.backup.noNewProfiles'), 'info');
            return;
        }

        const usedIds = new Set(this.savedConfigs.map(config => String(config.timestamp)));
        newProfiles.forEach((profile, index) => {
            let timestamp = Date.now() + index;
            while (usedIds.has(String(timestamp))) timestamp++;
            usedIds.add(String(timestamp));
            profile.timestamp = timestamp;
        });
        try {
            const nextConfigs = [...this.savedConfigs, ...newProfiles];
            await chrome.storage.local.set({ savedConfigs: nextConfigs });
            this.savedConfigs = nextConfigs;
            this.renderSavedConfigs();
            this.refreshCustomDNSPresets();
            this.showNotification(this.getText('dns.backup.imported'), 'success');
        } catch (error) {
            console.error('Could not import DNS profiles:', error);
            this.showNotification(this.getText('notifications.errors.backupFailed', 'Could not read or save the profile backup.'), 'error');
        }
    }

    renderSavedConfigs() {
        const container = document.getElementById('savedConfigsList');
        container.replaceChildren();

        if (this.savedConfigs.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-saved-configs';
            emptyMessage.textContent = window.i18n.getText('dns.saved.noSettings');
            container.appendChild(emptyMessage);
            return;
        }

        this.savedConfigs.forEach((config, index) => {
            const configElement = document.createElement('div');
            configElement.className = 'saved-config-item';
            const configInfo = document.createElement('div');
            configInfo.className = 'saved-config-info';
            const configName = document.createElement('div');
            configName.className = 'saved-config-name';
            configName.textContent = config.name;
            const configServers = document.createElement('div');
            configServers.className = 'saved-config-servers';
            configServers.textContent = `${config.primary}${config.secondary ? ', ' + config.secondary : ''}`;
            configInfo.append(configName, configServers);

            const configActions = document.createElement('div');
            configActions.className = 'saved-config-actions';
            const applyButton = document.createElement('button');
            applyButton.className = 'apply-btn';
            applyButton.dataset.index = index;
            applyButton.textContent = window.i18n.getText('dns.saved.apply');
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.dataset.index = index;
            deleteButton.textContent = window.i18n.getText('dns.saved.delete');
            configActions.append(applyButton, deleteButton);
            configElement.append(configInfo, configActions);

            // Add event listeners
            applyButton.addEventListener('click', async () => {
                await this.applySavedConfig(index);
            });
            
            deleteButton.addEventListener('click', async () => {
                await this.deleteSavedConfig(index);
            });

            container.appendChild(configElement);
        });
    }

    async applySavedConfig(index) {
        const config = this.savedConfigs[index];
        this.currentConfig = { ...config };
        
        // Apply DNS
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'applyDNS',
                config: this.currentConfig
            });
            
            if (response && response.success) {
                await this.updateStatus();
                await this.saveConfigsToStorage();
                // Update the current DNS bar
                updateCurrentDnsBar();
                this.showNotification(`${window.i18n.getText('notifications.success.dnsApplied')} ${config.name}`, 'success');
            } else {
                this.showNotification('Failed to save DNS configuration', 'error');
                await this.loadCurrentConfigFromStorage();
            }
        } catch (error) {
            console.error('Error applying DNS:', error);
            this.showNotification('Error applying DNS settings', 'error');
            await this.loadCurrentConfigFromStorage();
        }
    }

    async deleteSavedConfig(index) {
        const deletedConfig = this.savedConfigs[index];
        this.savedConfigs.splice(index, 1);
        await this.saveConfigsToStorage();
        this.renderSavedConfigs();
        
        // Remove custom DNS from preset grid
        this.removeCustomDNSFromPresetGrid(deletedConfig);
        
        this.showNotification(window.i18n.getText('notifications.success.settingsDeleted'), 'success');
    }

    removeCustomDNSFromPresetGrid(config) {
        const presetGrid = document.querySelector('.preset-grid');
        if (!presetGrid) return;

        // Find and remove the custom DNS container
        const customContainers = presetGrid.querySelectorAll('.custom-preset-container');
        customContainers.forEach(container => {
            if (container.getAttribute('data-config-id') === config.timestamp.toString()) {
                container.remove();
            }
        });
        this.selectedPresetIds.delete(`saved:${config.timestamp}`);
        this.updateCompareButton();
        this.applyPresetFilters();
        if (!document.getElementById('presetComparison').hidden) this.renderPresetComparison();
    }

    async applyCurrentDNS() {
        if (!this.currentConfig) {
            this.showNotification(window.i18n.getText('notifications.errors.noConfig'), 'error');
            return;
        }

        try {
            this.showNotification('Saving DNS profile...', 'info');
            
            // Send message to background script to apply DNS
            const response = await chrome.runtime.sendMessage({
                action: 'applyDNS',
                config: this.currentConfig
            });

            if (response.success) {
                await this.updateStatus();
                // Update the current DNS bar
                updateCurrentDnsBar();
                this.showNotification(`${window.i18n.getText('notifications.success.dnsApplied')} ${this.currentConfig.name}`, 'success');
            } else {
                this.showNotification('Failed to save DNS configuration', 'error');
            }
        } catch (error) {
            console.error('Error applying DNS:', error);
            this.showNotification('Error applying DNS settings', 'error');
        }
    }

    async resetToDefault() {
        try {
            this.showNotification('Clearing selected DNS profile...', 'info');
            
            const response = await chrome.runtime.sendMessage({
                action: 'resetDNS'
            });

            if (response.success) {
                this.currentConfig = null;
                
                await this.updateStatus();
                // Update the current DNS bar
                updateCurrentDnsBar();
                // Clear active selections
                document.querySelectorAll('.preset-btn').forEach(b => {
                    b.classList.remove('active');
                    const check = b.querySelector('.preset-check');
                    if (check) check.style.display = 'none';
                });
                this.showNotification(window.i18n.getText('notifications.success.resetDefault'), 'success');
            } else {
                this.showNotification('Failed to clear selected DNS profile', 'error');
            }
        } catch (error) {
            console.error('Error resetting DNS:', error);
            this.showNotification('Error clearing selected DNS profile', 'error');
        }
    }

    async updateStatus() {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = statusIndicator.querySelector('.status-text');
        const statusDot = statusIndicator.querySelector('.status-dot');

        try {
            // First try to get status from background
            const response = await chrome.runtime.sendMessage({
                action: 'getCurrentConfig'
            });

            if (response.success) {
                const { config, status } = response;
                
                if (config && status.isActive) {
                    statusText.textContent = `${config.name} (${window.i18n.getText('popup.status.profileSelected')})`;
            statusDot.style.background = '#28a745';
                    console.log('DNS profile is selected:', config.name);
                } else if (config && !status.isActive) {
                    statusText.textContent = `${config.name} (Not Active)`;
                    statusDot.style.background = '#ffc107';
                    console.log('DNS selected but not active:', config.name);
        } else {
                    // Fallback to storage check
                    await this.loadStatusFromStorage(statusText, statusDot);
                }
            } else {
                // Fallback to storage check
                await this.loadStatusFromStorage(statusText, statusDot);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            // Fallback to storage check
            await this.loadStatusFromStorage(statusText, statusDot);
        }
    }

    async loadStatusFromStorage(statusText, statusDot) {
        try {
            const result = await chrome.storage.local.get(['currentConfig', 'currentDNSConfig']);
            console.log('Loading status from storage:', result);
            
            const config = result.currentConfig || result.currentDNSConfig;
            
            if (config && config.primary) {
                statusText.textContent = `${config.name} (${window.i18n.getText('popup.status.profileSelected')})`;
            statusDot.style.background = '#28a745';
                console.log('DNS profile found in storage:', config.name);
                
                // Update current config in memory
                this.currentConfig = config;
        } else {
                statusText.textContent = window.i18n.getText('popup.status.default');
            statusDot.style.background = '#6c757d';
                console.log('No DNS configuration in storage');
                this.currentConfig = null;
            }
        } catch (error) {
            console.error('Error loading status from storage:', error);
            statusText.textContent = window.i18n.getText('popup.status.default');
            statusDot.style.background = '#6c757d';
        }
    }

    // Force refresh DNS status
    async refreshDNSStatus() {
        try {
            this.showNotification('Refreshing DNS status...', 'info');
            await this.updateStatus();
            updateCurrentDnsBar();
            this.showNotification('DNS status refreshed', 'success');
        } catch (error) {
            console.error('Error refreshing DNS status:', error);
            this.showNotification('Error refreshing DNS status', 'error');
        }
    }

    async testDNSConnection() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'testDNS',
                dnsServer: this.currentConfig && this.currentConfig.primary
            });

            if (response.supported === false) {
                this.showNotification(window.i18n.getText('notifications.info.dnsTestUnavailable'), 'info');
            } else {
                this.showNotification(window.i18n.getText('notifications.info.dnsTestUnavailable'), 'info');
            }
        } catch (error) {
            console.error('Error testing DNS connection:', error);
            this.showNotification('Error testing DNS connection', 'error');
        }
    }

    // Check if DNS is actually working
    async checkDNSStatus() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getCurrentConfig'
            });

            if (response.success) {
                const { config, status } = response;
                
                if (config && status.isActive) {
                    return { connected: true, config: config.name };
                } else if (config && !status.isActive) {
                    return { connected: false, config: config.name, reason: 'DNS not active' };
                } else {
                    return { connected: false, config: null, reason: 'No configuration' };
                }
            }
            return { connected: false, config: null, reason: 'Error getting status' };
        } catch (error) {
            console.error('Error checking DNS status:', error);
            return { connected: false, config: null, reason: 'Error' };
        }
    }

    // Check whether a profile is selected; the extension cannot inspect active DNS settings.
    async checkDNSConnection() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getCurrentConfig'
            });

            if (response.success) {
                const { config, status } = response;
                
                if (config && status.isActive) {
                    this.showNotification(`${window.i18n.getText('popup.status.connected')} ${config.name} (${config.primary})`, 'info');
                    return true;
                } else {
                    this.showNotification(window.i18n.getText('popup.status.noConnection'), 'info');
                    return false;
                }
            } else {
                this.showNotification('Error checking DNS connection', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error checking DNS connection:', error);
            this.showNotification('Error checking DNS connection', 'error');
            return false;
        }
    }

    // Show detailed DNS information
    async showDetailedDNSInfo() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getCurrentConfig'
            });

            if (response.success) {
                const { config, status } = response;
                
                let message = 'DNS Status Details:\n';
                message += `Selected profile: ${config ? config.name : 'None'}\n`;
                message += `DNS changed by extension: No\n`;
                message += `Mode: ${status.mode}\n`;
                
                this.showNotification(message, 'info');
            } else {
                this.showNotification('Error getting DNS details', 'error');
            }
        } catch (error) {
            console.error('Error showing DNS details:', error);
            this.showNotification('Error showing DNS details', 'error');
        }
    }

    async changeLanguage(language) {
        try {
            // Check if i18n is available and ready
            if (!window.i18n) {
                throw new Error('i18n not initialized');
            }
            
            if (!window.i18n.isReady()) {
                throw new Error('Translations not loaded');
            }

            // Remove active class and check from all language buttons
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
                const check = btn.querySelector('.lang-check');
                if (check) {
                    check.style.display = 'none';
                    check.style.opacity = '0';
                }
            });
            
            // Add active class and check to selected button
            const selectedBtn = document.querySelector(`[data-lang="${language}"]`);
            if (selectedBtn) {
                selectedBtn.classList.add('active');
                selectedBtn.setAttribute('aria-pressed', 'true');
                const check = selectedBtn.querySelector('.lang-check');
                if (check) {
                    check.style.display = 'flex';
                    check.style.opacity = '1';
                }
            }

            // Set language in i18n
            await window.i18n.setLanguage(language);
            this.updateNetworkMetrics();

            // Update DNS presets visibility
            this.updateDNSPresetsVisibility();

            // Update notification message based on language
            let message;
            switch(language) {
                case 'fa':
                    message = 'زبان به فارسی تغییر یافت';
                    break;
                case 'ar':
                    message = 'تم تغيير اللغة إلى العربية';
                    break;
                case 'zh':
                    message = '语言已更改为中文';
                    break;
                default:
                    message = 'Language changed to English';
            }
            this.showNotification(message, 'success');

            this.updateCopyDnsLabels();
            this.refreshCustomDNSPresets();
            this.renderReadyDnsPresets();
        } catch (error) {
            console.error('Error changing language:', error);
            
            // Revert button state
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
                const check = btn.querySelector('.lang-check');
                if (check) {
                    check.style.display = 'none';
                    check.style.opacity = '0';
                }
            });
            
            // Highlight current language
            const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
            const currentBtn = document.querySelector(`[data-lang="${currentLang}"]`);
            if (currentBtn) {
                currentBtn.classList.add('active');
                currentBtn.setAttribute('aria-pressed', 'true');
                const check = currentBtn.querySelector('.lang-check');
                if (check) {
                    check.style.display = 'flex';
                    check.style.opacity = '1';
                }
            }
            
            let errorMessage;
            switch(currentLang) {
                case 'fa':
                    errorMessage = 'خطا در تغییر زبان';
                    break;
                case 'ar':
                    errorMessage = 'خطأ في تغيير اللغة';
                    break;
                case 'zh':
                    errorMessage = '更改语言时出错';
                    break;
                default:
                    errorMessage = 'Error changing language';
            }
            this.showNotification(errorMessage, 'error');
        }
    }

    updateDNSPresetsVisibility() {
        if (!window.i18n || !window.i18n.isReady()) {
            return;
        }
        
        const isPersian = window.i18n.getCurrentLanguage() === 'fa';
        const persianOnlyButtons = document.querySelectorAll('.preset-btn.persian-only');
        
        persianOnlyButtons.forEach(btn => {
            if (isPersian) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    highlightCurrentPreset() {
        if (!this.currentConfig?.primary) return;
        document.querySelectorAll('.preset-btn').forEach(button => {
            const [primary, secondary = ''] = button.dataset.dns.split(',');
            const isActive = primary === this.currentConfig.primary
                && secondary === (this.currentConfig.secondary || '');
            button.classList.toggle('active', isActive);
            const check = button.querySelector('.preset-check');
            if (check) check.style.display = isActive ? 'inline-block' : 'none';
        });
    }

    highlightActiveLanguage() {
        if (!window.i18n || !window.i18n.isReady()) {
            return;
        }
        
        const currentLang = window.i18n.getCurrentLanguage();
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            const check = btn.querySelector('.lang-check');
            if (check) {
                check.style.display = 'none';
                check.style.opacity = '0';
            }
        });
        
        const activeBtn = document.querySelector(`[data-lang="${currentLang}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-pressed', 'true');
            const check = activeBtn.querySelector('.lang-check');
            if (check) {
                check.style.display = 'flex';
                check.style.opacity = '1';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Ensure notification container exists
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 12px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            pointer-events: auto;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-size: 14px;
            max-width: 320px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-weight: 600;
            letter-spacing: 0.3px;
            animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(135deg, #667eea, #764ba2);
            margin-bottom: 0;
            position: relative;
        `;
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
        // Add to container
        container.appendChild(notification);
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // Remove container if empty
                if (container.childElementCount === 0 && container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            }, 300);
        }, 3000);
    }

    async loadCurrentConfigFromStorage() {
        try {
            const result = await chrome.storage.local.get(['currentConfig', 'currentDNSConfig']);
            console.log('Loading current config from storage:', result);
            
            const config = result.currentConfig || result.currentDNSConfig;
            
            if (config && config.primary) {
                this.currentConfig = config;
                console.log('Current config loaded:', config.name);
            } else {
                this.currentConfig = null;
                console.log('No current config found in storage');
            }
        } catch (error) {
            console.error('Error loading current config from storage:', error);
            this.currentConfig = null;
        }
    }

    async copyDnsToClipboardCustom(primary, secondary) {
        const dnsText = primary; // Only copy the first (primary) DNS IP
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(dnsText);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = dnsText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            this.showNotification((window.i18n && window.i18n.isReady() ? window.i18n.getText('notifications.success.dnsCopied') : 'DNS address copied') + ': ' + dnsText, 'success');
            // Animate the copy button and label
            // Find the active preset-btn with this primary DNS
            const presetBtns = document.querySelectorAll('.preset-btn');
            presetBtns.forEach(btn => {
                const dns = btn.getAttribute('data-dns');
                if (dns && dns.split(',')[0].trim() === primary.trim()) {
                    const copyBtn = btn.querySelector('.copy-dns-btn');
                    const copyLabel = btn.querySelector('.copy-dns-label');
                    if (copyBtn) {
                        copyBtn.classList.add('copied');
                        setTimeout(() => copyBtn.classList.remove('copied'), 600);
                    }
                    if (copyLabel) {
                        copyLabel.classList.add('copied');
                        setTimeout(() => copyLabel.classList.remove('copied'), 600);
                    }
                }
            });
        } catch (error) {
            this.showNotification((window.i18n && window.i18n.isReady() ? window.i18n.getText('notifications.errors.copyFailed') : 'Failed to copy DNS'), 'error');
        }
    }

    updateCopyDnsLabels() {
        const labelText = window.i18n && window.i18n.isReady() ? window.i18n.getText('dns.copyLabel') : 'Copy DNS';
        document.querySelectorAll('.copy-dns-label').forEach(el => {
            el.textContent = labelText;
        });
    }

    async loadReadyDnsPresets() {
        const stored = await chrome.storage.local.get(['readyDnsPresets', 'readyDnsPresetVersion']);
        const hasStoredPresets = Array.isArray(stored.readyDnsPresets);

        this.readyDnsPresets = hasStoredPresets
            ? stored.readyDnsPresets
            : DEFAULT_READY_DNS_PRESETS.map(preset => ({ ...preset }));

        const storedVersion = Number.isInteger(stored.readyDnsPresetVersion)
            ? stored.readyDnsPresetVersion
            : 0;
        if (!hasStoredPresets || storedVersion < READY_DNS_PRESET_VERSION) {
            const existingNames = new Set(this.readyDnsPresets.map(preset => preset.nameKey));
            const missingPresets = DEFAULT_READY_DNS_PRESETS.filter(preset => !existingNames.has(preset.nameKey));
            this.readyDnsPresets.push(...missingPresets.map(preset => ({ ...preset })));
            await chrome.storage.local.set({
                readyDnsPresets: this.readyDnsPresets,
                readyDnsPresetVersion: READY_DNS_PRESET_VERSION
            });
        }
    }

    async saveReadyDnsPresets() {
        await chrome.storage.local.set({ readyDnsPresets: this.readyDnsPresets });
    }

    renderReadyDnsPresets() {
        const grid = document.getElementById('readyDnsGrid');
        if (!grid) return;
        grid.querySelectorAll('.ready-preset-container').forEach(container => container.remove());
        this.readyDnsPresets.forEach((preset, idx) => {
            const metadata = this.getPresetMetadata(preset);
            const categoryText = this.getText(`dns.discovery.categories.${metadata.category}`, metadata.category);
            const presetName = this.getPresetName(preset);

            // Create container
            const container = document.createElement('div');
            container.className = 'ready-preset-container';
            container.dataset.readyId = preset.timestamp;
            container.dataset.category = metadata.category;
            container.dataset.favorite = preset.favorite ? 'true' : 'false';

            // Create main button
            const btn = document.createElement('button');
            btn.className = 'preset-btn ready-preset';
            btn.setAttribute('data-dns', `${preset.primary}${preset.secondary ? ',' + preset.secondary : ''}`);
            btn.setAttribute('data-name', presetName);
            btn.setAttribute('data-preset', preset.nameKey);
            btn.setAttribute('data-ready-id', preset.timestamp);
            const presetIcon = document.createElement('div');
            presetIcon.className = 'preset-icon';
            this.setIcon(presetIcon, metadata.category);
            const presetInfo = document.createElement('div');
            presetInfo.className = 'preset-info';
            const nameElement = document.createElement('div');
            nameElement.className = 'preset-name';
            nameElement.textContent = presetName;
            const serversElement = document.createElement('div');
            serversElement.className = 'preset-servers ltr-text';
            serversElement.textContent = `${preset.primary}${preset.secondary ? ', ' + preset.secondary : ''}`;
            const readyLabel = document.createElement('div');
            readyLabel.className = 'ready-label';
            readyLabel.textContent = categoryText;
            const presetCheck = document.createElement('span');
            presetCheck.className = 'preset-check';
            presetCheck.style.display = 'none';
            presetCheck.textContent = '✔️';
            presetInfo.append(nameElement, serversElement, readyLabel);
            btn.append(presetIcon, presetInfo, presetCheck);
            // Select preset on click (not on action buttons)
            btn.addEventListener('click', async (e) => {
                if (e.target.closest('.ready-preset-actions')) return;
                await this.selectPreset(btn);
            });

            // Create action buttons container
            const actionButtons = document.createElement('div');
            actionButtons.className = 'ready-preset-actions custom-preset-actions';
            const favoriteButton = document.createElement('button');
            favoriteButton.className = 'favorite-toggle';
            favoriteButton.type = 'button';
            favoriteButton.setAttribute('aria-pressed', preset.favorite ? 'true' : 'false');
            favoriteButton.setAttribute('aria-label', this.getText(preset.favorite ? 'dns.discovery.removeFavorite' : 'dns.discovery.addFavorite'));
            favoriteButton.title = favoriteButton.getAttribute('aria-label');
            this.setIcon(favoriteButton, 'favorite');
            favoriteButton.addEventListener('click', async event => {
                event.stopPropagation();
                preset.favorite = !preset.favorite;
                await this.saveReadyDnsPresets();
                this.renderReadyDnsPresets();
            });

            const compareLabel = document.createElement('label');
            compareLabel.className = 'compare-checkbox';
            const compareInput = document.createElement('input');
            compareInput.type = 'checkbox';
            compareInput.dataset.compareId = `ready:${preset.timestamp}`;
            compareInput.setAttribute('aria-label', this.getText('dns.discovery.selectForCompare', 'Select to compare'));
            compareInput.checked = this.selectedPresetIds.has(compareInput.dataset.compareId);
            compareInput.addEventListener('change', () => this.trackPresetComparison(compareInput.dataset.compareId, compareInput.checked));
            compareLabel.appendChild(compareInput);

            const editButton = document.createElement('button');
            editButton.className = 'edit-custom-btn';
            editButton.title = 'Edit DNS';
            editButton.dataset.readyId = preset.timestamp;
            this.setIcon(editButton, 'edit');
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-custom-btn';
            deleteButton.title = 'Delete DNS';
            deleteButton.dataset.readyId = preset.timestamp;
            this.setIcon(deleteButton, 'delete');
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-dns-btn';
            copyButton.title = this.getText('dns.copyButton', 'Copy DNS');
            copyButton.dataset.dns = `${preset.primary}${preset.secondary ? ',' + preset.secondary : ''}`;
            this.setIcon(copyButton, 'copy');
            const copyLabel = document.createElement('span');
            copyLabel.className = 'copy-dns-label';
            copyLabel.dataset.i18n = 'dns.copyLabel';
            copyLabel.textContent = window.i18n && window.i18n.isReady()
                ? window.i18n.getText('dns.copyLabel')
                : 'Copy DNS';
            actionButtons.append(favoriteButton, compareLabel, editButton, deleteButton, copyButton, copyLabel);
            // Action listeners
            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editReadyDnsPreset(preset, idx);
            });
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteReadyDnsPreset(idx);
            });
            copyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyDnsToClipboardCustom(preset.primary, preset.secondary);
            });
            copyLabel.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyDnsToClipboardCustom(preset.primary, preset.secondary);
            });

            const metadataRow = document.createElement('div');
            metadataRow.className = 'preset-metadata';
            const dohBadge = document.createElement('span');
            dohBadge.className = metadata.doh ? 'preset-doh-badge' : 'preset-doh-badge unavailable';
            dohBadge.textContent = this.getText(metadata.doh ? 'dns.discovery.dohAvailable' : 'dns.discovery.noDoh');
            metadataRow.appendChild(dohBadge);

            const sourceRow = document.createElement('div');
            sourceRow.className = 'preset-source-row';
            if (metadata.source) {
                const sourceLink = document.createElement('a');
                sourceLink.href = metadata.source;
                sourceLink.target = '_blank';
                sourceLink.rel = 'noopener noreferrer';
                sourceLink.textContent = this.getText('dns.discovery.source');
                sourceLink.addEventListener('click', event => event.stopPropagation());
                sourceRow.appendChild(sourceLink);
            } else {
                const sourceText = document.createElement('span');
                sourceText.textContent = this.getText('dns.discovery.sourceUnavailable');
                sourceRow.appendChild(sourceText);
            }
            if (metadata.reviewed) {
                const reviewed = document.createElement('span');
                reviewed.textContent = `${this.getText('dns.discovery.lastReviewed')}: ${metadata.reviewed}`;
                sourceRow.appendChild(reviewed);
            }

            // Add to container
            container.appendChild(btn);
            container.append(metadataRow, sourceRow);
            container.appendChild(actionButtons);
            grid.appendChild(container);
        });
        this.updateCompareButton();
        this.applyPresetFilters();
        this.highlightCurrentPreset();
    }

    editReadyDnsPreset(preset, idx) {
        // Fill the custom DNS form with existing data for editing
        document.getElementById('primaryDNS').value = preset.primary;
        document.getElementById('secondaryDNS').value = preset.secondary || '';
        document.getElementById('dnsName').value = window.i18n && window.i18n.isReady() ? window.i18n.getText(`dns.presets.${preset.nameKey}.name`) : preset.nameKey;
        // Store editing state
        const saveButton = document.getElementById('saveCustom');
        saveButton.setAttribute('data-editing-ready-id', preset.timestamp);
        saveButton.textContent = window.i18n && window.i18n.isReady() ? window.i18n.getText('dns.custom.updateButton') || 'Update DNS' : 'Update DNS';
        document.getElementById('cancelEdit').style.display = 'inline-block';
        document.querySelector('.custom-dns').scrollIntoView({ behavior: 'smooth' });
        this.showNotification('Ready DNS loaded for editing', 'info');
    }

    async deleteReadyDnsPreset(idx) {
        if (confirm('Are you sure you want to delete this Ready DNS preset?')) {
            const [deleted] = this.readyDnsPresets.splice(idx, 1);
            if (deleted) this.selectedPresetIds.delete(`ready:${deleted.timestamp}`);
            await this.saveReadyDnsPresets();
            this.renderReadyDnsPresets();
            this.showNotification('Ready DNS deleted successfully', 'success');
        }
    }

    async copyDNSToClipboard() {
        // Get the currently active DNS config from storage
        chrome.storage.local.get(['currentConfig', 'currentDNSConfig'], (result) => {
            const config = result.currentConfig || result.currentDNSConfig;
            if (config && config.primary) {
                this.copyDnsToClipboardCustom(config.primary, config.secondary);
            } else {
                this.showNotification(
                    (window.i18n && window.i18n.isReady() ? window.i18n.getText('notifications.errors.noConfig') : 'No DNS selected to copy'),
                    'error'
                );
            }
        });
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
        }
    }
    
    @keyframes slideOut {
        from { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
        }
        to { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0; 
        }
    }
    
    .notification {
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-weight: 600;
        letter-spacing: 0.3px;
    }
`;
document.head.appendChild(style);

// Initialize the DNS Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
        window.dnsManager = new DNSManager();
        const openInTabBtn = document.getElementById('openInTab');
        if (openInTabBtn) {
            openInTabBtn.addEventListener('click', async () => {
                try {
                    await chrome.tabs.create({ url: chrome.runtime.getURL('popup.html?view=tab') });
                } catch (error) {
                    console.error('Could not open the settings tab:', error);
                    window.dnsManager?.showNotification('Could not open the settings tab', 'error');
                }
            });
        }
        
        // Update the current DNS bar on initialization
        updateCurrentDnsBar();

        // هر بار که DNS تغییر کند، نوار را به‌روزرسانی کن
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local' && changes.currentConfig) {
                if (window.dnsManager && typeof window.dnsManager.highlightActivePreset === 'function') {
                    window.dnsManager.highlightActivePreset();
                }
                updateCurrentDnsBar();
            }
        });
});

function updateCurrentDnsBar() {
    try {
        const currentDnsValue = document.getElementById('currentDnsValue');
        if (!currentDnsValue) {
            console.error('currentDnsValue element not found');
            return;
        }
        
        chrome.storage.local.get(['currentConfig', 'currentDNSConfig'], (result) => {
            console.log('Storage result for DNS bar:', result);
            
            // Try both storage keys
            const config = result.currentConfig || result.currentDNSConfig;
            console.log('Selected config for DNS bar:', config);
            
            if (!config || !config.primary) {
                // Check if i18n is ready, otherwise use fallback text
                if (window.i18n && window.i18n.isReady()) {
                    currentDnsValue.textContent = window.i18n.getText('popup.status.noConnection');
                } else {
                    currentDnsValue.textContent = 'No DNS profile selected';
                }
                console.log('No DNS config found, showing default');
            } else {
                currentDnsValue.textContent = `${config.primary} (profile only)`;
                console.log('DNS profile found:', config.primary);
            }
        });
    } catch (error) {
        console.error('Error updating current DNS bar:', error);
    }
}

// === Interactive DoH Poll Guide ===
function renderDohPollGuide(forceLang) {
    const guideDiv = document.getElementById('doh-poll-guide');
    if (!guideDiv) return;
    let lang = forceLang || (window.i18n && window.i18n.getCurrentLanguage && window.i18n.getCurrentLanguage()) || (navigator.language || 'en').split('-')[0];
    lang = ['en', 'fa', 'ar', 'zh'].includes(lang) ? lang : 'en';
    console.log('DoH Guide lang:', lang); // Debug log
    let t = window._i18n && window._i18n[lang] && window._i18n[lang].dohPoll;
    if (!t) t = window._i18n && window._i18n['en'] && window._i18n['en'].dohPoll;
    if (!t) return;
    const rtlLangs = ['fa', 'ar'];
    if (rtlLangs.includes(lang)) {
        guideDiv.setAttribute('dir', 'rtl');
    } else {
        guideDiv.setAttribute('dir', 'ltr');
    }
    let step = 0;
    guideDiv.innerHTML = '';
    // Add button to switch to direct DoH guide
    const switchBtn = document.createElement('button');
    switchBtn.className = 'doh-modern-switch';
    let switchLabel;
    if (lang === 'fa') switchLabel = 'راهنمای فعال‌سازی مستقیم DoH';
    else if (lang === 'ar') switchLabel = 'الدليل التفاعلي لـ DoH';
    else if (lang === 'zh') switchLabel = '直接启用 DoH 指南';
    else switchLabel = 'Direct DoH Activation Guide';
    switchBtn.innerHTML = `<span class='doh-modern-icon'>🔗</span> ${switchLabel}`;
    switchBtn.onclick = () => renderEnableDohGuide(lang);
    guideDiv.appendChild(switchBtn);
    function showStep() {
        guideDiv.innerHTML = '';
        guideDiv.appendChild(switchBtn);
        const card = document.createElement('div');
        card.className = 'doh-modern-card';
        // Progress bar
        const progress = document.createElement('div');
        progress.className = 'doh-modern-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'doh-modern-progress-bar';
        progressBar.style.width = `${(step === 0 ? 33 : step === 1 || step === 2 ? 66 : 100)}%`;
        progress.appendChild(progressBar);
        card.appendChild(progress);
        // Step indicator
        const stepIndicator = document.createElement('div');
        stepIndicator.className = 'doh-step-indicator';
        stepIndicator.textContent = `${step + 1}/4`;
        card.appendChild(stepIndicator);
        // Steps
        if (step === 0) {
            const q = document.createElement('div');
            q.className = 'doh-modern-step';
            q.innerHTML = `<span class='doh-modern-icon'>❓</span> ${t.q1}`;
            card.appendChild(q);
            const yesBtn = document.createElement('button');
            yesBtn.textContent = t.yes;
            yesBtn.className = 'doh-modern-btn';
            yesBtn.onclick = () => { step = 1; showStep(); };
            const noBtn = document.createElement('button');
            noBtn.textContent = t.no;
            noBtn.className = 'doh-modern-btn secondary';
            noBtn.onclick = () => { step = 2; showStep(); };
            card.appendChild(yesBtn);
            card.appendChild(noBtn);
        } else if (step === 1) {
            const q = document.createElement('div');
            q.className = 'doh-modern-step';
            q.innerHTML = `<span class='doh-modern-icon'>🔒</span> ${t.q2}`;
            card.appendChild(q);
            const showGuideBtn = document.createElement('button');
            showGuideBtn.textContent = t.showGuide;
            showGuideBtn.className = 'doh-modern-btn';
            showGuideBtn.onclick = () => { step = 3; showStep(); };
            card.appendChild(showGuideBtn);
            const openSettingsBtn = document.createElement('button');
            openSettingsBtn.textContent = t.openSettings;
            openSettingsBtn.className = 'doh-modern-btn secondary';
            openSettingsBtn.onclick = () => window.dohManager?.openSettings();
            card.appendChild(openSettingsBtn);
        } else if (step === 2) {
            const q = document.createElement('div');
            q.className = 'doh-modern-step';
            q.innerHTML = `<span class='doh-modern-icon'>ℹ️</span> ${t.notifyTitle}`;
            card.appendChild(q);
            const infoText = document.createElement('div');
            infoText.className = 'doh-modern-note';
            infoText.innerHTML = `<span class='doh-modern-icon'>💡</span> ${t.notifyBody}`;
            card.appendChild(infoText);
            const continueBtn = document.createElement('button');
            continueBtn.textContent = t.yes;
            continueBtn.className = 'doh-modern-btn';
            continueBtn.onclick = () => { step = 1; showStep(); };
            card.appendChild(continueBtn);
            if (window.chrome && chrome.notifications) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon128.png',
                    title: t.notifyTitle,
                    message: t.notifyBody
                });
            } else {
                setTimeout(() => alert(t.notifyTitle + '\n' + t.notifyBody), 300);
            }
        } else if (step === 3) {
            const guideBox = document.createElement('div');
            guideBox.className = 'doh-modern-guidebox';
            const title = document.createElement('strong');
            title.innerHTML = `<span class='doh-modern-icon'>📖</span> ${t.showGuide}`;
            guideBox.appendChild(title);
            const ol = document.createElement('ol');
            t.steps.forEach(stepText => {
                const li = document.createElement('li');
                li.innerHTML = stepText;
                ol.appendChild(li);
            });
            guideBox.appendChild(ol);
            const note = document.createElement('div');
            note.className = 'doh-modern-note';
            note.innerHTML = `<span class='doh-modern-icon'>💡</span> ${t.note}`;
            guideBox.appendChild(note);
            card.appendChild(guideBox);
            // Success check
            const success = document.createElement('div');
            success.className = 'doh-modern-success';
            success.innerHTML = `<span class='doh-modern-icon'>✅</span> ${(lang === 'fa') ? 'آموزش با موفقیت نمایش داده شد!' : (lang === 'ar') ? 'تم عرض الدليل بنجاح!' : (lang === 'zh') ? '指南已成功显示！' : 'Guide displayed successfully!'} `;
            card.appendChild(success);
        }
        guideDiv.appendChild(card);
    }
    showStep();
}

// === Direct DoH Activation Guide ===
function renderEnableDohGuide(forceLang) {
    const guideDiv = document.getElementById('doh-poll-guide');
    if (!guideDiv) return;
    let lang = forceLang || (window.i18n && window.i18n.getCurrentLanguage && window.i18n.getCurrentLanguage()) || (navigator.language || 'en').split('-')[0];
    lang = ['en', 'fa', 'ar', 'zh'].includes(lang) ? lang : 'en';
    console.log('Enable DoH Guide lang:', lang); // Debug log
    let t = window._i18n && window._i18n[lang] && window._i18n[lang].enableDoh;
    if (!t) t = window._i18n && window._i18n['en'] && window._i18n['en'].enableDoh;
    if (!t) return;
    const rtlLangs = ['fa', 'ar'];
    if (rtlLangs.includes(lang)) {
        guideDiv.setAttribute('dir', 'rtl');
    } else {
        guideDiv.setAttribute('dir', 'ltr');
    }
    guideDiv.innerHTML = '';
    // Add button to switch back to poll guide
    const switchBtn = document.createElement('button');
    switchBtn.className = 'doh-modern-switch';
    let switchLabel2;
    if (lang === 'fa') switchLabel2 = 'راهنمای تعاملی DoH';
    else if (lang === 'ar') switchLabel2 = 'الدليل التفاعلي لـ DoH';
    else if (lang === 'zh') switchLabel2 = 'DoH 互动指南';
    else switchLabel2 = 'Interactive DoH Guide';
    switchBtn.innerHTML = `<span class='doh-modern-icon'>💬</span> ${switchLabel2}`;
    switchBtn.onclick = () => renderDohPollGuide(lang);
    guideDiv.appendChild(switchBtn);
    // Card
    const card = document.createElement('div');
    card.className = 'doh-modern-card';
    // Title
    const title = document.createElement('div');
    title.className = 'doh-modern-title';
    title.innerHTML = `<span class='doh-modern-icon'>🔗</span> ${t.title}`;
    card.appendChild(title);
    // Intro
    const intro = document.createElement('div');
    intro.className = 'doh-modern-step';
    intro.innerHTML = `<span class='doh-modern-icon'>ℹ️</span> ${t.intro}`;
    card.appendChild(intro);
    // Steps
    const ol = document.createElement('ol');
    for (let i = 1; i <= 5; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<span class='doh-modern-icon'>${i === 1 ? '⚙️' : i === 2 ? '🔍' : i === 3 ? '⬇️' : i === 4 ? '🛡️' : '🔗'}</span> ${t[`step${i}`]}`;
        ol.appendChild(li);
    }
    card.appendChild(ol);
    // Done
    const done = document.createElement('div');
    done.className = 'doh-modern-success';
    done.innerHTML = `<span class='doh-modern-icon'>✅</span> ${t.done}`;
    card.appendChild(done);
    guideDiv.appendChild(card);
}

// Load translations for all supported languages and always re-render after all are loaded
window._i18n = window._i18n || {};
async function loadDohPollTranslations() {
    const langs = ['en', 'fa', 'ar', 'zh'];
    await Promise.all(langs.map(async lang => {
        try {
            const response = await fetch(chrome.runtime.getURL(`locales/${lang}.json`));
            if (!response.ok) {
                throw new Error(`Failed to load ${lang} guide translations: ${response.status}`);
            }
            window._i18n[lang] = await response.json();
        } catch (error) {
            console.error(`Could not load ${lang} guide translations:`, error);
        }
    }));

    if (!window._i18n.en) {
        return;
    }

    const currentLang = window.i18n && window.i18n.getCurrentLanguage
        ? window.i18n.getCurrentLanguage()
        : 'en';
    renderDohPollGuide(currentLang);
}

// Listen for language change and re-render DoH guide
function setupDohGuideLanguageSync() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const language = e.target.closest('.lang-btn').dataset.lang;
            if (language) {
                setTimeout(() => renderDohPollGuide(language), 200); // slight delay to allow i18n to update
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDohPollTranslations();
    setupDohGuideLanguageSync();
    // ... existing code ...
});

// Add after I18nManager class or at the end of popup.js
function updateLinksBarLabels() {
    if (!window.i18n || !window.i18n.isReady()) return;
    const map = [
        { id: 'homeLink', key: 'home' },
        { id: 'privacyPolicyLink', key: 'privacy' },
        { id: 'termsOfServiceLink', key: 'terms' },
        { id: 'licenseLink', key: 'license' },
        { id: 'contributingLink', key: 'contributing' },
        { id: 'securityLink', key: 'security' }
    ];
    map.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (el) {
            // Find the span for label (second span)
            const spans = el.querySelectorAll('span');
            if (spans.length > 1) {
                spans[1].textContent = window.i18n.getText('links.' + key);
            }
        }
    });
}
// Patch: call this in applyLanguage and after language change
const origApplyLanguage = window.i18n.applyLanguage.bind(window.i18n);
window.i18n.applyLanguage = function() {
    origApplyLanguage();
    updateLinksBarLabels();
};
// Also call once on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLinksBarLabels);
} else {
    updateLinksBarLabels();
}

 
class I18nManager {
    constructor() {
        this.currentLanguage = 'en'; // Default language
        this.translations = {};
        this.init();
    }

    async init() {
        try {
            const { language } = await chrome.storage.local.get(['language']);
            if (['en', 'fa', 'ar', 'zh'].includes(language)) {
                this.currentLanguage = language;
            }
        } catch (error) {
            console.error('Could not load language preference:', error);
        }

        // Load translations
        await this.loadTranslations();
        
        // Apply current language
        this.applyLanguage();
    }

    async loadTranslations() {
        try {
            // Load English translations
            const enResponse = await fetch(chrome.runtime.getURL('locales/en.json'));
            if (!enResponse.ok) {
                throw new Error(`Failed to load English translations: ${enResponse.status}`);
            }
            this.translations.en = await enResponse.json();
            
            // Load Persian translations
            const faResponse = await fetch(chrome.runtime.getURL('locales/fa.json'));
            if (!faResponse.ok) {
                throw new Error(`Failed to load Persian translations: ${faResponse.status}`);
            }
            this.translations.fa = await faResponse.json();
            
            // Load Arabic translations
            const arResponse = await fetch(chrome.runtime.getURL('locales/ar.json'));
            if (!arResponse.ok) {
                throw new Error(`Failed to load Arabic translations: ${arResponse.status}`);
            }
            this.translations.ar = await arResponse.json();
            
            // Load Chinese translations
            const zhResponse = await fetch(chrome.runtime.getURL('locales/zh.json'));
            if (!zhResponse.ok) {
                throw new Error(`Failed to load Chinese translations: ${zhResponse.status}`);
            }
            this.translations.zh = await zhResponse.json();
            
            console.log('All translations loaded successfully');
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English only
            this.translations = {
                en: {
                    "extension": {
                        "name": "DNS Configuration Manager",
                        "description": "Smart DNS settings for Chrome browser"
                    },
                    "popup": {
                        "title": "DNS Settings",
                        "dnsToggle": {
                            "enabled": "Profile selected",
                            "disabled": "No profile selected"
                        },
                        "openInTab": "Open in new tab",
                        "status": {
                            "default": "No DNS profile selected",
                            "connected": "Selected DNS profile:",
                            "noConnection": "No DNS profile selected",
                            "disabled": "No DNS profile selected",
                            "profileSelected": "Saved profile (DNS unchanged)"
                        },
                        "appearance": {
                            "label": "Appearance",
                            "system": "System",
                            "light": "Light",
                            "dark": "Dark"
                        },
                        "network": {
                            "title": "Network & gaming",
                            "refresh": "Refresh",
                            "latency": "Estimated RTT",
                            "downlink": "Estimated download",
                            "connection": "Network type",
                            "notAvailable": "Not available",
                            "estimateNote": "Chrome-provided estimates only; this does not run a speed test or ping a game server.",
                            "gamingTitle": "Gaming and DNS",
                            "gamingNote": "DNS can affect domain lookups during sign-in or matchmaking, but it does not change latency once a game session is connected. Saved profiles do not change Chrome settings."
                        }
                    },
                    "dns": {
                        "discovery": {
                            "subtitle": "Browse providers by purpose, then compare their published options.",
                            "compare": "Compare selected",
                            "searchPlaceholder": "Search providers or addresses",
                            "filterLabel": "Filter DNS providers",
                            "categories": {
                                "all": "All profiles", "standard": "Standard", "security": "Security",
                                "ads": "Ad blocking", "family": "Family", "adult": "Adult content",
                                "unfiltered": "Unfiltered", "uncensored": "Uncensored", "custom": "Custom"
                            },
                            "favoritesOnly": "Favorites",
                            "noResults": "No profiles match these filters.",
                            "selectForCompare": "Select to compare",
                            "addFavorite": "Add to favorites",
                            "removeFavorite": "Remove from favorites",
                            "source": "Official details",
                            "sourceUnavailable": "Source not listed",
                            "dohAvailable": "DoH template available",
                            "noDoh": "No DoH template listed",
                            "lastReviewed": "Details checked",
                            "comparisonTitle": "Provider comparison",
                            "closeComparison": "Close comparison",
                            "comparisonNote": "Provider features and DoH compatibility are based on published details; this extension does not test resolver performance.",
                            "comparisonEmpty": "Select up to 3 profiles using the comparison checkboxes.",
                            "comparisonProfile": "Profile",
                            "comparisonCategory": "Use case",
                            "comparisonServers": "IPv4 servers",
                            "comparisonDoH": "DoH template",
                            "comparisonSource": "Official source"
                        },
                        "backup": {
                            "export": "Export profiles",
                            "import": "Import profiles",
                            "exported": "Profiles exported.",
                            "imported": "Profiles imported.",
                            "noNewProfiles": "All profiles in this file are already saved.",
                            "noProfiles": "There are no saved profiles to export.",
                            "invalidFile": "This profile file is invalid or unsupported.",
                            "tooLarge": "The selected file is too large."
                        },
                        "presets": {
                            "title": "Ready DNS",
                            "google": { "name": "Google DNS", "servers": "8.8.8.8, 8.8.4.4" },
                            "cloudflare": { "name": "Cloudflare", "servers": "1.1.1.1, 1.0.0.1" },
                            "opendns": { "name": "Open DNS", "servers": "208.67.222.222, 208.67.220.220" },
                            "quad9": { "name": "Quad 9", "servers": "9.9.9.9, 149.112.112.112" },
                            "cloudflare_malware": { "name": "Cloudflare Malware Protection", "servers": "1.1.1.2, 1.0.0.2" },
                            "cloudflare_family": { "name": "Cloudflare Family Protection", "servers": "1.1.1.3, 1.0.0.3" },
                            "adguard": { "name": "AdGuard DNS (ads and trackers)", "servers": "94.140.14.14, 94.140.15.15" },
                            "adguard_family": { "name": "AdGuard Family Protection", "servers": "94.140.14.15, 94.140.15.16" },
                            "adguard_unfiltered": { "name": "AdGuard Non-filtering", "servers": "94.140.14.140, 94.140.14.141" },
                            "cleanbrowsing_security": { "name": "CleanBrowsing Security Filter", "servers": "185.228.168.9, 185.228.169.9" },
                            "cleanbrowsing_family": { "name": "CleanBrowsing Family Filter", "servers": "185.228.168.168, 185.228.169.168" },
                            "cleanbrowsing_adult": { "name": "CleanBrowsing Adult Filter", "servers": "185.228.168.10, 185.228.169.11" },
                            "controld_unfiltered": { "name": "Control D Free Unfiltered", "servers": "76.76.2.0, 76.76.10.0" },
                            "controld_malware": { "name": "Control D Free Malware Filter", "servers": "76.76.2.1, 76.76.10.1" },
                            "controld_ads": { "name": "Control D Free Ads and Tracking", "servers": "76.76.2.2, 76.76.10.2" },
                            "controld_family": { "name": "Control D Free Family", "servers": "76.76.2.4, 76.76.10.4" },
                            "controld_uncensored": { "name": "Control D Free Uncensored", "servers": "76.76.2.5, 76.76.10.5" }
                        },
                        "custom": {
                            "title": "Custom DNS Settings",
                            "primary": "Primary DNS Server:",
                            "secondary": "Secondary DNS Server:",
                            "name": "Settings Name:",
                            "primaryPlaceholder": "Example: 8.8.8.8",
                            "secondaryPlaceholder": "Example: 8.8.4.4",
                            "namePlaceholder": "My Custom DNS",
                            "saveButton": "Save Custom DNS"
                        },
                        "saved": {
                            "title": "Saved Settings",
                            "noSettings": "No settings saved",
                            "apply": "Apply",
                            "delete": "Delete"
                        },
                        "actions": {
                            "apply": "Save DNS profile",
                            "reset": "Reset to Default",
                            "copy": "Copy DNS",
                            "refresh": "Refresh status",
                            "testUnavailable": "DNS test limitations",
                            "checkProfile": "Check saved profile"
                        }
                    },
                    "notifications": {
                        "errors": {
                            "primaryRequired": "Please enter primary DNS server and settings name",
                            "invalidIP": "Please enter valid IP addresses",
                            "noConfig": "Please select a DNS configuration first",
                            "noSettings": "No saved DNS profile is available. Select a profile first.",
                            "themeStorage": "Could not save appearance preference",
                            "compareLimit": "You can compare up to 3 profiles at a time.",
                            "backupFailed": "Could not read or save the profile backup."
                        },
                        "success": {
                            "customSaved": "Custom DNS settings saved successfully!",
                            "dnsApplied": "DNS profile saved (DNS unchanged):",
                            "settingsDeleted": "Settings deleted successfully",
                            "resetDefault": "Selected DNS profile cleared. DNS settings were not changed."
                        },
                        "info": {
                            "dnsTestUnavailable": "This extension stores DNS profiles but cannot test DNS connectivity or change DNS settings."
                        }
                    },
                    "info": {
                        "note": "This extension stores DNS profiles only. It does not change or test DNS settings in Chrome or your operating system."
                    },
                    "links": {
                        "developerName": "Naser Sadrmanesh",
                        "developerProfile": "GitHub profile",
                        "github": "GitHub",
                        "privacy": "Privacy Policy",
                        "terms": "Terms of Service"
                    }
                }
            };
        }
    }

    getText(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                // Fallback to English
                value = this.translations.en;
                for (const fallbackKey of keys) {
                    if (value && value[fallbackKey]) {
                        value = value[fallbackKey];
                    } else {
                        return key; // Return key if translation not found
                    }
                }
                break;
            }
        }
        
        return value || key;
    }

    async setLanguage(language) {
        const validLanguages = ['en', 'fa', 'ar', 'zh'];
        if (!validLanguages.includes(language)) {
            throw new Error(`Invalid language: ${language}`);
        }

        if (!this.translations[language]) {
            throw new Error(`Translations for language ${language} not loaded`);
        }

        await chrome.storage.local.set({ language });
        this.currentLanguage = language;
        this.applyLanguage();
        console.log(`Language changed to: ${language}`);
    }

    applyLanguage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Set RTL for Arabic and Persian
        const rtlLanguages = ['fa', 'ar'];
        document.documentElement.dir = rtlLanguages.includes(this.currentLanguage) ? 'rtl' : 'ltr';
        
        // Update all translatable elements
        this.updateElements();
    }

    updateElements() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                element.textContent = this.getText(key);
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (key) element.setAttribute('placeholder', this.getText(key));
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            if (key) element.setAttribute('aria-label', this.getText(key));
        });

        // Update title
        document.title = this.getText('popup.title');
        
        // Update DNS toggle label
        const dnsToggleLabel = document.getElementById('dnsToggleLabel');
        if (dnsToggleLabel) {
            const isEnabled = document.getElementById('dnsToggle')?.checked;
            dnsToggleLabel.textContent = this.getText(`popup.dnsToggle.${isEnabled ? 'enabled' : 'disabled'}`);
        }
        
        // Update open in tab button
        const openInTabBtn = document.getElementById('openInTab');
        if (openInTabBtn) {
            openInTabBtn.textContent = this.getText('popup.openInTab');
        }
        
        // Update header title
        const headerTitle = document.querySelector('header h1');
        if (headerTitle) {
            headerTitle.textContent = this.getText('popup.title');
        }

        const appearanceLabel = document.getElementById('appearanceLabel');
        if (appearanceLabel) {
            appearanceLabel.textContent = this.getText('popup.appearance.label');
        }
        document.querySelectorAll('.theme-btn').forEach(button => {
            const label = button.querySelector('.theme-name');
            if (label && ['system', 'light', 'dark'].includes(button.dataset.theme)) {
                label.textContent = this.getText(`popup.appearance.${button.dataset.theme}`);
            }
        });

        // Update status text
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = this.getText('popup.status.default');
        }
        
        // Update current DNS bar
        const currentDnsTitle = document.querySelector('.current-dns-title');
        if (currentDnsTitle) {
            currentDnsTitle.textContent = this.getText('popup.status.connected');
        }
        
        // Update current IP bar
        const currentIpTitle = document.querySelector('.current-ip-title');
        if (currentIpTitle) {
            currentIpTitle.textContent = this.getText('popup.ip.title');
        }
        
        // Update section titles
        const presetTitle = document.querySelector('.dns-presets h3');
        if (presetTitle) {
            presetTitle.textContent = this.getText('dns.presets.title');
        }
        
        const customTitle = document.querySelector('.custom-dns h3');
        if (customTitle) {
            customTitle.textContent = this.getText('dns.custom.title');
        }
        
        const savedTitle = document.querySelector('.saved-configs h3');
        if (savedTitle) {
            savedTitle.textContent = this.getText('dns.saved.title');
        }
        
        // Update form labels
        const primaryLabel = document.querySelector('label[for="primaryDNS"]');
        if (primaryLabel) {
            primaryLabel.textContent = this.getText('dns.custom.primary');
        }
        
        const secondaryLabel = document.querySelector('label[for="secondaryDNS"]');
        if (secondaryLabel) {
            secondaryLabel.textContent = this.getText('dns.custom.secondary');
        }
        
        const nameLabel = document.querySelector('label[for="dnsName"]');
        if (nameLabel) {
            nameLabel.textContent = this.getText('dns.custom.name');
        }
        
        // Update placeholders
        const primaryInput = document.getElementById('primaryDNS');
        if (primaryInput) {
            primaryInput.placeholder = this.getText('dns.custom.primaryPlaceholder');
        }
        
        const secondaryInput = document.getElementById('secondaryDNS');
        if (secondaryInput) {
            secondaryInput.placeholder = this.getText('dns.custom.secondaryPlaceholder');
        }
        
        const nameInput = document.getElementById('dnsName');
        if (nameInput) {
            nameInput.placeholder = this.getText('dns.custom.namePlaceholder');
        }
        
        // Update buttons
        const saveCustomBtn = document.getElementById('saveCustom');
        if (saveCustomBtn) {
            saveCustomBtn.textContent = this.getText('dns.custom.saveButton');
        }
        
        const applyDnsBtn = document.getElementById('applyDNS');
        if (applyDnsBtn) {
            applyDnsBtn.querySelector('.button-label').textContent = this.getText('dns.actions.apply');
        }
        
        const resetDnsBtn = document.getElementById('resetDNS');
        if (resetDnsBtn) {
            resetDnsBtn.querySelector('.button-label').textContent = this.getText('dns.actions.reset');
        }

        const dnsTestBtn = document.getElementById('testDNS');
        if (dnsTestBtn) {
            dnsTestBtn.querySelector('.button-label').textContent = this.getText('dns.actions.testUnavailable');
        }

        const checkDnsBtn = document.getElementById('checkDNS');
        if (checkDnsBtn) {
            checkDnsBtn.querySelector('.button-label').textContent = this.getText('dns.actions.checkProfile');
        }
        
        // Update info text
        const infoText = document.querySelector('.info p');
        if (infoText) {
            infoText.innerHTML = `<strong>${this.getText('info.note')}</strong>`;
        }
        
        // Update links
        const githubLink = document.querySelector('.btn-link[href*="github.com/sadrmanesh/chrome-dns-manager"]');
        if (githubLink) {
            const textSpan = githubLink.querySelector('span:last-child');
            if (textSpan) {
                textSpan.textContent = this.getText('links.github');
            }
        }
        
        const privacyLink = document.querySelector('.btn-link[href="privacy-policy.html"]');
        if (privacyLink) {
            const textSpan = privacyLink.querySelector('span:last-child');
            if (textSpan) {
                textSpan.textContent = this.getText('links.privacy');
            }
        }
        
        const termsLink = document.querySelector('.btn-link[href="terms-of-service.html"]');
        if (termsLink) {
            const textSpan = termsLink.querySelector('span:last-child');
            if (textSpan) {
                textSpan.textContent = this.getText('links.terms');
            }
        }
        
        // Update DNS presets
        this.updateDNSPresets();

        // Update Chrome settings copy button
        const chromeSettingsBtn = document.getElementById('openChromeSettings');
        if (chromeSettingsBtn) {
            chromeSettingsBtn.textContent = this.getText('chromeSettings.copyButton');
        }
    }

    updateDNSPresets() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        
        presetButtons.forEach(btn => {
            const presetType = btn.dataset.preset;
            if (presetType && presetType !== 'custom') {
                const nameElement = btn.querySelector('.preset-name');
                const serversElement = btn.querySelector('.preset-servers');
                
                if (nameElement) {
                    const key = `dns.presets.${presetType}.name`;
                    const translatedName = this.getText(key);
                    if (translatedName !== key) nameElement.textContent = translatedName;
                }
                
                if (serversElement) {
                    const key = `dns.presets.${presetType}.servers`;
                    const translatedServers = this.getText(key);
                    if (translatedServers !== key) serversElement.textContent = translatedServers;
                }
            }
        });
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    // Check if language is RTL
    isRTL() {
        const rtlLanguages = ['fa', 'ar'];
        return rtlLanguages.includes(this.currentLanguage);
    }

    // Check if translations are loaded
    isReady() {
        return this.translations && Object.keys(this.translations).length > 0;
    }

    // Get translation status
    getTranslationStatus() {
        return {
            isReady: this.isReady(),
            loadedLanguages: Object.keys(this.translations || {}),
            currentLanguage: this.currentLanguage
        };
    }
}

// Create global i18n instance
window.i18n = new I18nManager(); 
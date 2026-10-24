class DNSBackgroundManager {
    constructor() {
        this.currentConfig = null;
        this.isActive = false;
        this.init();
    }

    init() {
        try {
            console.log('Initializing DNS Background Manager...');
            
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async response
        });
            console.log('Message listener setup complete');

        // Load saved configuration on startup
        this.loadSavedConfiguration();
            console.log('Saved configuration loaded');
            
            console.log('DNS Background Manager initialization complete');
        } catch (error) {
            console.error('Error during background initialization:', error);
        }
    }

    async handleMessage(message, sender, sendResponse) {
        try {
            switch (message.action) {
                case 'applyDNS':
                    const result = await this.applyDNSConfiguration(message.config);
                    sendResponse({ success: result });
                    break;
                    
                case 'resetDNS':
                    const resetResult = await this.resetDNSConfiguration();
                    sendResponse({ success: resetResult });
                    break;
                    
                case 'getCurrentConfig':
                    const config = await this.getCurrentConfiguration();
                    const status = await this.getDNSStatus();
                    sendResponse({ success: true, config, status });
                    break;
                    
                case 'testDNS':
                    sendResponse(await this.testDNSConnection(message.dnsServer));
                    break;
                    
                case 'checkDNSStatus':
                    const statusResult = await this.checkDNSStatus();
                    sendResponse({ success: true, status: statusResult });
                    break;
                    
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async applyDNSConfiguration(config) {
        try {
            console.log('Applying DNS configuration:', config);
            
            if (!config || typeof config !== 'object' || !this.validateDNSServer(config.primary)) {
                throw new Error('Invalid primary DNS server');
            }
            if (config.secondary && !this.validateDNSServer(config.secondary)) {
                throw new Error('Invalid secondary DNS server');
            }

            await this.saveConfiguration(config);
            this.currentConfig = config;
            this.isActive = true;
            console.log('Configuration saved to storage');
            
            console.log(`DNS profile saved: ${config.name} (${config.primary}); DNS settings were not changed`);

            return true;
        } catch (error) {
            console.error('Error applying DNS configuration:', error);
            throw error;
        }
    }

    async resetDNSConfiguration() {
        try {
            console.log('Resetting DNS configuration...');

            const { currentConfig, currentDNSConfig } = await chrome.storage.local.get([
                'currentConfig',
                'currentDNSConfig'
            ]);
            const lastActiveConfig = currentConfig || currentDNSConfig;
            const storageData = {
                currentDNSConfig: null,
                currentConfig: null
            };
            if (lastActiveConfig) {
                storageData.lastActiveConfig = lastActiveConfig;
            }
            await chrome.storage.local.set(storageData);

            this.currentConfig = null;
            this.isActive = false;
            console.log('Storage keys cleared');

            console.log('Selected DNS profile reset; DNS settings were not changed');
            return true;
        } catch (error) {
            console.error('Error resetting DNS configuration:', error);
            throw error;
        }
    }

    async loadSavedConfiguration() {
        try {
            const result = await chrome.storage.local.get(['currentDNSConfig', 'currentConfig']);
            this.currentConfig = result.currentConfig || result.currentDNSConfig || null;
            this.isActive = this.currentConfig !== null;
            if (this.currentConfig) {
                console.log('Loaded saved DNS configuration:', this.currentConfig.name);
                
                // Don't automatically reapply - just load into memory
                // The configuration will be applied when needed
            }
        } catch (error) {
            console.error('Error loading saved configuration:', error);
        }
    }

    async saveConfiguration(config) {
        console.log('Saving configuration to storage:', config);
        
        const storageData = {
            currentDNSConfig: config,
            currentConfig: config,
            lastActiveConfig: config
        };
        
        await chrome.storage.local.set(storageData);
        console.log('Configuration saved successfully to both keys');
    }

    async getCurrentConfiguration() {
        return this.currentConfig;
    }

    async getDNSStatus() {
        return {
            isActive: this.isActive && this.currentConfig !== null,
            mode: 'profile-only',
            config: this.currentConfig
        };
    }

    async checkDNSStatus() {
        try {
            // Update active status based on saved configuration
            this.isActive = this.currentConfig !== null;
            
            return {
                isActive: this.isActive,
                mode: 'profile-only',
                config: this.currentConfig
            };
        } catch (error) {
            console.error('Error checking DNS status:', error);
            return { isActive: false, mode: 'unknown', config: null };
        }
    }

    // Validate DNS server configuration
    validateDNSServer(server) {
        if (typeof server !== 'string') {
            return false;
        }
        const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!ipPattern.test(server)) {
            return false;
        }
        
        const parts = server.split('.');
        return parts.every(part => {
            const num = parseInt(part);
            return num >= 0 && num <= 255;
        });
    }

    // A Chrome extension cannot probe DNS servers directly without making a misleading HTTP request.
    async testDNSConnection(dnsServer) {
        return {
            success: false,
            supported: false,
            error: `DNS reachability checks are not supported (requested server: ${dnsServer || 'unknown'}).`
        };
    }

}

// Initialize the DNS manager
const dnsManager = new DNSBackgroundManager(); 
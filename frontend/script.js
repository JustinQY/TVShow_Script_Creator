// Main Application Script - Coordinates all components

class TVScriptCreatorApp {
    constructor() {
        this.scriptGenerator = null;
        this.scriptHistory = [];
        this.currentScript = null;
        this.init();
    }

    async init() {
        try {
            // Initialize script generator
            this.scriptGenerator = new MockScriptGenerator();
            
            // Set up progress callback
            this.scriptGenerator.setProgressCallback((progress) => {
                if (window.loadingStates) {
                    window.loadingStates.updateProgress(
                        progress.step,
                        progress.totalSteps,
                        progress.message,
                        progress.progress
                    );
                }
            });

            // Load script history from localStorage
            this.loadHistory();
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('TV Script Creator App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            if (window.errorHandler) {
                window.errorHandler.logError('App Initialization Failed', error);
            }
        }
    }

    setupEventListeners() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            if (window.loadingStates) {
                window.loadingStates.showToast('Connection restored', 'success');
            }
        });

        window.addEventListener('offline', () => {
            if (window.loadingStates) {
                window.loadingStates.showToast('You are now offline', 'warning');
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Auto-save form data
        this.setupAutoSave();
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to generate script
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.generateScript();
        }
        
        // Ctrl/Cmd + S to download current script
        if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.currentScript) {
            e.preventDefault();
            if (window.scriptDisplay) {
                window.scriptDisplay.downloadScript();
            }
        }
        
        // Ctrl/Cmd + C to copy current script
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && this.currentScript && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            if (window.scriptDisplay) {
                window.scriptDisplay.copyScript();
            }
        }
    }

    setupAutoSave() {
        // Save form data periodically
        const formElements = ['characters', 'location', 'scenario', 'temperature', 'topK', 'topP', 'maxTokens'];
        
        formElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener('change', () => {
                    this.saveFormData();
                });
            }
        });

        // Load saved form data
        this.loadFormData();
    }

    saveFormData() {
        try {
            if (window.parameterForm) {
                const formData = window.parameterForm.getFormData();
                localStorage.setItem('tvscript_form_data', JSON.stringify(formData));
            }
        } catch (error) {
            console.warn('Failed to save form data:', error);
        }
    }

    loadFormData() {
        try {
            const savedData = localStorage.getItem('tvscript_form_data');
            if (savedData && window.parameterForm) {
                const formData = JSON.parse(savedData);
                this.restoreFormData(formData);
            }
        } catch (error) {
            console.warn('Failed to load form data:', error);
        }
    }

    restoreFormData(formData) {
        // This would be implemented to restore form state
        // For now, we'll skip this to avoid complexity
        console.log('Form data restoration not implemented yet');
    }

    async generateScript() {
        try {
            // Validate form
            if (!window.parameterForm || !window.parameterForm.validateForm()) {
                return;
            }

            // Get form data
            const parameters = window.parameterForm.getFormData();
            
            // Validate parameters
            if (window.errorHandler) {
                const validationErrors = window.errorHandler.validateParameters(parameters);
                if (validationErrors.length > 0) {
                    validationErrors.forEach(error => {
                        window.errorHandler.handleFormValidationError(error.field, error.message);
                    });
                    return;
                }
            }

            // Show loading state
            if (window.loadingStates) {
                window.loadingStates.showLoading('Generating Your Script...');
            }

            // Generate script
            const scriptData = await this.scriptGenerator.createNewScript(parameters);
            
            // Show success message
            if (window.loadingStates) {
                window.loadingStates.showSuccess('Script generated successfully!');
            }

            // Display script
            if (window.scriptDisplay) {
                window.scriptDisplay.displayScript(scriptData);
            }

            // Save to history
            this.addToHistory(scriptData);
            this.currentScript = scriptData;

            // Save form data
            this.saveFormData();

        } catch (error) {
            console.error('Script generation failed:', error);
            
            if (window.errorHandler) {
                window.errorHandler.handleScriptGenerationError(error, window.parameterForm?.getFormData());
            }
            
            if (window.loadingStates) {
                window.loadingStates.showError('Failed to generate script. Please try again.');
            }
        }
    }

    regenerateScript() {
        if (window.loadingStates) {
            window.loadingStates.showToast('Regenerating script with same parameters...', 'info');
        }
        this.generateScript();
    }

    addToHistory(scriptData) {
        this.scriptHistory.unshift(scriptData);
        
        // Limit history to 20 items
        if (this.scriptHistory.length > 20) {
            this.scriptHistory = this.scriptHistory.slice(0, 20);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    saveHistory() {
        try {
            localStorage.setItem('tvscript_history', JSON.stringify(this.scriptHistory));
        } catch (error) {
            console.warn('Failed to save history:', error);
        }
    }

    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('tvscript_history');
            if (savedHistory) {
                this.scriptHistory = JSON.parse(savedHistory);
                this.updateHistoryDisplay();
            }
        } catch (error) {
            console.warn('Failed to load history:', error);
            this.scriptHistory = [];
        }
    }

    updateHistoryDisplay() {
        const historyPanel = document.getElementById('historyPanel');
        const historyGrid = document.getElementById('historyGrid');
        
        if (this.scriptHistory.length === 0) {
            historyPanel.style.display = 'none';
            return;
        }
        
        historyPanel.style.display = 'block';
        historyGrid.innerHTML = '';
        
        this.scriptHistory.forEach((script, index) => {
            const historyItem = this.createHistoryItem(script, index);
            historyGrid.appendChild(historyItem);
        });
    }

    createHistoryItem(script, index) {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        const preview = script.script.substring(0, 200) + (script.script.length > 200 ? '...' : '');
        const date = new Date(script.timestamp).toLocaleDateString();
        const time = new Date(script.timestamp).toLocaleTimeString();
        
        div.innerHTML = `
            <h4>Script #${this.scriptHistory.length - index}</h4>
            <div class="meta">
                ${date} at ${time} | 
                ${script.parameters.characters.join(', ')} | 
                ${script.parameters.location}
            </div>
            <div class="preview">${preview}</div>
        `;
        
        div.addEventListener('click', () => {
            this.loadHistoryItem(script);
        });
        
        return div;
    }

    loadHistoryItem(script) {
        this.currentScript = script;
        
        if (window.scriptDisplay) {
            window.scriptDisplay.displayScript(script);
        }
        
        // Scroll to script display
        document.getElementById('scriptOutput').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        if (window.loadingStates) {
            window.loadingStates.showToast('Loaded script from history', 'success');
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all script history? This cannot be undone.')) {
            this.scriptHistory = [];
            this.saveHistory();
            this.updateHistoryDisplay();
            
            if (window.loadingStates) {
                window.loadingStates.showToast('Script history cleared', 'info');
            }
        }
    }

    exportHistory() {
        if (this.scriptHistory.length === 0) {
            if (window.loadingStates) {
                window.loadingStates.showToast('No scripts to export', 'warning');
            }
            return;
        }
        
        const exportData = {
            scripts: this.scriptHistory,
            exportDate: new Date().toISOString(),
            totalScripts: this.scriptHistory.length
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `friends-scripts-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (window.loadingStates) {
            window.loadingStates.showToast('Script history exported successfully', 'success');
        }
    }

    handleRouteChange() {
        // Handle any route-based changes if needed
        console.log('Route changed:', window.location.hash);
    }

    // Public API methods
    getAppState() {
        return {
            currentScript: this.currentScript,
            historyCount: this.scriptHistory.length,
            isGenerating: this.scriptGenerator?.isCurrentlyGenerating() || false
        };
    }

    resetApp() {
        if (confirm('Are you sure you want to reset the application? This will clear all data.')) {
            // Clear history
            this.scriptHistory = [];
            this.currentScript = null;
            
            // Clear localStorage
            localStorage.removeItem('tvscript_history');
            localStorage.removeItem('tvscript_form_data');
            
            // Reset form
            if (window.parameterForm) {
                window.parameterForm.resetForm();
            }
            
            // Clear script display
            if (window.scriptDisplay) {
                window.scriptDisplay.clearDisplay();
            }
            
            // Update displays
            this.updateHistoryDisplay();
            
            if (window.loadingStates) {
                window.loadingStates.showToast('Application reset successfully', 'success');
            }
        }
    }
}

// Global functions for HTML onclick handlers
function generateScript() {
    if (window.app) {
        window.app.generateScript();
    }
}

function regenerateScript() {
    if (window.app) {
        window.app.regenerateScript();
    }
}

function clearHistory() {
    if (window.app) {
        window.app.clearHistory();
    }
}

function exportHistory() {
    if (window.app) {
        window.app.exportHistory();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for all components to be initialized
    setTimeout(() => {
        window.app = new TVScriptCreatorApp();
        console.log('TV Script Creator App ready!');
    }, 100);
});

// Add some helpful console commands for debugging
if (typeof window !== 'undefined') {
    window.debugApp = {
        getState: () => window.app?.getAppState(),
        getHistory: () => window.app?.scriptHistory,
        getErrors: () => window.errorHandler?.getErrorStats(),
        reset: () => window.app?.resetApp(),
        exportErrors: () => window.errorHandler?.exportErrorLog()
    };
}


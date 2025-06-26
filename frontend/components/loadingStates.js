// Loading States Component - Handles loading animations and progress

class LoadingStates {
    constructor() {
        this.isLoading = false;
        this.currentStep = 0;
        this.totalSteps = 4;
        this.loadingMessages = [
            'Initializing AI model...',
            'Loading model weights...',
            'Tokenizing input...',
            'Generating script...',
            'Post-processing output...'
        ];
    }

    showLoading(title = 'Generating Script...') {
        this.isLoading = true;
        this.currentStep = 0;
        
        const overlay = document.getElementById('loadingOverlay');
        const titleElement = document.getElementById('loadingTitle');
        const messageElement = document.getElementById('loadingMessage');
        const progressFill = document.getElementById('progressFill');
        
        titleElement.textContent = title;
        messageElement.textContent = this.loadingMessages[0];
        progressFill.style.width = '0%';
        
        overlay.style.display = 'flex';
        
        // Disable generate button
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = true;
        generateBtn.textContent = '⏳ Generating...';
    }

    updateProgress(step, totalSteps, message, progress) {
        if (!this.isLoading) return;
        
        const messageElement = document.getElementById('loadingMessage');
        const progressFill = document.getElementById('progressFill');
        
        messageElement.textContent = message;
        progressFill.style.width = `${progress}%`;
        
        this.currentStep = step;
        this.totalSteps = totalSteps;
    }

    simulateProgress(duration = 4000) {
        return new Promise((resolve) => {
            const steps = this.loadingMessages.length;
            const stepDuration = duration / steps;
            let currentStep = 0;
            
            const updateStep = () => {
                if (currentStep < steps && this.isLoading) {
                    const progress = ((currentStep + 1) / steps) * 100;
                    this.updateProgress(
                        currentStep + 1, 
                        steps, 
                        this.loadingMessages[currentStep], 
                        progress
                    );
                    
                    currentStep++;
                    
                    if (currentStep < steps) {
                        setTimeout(updateStep, stepDuration);
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            };
            
            updateStep();
        });
    }

    hideLoading() {
        this.isLoading = false;
        
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'none';
        
        // Re-enable generate button
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = false;
        generateBtn.textContent = '🎭 Generate Script';
    }

    showError(message) {
        this.hideLoading();
        
        const overlay = document.getElementById('loadingOverlay');
        const loadingContent = overlay.querySelector('.loading-content');
        
        loadingContent.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3 style="color: #dc3545; margin-bottom: 1rem;">Generation Failed</h3>
                <p style="margin-bottom: 2rem;">${message}</p>
                <button class="btn btn-primary" onclick="hideLoadingError()">Try Again</button>
            </div>
        `;
        
        overlay.style.display = 'flex';
    }

    showSuccess(message) {
        const overlay = document.getElementById('loadingOverlay');
        const loadingContent = overlay.querySelector('.loading-content');
        
        loadingContent.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                <h3 style="color: #28a745; margin-bottom: 1rem;">Success!</h3>
                <p style="margin-bottom: 2rem;">${message}</p>
                <div class="loading-spinner" style="margin: 1rem auto;"></div>
                <p><small>Displaying your script...</small></p>
            </div>
        `;
        
        // Hide after a short delay
        setTimeout(() => {
            this.hideLoading();
        }, 1500);
    }

    resetLoadingContent() {
        const overlay = document.getElementById('loadingOverlay');
        const loadingContent = overlay.querySelector('.loading-content');
        
        loadingContent.innerHTML = `
            <div class="loading-spinner"></div>
            <h3 id="loadingTitle">Generating Script...</h3>
            <p id="loadingMessage">Initializing AI model...</p>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill" style="width: 0%;"></div>
            </div>
            <p><small>This may take a few moments</small></p>
        `;
    }

    // Button loading states
    setButtonLoading(buttonId, loadingText = 'Loading...') {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
            button.classList.add('loading');
        }
    }

    resetButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
            button.classList.remove('loading');
        }
    }

    // Skeleton loading for content areas
    showSkeleton(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="skeleton-loading">
                    <div class="skeleton-line" style="width: 80%; margin-bottom: 1rem;"></div>
                    <div class="skeleton-line" style="width: 60%; margin-bottom: 1rem;"></div>
                    <div class="skeleton-line" style="width: 90%; margin-bottom: 1rem;"></div>
                    <div class="skeleton-line" style="width: 70%; margin-bottom: 1rem;"></div>
                    <div class="skeleton-line" style="width: 85%; margin-bottom: 1rem;"></div>
                </div>
            `;
        }
    }

    // Pulse animation for elements
    addPulseAnimation(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('pulse-animation');
        }
    }

    removePulseAnimation(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('pulse-animation');
        }
    }

    // Toast notifications
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add toast styles if not already present
        this.addToastStyles();
        
        document.body.appendChild(toast);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('fade-out');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        };
        return icons[type] || icons['info'];
    }

    addToastStyles() {
        if (document.getElementById('toast-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1002;
                min-width: 300px;
                max-width: 500px;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                padding: 1rem;
                gap: 0.5rem;
            }
            
            .toast-icon {
                font-size: 1.2rem;
            }
            
            .toast-message {
                flex: 1;
                font-size: 0.9rem;
            }
            
            .toast-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #6c757d;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .toast-close:hover {
                color: #dc3545;
            }
            
            .toast-info { border-left: 4px solid #17a2b8; }
            .toast-success { border-left: 4px solid #28a745; }
            .toast-warning { border-left: 4px solid #ffc107; }
            .toast-error { border-left: 4px solid #dc3545; }
            
            .fade-out {
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }
            
            .skeleton-loading {
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            .skeleton-line {
                height: 1rem;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                border-radius: 4px;
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            .pulse-animation {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Global functions for HTML onclick handlers
function hideLoadingError() {
    if (window.loadingStates) {
        window.loadingStates.resetLoadingContent();
        window.loadingStates.hideLoading();
    }
}

// Initialize loading states when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loadingStates = new LoadingStates();
});


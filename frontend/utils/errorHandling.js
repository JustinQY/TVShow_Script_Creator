// Error Handling Utilities

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        // Handle uncaught JavaScript errors
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason);
            event.preventDefault(); // Prevent console error
        });
    }

    logError(type, error, context = {}) {
        const errorEntry = {
            type,
            message: error?.message || error,
            stack: error?.stack,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.errorLog.push(errorEntry);
        console.error('Error logged:', errorEntry);

        // Show user-friendly error message for critical errors
        if (this.isCriticalError(type, error)) {
            this.showUserError(this.getUserFriendlyMessage(type, error));
        }
    }

    isCriticalError(type, error) {
        const criticalTypes = [
            'Script Generation Failed',
            'Network Error',
            'Model Loading Error'
        ];
        
        return criticalTypes.includes(type) || 
               (error?.message && error.message.includes('fetch'));
    }

    getUserFriendlyMessage(type, error) {
        const friendlyMessages = {
            'Script Generation Failed': 'Sorry, we couldn\'t generate your script. Please try again with different parameters.',
            'Network Error': 'Connection problem detected. Please check your internet connection and try again.',
            'Model Loading Error': 'There was an issue loading the AI model. Please refresh the page and try again.',
            'JavaScript Error': 'Something went wrong. Please refresh the page and try again.',
            'Unhandled Promise Rejection': 'An unexpected error occurred. Please try again.'
        };

        return friendlyMessages[type] || 'An unexpected error occurred. Please try again.';
    }

    showUserError(message, type = 'error') {
        if (window.loadingStates) {
            window.loadingStates.showToast(message, type, 5000);
        } else {
            // Fallback if toast system isn't available
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message fade-in';
            errorDiv.textContent = message;
            errorDiv.style.position = 'fixed';
            errorDiv.style.top = '20px';
            errorDiv.style.right = '20px';
            errorDiv.style.zIndex = '1003';
            errorDiv.style.maxWidth = '400px';
            
            document.body.appendChild(errorDiv);
            
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    }

    // Specific error handlers for different components
    handleScriptGenerationError(error, parameters) {
        const context = {
            component: 'ScriptGenerator',
            parameters: parameters,
            selectedCharacters: parameters?.characters?.length || 0
        };

        this.logError('Script Generation Failed', error, context);
        
        // Show specific error message based on the error type
        let userMessage = 'Failed to generate script. ';
        
        if (error?.message?.includes('characters')) {
            userMessage += 'Please select at least 2 characters.';
        } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
            userMessage += 'Network connection issue. Please try again.';
        } else if (error?.message?.includes('timeout')) {
            userMessage += 'Generation took too long. Try reducing the max tokens or try again.';
        } else {
            userMessage += 'Please try again with different parameters.';
        }

        this.showUserError(userMessage);
        
        // Update script display with error
        if (window.scriptDisplay) {
            window.scriptDisplay.showError(userMessage);
        }
    }

    handleFormValidationError(field, message) {
        this.logError('Form Validation Error', `${field}: ${message}`, {
            component: 'ParameterForm',
            field: field
        });

        // Highlight the problematic field
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
            fieldElement.classList.add('error');
            fieldElement.focus();
            
            // Remove error class after a few seconds
            setTimeout(() => {
                fieldElement.classList.remove('error');
            }, 3000);
        }

        this.showUserError(message, 'warning');
    }

    handleFileOperationError(operation, error) {
        this.logError('File Operation Error', error, {
            component: 'ScriptDisplay',
            operation: operation
        });

        const messages = {
            'copy': 'Failed to copy script to clipboard. Please select and copy manually.',
            'download': 'Failed to download script. Please try again.',
            'share': 'Failed to share script. Please try copying the link manually.'
        };

        this.showUserError(messages[operation] || 'File operation failed.');
    }

    handleNetworkError(url, error) {
        this.logError('Network Error', error, {
            url: url,
            online: navigator.onLine
        });

        if (!navigator.onLine) {
            this.showUserError('You appear to be offline. Please check your internet connection.');
        } else {
            this.showUserError('Network error occurred. Please try again.');
        }
    }

    // Validation helpers
    validateParameters(parameters) {
        const errors = [];

        if (!parameters.characters || parameters.characters.length < 2) {
            errors.push({ field: 'characters', message: 'Please select at least 2 characters.' });
        }

        if (!parameters.scenario || parameters.scenario.trim().length === 0) {
            errors.push({ field: 'scenario', message: 'Please enter a scenario.' });
        }

        if (parameters.temperature < 0.1 || parameters.temperature > 1.0) {
            errors.push({ field: 'temperature', message: 'Temperature must be between 0.1 and 1.0.' });
        }

        if (parameters.topK < 1 || parameters.topK > 100) {
            errors.push({ field: 'topK', message: 'Top K must be between 1 and 100.' });
        }

        if (parameters.topP < 0.1 || parameters.topP > 1.0) {
            errors.push({ field: 'topP', message: 'Top P must be between 0.1 and 1.0.' });
        }

        if (parameters.maxNewTokens < 100 || parameters.maxNewTokens > 4096) {
            errors.push({ field: 'maxNewTokens', message: 'Max tokens must be between 100 and 4096.' });
        }

        return errors;
    }

    // Retry mechanism
    async retryOperation(operation, maxRetries = 3, delay = 1000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                this.logError('Retry Attempt Failed', error, {
                    attempt: attempt,
                    maxRetries: maxRetries
                });
                
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, delay * attempt));
                }
            }
        }
        
        throw lastError;
    }

    // Get error statistics
    getErrorStats() {
        const stats = {
            total: this.errorLog.length,
            byType: {},
            recent: this.errorLog.slice(-10)
        };

        this.errorLog.forEach(error => {
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
        });

        return stats;
    }

    // Clear error log
    clearErrorLog() {
        this.errorLog = [];
    }

    // Export error log for debugging
    exportErrorLog() {
        const data = {
            errors: this.errorLog,
            stats: this.getErrorStats(),
            exportTime: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-log-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Utility functions for common error scenarios
function handleAsyncError(promise, context = {}) {
    return promise.catch(error => {
        if (window.errorHandler) {
            window.errorHandler.logError('Async Operation Failed', error, context);
        }
        throw error;
    });
}

function safeExecute(fn, fallback = null, context = {}) {
    try {
        return fn();
    } catch (error) {
        if (window.errorHandler) {
            window.errorHandler.logError('Safe Execute Failed', error, context);
        }
        return fallback;
    }
}

function validateAndExecute(validator, executor, errorHandler) {
    try {
        const validation = validator();
        if (validation.isValid) {
            return executor();
        } else {
            validation.errors.forEach(error => {
                if (window.errorHandler) {
                    window.errorHandler.handleFormValidationError(error.field, error.message);
                }
            });
            return false;
        }
    } catch (error) {
        if (errorHandler) {
            errorHandler(error);
        } else if (window.errorHandler) {
            window.errorHandler.logError('Validation Error', error);
        }
        return false;
    }
}

// Initialize error handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.errorHandler = new ErrorHandler();
});


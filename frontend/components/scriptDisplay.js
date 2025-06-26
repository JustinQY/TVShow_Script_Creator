// Script Display Component - Handles script formatting and display

class ScriptDisplay {
    constructor() {
        this.currentScript = null;
        this.displayMode = 'formatted'; // 'formatted' or 'raw'
    }

    displayScript(scriptData) {
        this.currentScript = scriptData;
        const outputContainer = document.getElementById('scriptOutput');
        const actionsContainer = document.getElementById('scriptActions');
        
        // Format and display the script
        const formattedScript = this.formatScript(scriptData.script);
        
        outputContainer.innerHTML = `
            <div class="script-content formatted script-loading" id="scriptContent">
                ${formattedScript}
            </div>
            <div class="script-meta">
                <small>
                    <strong>Generated:</strong> ${new Date(scriptData.timestamp).toLocaleString()} | 
                    <strong>Characters:</strong> ${scriptData.parameters.characters.join(', ')} | 
                    <strong>Location:</strong> ${scriptData.parameters.location} |
                    <strong>Temperature:</strong> ${scriptData.parameters.temperature}
                </small>
            </div>
        `;
        
        // Show action buttons
        actionsContainer.style.display = 'flex';
        
        // Add animation
        setTimeout(() => {
            document.getElementById('scriptContent').classList.remove('script-loading');
        }, 100);
        
        // Scroll to script
        outputContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    formatScript(scriptText) {
        if (!scriptText) return '<p>No script content available.</p>';
        
        const lines = scriptText.split('\n');
        let formattedHtml = '';
        let inFlashback = false;
        let inDreamSequence = false;
        
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            
            // Scene descriptions
            if (line.startsWith('[Scene:') || line.startsWith('[scene:')) {
                formattedHtml += `<div class="scene-description">${this.escapeHtml(line)}</div>`;
            }
            // End of scene/episode markers
            else if (line.toLowerCase().includes('[end of scene]') || line.toLowerCase().includes('[end of episode]')) {
                formattedHtml += `<div class="episode-end">${this.escapeHtml(line)}</div>`;
            }
            // Stage directions in brackets
            else if (line.startsWith('[') && line.endsWith(']')) {
                if (line.toLowerCase().includes('flashback')) {
                    inFlashback = !inFlashback;
                    formattedHtml += `<div class="scene-transition">${this.escapeHtml(line)}</div>`;
                } else if (line.toLowerCase().includes('dream')) {
                    inDreamSequence = !inDreamSequence;
                    formattedHtml += `<div class="scene-transition">${this.escapeHtml(line)}</div>`;
                } else {
                    formattedHtml += `<div class="stage-direction">${this.escapeHtml(line)}</div>`;
                }
            }
            // Character dialogue
            else if (line.includes(':') && !line.startsWith('(')) {
                const colonIndex = line.indexOf(':');
                const speaker = line.substring(0, colonIndex).trim();
                const dialogue = line.substring(colonIndex + 1).trim();
                
                if (this.isValidCharacterName(speaker)) {
                    const speakerClass = speaker.toLowerCase().replace(/[^a-z]/g, '');
                    let dialogueHtml = `<div class="dialogue">
                        <span class="speaker ${speakerClass}">${this.escapeHtml(speaker)}:</span>
                        <span class="line">${this.formatDialogueLine(dialogue)}</span>
                    </div>`;
                    
                    // Wrap in special containers if needed
                    if (inFlashback) {
                        dialogueHtml = `<div class="flashback">${dialogueHtml}</div>`;
                    } else if (inDreamSequence) {
                        dialogueHtml = `<div class="dream-sequence">${dialogueHtml}</div>`;
                    }
                    
                    formattedHtml += dialogueHtml;
                } else {
                    formattedHtml += `<div class="narrative">${this.escapeHtml(line)}</div>`;
                }
            }
            // Stage directions in parentheses
            else if (line.startsWith('(') && line.endsWith(')')) {
                formattedHtml += `<div class="stage-direction">${this.escapeHtml(line)}</div>`;
            }
            // Sound effects and music cues
            else if (line.toLowerCase().includes('sound') || line.toLowerCase().includes('sfx')) {
                formattedHtml += `<div class="sound-effect">${this.escapeHtml(line)}</div>`;
            }
            else if (line.toLowerCase().includes('music') || line.toLowerCase().includes('song')) {
                formattedHtml += `<div class="music-cue">${this.escapeHtml(line)}</div>`;
            }
            // Pause indicators
            else if (line === '...' || line === '[Pause]' || line.toLowerCase() === 'pause') {
                formattedHtml += `<div class="pause">${this.escapeHtml(line)}</div>`;
            }
            // Commercial breaks
            else if (line.toLowerCase().includes('commercial')) {
                formattedHtml += `<div class="commercial-break">${this.escapeHtml(line)}</div>`;
            }
            // Everything else as narrative
            else {
                formattedHtml += `<div class="narrative">${this.escapeHtml(line)}</div>`;
            }
        }
        
        return formattedHtml;
    }

    formatDialogueLine(dialogue) {
        let formatted = this.escapeHtml(dialogue);
        
        // Handle emphasis (words in caps)
        formatted = formatted.replace(/\b[A-Z]{2,}\b/g, '<span class="shout">$&</span>');
        
        // Handle whispers (text in parentheses within dialogue)
        formatted = formatted.replace(/\([^)]+\)/g, '<span class="whisper">$&</span>');
        
        // Handle emphasis with asterisks
        formatted = formatted.replace(/\*([^*]+)\*/g, '<span class="emphasis">$1</span>');
        
        return formatted;
    }

    isValidCharacterName(name) {
        const validNames = [...FRIENDS_CHARACTERS, 'Narrator', 'All', 'Everyone'];
        return validNames.some(validName => 
            name.toLowerCase().includes(validName.toLowerCase())
        );
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    toggleDisplayMode() {
        this.displayMode = this.displayMode === 'formatted' ? 'raw' : 'formatted';
        
        if (this.currentScript) {
            const content = document.getElementById('scriptContent');
            if (this.displayMode === 'raw') {
                content.innerHTML = `<pre>${this.escapeHtml(this.currentScript.script)}</pre>`;
                content.classList.remove('formatted');
            } else {
                content.innerHTML = this.formatScript(this.currentScript.script);
                content.classList.add('formatted');
            }
        }
    }

    copyScript() {
        if (!this.currentScript) return;
        
        const textToCopy = this.currentScript.script;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showCopySuccess();
            }).catch(() => {
                this.fallbackCopy(textToCopy);
            });
        } else {
            this.fallbackCopy(textToCopy);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy script. Please select and copy manually.');
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccess() {
        const scriptContent = document.getElementById('scriptContent');
        scriptContent.classList.add('copy-success');
        
        // Show temporary message
        const message = document.createElement('div');
        message.className = 'success-message fade-in';
        message.textContent = '✅ Script copied to clipboard!';
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.zIndex = '1001';
        document.body.appendChild(message);
        
        setTimeout(() => {
            scriptContent.classList.remove('copy-success');
            message.remove();
        }, 2000);
    }

    downloadScript() {
        if (!this.currentScript) return;
        
        const scriptData = this.currentScript;
        const filename = this.generateFilename(scriptData);
        const content = this.generateDownloadContent(scriptData);
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        const message = document.createElement('div');
        message.className = 'success-message fade-in';
        message.textContent = `📁 Script downloaded as ${filename}`;
        document.getElementById('messageContainer').appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    generateFilename(scriptData) {
        const characters = scriptData.parameters.characters.join('-');
        const location = scriptData.parameters.location.replace(/[^a-zA-Z0-9]/g, '-');
        const timestamp = new Date(scriptData.timestamp).toISOString().split('T')[0];
        return `friends-script-${characters}-${location}-${timestamp}.txt`;
    }

    generateDownloadContent(scriptData) {
        const params = scriptData.parameters;
        const header = `FRIENDS TV SCRIPT
Generated: ${new Date(scriptData.timestamp).toLocaleString()}

PARAMETERS:
Characters: ${params.characters.join(', ')}
Location: ${params.location}
Scenario: ${params.scenario}
Temperature: ${params.temperature}
Top K: ${params.topK}
Top P: ${params.topP}
Max Tokens: ${params.maxNewTokens}

${params.seedDialogue ? 'SEED DIALOGUE:\n' + Object.entries(params.seedDialogue).map(([speaker, line]) => `${speaker}: ${line}`).join('\n') + '\n' : ''}
${'='.repeat(80)}

`;
        
        return header + scriptData.script;
    }

    shareScript() {
        if (!this.currentScript) return;
        
        const shareData = {
            title: 'Friends Script Generated by AI',
            text: `Check out this Friends-style script I generated with AI! Characters: ${this.currentScript.parameters.characters.join(', ')}`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare();
            });
        } else {
            this.fallbackShare();
        }
    }

    fallbackShare() {
        const url = window.location.href;
        const text = `Check out this Friends-style script I generated with AI! ${url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Share link copied to clipboard!');
            });
        } else {
            prompt('Copy this link to share:', url);
        }
    }

    clearDisplay() {
        const outputContainer = document.getElementById('scriptOutput');
        const actionsContainer = document.getElementById('scriptActions');
        
        outputContainer.innerHTML = `
            <div class="script-content" style="text-align: center; color: #6c757d; padding: 3rem;">
                <p>🎬 Your generated script will appear here</p>
                <p>Select characters and parameters, then click "Generate Script" to begin!</p>
            </div>
        `;
        
        actionsContainer.style.display = 'none';
        this.currentScript = null;
    }

    showError(message) {
        const outputContainer = document.getElementById('scriptOutput');
        outputContainer.innerHTML = `
            <div class="error-message">
                <h3>❌ Generation Failed</h3>
                <p>${message}</p>
                <p>Please try again with different parameters.</p>
            </div>
        `;
    }
}

// Global functions for HTML onclick handlers
function copyScript() {
    if (window.scriptDisplay) {
        window.scriptDisplay.copyScript();
    }
}

function downloadScript() {
    if (window.scriptDisplay) {
        window.scriptDisplay.downloadScript();
    }
}

function shareScript() {
    if (window.scriptDisplay) {
        window.scriptDisplay.shareScript();
    }
}

function toggleDisplayMode() {
    if (window.scriptDisplay) {
        window.scriptDisplay.toggleDisplayMode();
    }
}

// Initialize script display when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scriptDisplay = new ScriptDisplay();
});


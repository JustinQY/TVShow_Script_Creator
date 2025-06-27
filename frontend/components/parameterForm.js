// Parameter Form Component - Handles all form interactions and validation

class ParameterForm {
    constructor() {
        this.selectedCharacters = new Set();
        this.currentPreset = null;
        this.seedDialogueCount = 1;
        this.init();
    }

    init() {
        this.populateCharacters();
        this.populateLocations();
        this.populateScenarioSuggestions();
        this.populatePresets();
        this.setupEventListeners();
        this.updateSeedDialogueCharacters();
    }

    populateCharacters() {
        const container = document.getElementById('characterSelection');
        container.innerHTML = '';

        FRIENDS_CHARACTERS.forEach(character => {
            const div = document.createElement('div');
            div.className = 'character-checkbox';
            div.innerHTML = `
                <input type="checkbox" id="char-${character}" value="${character}">
                <label for="char-${character}">${character}</label>
            `;
            
            div.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = div.querySelector('input');
                    checkbox.checked = !checkbox.checked;
                }
                this.handleCharacterSelection(character, div.querySelector('input').checked);
            });

            container.appendChild(div);
        });
    }

    populateLocations() {
        const select = document.getElementById('location');
        select.innerHTML = '';

        FRIENDS_LOCATIONS.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            select.appendChild(option);
        });

        // Set default
        select.value = 'Central Perk';
    }

    populateScenarioSuggestions() {
        const select = document.getElementById('scenarioSuggestions');
        const scenarioInput = document.getElementById('scenario');
        
        // Clear existing options except the first one
        select.innerHTML = '<option value="">Choose a suggestion...</option>';

        SCENARIO_SUGGESTIONS.forEach(scenario => {
            const option = document.createElement('option');
            option.value = scenario;
            option.textContent = scenario;
            select.appendChild(option);
        });

        // Handle suggestion selection
        select.addEventListener('change', () => {
            if (select.value) {
                scenarioInput.value = select.value;
                select.value = ''; // Reset selection
            }
        });

        // Set default scenario
        scenarioInput.value = 'having coffee and discussing relationships';
    }

    populatePresets() {
        const container = document.getElementById('presetGrid');
        container.innerHTML = '';

        PRESET_COMBINATIONS.forEach((preset, index) => {
            const div = document.createElement('div');
            div.className = 'preset-card';
            div.innerHTML = `
                <h4>${preset.name}</h4>
                <p><strong>Characters:</strong> ${preset.characters.join(', ')}</p>
                <p><strong>Location:</strong> ${preset.location}</p>
                <p><strong>Scenario:</strong> ${preset.scenario}</p>
            `;
            
            div.addEventListener('click', () => this.applyPreset(preset, div));
            container.appendChild(div);
        });
    }

    setupEventListeners() {
        // Parameter sliders
        const sliders = ['temperature', 'topK', 'topP', 'maxTokens'];
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            const valueDisplay = document.getElementById(sliderId + 'Value');
            
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
            });
        });

        // Form validation
        document.getElementById('generateBtn').addEventListener('click', () => {
            if (this.validateForm()) {
                this.clearPresetSelection();
            }
        });
    }

    handleCharacterSelection(character, isSelected) {
        const checkbox = document.getElementById(`char-${character}`);
        const container = checkbox.closest('.character-checkbox');
        
        if (isSelected) {
            this.selectedCharacters.add(character);
            container.classList.add('selected');
        } else {
            this.selectedCharacters.delete(character);
            container.classList.remove('selected');
        }

        this.updateSeedDialogueCharacters();
        this.validateCharacters();
        this.clearPresetSelection();
    }

    updateSeedDialogueCharacters() {
        const selects = document.querySelectorAll('#seedDialogue select');
        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select character...</option>';
            
            this.selectedCharacters.forEach(character => {
                const option = document.createElement('option');
                option.value = character;
                option.textContent = character;
                select.appendChild(option);
            });
            
            // Restore previous selection if still valid
            if (this.selectedCharacters.has(currentValue)) {
                select.value = currentValue;
            }
        });
    }

    validateCharacters() {
        const errorDiv = document.getElementById('characterError');
        const isValid = this.selectedCharacters.size >= 2;
        
        errorDiv.style.display = isValid ? 'none' : 'block';
        return isValid;
    }

    validateForm() {
        let isValid = true;
        
        // Validate characters
        if (!this.validateCharacters()) {
            isValid = false;
        }

        // Validate scenario
        const scenario = document.getElementById('scenario').value.trim();
        if (!scenario) {
            this.showError('Please enter a scenario.');
            isValid = false;
        }

        return isValid;
    }

    applyPreset(preset, presetElement) {
        // Clear previous preset selection
        document.querySelectorAll('.preset-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Mark current preset as selected
        presetElement.classList.add('selected');
        this.currentPreset = preset;

        // Apply character selection
        this.selectedCharacters.clear();
        document.querySelectorAll('.character-checkbox').forEach(container => {
            container.classList.remove('selected');
            container.querySelector('input').checked = false;
        });

        preset.characters.forEach(character => {
            const checkbox = document.getElementById(`char-${character}`);
            const container = checkbox.closest('.character-checkbox');
            checkbox.checked = true;
            container.classList.add('selected');
            this.selectedCharacters.add(character);
        });

        // Apply other parameters
        document.getElementById('location').value = preset.location;
        document.getElementById('scenario').value = preset.scenario;

        // Apply seed dialogue if present
        if (preset.seedDialogue) {
            this.clearSeedDialogue();
            Object.entries(preset.seedDialogue).forEach(([speaker, line], index) => {
                if (index > 0) {
                    this.addSeedDialogue();
                }
                const dialogueEntries = document.querySelectorAll('#seedDialogue .dialogue-entry');
                const entry = dialogueEntries[index];
                entry.querySelector('select').value = speaker;
                entry.querySelector('input').value = line;
            });
        }

        this.updateSeedDialogueCharacters();
        this.validateCharacters();
        
        // Show success message
        this.showSuccess(`Applied preset: ${preset.name}`);
    }

    clearPresetSelection() {
        document.querySelectorAll('.preset-card').forEach(card => {
            card.classList.remove('selected');
        });
        this.currentPreset = null;
    }

    getFormData() {
        const seedDialogue = {};
        document.querySelectorAll('#seedDialogue .dialogue-entry').forEach(entry => {
            const speaker = entry.querySelector('select').value;
            const line = entry.querySelector('input').value.trim();
            if (speaker && line) {
                seedDialogue[speaker] = line;
            }
        });

        return {
            characters: Array.from(this.selectedCharacters),
            location: document.getElementById('location').value,
            scenario: document.getElementById('scenario').value.trim(),
            seedDialogue: Object.keys(seedDialogue).length > 0 ? seedDialogue : null,
            temperature: parseFloat(document.getElementById('temperature').value),
            topK: parseInt(document.getElementById('topK').value),
            topP: parseFloat(document.getElementById('topP').value),
            maxNewTokens: parseInt(document.getElementById('maxTokens').value)
        };
    }

    resetForm() {
        // Clear character selection
        this.selectedCharacters.clear();
        document.querySelectorAll('.character-checkbox').forEach(container => {
            container.classList.remove('selected');
            container.querySelector('input').checked = false;
        });

        // Reset form fields
        document.getElementById('location').value = 'Central Perk';
        document.getElementById('scenario').value = 'having coffee and discussing relationships';
        
        // Reset sliders
        document.getElementById('temperature').value = 0.9;
        document.getElementById('tempValue').textContent = '0.9';
        document.getElementById('topK').value = 50;
        document.getElementById('topKValue').textContent = '50';
        document.getElementById('topP').value = 0.95;
        document.getElementById('topPValue').textContent = '0.95';
        document.getElementById('maxTokens').value = 2048;
        document.getElementById('maxTokensValue').textContent = '2048';

        // Clear seed dialogue
        this.clearSeedDialogue();
        
        // Clear preset selection
        this.clearPresetSelection();
        
        // Hide error messages
        document.getElementById('characterError').style.display = 'none';
    }

    clearSeedDialogue() {
        const container = document.getElementById('seedDialogue');
        container.innerHTML = `
            <div class="dialogue-entry">
                <select class="form-control">
                    <option value="">Select character...</option>
                </select>
                <input type="text" class="form-control" placeholder="Enter dialogue line...">
                <button type="button" onclick="removeSeedDialogue(this)">×</button>
            </div>
        `;
        this.seedDialogueCount = 1;
        this.updateSeedDialogueCharacters();
    }

    showError(message) {
        const container = document.getElementById('messageContainer');
        const div = document.createElement('div');
        div.className = 'error-message fade-in';
        div.textContent = message;
        container.appendChild(div);
        
        setTimeout(() => {
            div.remove();
        }, 5000);
    }

    showSuccess(message) {
        const container = document.getElementById('messageContainer');
        const div = document.createElement('div');
        div.className = 'success-message fade-in';
        div.textContent = message;
        container.appendChild(div);
        
        setTimeout(() => {
            div.remove();
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
function addSeedDialogue() {
    const container = document.getElementById('seedDialogue');
    const div = document.createElement('div');
    div.className = 'dialogue-entry';
    div.innerHTML = `
        <select class="form-control">
            <option value="">Select character...</option>
        </select>
        <input type="text" class="form-control" placeholder="Enter dialogue line...">
        <button type="button" onclick="removeSeedDialogue(this)">×</button>
    `;
    
    container.appendChild(div);
    
    // Update character options for the new select
    if (window.parameterForm) {
        window.parameterForm.updateSeedDialogueCharacters();
    }
}

function removeSeedDialogue(button) {
    const entry = button.closest('.dialogue-entry');
    const container = document.getElementById('seedDialogue');
    
    // Don't remove if it's the only entry
    if (container.children.length > 1) {
        entry.remove();
    } else {
        // Clear the content of the last entry
        entry.querySelector('select').value = '';
        entry.querySelector('input').value = '';
    }
}

function toggleAdvanced() {
    const content = document.getElementById('advancedParams');
    const arrow = document.querySelector('.collapsible-arrow');
    const collapsible = document.querySelector('.collapsible');
    
    content.classList.toggle('active');
    collapsible.classList.toggle('active');
    
    if (content.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
    } else {
        content.style.maxHeight = '0';
    }
}

// Initialize parameter form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.parameterForm = new ParameterForm();
});


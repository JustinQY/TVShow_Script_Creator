// Mock Script Generator Service - Simulates the Python ScriptGenerator functionality

class MockScriptGenerator {
    constructor() {
        this.generatedScripts = [];
        this.isGenerating = false;
    }

    // Simulate the create_prompt method from the Python class
    createPrompt(characters, location = "Central Perk", scenario = "having coffee", seedDialogue = null, continueSpeaker = null) {
        if (!characters || characters.length < 2) {
            throw new Error("Please assign at least 2 characters");
        }

        let prompt = `You are going to generate a new episode of the show *Friends*.

The episode should include multiple scenes, natural conversations, character-specific humor, and a clear ending.

[Scene: ${location}, ${characters.join(', ')} are ${scenario}.]

`;

        if (seedDialogue) {
            for (const [speaker, line] of Object.entries(seedDialogue)) {
                if (line && line.trim()) {
                    prompt += `${speaker}: ${line.trim()}\n`;
                }
            }
        }

        if (continueSpeaker) {
            prompt += `${continueSpeaker}:`;
        }

        return prompt.trim();
    }

    // Simulate the create_new_script method with realistic timing
    async createNewScript(parameters) {
        const {
            characters,
            location = "Central Perk",
            scenario = "having coffee",
            seedDialogue = null,
            continueSpeaker = null,
            maxNewTokens = 2048,
            temperature = 0.9,
            topK = 50,
            topP = 0.95
        } = parameters;

        this.isGenerating = true;

        // Simulate model inference time (2-5 seconds)
        const inferenceTime = Math.random() * 3000 + 2000;
        
        try {
            // Create the prompt
            const prompt = this.createPrompt(characters, location, scenario, seedDialogue, continueSpeaker);
            
            // Simulate processing time
            await this.simulateProcessing(inferenceTime);
            
            // Generate script based on parameters
            const script = this.generateMockScript(characters, location, scenario, seedDialogue, temperature);
            
            const result = {
                prompt,
                script,
                parameters: {
                    characters,
                    location,
                    scenario,
                    seedDialogue,
                    continueSpeaker,
                    maxNewTokens,
                    temperature,
                    topK,
                    topP
                },
                timestamp: new Date().toISOString(),
                id: Date.now()
            };

            this.generatedScripts.push(result);
            return result;

        } finally {
            this.isGenerating = false;
        }
    }

    // Simulate processing with progress updates
    async simulateProcessing(duration) {
        const steps = ['Loading model...', 'Tokenizing input...', 'Generating script...', 'Post-processing...'];
        const stepDuration = duration / steps.length;
        
        for (let i = 0; i < steps.length; i++) {
            if (this.onProgress) {
                this.onProgress({
                    step: i + 1,
                    totalSteps: steps.length,
                    message: steps[i],
                    progress: ((i + 1) / steps.length) * 100
                });
            }
            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
    }

    // Generate mock script based on parameters
    generateMockScript(characters, location, scenario, seedDialogue, temperature) {
        // Use temperature to influence script style
        const creativity = temperature > 0.8 ? 'high' : temperature > 0.5 ? 'medium' : 'low';
        
        // Select appropriate script template based on characters and scenario
        const scriptTemplate = this.selectScriptTemplate(characters, location, scenario, creativity);
        
        // Fill in the template with character-specific dialogue
        return this.fillScriptTemplate(scriptTemplate, characters, location, scenario, seedDialogue);
    }

    selectScriptTemplate(characters, location, scenario, creativity) {
        // Different templates based on creativity level and character combinations
        const templates = {
            high: [
                this.getCreativeTemplate(),
                this.getQuirkyTemplate(),
                this.getDramaticTemplate()
            ],
            medium: [
                this.getBalancedTemplate(),
                this.getClassicTemplate()
            ],
            low: [
                this.getSimpleTemplate(),
                this.getStraightforwardTemplate()
            ]
        };

        const templateSet = templates[creativity];
        return templateSet[Math.floor(Math.random() * templateSet.length)];
    }

    fillScriptTemplate(template, characters, location, scenario, seedDialogue) {
        let script = `[Scene: ${location}, ${characters.join(', ')} are ${scenario}.]\n\n`;
        
        // Add seed dialogue if provided
        if (seedDialogue) {
            for (const [speaker, line] of Object.entries(seedDialogue)) {
                if (line && line.trim()) {
                    script += `${speaker}: ${line.trim()}\n\n`;
                }
            }
        }

        // Generate character-specific dialogue
        script += this.generateCharacterDialogue(characters, template);
        
        script += '\n[End of scene]';
        
        return script;
    }

    generateCharacterDialogue(characters, template) {
        const dialogues = {
            'Rachel': [
                "Oh my God, you guys, this is like, so not what I expected!",
                "I can't believe this is happening to me right now.",
                "Wait, wait, wait. Let me get this straight...",
                "This is just perfect. Just absolutely perfect."
            ],
            'Monica': [
                "Okay, here's what we're going to do. First, we need to organize this situation.",
                "I have a system for this exact scenario!",
                "This is not how things are supposed to go!",
                "Can we please just focus and handle this properly?"
            ],
            'Phoebe': [
                "You know, my grandmother always said that when life gives you lemons...",
                "Oh! Oh! I know exactly what this means! It's a sign from the universe.",
                "This reminds me of the time I was living in the park and...",
                "Wait, are we sure this isn't because of some bad karma?"
            ],
            'Ross': [
                "Actually, if you look at this from a scientific perspective...",
                "This is just like what happened to the dinosaurs, except...",
                "I can't believe I'm dealing with this again.",
                "You know what? Fine. FINE! This is just... fine."
            ],
            'Chandler': [
                "Could this BE any more complicated?",
                "I'm sorry, are we living in some kind of sitcom here?",
                "Oh, great. This is exactly what I needed today.",
                "You know what? I'm just going to make jokes until this goes away."
            ],
            'Joey': [
                "I don't get it. Can someone explain this to me like I'm five?",
                "Ooh! Ooh! Can we get food while we figure this out?",
                "This is confusing. I'm going to need a sandwich to think about this.",
                "Wait, so what you're saying is..."
            ]
        };

        let dialogue = '';
        const usedLines = new Set();
        
        // Generate 3-5 exchanges
        const exchanges = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < exchanges; i++) {
            const speaker = characters[i % characters.length];
            const lines = dialogues[speaker] || ["I don't know what to say about this."];
            
            let line;
            do {
                line = lines[Math.floor(Math.random() * lines.length)];
            } while (usedLines.has(line) && usedLines.size < lines.length);
            
            usedLines.add(line);
            dialogue += `${speaker}: ${line}\n\n`;
        }

        return dialogue;
    }

    // Template methods for different creativity levels
    getCreativeTemplate() {
        return {
            style: 'creative',
            complexity: 'high',
            humor: 'quirky',
            length: 'long'
        };
    }

    getQuirkyTemplate() {
        return {
            style: 'quirky',
            complexity: 'medium',
            humor: 'absurd',
            length: 'medium'
        };
    }

    getDramaticTemplate() {
        return {
            style: 'dramatic',
            complexity: 'high',
            humor: 'situational',
            length: 'long'
        };
    }

    getBalancedTemplate() {
        return {
            style: 'balanced',
            complexity: 'medium',
            humor: 'classic',
            length: 'medium'
        };
    }

    getClassicTemplate() {
        return {
            style: 'classic',
            complexity: 'medium',
            humor: 'traditional',
            length: 'medium'
        };
    }

    getSimpleTemplate() {
        return {
            style: 'simple',
            complexity: 'low',
            humor: 'straightforward',
            length: 'short'
        };
    }

    getStraightforwardTemplate() {
        return {
            style: 'straightforward',
            complexity: 'low',
            humor: 'minimal',
            length: 'short'
        };
    }

    // Pretty print script (similar to Python version)
    prettyPrintScript(scriptStr) {
        const lines = scriptStr.trim().split('\n');
        let formattedScript = '';

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.startsWith('[Scene') || trimmedLine.startsWith('[')) {
                formattedScript += `<div class="scene-description">${trimmedLine}</div>\n`;
            } else if (trimmedLine.includes(':') && !trimmedLine.startsWith('(')) {
                const [speaker, ...dialogueParts] = trimmedLine.split(':');
                const dialogue = dialogueParts.join(':').trim();
                formattedScript += `<div class="dialogue"><span class="speaker">${speaker.trim()}:</span> <span class="line">${dialogue}</span></div>\n`;
            } else if (trimmedLine.startsWith('(') && trimmedLine.endsWith(')')) {
                formattedScript += `<div class="stage-direction">${trimmedLine}</div>\n`;
            } else if (trimmedLine) {
                formattedScript += `<div class="narrative">${trimmedLine}</div>\n`;
            }
        }

        return formattedScript;
    }

    // Get generation history
    getGeneratedScripts() {
        return this.generatedScripts;
    }

    // Clear history
    clearHistory() {
        this.generatedScripts = [];
    }

    // Check if currently generating
    isCurrentlyGenerating() {
        return this.isGenerating;
    }

    // Set progress callback
    setProgressCallback(callback) {
        this.onProgress = callback;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockScriptGenerator;
}


# 📺 TV Show Script Creator - Frontend Interface

A modern web interface for generating Friends-style TV scripts using a fine-tuned LLaMA-2 AI model.

## 🎬 Features

### Core Functionality
- **Character Selection**: Choose from the main Friends characters (Rachel, Monica, Phoebe, Ross, Chandler, Joey)
- **Location Settings**: Select from iconic Friends locations (Central Perk, apartments, etc.)
- **Scenario Input**: Describe the situation or use suggested scenarios
- **Seed Dialogue**: Optionally provide starting dialogue to guide the script
- **Advanced Parameters**: Fine-tune AI generation with temperature, top-k, top-p, and token limits

### User Experience
- **Quick Start Presets**: Pre-configured character combinations and scenarios
- **Real-time Validation**: Form validation with helpful error messages
- **Loading States**: Progress indicators during script generation
- **Script Formatting**: Professional TV script formatting with proper styling
- **Script History**: Save and revisit previously generated scripts
- **Export Options**: Copy, download, or share generated scripts

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Support**: Basic functionality works without internet connection
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Keyboard Shortcuts**: Quick actions via keyboard shortcuts
- **Auto-save**: Automatically saves form data and script history

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd TVShow_Script_Creator/frontend
   ```

2. **Start the development server**:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Python 2
   python -m SimpleHTTPServer 8000
   
   # Or using Node.js (if you have it installed)
   npx http-server -p 8000
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8000` in your web browser.

### Alternative Setup
You can also open `index.html` directly in your browser, but some features may not work due to CORS restrictions.

## 🎯 How to Use

### Basic Usage
1. **Select Characters**: Choose at least 2 Friends characters
2. **Set Location**: Pick a location from the dropdown
3. **Enter Scenario**: Describe what the characters are doing
4. **Generate Script**: Click the "Generate Script" button

### Advanced Usage
1. **Add Seed Dialogue**: Provide starting lines to guide the conversation
2. **Adjust Parameters**: 
   - **Temperature**: Controls creativity (0.1 = focused, 1.0 = creative)
   - **Top K**: Vocabulary diversity (10-100)
   - **Top P**: Randomness in word selection (0.1-1.0)
   - **Max Tokens**: Maximum script length (512-4096)
3. **Use Presets**: Quick start with pre-configured combinations

### Keyboard Shortcuts
- `Ctrl/Cmd + Enter`: Generate script
- `Ctrl/Cmd + S`: Download current script
- `Ctrl/Cmd + C`: Copy current script (when not in input field)

## 🏗️ Architecture

### Component Structure
```
frontend/
├── index.html              # Main HTML file
├── styles.css              # Main stylesheet
├── script.js               # Main application logic
├── package.json            # Project configuration
├── components/             # Reusable components
│   ├── parameterForm.js    # Form handling and validation
│   ├── scriptDisplay.js    # Script formatting and display
│   └── loadingStates.js    # Loading animations and progress
├── services/               # Business logic
│   └── mockScriptGenerator.js  # Mock AI service
├── data/                   # Static data and samples
│   ├── friendsData.js      # Characters, locations, presets
│   └── sampleScripts.js    # Sample generated scripts
├── utils/                  # Utility functions
│   └── errorHandling.js    # Error handling and logging
└── styles/                 # Additional stylesheets
    └── scriptFormatting.css # TV script specific styling
```

### Key Classes
- **TVScriptCreatorApp**: Main application controller
- **MockScriptGenerator**: Simulates the AI model functionality
- **ParameterForm**: Handles form interactions and validation
- **ScriptDisplay**: Manages script formatting and display
- **LoadingStates**: Controls loading animations and progress
- **ErrorHandler**: Comprehensive error handling and logging

## 🎨 Customization

### Adding New Characters
Edit `frontend/data/friendsData.js`:
```javascript
const FRIENDS_CHARACTERS = [
    'Rachel', 'Monica', 'Phoebe', 'Ross', 'Chandler', 'Joey',
    'Your New Character'  // Add here
];
```

### Adding New Locations
Edit `frontend/data/friendsData.js`:
```javascript
const FRIENDS_LOCATIONS = [
    'Central Perk',
    'Monica and Rachel\'s apartment',
    // ... existing locations
    'Your New Location'  // Add here
];
```

### Customizing Script Formatting
Edit `frontend/styles/scriptFormatting.css` to modify how scripts are displayed.

### Adding New Presets
Edit `frontend/data/friendsData.js` and add to `PRESET_COMBINATIONS`.

## 🔧 Integration with Real AI Model

This frontend is designed to work with the actual LLaMA-2 model. To integrate:

1. **Replace MockScriptGenerator**: 
   - Create a new service that calls your AI backend
   - Implement the same interface as `MockScriptGenerator`

2. **Update API Endpoints**:
   - Modify `services/mockScriptGenerator.js` to make real HTTP requests
   - Handle authentication if required

3. **Error Handling**:
   - Update error messages for real API responses
   - Handle network timeouts and server errors

Example integration:
```javascript
// In services/realScriptGenerator.js
class RealScriptGenerator {
    async createNewScript(parameters) {
        const response = await fetch('/api/generate-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parameters)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    }
}
```

## 🐛 Troubleshooting

### Common Issues

**Scripts not generating**:
- Check browser console for errors
- Ensure at least 2 characters are selected
- Try refreshing the page

**Styling issues**:
- Clear browser cache
- Check if CSS files are loading properly
- Try a different browser

**Local server not working**:
- Ensure Python is installed
- Try a different port: `python -m http.server 8080`
- Check firewall settings

### Debug Tools
Open browser console and use:
```javascript
// Get application state
window.debugApp.getState()

// View error log
window.debugApp.getErrors()

// Export error log
window.debugApp.exportErrors()

// Reset application
window.debugApp.reset()
```

## 📱 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for the TV Show Script Creator project using fine-tuned LLaMA-2
- Inspired by the Friends TV show
- Uses modern web technologies for optimal user experience


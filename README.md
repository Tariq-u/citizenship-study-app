# U.S. Citizenship Test Study App 🇺🇸

A beautiful, comprehensive study application for the U.S. Citizenship Test, featuring multilingual support and interactive learning tools with modern design.

## ✨ Features

### 🌍 **Dual Language Display**
- **Side-by-Side Layout**: English and Pashto displayed together - no switching needed!
- **Complete Translations**: All 100+ questions and answers in both languages
- **RTL Support**: Proper right-to-left text direction for Pashto
- **Beautiful Typography**: Google Fonts (Inter for English + Noto Naskh Arabic for Pashto)
- **Color Coding**: Green for English, Blue for Pashto sections

### 📚 **Interactive Learning Tools**
- **Lessons**: Study all 100+ citizenship test questions organized by sections
- **Flashcards**: Interactive card-based review with flip animations
- **Practice Quiz**: Randomized 10-question quizzes with instant feedback
- **Progress Tracking**: Monitor your study progress with visual indicators

### 🎨 **Modern Beautiful Design**
- Gradient backgrounds and glassmorphism effects
- Smooth animations and hover effects
- Responsive design for all devices
- Dark/light theme with beautiful color schemes
- Card-based layouts with shadows and blur effects

### 🔧 **Advanced Functionality**
- **Bookmark System**: Save important questions for later review
- **Completion Tracking**: Mark questions as studied
- **Dual Audio Support**:
  - Separate audio buttons for English and Pashto
  - Plays audio files when available
  - Falls back to text-to-speech when audio files are missing
  - Independent language pronunciation (click EN or PS buttons)
- **Offline Support**: Works without internet connection (PWA ready)
- **Local Storage**: Persistent progress and preferences

## 🎯 **Pashto Translation & Audio Status**

### ✅ **What's Working:**
- **Dual Language Display**: English and Pashto shown side-by-side simultaneously
- **Complete Translations**: All 100+ questions and answers in both languages
- **No Language Switching**: Both languages always visible - no dropdown needed!
- **RTL Support**: Proper right-to-left text direction for Pashto sections
- **Beautiful Typography**: Noto Naskh Arabic font for authentic Pashto display
- **Dual Audio System**: Separate EN and PS buttons for independent audio playback

### 🔧 **Audio System:**
- **Primary**: Looks for MP3 files in `src/assets/audio/en/` and `src/assets/audio/ps/`
- **Fallback**: Uses browser's built-in text-to-speech when audio files are missing
- **Smart Detection**: Automatically switches between audio file and TTS
- **Language Support**: Handles both English (en-US) and Pashto (ps-AF) pronunciation

### 📁 **To Add Your Own Audio Files:**
1. Create MP3 files named `q1.mp3`, `q2.mp3`, etc.
2. Place English audio in: `src/assets/audio/en/`
3. Place Pashto audio in: `src/assets/audio/ps/`
4. The app will automatically use them instead of text-to-speech

## File Structure

- `src/assets/audio/en`: Audio files for English text-to-speech.
- `src/assets/audio/ps`: Audio files for Pashto text-to-speech.
- `src/assets/data/questions.json`: Contains an array of 100 official questions and answers.
- `src/assets/data/translations.json`: Translations of questions and answers from English to Pashto.
- `src/css/`: Contains styles for the application.
- `src/js/`: Contains JavaScript files for app functionality.
- `src/pages/`: Contains HTML files for each section of the app.
- `src/service-worker.js`: Enables offline functionality.
- `src/manifest.json`: Metadata for the web app.
- `index.html`: Main entry point of the application.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

This app can be deployed to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/citizenship-study-app.git

# Navigate to the project
cd citizenship-study-app

# Start a local server (e.g., using Python)
python -m http.server 8000
```

## ⌨️ **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| `Ctrl+F` | Focus search box |
| `Ctrl+S` | Toggle study mode |
| `Ctrl+Shift+T` | Toggle dark/light theme |
| `Escape` | Clear search |

## 🎯 **Quick Start Guide**

1. **Open the app**: Launch `index.html` in your browser
2. **Start studying**: Click "Lessons" to see all questions
3. **Use search**: Press `Ctrl+F` to find specific topics
4. **Study mode**: Press `Ctrl+S` to hide answers and test yourself
5. **Track progress**: Bookmark questions and mark them complete
6. **Audio support**: Click EN/PS buttons to hear pronunciations
7. **Dark mode**: Press `Ctrl+Shift+T` for comfortable night studying

## 🧪 **Demo & Testing**

- **`demo-features.html`** - Comprehensive feature showcase
- **`test-dual-language.html`** - Dual language layout demo
- **`verify-pashto.html`** - Pashto translation verification
- **`test-validation.html`** - Technical validation tests

## 🎉 **What Makes This App Special**

✅ **Complete**: All 100+ official USCIS citizenship test questions
✅ **Bilingual**: English & Pashto displayed side-by-side
✅ **Smart**: Advanced search, filtering, and study modes
✅ **Beautiful**: Modern design with dark/light themes
✅ **Accessible**: Keyboard shortcuts and screen reader support
✅ **Offline**: Works without internet connection
✅ **Progressive**: Tracks your study progress and statistics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for aspiring U.S. citizens studying in English and Pashto**
# U.S. Citizenship Test Study App 🇺🇸

A beautiful, comprehensive study application for the U.S. Citizenship Test, featuring multilingual support and interactive learning tools with modern design.

## ✨ Features

### 🌍 **Multilingual Support**
- **English**: Complete question set with answers
- **Pashto (پښتو)**: Full translation of all questions and answers with RTL support
- Persistent language selection across sessions
- Beautiful typography with Google Fonts (Inter + Noto Naskh Arabic)

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
- **Audio Support**: Listen to questions and answers (when audio files are available)
- **Offline Support**: Works without internet connection (PWA ready)
- **Local Storage**: Persistent progress and preferences

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
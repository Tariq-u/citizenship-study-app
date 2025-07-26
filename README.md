# README.md

# U.S. Citizenship Test Study App

A Progressive Web App (PWA) to help users study for the U.S. Citizenship Test. The app includes:

- Study lessons
- Flashcards
- Quiz mode
- Offline support
- Multi-language support (English and Pashto)

## Setup

1. Clone the repository
2. Open `index.html` in your browser
3. For development, use a local server to avoid CORS issues

## Features

- PWA with offline functionality
- Progress tracking
- Multi-language support
- Interactive study modes

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
// Utility functions for the Citizenship Study App

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to format time in minutes and seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to check if the device is online
function isOnline() {
    return navigator.onLine;
}

// Function to play audio
function playAudio(audioElement) {
    if (audioElement) {
        audioElement.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    }
}

// Function to speak text using the Web Speech API
function speak(text, lang) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'en' ? 'en-US' : 'ps';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

// Function to play audio for a specific question index
function playAudioForQuestion(index) {
    const currentLanguage = document.getElementById('languageSelect').value;
    const text = questions[index][currentLanguage].question + '. ' + 
                 questions[index][currentLanguage].answer;
    speak(text, currentLanguage);
}

// Exporting utility functions
export { shuffleArray, formatTime, isOnline, playAudio, speak, playAudioForQuestion };
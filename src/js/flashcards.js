import { citizenshipData } from '../data/citizenshipData.js';

const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const showAnswerButton = document.getElementById('showAnswer');
const nextButton = document.getElementById('nextCard');
const prevButton = document.getElementById('prevCard');
const languageSelect = document.getElementById('languageSelect');
const cardCounter = document.getElementById('cardCounter');
const playAudioButton = document.getElementById('playAudio');
const flashcard = document.getElementById('flashcard');

let currentQuestionIndex = 0;
let questions = citizenshipData;
let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
let audioPlayer = null;

// Translation object for UI elements
const translations = {
    en: {
        'Flashcards': 'Flashcards',
        'Show Answer': 'Show Answer',
        'Listen': 'Listen',
        'Previous': 'Previous',
        'Next': 'Next'
    },
    ps: {
        'Flashcards': 'فلش کارتونه',
        'Show Answer': 'ځواب وښایاست',
        'Listen': 'واورئ',
        'Previous': 'پخوانی',
        'Next': 'راتلونکی'
    }
};

function initializeFlashcards() {
    // Set language selector to saved preference
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    updatePageLanguage();
    updateCard();
}

function updatePageLanguage() {
    // Update page title
    const flashcardsTitle = document.getElementById('flashcardsTitle');
    if (flashcardsTitle) {
        flashcardsTitle.textContent = translations[currentLanguage]['Flashcards'];
    }

    // Update button texts
    if (showAnswerButton) {
        showAnswerButton.textContent = translations[currentLanguage]['Show Answer'];
    }

    if (playAudioButton) {
        playAudioButton.innerHTML = `🔊 ${translations[currentLanguage]['Listen']}`;
    }

    if (prevButton) {
        prevButton.innerHTML = `← ${translations[currentLanguage]['Previous']}`;
    }

    if (nextButton) {
        nextButton.innerHTML = `${translations[currentLanguage]['Next']} →`;
    }

    // Update document direction for RTL languages
    if (currentLanguage === 'ps') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ps');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }
}

// Update the displayed question and answer
function updateCard() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentLanguage === 'en' ? currentQuestion.questionEN : currentQuestion.questionPS;
    answerElement.textContent = currentLanguage === 'en' ? currentQuestion.answerEN : currentQuestion.answerPS;
    cardCounter.textContent = `${currentQuestionIndex + 1}/${questions.length}`;

    // Reset card to show question side
    flashcard.classList.remove('flipped');
}

// Show the answer
showAnswerButton.addEventListener('click', () => {
    flashcard.classList.add('flipped');
});

// Play audio
playAudioButton.addEventListener('click', () => {
    const currentQuestion = questions[currentQuestionIndex];
    const audioSrc = currentLanguage === 'en' ? currentQuestion.audioEN : currentQuestion.audioPS;

    if (audioPlayer) {
        audioPlayer.pause();
    }

    audioPlayer = new Audio(audioSrc);
    audioPlayer.play().catch(error => {
        console.error('Audio playback failed:', error);
        alert('Audio file not found. Please check if audio files are available.');
    });
});

// Load the next question
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateCard();
    }
});

// Load the previous question
prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateCard();
    }
});

// Change the language of the question and answer
languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('selectedLanguage', currentLanguage);
    updatePageLanguage();
    updateCard();
});

// Initialize the flashcards
initializeFlashcards();
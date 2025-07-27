import { citizenshipData } from '../data/citizenshipData.js';

const questionENElement = document.getElementById('questionEN');
const questionPSElement = document.getElementById('questionPS');
const answerENElement = document.getElementById('answerEN');
const answerPSElement = document.getElementById('answerPS');
const showAnswerButton = document.getElementById('showAnswer');
const nextButton = document.getElementById('nextCard');
const prevButton = document.getElementById('prevCard');
const cardCounter = document.getElementById('cardCounter');
const playAudioENButton = document.getElementById('playAudioEN');
const playAudioPSButton = document.getElementById('playAudioPS');
const flashcard = document.getElementById('flashcard');

let currentQuestionIndex = 0;
let questions = citizenshipData;
let audioPlayer = null;

function initializeFlashcards() {
    updateCard();
}

// Update the displayed question and answer
function updateCard() {
    const currentQuestion = questions[currentQuestionIndex];
    questionENElement.innerHTML = `<strong>English:</strong> ${currentQuestion.questionEN}`;
    questionPSElement.innerHTML = `<strong>پښتو:</strong> ${currentQuestion.questionPS}`;
    answerENElement.innerHTML = `<strong>Answer:</strong> ${currentQuestion.answerEN}`;
    answerPSElement.innerHTML = `<strong>ځواب:</strong> ${currentQuestion.answerPS}`;
    cardCounter.textContent = `${currentQuestionIndex + 1}/${questions.length}`;

    // Reset card to show question side
    flashcard.classList.remove('flipped');
}

// Show the answer
showAnswerButton.addEventListener('click', () => {
    flashcard.classList.add('flipped');
});

// Play English audio
playAudioENButton.addEventListener('click', () => {
    playAudio('en');
});

// Play Pashto audio
playAudioPSButton.addEventListener('click', () => {
    playAudio('ps');
});

function playAudio(language) {
    const currentQuestion = questions[currentQuestionIndex];
    const audioSrc = language === 'en' ? currentQuestion.audioEN : currentQuestion.audioPS;

    if (audioPlayer) {
        audioPlayer.pause();
    }

    // Fix audio path
    const correctedAudioSrc = audioSrc.replace('/audio/', 'src/assets/audio/');

    audioPlayer = new Audio(correctedAudioSrc);
    audioPlayer.onerror = () => {
        // Try text-to-speech as fallback
        tryTextToSpeechFlashcard(language);
    };
    audioPlayer.play().catch(error => {
        console.error('Audio playback failed:', error);
        tryTextToSpeechFlashcard(language);
    });
}

function tryTextToSpeechFlashcard(language) {
    const currentQuestion = questions[currentQuestionIndex];
    const questionText = language === 'en' ? currentQuestion.questionEN : currentQuestion.questionPS;
    const answerText = language === 'en' ? currentQuestion.answerEN : currentQuestion.answerPS;
    const fullText = questionText + '. ' + answerText;

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = language === 'ps' ? 'ps-AF' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    } else {
        const message = language === 'ps'
            ? 'د غږ فایل موندل نشو. د متن څخه غږ جوړول هم د دغه براوزر لخوا ملاتړ نشو.'
            : 'Audio file not found and text-to-speech is not supported in this browser.';
        alert(message);
    }
}

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

// Initialize the flashcards
initializeFlashcards();
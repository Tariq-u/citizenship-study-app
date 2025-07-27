import { citizenshipData } from '../data/citizenshipData.js';

const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submitAnswer');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const nextButton = document.getElementById('nextQuestion');
const languageSelect = document.getElementById('languageSelect');

let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 10; // Quiz length
let quizQuestions = [];
let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

// Translation object for UI elements
const translations = {
    en: {
        'Quiz': 'Quiz',
        'Submit Answer': 'Submit Answer',
        'Next Question': 'Next Question',
        'Correct!': 'Correct!',
        'Incorrect': 'Incorrect',
        'The correct answer is': 'The correct answer is',
        'Quiz Complete!': 'Quiz Complete!',
        'Your final score': 'Your final score',
        'Restart Quiz': 'Restart Quiz',
        'Score': 'Score'
    },
    ps: {
        'Quiz': 'ازموینه',
        'Submit Answer': 'ځواب وسپارئ',
        'Next Question': 'راتلونکې پوښتنه',
        'Correct!': 'سمه!',
        'Incorrect': 'غلطه',
        'The correct answer is': 'سمه ځواب دا دی',
        'Quiz Complete!': 'ازموینه بشپړه شوه!',
        'Your final score': 'ستاسو وروستۍ نمره',
        'Restart Quiz': 'ازموینه بیا پیل کړئ',
        'Score': 'نمره'
    }
};

function initializeQuiz() {
    // Set language selector to saved preference
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    updatePageLanguage();
    startQuiz();
}

function updatePageLanguage() {
    // Update page title
    const quizTitle = document.getElementById('quizTitle');
    if (quizTitle) {
        quizTitle.textContent = translations[currentLanguage]['Quiz'];
    }

    // Update button texts
    if (submitButton) {
        submitButton.textContent = translations[currentLanguage]['Submit Answer'];
    }

    if (nextButton) {
        nextButton.textContent = translations[currentLanguage]['Next Question'] + ' →';
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

function startQuiz() {
    // Shuffle and select random questions
    const shuffled = [...citizenshipData].sort(() => 0.5 - Math.random());
    quizQuestions = shuffled.slice(0, totalQuestions);

    currentQuestionIndex = 0;
    score = 0;

    showQuestion();
    updateScore();
}

function showQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showResults();
        return;
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionElement.textContent = currentLanguage === 'en' ? currentQuestion.questionEN : currentQuestion.questionPS;
    answerInput.value = '';
    feedbackElement.classList.add('hidden');
    feedbackElement.textContent = '';

    submitButton.style.display = 'inline-block';
    nextButton.style.display = 'none';
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswer = (currentLanguage === 'en' ? currentQuestion.answerEN : currentQuestion.answerPS).toLowerCase();

    const isCorrect = correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer.split(';')[0].trim());

    if (isCorrect) {
        score++;
        feedbackElement.textContent = translations[currentLanguage]['Correct!'];
        feedbackElement.className = 'feedback correct';
    } else {
        feedbackElement.textContent = `${translations[currentLanguage]['Incorrect']}. ${translations[currentLanguage]['The correct answer is']}: ${currentLanguage === 'en' ? currentQuestion.answerEN : currentQuestion.answerPS}`;
        feedbackElement.className = 'feedback incorrect';
    }

    feedbackElement.classList.remove('hidden');
    submitButton.style.display = 'none';
    nextButton.style.display = 'inline-block';

    updateScore();
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

function showResults() {
    const percentage = Math.round((score / totalQuestions) * 100);

    questionElement.textContent = translations[currentLanguage]['Quiz Complete!'];
    answerInput.style.display = 'none';
    feedbackElement.textContent = `${translations[currentLanguage]['Your final score']}: ${score}/${totalQuestions} (${percentage}%)`;
    feedbackElement.className = 'feedback final-score';
    feedbackElement.classList.remove('hidden');

    submitButton.textContent = translations[currentLanguage]['Restart Quiz'];
    submitButton.style.display = 'inline-block';
    nextButton.style.display = 'none';

    // Save quiz score
    localStorage.setItem('quizScore', percentage);
    updateMainProgress();
}

function updateScore() {
    scoreElement.textContent = `${translations[currentLanguage]['Score']}: ${score}/${currentQuestionIndex}`;
}

function updateMainProgress() {
    // Update the main app's progress tracking
    const completedQuestions = JSON.parse(localStorage.getItem('completedQuestions') || '[]');
    const progress = {
        questionsStudied: completedQuestions.length,
        quizScore: localStorage.getItem('quizScore') || 0
    };
    localStorage.setItem('citizenshipProgress', JSON.stringify(progress));
}

// Event listeners
submitButton.addEventListener('click', () => {
    if (submitButton.textContent === translations[currentLanguage]['Restart Quiz']) {
        answerInput.style.display = 'block';
        startQuiz();
        submitButton.textContent = translations[currentLanguage]['Submit Answer'];
    } else {
        checkAnswer();
    }
});

nextButton.addEventListener('click', nextQuestion);

languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('selectedLanguage', currentLanguage);
    updatePageLanguage();
    showQuestion(); // Refresh current question in new language
});

// Initialize the quiz
initializeQuiz();
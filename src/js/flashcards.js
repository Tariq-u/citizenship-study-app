const flashcardsContainer = document.getElementById('flashcards-container');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const showAnswerButton = document.getElementById('show-answer');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const languageSelect = document.getElementById('languageSelect');
const cardCounter = document.getElementById('cardCounter');

let currentQuestionIndex = 0;
let questions = [];
let currentLanguage = 'en';

// Fetch questions from the JSON file
async function loadQuestions() {
    const response = await fetch('./assets/data/questions.json');
    questions = await response.json();
    updateCard();
}

// Update the displayed question and answer
function updateCard() {
    questionElement.textContent = questions[currentQuestionIndex][currentLanguage].question;
    answerElement.textContent = questions[currentQuestionIndex][currentLanguage].answer;
    cardCounter.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
}

// Show the answer
showAnswerButton.addEventListener('click', () => {
    answerElement.style.display = 'block';
});

// Load the next question
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        answerElement.style.display = 'none'; // Hide answer when moving to the next question
        updateCard();
    }
});

// Load the previous question
prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        answerElement.style.display = 'none'; // Hide answer when moving to the previous question
        updateCard();
    }
});

// Change the language of the question and answer
languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    updateCard();
});

// Initialize the flashcards
loadQuestions();
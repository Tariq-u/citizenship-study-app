import { citizenshipData } from '../data/citizenshipData.js';

const sections = {
    AMERICAN_GOVERNMENT: 'American Government',
    AMERICAN_HISTORY: 'American History',
    INTEGRATED_CIVICS: 'Integrated Civics'
};

// Translation object for UI elements
const translations = {
    en: {
        'American Government': 'American Government',
        'American History': 'American History',
        'Integrated Civics': 'Integrated Civics',
        'All Sections': 'All Sections',
        'Search': 'Search questions...',
        'Questions': 'Questions',
        'Progress': 'Progress',
        'Lessons': 'Lessons',
        'Study Mode': 'Study Mode',
        'Show Completed': 'Show Completed',
        'Show Bookmarked': 'Show Bookmarked'
    },
    ps: {
        'American Government': 'د امریکا حکومت',
        'American History': 'د امریکا تاریخ',
        'Integrated Civics': 'ګډ مدني زده کړې',
        'All Sections': 'ټول برخې',
        'Search': 'پوښتنې پلټئ...',
        'Questions': 'پوښتنې',
        'Progress': 'پرمختګ',
        'Lessons': 'زده کړې',
        'Study Mode': 'د زده کړې حالت',
        'Show Completed': 'بشپړ شوي وښایاست',
        'Show Bookmarked': 'نښه شوي وښایاست'
    }
};

let audioPlayer = null;
let bookmarkedQuestions = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
let completedQuestions = JSON.parse(localStorage.getItem('completedQuestions') || '[]');
let currentFilter = 'all'; // 'all', 'completed', 'bookmarked', or section name
let searchQuery = '';
let studyMode = false;

function createSectionNav() {
    const nav = document.createElement('nav');
    nav.className = 'section-nav';
    nav.innerHTML = Object.values(sections).map(section => `
        <button class="section-btn ${currentSection === section ? 'active' : ''}"
                onclick="changeSection('${section}')">
            ${translations[currentLanguage][section] || section}
        </button>
    `).join('');
    return nav;
}

function handleAudioPlay(audioSrc, button, language = 'en') {
    if (audioPlayer) {
        audioPlayer.pause();
    }

    // Show loading state
    const playIcon = button.querySelector('.play-icon');
    const loadingIcon = button.querySelector('.loading-icon');
    playIcon.classList.add('hidden');
    loadingIcon.classList.remove('hidden');
    button.disabled = true;

    // Fix audio path - convert to correct path
    const correctedAudioSrc = audioSrc.replace('/audio/', 'src/assets/audio/');

    audioPlayer = new Audio(correctedAudioSrc);
    audioPlayer.onended = () => {
        // Reset button state
        playIcon.classList.remove('hidden');
        loadingIcon.classList.add('hidden');
        button.disabled = false;
    };
    audioPlayer.onerror = () => {
        // Reset button state on error
        playIcon.classList.remove('hidden');
        loadingIcon.classList.add('hidden');
        button.disabled = false;

        // Try text-to-speech as fallback
        tryTextToSpeech(button, language);
    };
    audioPlayer.play().catch(error => {
        console.error('Audio playback failed:', error);
        // Reset button state
        playIcon.classList.remove('hidden');
        loadingIcon.classList.add('hidden');
        button.disabled = false;

        // Try text-to-speech as fallback
        tryTextToSpeech(button, language);
    });
}

function tryTextToSpeech(button, language) {
    // Get the question and answer text from the card based on language
    const card = button.closest('.question-card');
    let questionText, answerText;

    if (language === 'ps') {
        questionText = card.querySelector('.question-pashto').textContent.replace('پښتو:', '').trim();
        answerText = card.querySelector('.answer-pashto').textContent.replace('ځواب:', '').trim();
    } else {
        questionText = card.querySelector('.question-english').textContent.replace('English:', '').trim();
        answerText = card.querySelector('.answer-english').textContent.replace('Answer:', '').trim();
    }

    const fullText = questionText + '. ' + answerText;

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fullText);

        // Set language
        utterance.lang = language === 'ps' ? 'ps-AF' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;

        utterance.onend = () => {
            const playIcon = button.querySelector('.play-icon');
            const loadingIcon = button.querySelector('.loading-icon');
            playIcon.classList.remove('hidden');
            loadingIcon.classList.add('hidden');
            button.disabled = false;
        };

        speechSynthesis.speak(utterance);
    } else {
        // Show user-friendly message
        const message = language === 'ps'
            ? 'د غږ فایل موندل نشو. د متن څخه غږ جوړول هم د دغه براوزر لخوا ملاتړ نشو.'
            : 'Audio file not found and text-to-speech is not supported in this browser.';
        alert(message);
    }
}

function createQuestionCard(q, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    const isBookmarked = bookmarkedQuestions.includes(q.id);
    const isCompleted = completedQuestions.includes(q.id);

    card.innerHTML = `
        <div class="card-header">
            <span class="question-number">#${q.id}</span>
            <span class="section-tag">${q.section}</span>
        </div>
        <div class="question-section">
            <div class="question-english">
                <span class="language-label">English:</span>
                ${q.questionEN}
            </div>
            <div class="question-pashto" lang="ps">
                <span class="language-label">پښتو:</span>
                ${q.questionPS}
            </div>
        </div>
        <div class="answer-section">
            <div class="answer-english">
                <span class="language-label">Answer:</span>
                ${q.answerEN}
            </div>
            <div class="answer-pashto" lang="ps">
                <span class="language-label">ځواب:</span>
                ${q.answerPS}
            </div>
        </div>
        <div class="card-footer">
            <button class="audio-button english-audio" onclick="handleAudioPlay('${q.audioEN}', this, 'en')" title="Play English Audio">
                <span class="play-icon">▶</span>
                <span class="loading-icon hidden">⌛</span>
                <span class="audio-label">EN</span>
            </button>
            <button class="audio-button pashto-audio" onclick="handleAudioPlay('${q.audioPS}', this, 'ps')" title="Play Pashto Audio">
                <span class="play-icon">▶</span>
                <span class="loading-icon hidden">⌛</span>
                <span class="audio-label">PS</span>
            </button>
            <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(${q.id})" title="Bookmark">
                <span class="bookmark-icon">${isBookmarked ? '🔖' : '📑'}</span>
            </button>
            <button class="complete-btn ${isCompleted ? 'completed' : ''}" onclick="toggleComplete(${q.id})" title="Mark as Complete">
                <span class="complete-icon">${isCompleted ? '✅' : '⭕'}</span>
            </button>
        </div>
    `;
    return card;
}

function renderQuestions() {
    const content = document.getElementById('lessonContent');
    content.innerHTML = '';
    
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'section-header';
    sectionHeader.innerHTML = `
        <h2>${translations[currentLanguage][currentSection]}</h2>
        <div class="progress-bar">
            <div class="progress" style="width: ${getProgress()}%"></div>
        </div>
    `;
    
    content.appendChild(createSectionNav());
    content.appendChild(sectionHeader);
    
    const questionsGrid = document.createElement('div');
    questionsGrid.className = 'questions-grid';
    
    const questions = citizenshipData.filter(q => q.section === currentSection);
    questions.forEach((q, index) => {
        questionsGrid.appendChild(createQuestionCard(q, index));
    });
    
    content.appendChild(questionsGrid);
}

function getProgress() {
    const sectionQuestions = citizenshipData.filter(q => q.section === currentSection);
    const completedInSection = completedQuestions.filter(id =>
        sectionQuestions.some(q => q.id === id)
    );
    return sectionQuestions.length > 0 ? (completedInSection.length / sectionQuestions.length) * 100 : 0;
}

// Add missing functions
function toggleBookmark(questionId) {
    const index = bookmarkedQuestions.indexOf(questionId);
    if (index > -1) {
        bookmarkedQuestions.splice(index, 1);
    } else {
        bookmarkedQuestions.push(questionId);
    }
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(bookmarkedQuestions));
    renderQuestions(); // Re-render to update UI
}

function toggleComplete(questionId) {
    const index = completedQuestions.indexOf(questionId);
    if (index > -1) {
        completedQuestions.splice(index, 1);
    } else {
        completedQuestions.push(questionId);
    }
    localStorage.setItem('completedQuestions', JSON.stringify(completedQuestions));
    renderQuestions(); // Re-render to update UI
    updateMainProgress(); // Update main app progress
}

function updateMainProgress() {
    // Update the main app's progress tracking
    const progress = {
        questionsStudied: completedQuestions.length,
        quizScore: localStorage.getItem('quizScore') || 0
    };
    localStorage.setItem('citizenshipProgress', JSON.stringify(progress));
}

// Make functions globally accessible
window.changeSection = function(section) {
    currentSection = section;
    renderQuestions();
};

window.handleAudioPlay = handleAudioPlay;
window.toggleBookmark = toggleBookmark;
window.toggleComplete = toggleComplete;

// Initialize the app
function initializeLessons() {
    // Set document to support both LTR and RTL
    document.documentElement.setAttribute('lang', 'en');
    renderQuestions();
}

initializeLessons();
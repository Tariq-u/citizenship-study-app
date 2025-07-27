let progress = {
    questionsStudied: 0,
    quizScore: 0
};

let currentLanguage = 'en';

// Translation object for main page
const translations = {
    en: {
        appTitle: 'U.S. Citizenship Test Study App',
        lessons: 'Lessons',
        flashcards: 'Flashcards',
        quiz: 'Quiz',
        offlineMode: 'Offline Mode',
        yourProgress: 'Your Progress',
        questionsStudied: 'Questions Studied',
        quizScore: 'Quiz Score'
    },
    ps: {
        appTitle: 'د امریکا د تابعیت د ازموینې د زده کړې اپلیکیشن',
        lessons: 'زده کړې',
        flashcards: 'فلش کارتونه',
        quiz: 'ازموینه',
        offlineMode: 'آفلاین حالت',
        yourProgress: 'ستاسو پرمختګ',
        questionsStudied: 'مطالعه شوي پوښتنې',
        quizScore: 'د ازموینې نمره'
    }
};

function initializeApp() {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('citizenshipProgress');
    if (savedProgress) {
        progress = JSON.parse(savedProgress);
        updateProgressDisplay();
    }

    // Check online status
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Set document to support both languages
    document.documentElement.setAttribute('lang', 'en');
}

function updateProgressDisplay() {
    document.getElementById('questionsStudied').textContent = 
        `${progress.questionsStudied}/100`;
    document.getElementById('quizScore').textContent = 
        `${progress.quizScore}%`;
}

function updateOnlineStatus() {
    const indicator = document.getElementById('offlineIndicator');
    if (navigator.onLine) {
        indicator.classList.add('hidden');
    } else {
        indicator.classList.remove('hidden');
    }
}

// Removed updateLanguage function since we're showing both languages together

initializeApp();
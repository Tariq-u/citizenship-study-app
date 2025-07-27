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

    // Initialize language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            updateLanguage();
            localStorage.setItem('selectedLanguage', currentLanguage);
        });

        // Load saved language preference
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            currentLanguage = savedLanguage;
            languageSelect.value = savedLanguage;
            updateLanguage();
        }
    }
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

function updateLanguage() {
    const elements = {
        appTitle: document.getElementById('appTitle'),
        lessonsText: document.getElementById('lessonsText'),
        flashcardsText: document.getElementById('flashcardsText'),
        quizText: document.getElementById('quizText'),
        offlineText: document.getElementById('offlineText'),
        progressTitle: document.getElementById('progressTitle'),
        questionsStudiedLabel: document.getElementById('questionsStudiedLabel'),
        quizScoreLabel: document.getElementById('quizScoreLabel')
    };

    // Update text content based on current language
    Object.keys(elements).forEach(key => {
        const element = elements[key];
        const translationKey = key.replace('Text', '').replace('Label', '').replace('Title', '');
        let finalKey = translationKey;

        // Map element IDs to translation keys
        if (key === 'appTitle') finalKey = 'appTitle';
        else if (key === 'lessonsText') finalKey = 'lessons';
        else if (key === 'flashcardsText') finalKey = 'flashcards';
        else if (key === 'quizText') finalKey = 'quiz';
        else if (key === 'offlineText') finalKey = 'offlineMode';
        else if (key === 'progressTitle') finalKey = 'yourProgress';
        else if (key === 'questionsStudiedLabel') finalKey = 'questionsStudied';
        else if (key === 'quizScoreLabel') finalKey = 'quizScore';

        if (element && translations[currentLanguage][finalKey]) {
            element.textContent = translations[currentLanguage][finalKey];
        }
    });

    // Update document direction for RTL languages
    if (currentLanguage === 'ps') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ps');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }
}

initializeApp();
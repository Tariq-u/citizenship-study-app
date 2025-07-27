let progress = {
    questionsStudied: 0,
    quizScore: 0
};

let currentTheme = localStorage.getItem('theme') || 'light';

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

    // Initialize theme
    applyTheme(currentTheme);
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

// Theme management functions
function toggleTheme() {
    const themes = ['light', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    currentTheme = themes[(currentIndex + 1) % themes.length];

    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    }
}

// Make theme functions globally accessible
window.toggleTheme = toggleTheme;

// Add keyboard shortcut for theme toggle
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + T for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
    }
});

initializeApp();
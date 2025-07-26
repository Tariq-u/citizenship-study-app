let progress = {
    questionsStudied: 0,
    quizScore: 0
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

initializeApp();
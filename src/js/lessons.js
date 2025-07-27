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

function createControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'control-panel';
    panel.innerHTML = `
        <div class="search-section">
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Search questions..." class="search-input">
                <button class="search-btn" onclick="performSearch()">🔍</button>
            </div>
        </div>
        <div class="filter-section">
            <div class="filter-group">
                <label>Filter by Section:</label>
                <select id="sectionFilter" onchange="applyFilter()">
                    <option value="all">All Sections (${citizenshipData.length})</option>
                    ${Object.values(sections).map(section => {
                        const count = citizenshipData.filter(q => q.section === section).length;
                        return `<option value="${section}">${section} (${count})</option>`;
                    }).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>Show:</label>
                <select id="statusFilter" onchange="applyFilter()">
                    <option value="all">All Questions</option>
                    <option value="completed">Completed (${completedQuestions.length})</option>
                    <option value="bookmarked">Bookmarked (${bookmarkedQuestions.length})</option>
                    <option value="incomplete">Not Completed</option>
                </select>
            </div>
        </div>
        <div class="study-controls">
            <button class="study-btn" onclick="toggleStudyMode()" id="studyModeBtn">
                📚 Study Mode: OFF
            </button>
            <button class="progress-btn" onclick="showProgress()">
                📊 Progress
            </button>
        </div>
    `;
    return panel;
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
    card.dataset.questionId = q.id;
    const isBookmarked = bookmarkedQuestions.includes(q.id);
    const isCompleted = completedQuestions.includes(q.id);

    // Add intersection observer for view tracking
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackQuestionView(q.id);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(card);
    }

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

    // Add control panel
    content.appendChild(createControlPanel());

    // Add progress overview
    const progressOverview = document.createElement('div');
    progressOverview.className = 'progress-overview';
    progressOverview.innerHTML = `
        <div class="progress-stats">
            <div class="stat-item">
                <span class="stat-number">${completedQuestions.length}</span>
                <span class="stat-label">Completed</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${bookmarkedQuestions.length}</span>
                <span class="stat-label">Bookmarked</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${citizenshipData.length}</span>
                <span class="stat-label">Total Questions</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${Math.round((completedQuestions.length / citizenshipData.length) * 100)}%</span>
                <span class="stat-label">Progress</span>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress" style="width: ${(completedQuestions.length / citizenshipData.length) * 100}%"></div>
        </div>
    `;
    content.appendChild(progressOverview);

    // Filter and display questions
    const filteredQuestions = getFilteredQuestions();

    const questionsGrid = document.createElement('div');
    questionsGrid.className = 'questions-grid';
    questionsGrid.id = 'questionsGrid';

    if (filteredQuestions.length === 0) {
        questionsGrid.innerHTML = `
            <div class="no-results">
                <h3>No questions found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
    } else {
        filteredQuestions.forEach((q, index) => {
            questionsGrid.appendChild(createQuestionCard(q, index));
        });
    }

    content.appendChild(questionsGrid);

    // Add floating action button for quick actions
    const fab = document.createElement('div');
    fab.className = 'floating-action-btn';
    fab.innerHTML = `
        <button class="fab-btn" onclick="scrollToTop()" title="Scroll to Top">
            ↑
        </button>
    `;
    content.appendChild(fab);
}

function getFilteredQuestions() {
    let filtered = [...citizenshipData];

    // Apply section filter
    const sectionFilter = document.getElementById('sectionFilter');
    if (sectionFilter && sectionFilter.value !== 'all') {
        filtered = filtered.filter(q => q.section === sectionFilter.value);
    }

    // Apply status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        switch (statusFilter.value) {
            case 'completed':
                filtered = filtered.filter(q => completedQuestions.includes(q.id));
                break;
            case 'bookmarked':
                filtered = filtered.filter(q => bookmarkedQuestions.includes(q.id));
                break;
            case 'incomplete':
                filtered = filtered.filter(q => !completedQuestions.includes(q.id));
                break;
        }
    }

    // Apply search filter
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(q =>
            q.questionEN.toLowerCase().includes(query) ||
            q.questionPS.toLowerCase().includes(query) ||
            q.answerEN.toLowerCase().includes(query) ||
            q.answerPS.toLowerCase().includes(query)
        );
    }

    return filtered;
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput ? searchInput.value : '';
    renderQuestions();
}

function applyFilter() {
    renderQuestions();
}

function toggleStudyMode() {
    studyMode = !studyMode;
    const btn = document.getElementById('studyModeBtn');
    if (btn) {
        btn.textContent = `📚 Study Mode: ${studyMode ? 'ON' : 'OFF'}`;
        btn.classList.toggle('active', studyMode);
    }

    // Apply study mode styling
    document.body.classList.toggle('study-mode', studyMode);

    if (studyMode) {
        // Hide answers initially in study mode
        document.querySelectorAll('.answer-section').forEach(section => {
            section.style.display = 'none';
        });

        // Add reveal buttons
        document.querySelectorAll('.question-card').forEach(card => {
            if (!card.querySelector('.reveal-answer-btn')) {
                const revealBtn = document.createElement('button');
                revealBtn.className = 'reveal-answer-btn';
                revealBtn.textContent = 'Show Answer';
                revealBtn.onclick = () => {
                    const answerSection = card.querySelector('.answer-section');
                    answerSection.style.display = answerSection.style.display === 'none' ? 'block' : 'none';
                    revealBtn.textContent = answerSection.style.display === 'none' ? 'Show Answer' : 'Hide Answer';
                };
                card.querySelector('.question-section').appendChild(revealBtn);
            }
        });
    } else {
        // Show all answers
        document.querySelectorAll('.answer-section').forEach(section => {
            section.style.display = 'block';
        });

        // Remove reveal buttons
        document.querySelectorAll('.reveal-answer-btn').forEach(btn => btn.remove());
    }
}

function showProgress() {
    const modal = document.createElement('div');
    modal.className = 'progress-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>📊 Study Progress</h2>
                <button class="close-btn" onclick="this.closest('.progress-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="progress-details">
                    <div class="section-progress">
                        ${Object.values(sections).map(section => {
                            const sectionQuestions = citizenshipData.filter(q => q.section === section);
                            const sectionCompleted = sectionQuestions.filter(q => completedQuestions.includes(q.id));
                            const percentage = sectionQuestions.length > 0 ? Math.round((sectionCompleted.length / sectionQuestions.length) * 100) : 0;
                            return `
                                <div class="section-stat">
                                    <h4>${section}</h4>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${percentage}%"></div>
                                    </div>
                                    <span>${sectionCompleted.length}/${sectionQuestions.length} (${percentage}%)</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
window.handleAudioPlay = handleAudioPlay;
window.toggleBookmark = toggleBookmark;
window.toggleComplete = toggleComplete;
window.performSearch = performSearch;
window.applyFilter = applyFilter;
window.toggleStudyMode = toggleStudyMode;
window.showProgress = showProgress;
window.scrollToTop = scrollToTop;

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + F for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Ctrl/Cmd + S for study mode
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        toggleStudyMode();
    }

    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            performSearch();
        }
    }
});

// Add search input event listener
document.addEventListener('input', (e) => {
    if (e.target.id === 'searchInput') {
        // Debounce search
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            performSearch();
        }, 300);
    }
});

// Initialize the app
function initializeLessons() {
    // Set document to support both LTR and RTL
    document.documentElement.setAttribute('lang', 'en');
    renderQuestions();

    // Add welcome message for first-time users
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(() => {
            showWelcomeMessage();
            localStorage.setItem('hasVisited', 'true');
        }, 1000);
    }
}

function showWelcomeMessage() {
    const welcome = document.createElement('div');
    welcome.className = 'welcome-message';
    welcome.innerHTML = `
        <div class="welcome-content">
            <h3>🎉 Welcome to Enhanced U.S. Citizenship Study!</h3>
            <p>Your app now has powerful new features:</p>
            <ul>
                <li>📚 <strong>Study Mode</strong> - Hide answers to test yourself (Ctrl+S)</li>
                <li>🔍 <strong>Advanced Search</strong> - Find any topic instantly (Ctrl+F)</li>
                <li>� <strong>Progress Tracking</strong> - See detailed study analytics</li>
                <li>�📑 <strong>Smart Bookmarks</strong> - Save important questions</li>
                <li>🌙 <strong>Dark Mode</strong> - Toggle theme (Ctrl+Shift+T)</li>
                <li>🔊 <strong>Dual Audio</strong> - EN/PS buttons for pronunciations</li>
                <li>🌍 <strong>Dual Language</strong> - English & Pashto side-by-side</li>
            </ul>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="this.closest('.welcome-message').remove()" style="margin-right: 10px;">Start Studying!</button>
                <button onclick="window.open('demo-features.html', '_blank')" style="background: #10b981;">See All Features</button>
            </div>
        </div>
    `;
    document.body.appendChild(welcome);
}

// Add study session tracking
let studySession = {
    startTime: Date.now(),
    questionsViewed: new Set(),
    questionsCompleted: 0,
    bookmarksAdded: 0
};

function trackQuestionView(questionId) {
    studySession.questionsViewed.add(questionId);
    updateStudyStats();
}

function updateStudyStats() {
    // Update study session statistics
    const sessionTime = Math.floor((Date.now() - studySession.startTime) / 1000 / 60); // minutes
    localStorage.setItem('lastStudySession', JSON.stringify({
        ...studySession,
        sessionTime,
        questionsViewed: Array.from(studySession.questionsViewed)
    }));
}

initializeLessons();
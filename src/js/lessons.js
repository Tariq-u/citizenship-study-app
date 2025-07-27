import { citizenshipData } from '../data/citizenshipData.js';

// Global state
let audioPlayer = null;
let bookmarkedQuestions = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
let completedQuestions = JSON.parse(localStorage.getItem('completedQuestions') || '[]');
let searchQuery = '';
let studyMode = false;
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing lessons...');
    initializeLessons();
});

function initializeLessons() {
    console.log('Initializing lessons with', citizenshipData.length, 'questions');
    
    // Apply theme
    applyTheme(currentTheme);
    
    // Render the complete interface
    renderLessonsInterface();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show welcome message for first-time users
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(showWelcomeMessage, 1000);
        localStorage.setItem('hasVisited', 'true');
    }
}

function renderLessonsInterface() {
    const content = document.getElementById('lessonContent');
    if (!content) {
        console.error('lessonContent element not found');
        return;
    }
    
    content.innerHTML = '';
    
    // Add theme toggle to header if not exists
    addThemeToggle();
    
    // Create and add control panel
    const controlPanel = createControlPanel();
    content.appendChild(controlPanel);
    
    // Create and add progress overview
    const progressOverview = createProgressOverview();
    content.appendChild(progressOverview);
    
    // Create and add questions grid
    const questionsGrid = createQuestionsGrid();
    content.appendChild(questionsGrid);
    
    // Add floating action button
    const fab = createFloatingActionButton();
    content.appendChild(fab);
    
    console.log('Interface rendered successfully');
}

function addThemeToggle() {
    // Add theme toggle to header if it doesn't exist
    const header = document.querySelector('header');
    if (header && !header.querySelector('.theme-toggle')) {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.onclick = toggleTheme;
        themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.title = `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`;
        themeToggle.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.75rem;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        `;
        header.appendChild(themeToggle);
    }
}

function createControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'control-panel';
    
    const sections = [...new Set(citizenshipData.map(q => q.section))];
    
    panel.innerHTML = `
        <div class="search-section">
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="🔍 Search questions and answers..." class="search-input">
                <button class="search-btn" onclick="performSearch()">Search</button>
            </div>
        </div>
        <div class="filter-section">
            <div class="filter-group">
                <label>📚 Filter by Section:</label>
                <select id="sectionFilter" onchange="applyFilter()">
                    <option value="all">All Sections (${citizenshipData.length})</option>
                    ${sections.map(section => {
                        const count = citizenshipData.filter(q => q.section === section).length;
                        return `<option value="${section}">${section} (${count})</option>`;
                    }).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>📊 Show:</label>
                <select id="statusFilter" onchange="applyFilter()">
                    <option value="all">All Questions</option>
                    <option value="completed">Completed (${completedQuestions.length})</option>
                    <option value="bookmarked">Bookmarked (${bookmarkedQuestions.length})</option>
                    <option value="incomplete">Not Completed (${citizenshipData.length - completedQuestions.length})</option>
                </select>
            </div>
        </div>
        <div class="study-controls">
            <button class="study-btn" onclick="toggleStudyMode()" id="studyModeBtn">
                📚 Study Mode: OFF
            </button>
            <button class="progress-btn" onclick="showProgress()">
                📊 Progress Details
            </button>
            <button class="theme-btn" onclick="toggleTheme()">
                🌙 Toggle Theme
            </button>
        </div>
    `;
    return panel;
}

function createProgressOverview() {
    const overview = document.createElement('div');
    overview.className = 'progress-overview';
    
    const totalQuestions = citizenshipData.length;
    const completedCount = completedQuestions.length;
    const bookmarkedCount = bookmarkedQuestions.length;
    const progressPercent = Math.round((completedCount / totalQuestions) * 100);
    
    overview.innerHTML = `
        <div class="progress-stats">
            <div class="stat-item">
                <span class="stat-number">${completedCount}</span>
                <span class="stat-label">Completed</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${bookmarkedCount}</span>
                <span class="stat-label">Bookmarked</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${totalQuestions}</span>
                <span class="stat-label">Total Questions</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${progressPercent}%</span>
                <span class="stat-label">Progress</span>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress" style="width: ${progressPercent}%"></div>
        </div>
    `;
    return overview;
}

function createQuestionsGrid() {
    const grid = document.createElement('div');
    grid.className = 'questions-grid';
    grid.id = 'questionsGrid';
    
    const filteredQuestions = getFilteredQuestions();
    
    if (filteredQuestions.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <h3>No questions found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
    } else {
        filteredQuestions.forEach((q) => {
            const card = createQuestionCard(q);
            grid.appendChild(card);
        });
    }
    
    return grid;
}

function createFloatingActionButton() {
    const fab = document.createElement('div');
    fab.className = 'floating-action-btn';
    fab.innerHTML = `
        <button class="fab-btn" onclick="scrollToTop()" title="Scroll to Top">
            ↑
        </button>
    `;
    return fab;
}

function createQuestionCard(q) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.dataset.questionId = q.id;
    const isBookmarked = bookmarkedQuestions.includes(q.id);
    const isCompleted = completedQuestions.includes(q.id);
    
    // Ensure we have the data we need
    const questionEN = q.questionEN || 'Question not available';
    const questionPS = q.questionPS || 'پوښتنه شتون نلري';
    const answerEN = q.answerEN || 'Answer not available';
    const answerPS = q.answerPS || 'ځواب شتون نلري';
    
    console.log('Creating card for question:', q.id, 'EN:', questionEN.substring(0, 50), 'PS:', questionPS.substring(0, 50));
    
    card.innerHTML = `
        <div class="card-header">
            <span class="question-number">#${q.id}</span>
            <span class="section-tag">${q.section}</span>
        </div>
        <div class="question-section">
            <div class="question-english">
                <span class="language-label">🇺🇸 English:</span>
                ${questionEN}
            </div>
            <div class="question-pashto" lang="ps" dir="rtl">
                <span class="language-label">🇦🇫 پښتو:</span>
                ${questionPS}
            </div>
        </div>
        <div class="answer-section" ${studyMode ? 'style="display: none;"' : ''}>
            <div class="answer-english">
                <span class="language-label">✅ Answer:</span>
                ${answerEN}
            </div>
            <div class="answer-pashto" lang="ps" dir="rtl">
                <span class="language-label">✅ ځواب:</span>
                ${answerPS}
            </div>
        </div>
        <div class="card-footer">
            <button class="audio-button english-audio" onclick="handleAudioPlay('${q.audioEN || ''}', this, 'en')" title="Play English Audio">
                <span class="play-icon">▶</span>
                <span class="loading-icon hidden">⌛</span>
                <span class="audio-label">EN</span>
            </button>
            <button class="audio-button pashto-audio" onclick="handleAudioPlay('${q.audioPS || ''}', this, 'ps')" title="Play Pashto Audio">
                <span class="play-icon">▶</span>
                <span class="loading-icon hidden">⌛</span>
                <span class="audio-label">PS</span>
            </button>
            <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(${q.id})" title="Bookmark Question">
                <span class="bookmark-icon">${isBookmarked ? '🔖' : '📑'}</span>
            </button>
            <button class="complete-btn ${isCompleted ? 'completed' : ''}" onclick="toggleComplete(${q.id})" title="Mark as Complete">
                <span class="complete-icon">${isCompleted ? '✅' : '⭕'}</span>
            </button>
        </div>
    `;
    
    return card;
}

// Audio handling functions
function handleAudioPlay(audioSrc, button, language = 'en') {
    if (audioPlayer) {
        audioPlayer.pause();
    }

    // Show loading state
    const playIcon = button.querySelector('.play-icon');
    const loadingIcon = button.querySelector('.loading-icon');
    if (playIcon && loadingIcon) {
        playIcon.classList.add('hidden');
        loadingIcon.classList.remove('hidden');
    }
    button.disabled = true;

    // Try text-to-speech directly since audio files may not exist
    tryTextToSpeech(button, language);
}

function tryTextToSpeech(button, language) {
    // Get the question and answer text from the card based on language
    const card = button.closest('.question-card');
    let questionText, answerText;

    if (language === 'ps') {
        const questionEl = card.querySelector('.question-pashto');
        const answerEl = card.querySelector('.answer-pashto');
        questionText = questionEl ? questionEl.textContent.replace('🇦🇫 پښتو:', '').trim() : '';
        answerText = answerEl ? answerEl.textContent.replace('✅ ځواب:', '').trim() : '';
    } else {
        const questionEl = card.querySelector('.question-english');
        const answerEl = card.querySelector('.answer-english');
        questionText = questionEl ? questionEl.textContent.replace('🇺🇸 English:', '').trim() : '';
        answerText = answerEl ? answerEl.textContent.replace('✅ Answer:', '').trim() : '';
    }

    const fullText = questionText + '. ' + answerText;

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = language === 'ps' ? 'ps-AF' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;

        utterance.onend = () => {
            resetAudioButton(button);
        };

        speechSynthesis.speak(utterance);
    } else {
        const message = language === 'ps'
            ? 'د غږ فایل موندل نشو. د متن څخه غږ جوړول هم د دغه براوزر لخوا ملاتړ نشو.'
            : 'Audio file not found and text-to-speech is not supported in this browser.';
        alert(message);
        resetAudioButton(button);
    }
}

function resetAudioButton(button) {
    const playIcon = button.querySelector('.play-icon');
    const loadingIcon = button.querySelector('.loading-icon');
    if (playIcon && loadingIcon) {
        playIcon.classList.remove('hidden');
        loadingIcon.classList.add('hidden');
    }
    button.disabled = false;
}

// Bookmark and completion functions
function toggleBookmark(questionId) {
    const index = bookmarkedQuestions.indexOf(questionId);
    if (index > -1) {
        bookmarkedQuestions.splice(index, 1);
    } else {
        bookmarkedQuestions.push(questionId);
    }
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(bookmarkedQuestions));
    renderLessonsInterface(); // Re-render to update UI
}

function toggleComplete(questionId) {
    const index = completedQuestions.indexOf(questionId);
    if (index > -1) {
        completedQuestions.splice(index, 1);
    } else {
        completedQuestions.push(questionId);
    }
    localStorage.setItem('completedQuestions', JSON.stringify(completedQuestions));
    renderLessonsInterface(); // Re-render to update UI
    updateMainProgress(); // Update main app progress
}

function updateMainProgress() {
    const progress = {
        questionsStudied: completedQuestions.length,
        quizScore: localStorage.getItem('quizScore') || 0
    };
    localStorage.setItem('citizenshipProgress', JSON.stringify(progress));
}

// Search and filter functions
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
    console.log('Performing search for:', searchQuery);
    renderLessonsInterface();
}

function applyFilter() {
    console.log('Applying filters');
    renderLessonsInterface();
}

// Study mode functions
function toggleStudyMode() {
    studyMode = !studyMode;
    const btn = document.getElementById('studyModeBtn');
    if (btn) {
        btn.textContent = `📚 Study Mode: ${studyMode ? 'ON' : 'OFF'}`;
        btn.classList.toggle('active', studyMode);
    }

    console.log('Study mode toggled:', studyMode);
    renderLessonsInterface();
}

// Theme functions
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update theme toggle buttons
    const themeButtons = document.querySelectorAll('.theme-toggle, .theme-btn');
    themeButtons.forEach(btn => {
        if (btn.classList.contains('theme-toggle')) {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
        } else {
            btn.textContent = `${theme === 'dark' ? '☀️' : '🌙'} Toggle Theme`;
        }
    });
}

// Progress and utility functions
function showProgress() {
    const modal = document.createElement('div');
    modal.className = 'progress-modal';

    const sections = [...new Set(citizenshipData.map(q => q.section))];

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>📊 Detailed Study Progress</h2>
                <button class="close-btn" onclick="this.closest('.progress-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="progress-details">
                    <div class="section-progress">
                        ${sections.map(section => {
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

function setupEventListeners() {
    // Search input with debouncing
    let searchTimeout;
    document.addEventListener('input', (e) => {
        if (e.target.id === 'searchInput') {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch();
            }, 300);
        }
    });

    // Keyboard shortcuts
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

        // Ctrl/Cmd + Shift + T for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTheme();
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
                <li>📊 <strong>Progress Tracking</strong> - See detailed study analytics</li>
                <li>📑 <strong>Smart Bookmarks</strong> - Save important questions</li>
                <li>🌙 <strong>Dark Mode</strong> - Toggle theme (Ctrl+Shift+T)</li>
                <li>🔊 <strong>Dual Audio</strong> - EN/PS buttons for pronunciations</li>
                <li>🌍 <strong>Dual Language</strong> - English & Pashto side-by-side</li>
            </ul>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="this.closest('.welcome-message').remove()" style="margin-right: 10px;">Start Studying!</button>
            </div>
        </div>
    `;
    document.body.appendChild(welcome);
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
window.toggleTheme = toggleTheme;

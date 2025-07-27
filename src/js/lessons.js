import { citizenshipData } from '../data/citizenshipData.js';

// Global state
let bookmarkedQuestions = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
let completedQuestions = JSON.parse(localStorage.getItem('completedQuestions') || '[]');
let searchQuery = '';
let studyMode = false;
let currentTheme = localStorage.getItem('theme') || 'light';

console.log('🚀 Lessons module loaded with', citizenshipData.length, 'questions');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM ready, initializing lessons...');
    initializeLessons();
});

function initializeLessons() {
    console.log('📊 Total questions available:', citizenshipData.length);
    console.log('📊 Question ID range:', citizenshipData[0]?.id, 'to', citizenshipData[citizenshipData.length - 1]?.id);
    
    // Apply theme
    applyTheme(currentTheme);
    
    // Render interface
    renderCompleteInterface();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('✅ Lessons initialized successfully');
}

function renderCompleteInterface() {
    const content = document.getElementById('lessonContent');
    if (!content) {
        console.error('❌ lessonContent element not found');
        return;
    }
    
    console.log('🎨 Rendering complete interface...');
    content.innerHTML = '';
    
    // Add theme toggle to header
    addThemeToggle();
    
    // Create control panel
    const controlPanel = createControlPanel();
    content.appendChild(controlPanel);
    
    // Create progress overview
    const progressOverview = createProgressOverview();
    content.appendChild(progressOverview);
    
    // Create questions display
    const questionsContainer = createAllQuestionsDisplay();
    content.appendChild(questionsContainer);
    
    // Add floating action button
    const fab = createFloatingActionButton();
    content.appendChild(fab);
    
    console.log('✅ Interface rendered with', document.querySelectorAll('.question-card').length, 'question cards');
}

function addThemeToggle() {
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
                <input type="text" id="searchInput" placeholder="🔍 Search all ${citizenshipData.length} questions and answers..." class="search-input">
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
                    <option value="all">All Questions (${citizenshipData.length})</option>
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

function createAllQuestionsDisplay() {
    console.log('📝 Creating questions display for all', citizenshipData.length, 'questions...');
    
    const container = document.createElement('div');
    container.className = 'questions-container';
    
    const grid = document.createElement('div');
    grid.className = 'questions-grid';
    grid.id = 'questionsGrid';
    
    // Get filtered questions
    const filteredQuestions = getFilteredQuestions();
    console.log('📝 Filtered questions count:', filteredQuestions.length);
    
    if (filteredQuestions.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <h3>No questions found</h3>
                <p>Try adjusting your search or filter criteria.</p>
                <p>Total available: ${citizenshipData.length} questions</p>
            </div>
        `;
    } else {
        // Create all question cards
        filteredQuestions.forEach((question, index) => {
            const card = createQuestionCard(question, index);
            grid.appendChild(card);
            
            // Log progress for large sets
            if (filteredQuestions.length > 50 && (index + 1) % 25 === 0) {
                console.log(`📝 Created ${index + 1}/${filteredQuestions.length} question cards`);
            }
        });
        
        console.log('✅ All question cards created:', filteredQuestions.length);
    }
    
    container.appendChild(grid);
    return container;
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

function createQuestionCard(q, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.dataset.questionId = q.id;
    
    const isBookmarked = bookmarkedQuestions.includes(q.id);
    const isCompleted = completedQuestions.includes(q.id);
    
    // Ensure we have the data
    const questionEN = q.questionEN || 'Question not available';
    const questionPS = q.questionPS || 'پوښتنه شتون نلري';
    const answerEN = q.answerEN || 'Answer not available';
    const answerPS = q.answerPS || 'ځواب شتون نلري';
    
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
            <button class="audio-button english-audio" onclick="handleAudioPlay('${q.audioEN || ''}', this, 'en')" title="Play English Audio (Clean Text Only)">
                <span class="play-icon">▶</span>
                <span class="loading-icon hidden">⌛</span>
                <span class="audio-label">EN</span>
            </button>
            <button class="audio-button pashto-audio" onclick="handleAudioPlay('${q.audioPS || ''}', this, 'ps')" title="Play Pashto Audio (Clean Text Only)">
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

// Filtering and search functions
function getFilteredQuestions() {
    console.log('🔍 Filtering from', citizenshipData.length, 'total questions');
    let filtered = [...citizenshipData];

    // Apply section filter
    const sectionFilter = document.getElementById('sectionFilter');
    if (sectionFilter && sectionFilter.value !== 'all') {
        const beforeCount = filtered.length;
        filtered = filtered.filter(q => q.section === sectionFilter.value);
        console.log(`🔍 Section filter: ${beforeCount} → ${filtered.length}`);
    }

    // Apply status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter && statusFilter.value !== 'all') {
        const beforeCount = filtered.length;
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
        console.log(`🔍 Status filter: ${beforeCount} → ${filtered.length}`);
    }

    // Apply search filter
    if (searchQuery.trim()) {
        const beforeCount = filtered.length;
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(q =>
            q.questionEN.toLowerCase().includes(query) ||
            q.questionPS.toLowerCase().includes(query) ||
            q.answerEN.toLowerCase().includes(query) ||
            q.answerPS.toLowerCase().includes(query)
        );
        console.log(`🔍 Search filter: ${beforeCount} → ${filtered.length}`);
    }

    console.log('🔍 Final filtered count:', filtered.length);
    return filtered;
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput ? searchInput.value : '';
    console.log('🔍 Performing search:', searchQuery);
    renderCompleteInterface();
}

function applyFilter() {
    console.log('🔍 Applying filters');
    renderCompleteInterface();
}

// Study mode and theme functions
function toggleStudyMode() {
    studyMode = !studyMode;
    const btn = document.getElementById('studyModeBtn');
    if (btn) {
        btn.textContent = `📚 Study Mode: ${studyMode ? 'ON' : 'OFF'}`;
        btn.classList.toggle('active', studyMode);
    }
    console.log('📚 Study mode:', studyMode);
    renderCompleteInterface();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
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

// Bookmark and completion functions
function toggleBookmark(questionId) {
    const index = bookmarkedQuestions.indexOf(questionId);
    if (index > -1) {
        bookmarkedQuestions.splice(index, 1);
    } else {
        bookmarkedQuestions.push(questionId);
    }
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(bookmarkedQuestions));
    console.log('📑 Bookmark toggled for question', questionId);
    renderCompleteInterface();
}

function toggleComplete(questionId) {
    const index = completedQuestions.indexOf(questionId);
    if (index > -1) {
        completedQuestions.splice(index, 1);
    } else {
        completedQuestions.push(questionId);
    }
    localStorage.setItem('completedQuestions', JSON.stringify(completedQuestions));
    console.log('✅ Completion toggled for question', questionId);
    renderCompleteInterface();

    // Update main app progress
    const progress = {
        questionsStudied: completedQuestions.length,
        quizScore: localStorage.getItem('quizScore') || 0
    };
    localStorage.setItem('citizenshipProgress', JSON.stringify(progress));
}

// Enhanced Audio function with fallback
function handleAudioPlay(audioSrc, button, language = 'en') {
    console.log('🔊 Playing audio for language:', language, 'Source:', audioSrc);

    // Show loading state
    const playIcon = button.querySelector('.play-icon');
    const loadingIcon = button.querySelector('.loading-icon');
    if (playIcon && loadingIcon) {
        playIcon.classList.add('hidden');
        loadingIcon.classList.remove('hidden');
    }
    button.disabled = true;

    // Try to play audio file first, then fallback to text-to-speech
    if (audioSrc && audioSrc.trim() !== '') {
        tryAudioFile(audioSrc, button, language);
    } else {
        tryTextToSpeech(button, language);
    }
}

function tryAudioFile(audioSrc, button, language) {
    const audio = new Audio(audioSrc);

    audio.onloadeddata = () => {
        console.log('🔊 Audio file loaded successfully:', audioSrc);
        audio.play();
    };

    audio.onended = () => {
        resetAudioButton(button);
    };

    audio.onerror = (error) => {
        console.log('🔊 Audio file failed, falling back to text-to-speech:', error);
        tryTextToSpeech(button, language);
    };

    // Timeout fallback
    setTimeout(() => {
        if (audio.readyState === 0) {
            console.log('🔊 Audio file timeout, falling back to text-to-speech');
            tryTextToSpeech(button, language);
        }
    }, 2000);
}

// Helper function to clean text content from labels and prefixes
function cleanTextContent(text, prefixesToRemove) {
    if (!text || typeof text !== 'string') {
        return '';
    }

    let cleanText = text;

    // Remove all specified prefixes
    prefixesToRemove.forEach(prefix => {
        cleanText = cleanText.replace(new RegExp(prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
    });

    // Remove common artifacts and clean up
    cleanText = cleanText
        .replace(/^\s*[#]\d+\s*/, '') // Remove question numbers like "#1"
        .replace(/^\s*Question\s*:?\s*/i, '') // Remove "Question:" prefix
        .replace(/^\s*Answer\s*:?\s*/i, '') // Remove "Answer:" prefix
        .replace(/^\s*پوښتنه\s*:?\s*/, '') // Remove Pashto "Question:" prefix
        .replace(/^\s*ځواب\s*:?\s*/, '') // Remove Pashto "Answer:" prefix
        .replace(/[🇺🇸🇦🇫✅📝🔊]/g, '') // Remove emoji flags and symbols
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim(); // Remove leading/trailing whitespace

    console.log('🧹 Cleaned text:', cleanText.substring(0, 50) + '...');
    return cleanText;
}

function tryTextToSpeech(button, language) {
    const card = button.closest('.question-card');
    let questionText, answerText;

    console.log('🔊 Starting text-to-speech for language:', language);

    if (language === 'ps') {
        const questionEl = card.querySelector('.question-pashto');
        const answerEl = card.querySelector('.answer-pashto');

        console.log('🔊 Found Pashto elements:', !!questionEl, !!answerEl);
        console.log('🔊 Raw question text:', questionEl?.textContent);
        console.log('🔊 Raw answer text:', answerEl?.textContent);

        // Get pure text content without any labels
        questionText = questionEl ? cleanTextContent(questionEl.textContent, ['🇦🇫 پښتو:', 'پښتو:', 'پوښتنه:']) : '';
        answerText = answerEl ? cleanTextContent(answerEl.textContent, ['✅ ځواب:', 'ځواب:', 'Answer:']) : '';
    } else {
        const questionEl = card.querySelector('.question-english');
        const answerEl = card.querySelector('.answer-english');

        console.log('🔊 Found English elements:', !!questionEl, !!answerEl);
        console.log('🔊 Raw question text:', questionEl?.textContent);
        console.log('🔊 Raw answer text:', answerEl?.textContent);

        // Get pure text content without any labels
        questionText = questionEl ? cleanTextContent(questionEl.textContent, ['🇺🇸 English:', 'English:', 'Question:']) : '';
        answerText = answerEl ? cleanTextContent(answerEl.textContent, ['✅ Answer:', 'Answer:', 'ځواب:']) : '';
    }

    console.log('🔊 Cleaned question:', questionText);
    console.log('🔊 Cleaned answer:', answerText);

    // Check if we have valid text
    if (!questionText && !answerText) {
        console.error('🔊 No text found to speak');
        resetAudioButton(button);
        alert('No text content found to play.');
        return;
    }

    // Speak both question and answer with clean text only
    const textToSpeak = (questionText + '. ' + answerText).replace(/^\.\s*/, '').trim();
    console.log('🔊 Final text to speak:', textToSpeak);
    console.log('🔊 Text length:', textToSpeak.length);

    if ('speechSynthesis' in window && textToSpeak.trim() !== '') {
        // Stop any ongoing speech
        speechSynthesis.cancel();

        // Create utterance with simplified settings
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        // Use simple, widely supported language codes
        utterance.lang = language === 'ps' ? 'en-US' : 'en-US'; // Use English for both for now
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Set up event handlers
        utterance.onstart = () => {
            console.log('🔊 Speech started successfully');
        };

        utterance.onend = () => {
            console.log('🔊 Speech completed successfully');
            resetAudioButton(button);
        };

        utterance.onerror = (event) => {
            console.error('🔊 Speech error:', event.error, event);
            resetAudioButton(button);

            // Show user-friendly error message
            const errorMsg = `Audio failed: ${event.error || 'Unknown error'}. Please try again.`;
            alert(errorMsg);
        };

        // Start speech synthesis
        console.log('🔊 Starting speech synthesis...');
        console.log('🔊 Text length:', textToSpeak.length);
        console.log('🔊 Text preview:', textToSpeak.substring(0, 100));

        try {
            speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('🔊 Speech synthesis error:', error);
            resetAudioButton(button);
            alert('Speech synthesis failed: ' + error.message);
        }
    } else {
        resetAudioButton(button);
        const message = !textToSpeak.trim()
            ? 'No text content found to play.'
            : 'Text-to-speech is not supported in this browser.';
        console.log('🔊 Cannot play audio:', message);
        alert(message);
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

// Progress modal
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

// Utility functions
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
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            toggleStudyMode();
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }

        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                performSearch();
            }
        }
    });
}

// Test audio function
function testAudio() {
    console.log('🔊 Testing audio system...');

    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();

        const testText = "Hello, this is a test of the audio system.";
        const utterance = new SpeechSynthesisUtterance(testText);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            console.log('🔊 Test audio started successfully');
        };

        utterance.onend = () => {
            console.log('🔊 Test audio completed successfully');
        };

        utterance.onerror = (event) => {
            console.error('🔊 Test audio error:', event.error, event);
            alert('Audio test failed: ' + (event.error || 'Unknown error'));
        };

        try {
            speechSynthesis.speak(utterance);
            console.log('🔊 Test speech synthesis started');
        } catch (error) {
            console.error('🔊 Test speech synthesis failed:', error);
            alert('Speech synthesis failed: ' + error.message);
        }
    } else {
        alert('Speech synthesis is not supported in this browser.');
    }
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
window.testAudio = testAudio;

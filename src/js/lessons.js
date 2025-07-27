import { citizenshipData } from '../data/citizenshipData.js';
import { AudioPlayer } from './audioPlayer.js';

const lessonContent = document.getElementById('lessonContent');
const languageSelect = document.getElementById('languageSelect');
let currentLanguage = 'en';
const QUESTIONS_PER_PAGE = 10;
let currentPage = 1;

function createQuestionElement(question) {
    const div = document.createElement('div');
    div.className = 'lesson-item';
    
    div.innerHTML = `
        <div class="question-number">Question ${question.id}</div>
        <div class="question">${currentLanguage === 'en' ? question.questionEn : question.questionPs}</div>
        <div class="answer">${currentLanguage === 'en' ? question.answerEn : question.answerPs}</div>
        <div class="audio-controls">
            <button class="audio-button" data-audio="${currentLanguage === 'en' ? question.audioEn : question.audioPs}">
                <span class="play-icon">▶</span>
                <span class="loading-icon hidden">⌛</span>
            </button>
        </div>
    `;
    return div;
}

function renderPagination() {
    const totalPages = Math.ceil(citizenshipData.length / QUESTIONS_PER_PAGE);
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    
    paginationDiv.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>
    `;
    
    return paginationDiv;
}

function renderLessons() {
    lessonContent.innerHTML = '';
    const startIdx = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const endIdx = startIdx + QUESTIONS_PER_PAGE;
    
    citizenshipData.slice(startIdx, endIdx).forEach(question => {
        lessonContent.appendChild(createQuestionElement(question));
    });
    
    lessonContent.appendChild(renderPagination());
}

window.changePage = (page) => {
    currentPage = page;
    AudioPlayer.stop();
    renderLessons();
};

function handleAudioPlay(button) {
    const audio = new Audio(button.dataset.audio);
    const playIcon = button.querySelector('.play-icon');
    const loadingIcon = button.querySelector('.loading-icon');

    playIcon.classList.add('hidden');
    loadingIcon.classList.remove('hidden');

    audio.addEventListener('canplaythrough', () => {
        loadingIcon.classList.add('hidden');
        playIcon.classList.remove('hidden');
        audio.play();
    });

    audio.addEventListener('ended', () => {
        button.disabled = false;
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('audio-button')) {
        handleAudioPlay(e.target);
    }
});

languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    AudioPlayer.stop();
    renderLessons();
});

renderLessons();
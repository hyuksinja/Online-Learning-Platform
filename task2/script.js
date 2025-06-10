document.addEventListener('DOMContentLoaded', () => {
    const lessonList = document.getElementById('lesson-list');
    const videoPlayer = document.getElementById('video-player');
    const currentLessonTitle = document.getElementById('current-lesson-title');
    const markCompleteBtn = document.getElementById('mark-complete-btn');
    const nextLessonBtn = document.getElementById('next-lesson-btn');
    const quizSection = document.querySelector('.quiz-section');
    const quizTitle = document.getElementById('quiz-title');
    const quizQuestionsContainer = document.getElementById('quiz-questions');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const quizResultDiv = document.getElementById('quiz-result');
    const courseProgressBar = document.getElementById('course-progress-bar');
    const progressText = document.getElementById('progress-text');
    const downloadCertificateBtn = document.getElementById('download-certificate-btn');

    let currentLessonIndex = 0;
    let completedLessons = new Set();
    let quizScore = 0;

    // Mock data - In a real application, this would come from a backend API
    const lessons = [
        {
            id: 'intro',
            title: 'Introduction to Web Development',
            videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL_RGaFp_EwVqTph_Xf-w_IqM1n-e5aJb7', // Example playlist/video
            type: 'video'
        },
        {
            id: 'html-basics',
            title: 'HTML Fundamentals',
            videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL_RGaFp_EwVqTph_Xf-w_IqM1n-e5aJb7', // Example playlist/video
            type: 'video'
        },
        {
            id: 'css-styling',
            title: 'CSS Styling Essentials',
            videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL_RGaFp_EwVqTph_Xf-w_IqM1n-e5aJb7', // Example playlist/video
            type: 'video'
        },
        {
            id: 'js-intro',
            title: 'JavaScript Introduction',
            videoUrl: 'https://www.youtube.com/embed/videoseries?list=PL_RGaFp_EwVqTph_Xf-w_IqM1n-e5aJb7', // Example playlist/video
            type: 'video'
        },
        {
            id: 'final-quiz',
            title: 'Final Assessment Quiz',
            type: 'quiz',
            questions: [
                {
                    question: 'What does HTML stand for?',
                    options: ['Hyper Text Markup Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language'],
                    correctAnswer: 'Hyper Text Markup Language'
                },
                {
                    question: 'Which CSS property is used for changing the text color of an element?',
                    options: ['background-color', 'color', 'font-color'],
                    correctAnswer: 'color'
                },
                {
                    question: 'What is the correct way to write an alert box in JavaScript?',
                    options: ['alert("Hello World");', 'msgBox("Hello World");', 'alertBox("Hello World");'],
                    correctAnswer: 'alert("Hello World");'
                }
            ]
        }
    ];

    // Function to render lessons in the sidebar
    function renderLessons() {
        lessonList.innerHTML = '';
        lessons.forEach((lesson, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.index = index;
            a.innerHTML = `<i class="fas ${lesson.type === 'video' ? 'fa-video' : 'fa-clipboard-question'}"></i> ${lesson.title}`;
            a.classList.add('lesson-item');

            if (index === currentLessonIndex) {
                a.classList.add('active-lesson');
            }
            if (completedLessons.has(lesson.id)) {
                a.classList.add('completed-lesson');
                a.innerHTML = `<i class="fas fa-check"></i> ${lesson.title}`;
            }

            a.addEventListener('click', (e) => {
                e.preventDefault();
                loadLesson(index);
            });
            li.appendChild(a);
            lessonList.appendChild(li);
        });
    }

    // Function to load a specific lesson
    function loadLesson(index) {
        if (index < 0 || index >= lessons.length) return;

        currentLessonIndex = index;
        const lesson = lessons[currentLessonIndex];

        // Update active lesson in sidebar
        document.querySelectorAll('.lesson-item').forEach(item => item.classList.remove('active-lesson'));
        document.querySelector(`.lesson-item[data-index="${index}"]`).classList.add('active-lesson');

        currentLessonTitle.textContent = lesson.title;

        if (lesson.type === 'video') {
            videoPlayer.style.display = 'block';
            videoPlayer.src = lesson.videoUrl;
            markCompleteBtn.style.display = 'inline-flex';
            nextLessonBtn.style.display = 'inline-flex';
            quizSection.style.display = 'none';
            quizResultDiv.style.display = 'none';
            submitQuizBtn.style.display = 'none';
        } else if (lesson.type === 'quiz') {
            videoPlayer.style.display = 'none';
            markCompleteBtn.style.display = 'none';
            nextLessonBtn.style.display = 'none';
            quizSection.style.display = 'block';
            loadQuiz(lesson);
        }

        updateProgress();
    }

    // Function to mark current lesson as complete
    markCompleteBtn.addEventListener('click', () => {
        const currentLesson = lessons[currentLessonIndex];
        if (!completedLessons.has(currentLesson.id)) {
            completedLessons.add(currentLesson.id);
            alert(`Lesson "${currentLesson.title}" marked as complete!`);
            renderLessons(); // Re-render to update UI
            updateProgress();
        } else {
            alert(`Lesson "${currentLesson.title}" is already complete.`);
        }
    });

    // Function to go to the next lesson
    nextLessonBtn.addEventListener('click', () => {
        if (currentLessonIndex < lessons.length - 1) {
            loadLesson(currentLessonIndex + 1);
        } else {
            alert('You have reached the end of the course content. Please complete the quiz!');
        }
    });

    // Function to load and display quiz
    function loadQuiz(quizLesson) {
        quizTitle.textContent = quizLesson.title;
        quizQuestionsContainer.innerHTML = '';
        quizResultDiv.style.display = 'none';
        submitQuizBtn.style.display = 'inline-flex';

        quizLesson.questions.forEach((q, qIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('quiz-question');
            questionDiv.innerHTML = `<p>${qIndex + 1}. ${q.question}</p>`;

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('quiz-options');

            q.options.forEach((option, oIndex) => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="radio" name="question${qIndex}" value="${option}">
                    ${option}
                `;
                optionsDiv.appendChild(label);
            });
            questionDiv.appendChild(optionsDiv);
            quizQuestionsContainer.appendChild(questionDiv);
        });
    }

    // Function to submit quiz
    submitQuizBtn.addEventListener('click', () => {
        const quizLesson = lessons[currentLessonIndex];
        let correctAnswers = 0;

        quizLesson.questions.forEach((q, qIndex) => {
            const selectedOption = document.querySelector(`input[name="question${qIndex}"]:checked`);
            if (selectedOption && selectedOption.value === q.correctAnswer) {
                correctAnswers++;
            }
        });

        quizScore = (correctAnswers / quizLesson.questions.length) * 100;
        quizResultDiv.style.display = 'block';

        if (quizScore >= 70) { // Example pass mark
            quizResultDiv.classList.remove('incorrect');
            quizResultDiv.classList.add('correct');
            quizResultDiv.innerHTML = `<i class="fas fa-check-circle"></i> You passed the quiz with ${quizScore.toFixed(2)}% !`;
            if (!completedLessons.has(quizLesson.id)) {
                completedLessons.add(quizLesson.id);
                renderLessons();
                updateProgress();
            }
        } else {
            quizResultDiv.classList.remove('correct');
            quizResultDiv.classList.add('incorrect');
            quizResultDiv.innerHTML = `<i class="fas fa-times-circle"></i> You scored ${quizScore.toFixed(2)}%. Please review and try again.`;
        }
        submitQuizBtn.style.display = 'none';
    });

    // Function to update progress bar and text
    function updateProgress() {
        const totalLessons = lessons.length;
        const completedCount = completedLessons.size;
        const progressPercentage = (completedCount / totalLessons) * 100;

        courseProgressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage.toFixed(0)}% Complete`;

        if (progressPercentage >= 100) {
            downloadCertificateBtn.style.display = 'inline-flex';
            alert('Congratulations! You have completed all lessons and quizzes. You are eligible for the certificate!');
        } else {
            downloadCertificateBtn.style.display = 'none';
        }
    }

    // Handle Certificate Download (Placeholder)
    downloadCertificateBtn.addEventListener('click', () => {
        alert('Certificate generation is a backend process. In a real application, this would trigger a download or a link to your certificate from the CODTECH system.');
        // In a real scenario, you'd likely make an API call to generate/fetch the certificate
        // window.open('/api/generate-certificate', '_blank');
    });

    // Initial load
    renderLessons();
    loadLesson(currentLessonIndex); // Load the first lesson on page load
    updateProgress();
});
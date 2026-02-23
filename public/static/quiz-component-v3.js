// =====================================================
// QUIZ COMPONENT V3 - Enhanced Quiz System
// Features:
// - All questions on one scrollable page
// - Circular radio buttons (A, B, C, D)
// - Difficulty badges
// - Progress counter on submit button
// - Validation before submission
// - Pass/Fail with explanations based on requirements
// - 3 attempts maximum
// - Keyboard accessible
// =====================================================

class QuizComponent {
  constructor(containerId, moduleId, studentId, enrollmentId) {
    this.container = document.getElementById(containerId);
    this.moduleId = moduleId;
    this.studentId = studentId;
    this.enrollmentId = enrollmentId;
    
    this.questions = [];
    this.currentAttempt = null;
    this.previousAttempts = [];
    this.studentAnswers = {};
    this.startTime = null;
    this.maxAttempts = 3;
  }

  async init() {
    try {
      // Load quiz questions
      await this.loadQuizData();
      
      // Check for previous attempts
      await this.loadPreviousAttempts();
      
      // Render quiz
      this.render();
    } catch (error) {
      console.error('Quiz initialization error:', error);
      this.showError(error.message || 'Failed to load quiz');
    }
  }

  async loadQuizData() {
    try {
      console.log('[QuizComponent] Loading quiz for:', { moduleId: this.moduleId, studentId: this.studentId });
      const url = `/api/student/module/${this.moduleId}/quiz?studentId=${this.studentId}`;
      console.log('[QuizComponent] Fetching:', url);
      
      const response = await axios.get(url);
      
      console.log('[QuizComponent] Response:', response.data);
      
      if (response.data.success) {
        this.questions = response.data.questions;
        console.log('[QuizComponent] Loaded', this.questions.length, 'questions');
      } else {
        throw new Error(response.data.message || 'Failed to load quiz');
      }
    } catch (error) {
      console.error('[QuizComponent] Load error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async loadPreviousAttempts() {
    try {
      console.log('[QuizComponent] Loading previous attempts...');
      const response = await axios.get(`/api/student/module/${this.moduleId}/quiz/attempts?studentId=${this.studentId}`);
      
      console.log('[QuizComponent] Attempts response:', response.data);
      
      if (response.data.success) {
        this.previousAttempts = response.data.attempts || [];
        console.log('[QuizComponent] Found', this.previousAttempts.length, 'previous attempts');
        
        // Find last attempt
        if (this.previousAttempts.length > 0) {
          this.currentAttempt = this.previousAttempts[0]; // Most recent
        }
      }
    } catch (error) {
      console.warn('[QuizComponent] Failed to load previous attempts, continuing anyway:', error);
      this.previousAttempts = [];
      this.currentAttempt = null;
    }
  }

  render() {
    // Check if passed already
    if (this.currentAttempt && this.currentAttempt.passed) {
      this.renderPassedResults();
      return;
    }
    
    // Check if max attempts reached
    if (this.previousAttempts.length >= this.maxAttempts && (!this.currentAttempt || !this.currentAttempt.passed)) {
      this.renderMaxAttemptsReached();
      return;
    }
    
    // Show quiz form (or failed results if applicable)
    if (!this.currentAttempt) {
      this.renderQuizForm();
    } else if (!this.currentAttempt.passed) {
      this.renderFailedResults();
    }
  }

  renderQuizForm() {
    this.startTime = Date.now();
    const attemptNumber = this.previousAttempts.length + 1;
    
    const html = `
      <div class="quiz-container max-w-4xl mx-auto">
        <!-- Quiz Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 class="text-3xl font-bold mb-2">Module 1 Quiz</h2>
          <p class="text-blue-100 mb-4">
            Answer all 20 questions to complete this assessment.
          </p>
          <div class="flex items-center justify-between bg-white/10 rounded-lg p-4">
            <div class="flex items-center space-x-6">
              <div class="text-center">
                <p class="text-2xl font-bold">${this.questions.length}</p>
                <p class="text-sm text-blue-100">Questions</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold">70%</p>
                <p class="text-sm text-blue-100">Passing Score</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold">40</p>
                <p class="text-sm text-blue-100">Minutes</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold">${attemptNumber}/${this.maxAttempts}</p>
                <p class="text-sm text-blue-100">Attempt</p>
              </div>
            </div>
          </div>
        </div>

        ${attemptNumber > 1 ? `
          <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
            <div class="flex items-start">
              <i class="fas fa-info-circle text-yellow-500 text-xl mr-3 mt-1"></i>
              <div>
                <p class="font-bold text-yellow-800">Retake Attempt ${attemptNumber}</p>
                <p class="text-yellow-700">You have ${this.maxAttempts - attemptNumber + 1} attempt(s) remaining.</p>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Quiz Form -->
        <form id="quizForm" class="space-y-8">
          ${this.questions.map((q, index) => this.renderQuestion(q, index)).join('')}
          
          <!-- Submit Button (Sticky) -->
          <div class="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 shadow-2xl -mx-4 sm:mx-0 sm:rounded-lg">
            <div id="progressWarning" class="hidden bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p class="text-red-800 text-sm font-medium">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span id="progressWarningText"></span>
              </p>
            </div>
            <button 
              type="submit" 
              id="submitQuizBtn"
              class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-lg"
            >
              <i class="fas fa-check-circle mr-2"></i>
              <span id="submitBtnText">Submit Quiz (0/${this.questions.length})</span>
            </button>
          </div>
        </form>
      </div>
    `;
    
    this.container.innerHTML = html;
    
    // Attach event listeners
    this.attachFormListeners();
  }

  renderQuestion(question, index) {
    const difficultyBadge = this.getDifficultyBadge(question.difficulty);
    const questionNumber = index + 1;
    
    return `
      <div class="question-card bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition" id="question-${question.id}">
        <!-- Question Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start space-x-3 flex-1">
            <span class="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              ${questionNumber}
            </span>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-sm font-medium text-gray-500">Question ${questionNumber} of ${this.questions.length}</span>
                ${difficultyBadge}
              </div>
              <p class="text-lg font-medium text-gray-900 leading-relaxed">
                ${question.question_text}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Answer Options -->
        <div class="space-y-3 ml-13">
          ${this.renderAnswerOptions(question)}
        </div>
      </div>
    `;
  }

  renderAnswerOptions(question) {
    // Build options array based on what's available
    const options = [
      { label: 'A', value: question.option_a },
      { label: 'B', value: question.option_b },
      { label: 'C', value: question.option_c },
      { label: 'D', value: question.option_d },
      { label: 'E', value: question.option_e }
    ].filter(opt => opt.value !== null && opt.value !== undefined && opt.value !== '');
    
    // Determine input type based on question type
    const isMultipleSelect = question.question_type === 'multiple_select';
    const inputType = isMultipleSelect ? 'checkbox' : 'radio';
    
    // For true/false questions, show special formatting
    const isTrueFalse = question.question_type === 'true_false';
    
    return options.map(option => `
      <label 
        class="quiz-option flex items-start p-4 border-2 border-gray-300 rounded-lg cursor-pointer transition hover:bg-gray-50 hover:border-blue-400 ${isTrueFalse ? 'hover:border-green-400' : ''}"
        data-question-id="${question.id}"
        style="min-height: 44px;"
      >
        <input 
          type="${inputType}" 
          name="question_${question.id}" 
          value="${option.label}"
          class="quiz-${inputType} mt-1 flex-shrink-0"
          data-question-id="${question.id}"
          style="width: 20px; height: 20px; cursor: pointer; ${inputType === 'checkbox' ? 'border-radius: 4px;' : ''}"
        >
        <div class="ml-4 flex-1">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-full ${isTrueFalse ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} font-bold text-sm mr-3">
            ${option.label}
          </span>
          <span class="text-gray-800">${option.value}</span>
        </div>
      </label>
    `).join('');
  }

  getDifficultyBadge(difficulty) {
    const badges = {
      'easy': '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">Easy</span>',
      'medium': '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase">Medium</span>',
      'hard': '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase">Hard</span>'
    };
    return badges[difficulty] || '';
  }

  attachFormListeners() {
    const form = document.getElementById('quizForm');
    const submitBtn = document.getElementById('submitQuizBtn');
    const progressWarning = document.getElementById('progressWarning');
    const progressWarningText = document.getElementById('progressWarningText');
    
    // Track answer selections
    const radioButtons = form.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', (e) => {
        // Update visual selection
        const questionId = e.target.dataset.questionId;
        this.updateOptionStyles(questionId);
        
        // Update progress counter
        this.updateProgressCounter();
      });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateAndSubmit();
    });
  }

  updateOptionStyles(questionId) {
    const labels = document.querySelectorAll(`label[data-question-id="${questionId}"]`);
    labels.forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio.checked) {
        label.classList.remove('border-gray-300');
        label.classList.add('border-blue-500', 'bg-blue-50');
      } else {
        label.classList.remove('border-blue-500', 'bg-blue-50');
        label.classList.add('border-gray-300');
      }
    });
  }

  updateProgressCounter() {
    const answeredCount = this.getAnsweredCount();
    const submitBtnText = document.getElementById('submitBtnText');
    if (submitBtnText) {
      submitBtnText.textContent = `Submit Quiz (${answeredCount}/${this.questions.length})`;
    }
  }

  getAnsweredCount() {
    let count = 0;
    this.questions.forEach(q => {
      const selected = document.querySelector(`input[name="question_${q.id}"]:checked`);
      if (selected) count++;
    });
    return count;
  }

  validateAndSubmit() {
    const answeredCount = this.getAnsweredCount();
    const totalCount = this.questions.length;
    const progressWarning = document.getElementById('progressWarning');
    const progressWarningText = document.getElementById('progressWarningText');
    
    if (answeredCount < totalCount) {
      // Show warning
      progressWarning.classList.remove('hidden');
      progressWarningText.textContent = `Please answer all ${totalCount} questions before submitting. You have answered ${answeredCount} out of ${totalCount}.`;
      
      // Scroll to warning
      progressWarning.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      return;
    }
    
    // Hide warning
    progressWarning.classList.add('hidden');
    
    // Proceed with submission
    this.submitQuiz();
  }

  async submitQuiz() {
    // Collect answers
    const formData = new FormData(document.getElementById('quizForm'));
    this.studentAnswers = {};
    
    this.questions.forEach(q => {
      if (q.question_type === 'multiple_select') {
        // For multiple-select questions, get all checked values
        const selectedValues = formData.getAll(`question_${q.id}`);
        if (selectedValues.length > 0) {
          // Join with commas to match database format (e.g., "A,C,E")
          this.studentAnswers[q.id] = selectedValues.join(',');
        }
      } else {
        // For single-answer questions (multiple-choice, true/false)
        const answer = formData.get(`question_${q.id}`);
        if (answer) {
          this.studentAnswers[q.id] = answer;
        }
      }
    });
    
    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Prepare submission data
    const submissionData = {
      studentId: this.studentId,
      enrollmentId: this.enrollmentId,
      answers: this.studentAnswers,
      timeSpentSeconds: timeSpent
    };
    
    console.log('[QuizComponent] Submitting quiz with data:', submissionData);
    
    // Show loading
    this.container.innerHTML = `
      <div class="text-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p class="text-xl text-gray-600 font-medium">Grading your quiz...</p>
        <p class="text-sm text-gray-500 mt-2">Please wait</p>
      </div>
    `;
    
    try {
      // Submit to backend
      const response = await axios.post(`/api/student/module/${this.moduleId}/quiz/submit`, submissionData);
      
      console.log('[QuizComponent] Submit response:', response.data);
      
      if (response.data.success) {
        this.currentAttempt = response.data.attempt;
        this.previousAttempts.unshift(this.currentAttempt);
        
        // Show results
        if (this.currentAttempt.passed) {
          this.renderPassedResults();
        } else {
          this.renderFailedResults();
        }
      } else {
        throw new Error(response.data.message || 'Failed to submit quiz');
      }
      
    } catch (error) {
      console.error('[QuizComponent] Quiz submission error:', error);
      this.showError(error.response?.data?.message || 'Failed to submit quiz. Please try again.');
    }
  }

  renderPassedResults() {
    const attempt = this.currentAttempt;
    const percentage = Math.round((attempt.correct_answers / attempt.total_questions) * 100);
    
    const html = `
      <div class="quiz-results max-w-4xl mx-auto">
        <!-- Success Header -->
        <div class="bg-green-50 border-2 border-green-500 rounded-lg p-8 mb-8 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <i class="fas fa-check text-4xl text-white"></i>
          </div>
          <h2 class="text-4xl font-bold text-green-800 mb-2">
            Congratulations! You Passed!
          </h2>
          <p class="text-xl text-green-700 mb-6">
            You scored <strong>${attempt.correct_answers}/${attempt.total_questions} (${percentage}%)</strong>
          </p>
          <p class="text-lg text-green-800 font-medium bg-green-100 rounded-lg p-4 inline-block">
            You may proceed to Module 2
          </p>
        </div>

        <!-- Question Review -->
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">
            Detailed Review - All Questions
          </h3>
          <p class="text-gray-600 mb-6">
            Review your answers and learn from the explanations below:
          </p>
        </div>

        <div class="space-y-6">
          ${this.questions.map((q, index) => this.renderQuestionReview(q, index, true)).join('')}
        </div>

        <!-- Close Button -->
        <div class="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 shadow-2xl mt-8 rounded-lg">
          <button 
            onclick="document.getElementById('quizModal').classList.add('hidden')"
            class="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition font-bold text-lg"
          >
            <i class="fas fa-arrow-right mr-2"></i>
            Close & Continue
          </button>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }

  renderFailedResults() {
    const attempt = this.currentAttempt;
    const percentage = Math.round((attempt.correct_answers / attempt.total_questions) * 100);
    const remainingAttempts = this.maxAttempts - this.previousAttempts.length;
    const isLastAttempt = remainingAttempts === 0;
    
    const html = `
      <div class="quiz-results max-w-4xl mx-auto">
        <!-- Failed Header -->
        <div class="bg-red-50 border-2 border-red-500 rounded-lg p-8 mb-8 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-4">
            <i class="fas fa-times text-4xl text-white"></i>
          </div>
          <h2 class="text-4xl font-bold text-red-800 mb-2">
            You scored ${attempt.correct_answers}/${attempt.total_questions} (${percentage}%)
          </h2>
          <p class="text-xl text-red-700 mb-6">
            You need 70% or higher to pass.
          </p>
          ${!isLastAttempt ? `
            <p class="text-lg text-red-800 font-medium bg-red-100 rounded-lg p-4 inline-block">
              You have ${remainingAttempts} attempt(s) remaining
            </p>
          ` : `
            <p class="text-lg text-red-800 font-medium bg-red-100 rounded-lg p-4 inline-block">
              This was your final attempt
            </p>
          `}
        </div>

        ${isLastAttempt ? `
          <!-- Show All Answers (Final Attempt) -->
          <div class="mb-6">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p class="text-blue-800">
                <i class="fas fa-info-circle mr-2"></i>
                <strong>Final Attempt:</strong> Below are all correct answers and explanations to help you learn.
              </p>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">
              Detailed Review - All Questions
            </h3>
          </div>

          <div class="space-y-6">
            ${this.questions.map((q, index) => this.renderQuestionReview(q, index, true)).join('')}
          </div>
        ` : `
          <!-- Hide Answers (Attempt Remaining) -->
          <div class="mb-6">
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
              <p class="text-yellow-800">
                <i class="fas fa-info-circle mr-2"></i>
                <strong>Try Again:</strong> Correct answers are hidden until you pass or reach your final attempt.
              </p>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">
              Your Score Summary
            </h3>
            <p class="text-gray-600 mb-6">
              You answered ${attempt.correct_answers} out of ${attempt.total_questions} questions correctly. 
              Review the module content and try again.
            </p>
          </div>
        `}

        <!-- Action Buttons -->
        <div class="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 shadow-2xl mt-8 rounded-lg space-y-3">
          ${!isLastAttempt ? `
            <button 
              onclick="location.reload()"
              class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
            >
              <i class="fas fa-redo mr-2"></i>
              Retry Quiz
            </button>
          ` : `
            <button 
              onclick="document.getElementById('quizModal').classList.add('hidden')"
              class="w-full bg-gray-600 text-white py-4 px-6 rounded-lg hover:bg-gray-700 transition font-bold text-lg"
            >
              <i class="fas fa-times mr-2"></i>
              Close
            </button>
          `}
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }

  renderQuestionReview(question, index, showCorrectAnswer) {
    const studentAnswer = this.currentAttempt.answers[question.id];
    const correctAnswer = question.correct_answer;
    const isCorrect = studentAnswer === correctAnswer;
    
    const borderColor = isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
    const iconColor = isCorrect ? 'text-green-600' : 'text-red-600';
    const icon = isCorrect ? 'fa-check-circle' : 'fa-times-circle';
    
    return `
      <div class="border-2 ${borderColor} rounded-lg p-6">
        <div class="flex items-start space-x-3 mb-4">
          <i class="fas ${icon} ${iconColor} text-2xl mt-1"></i>
          <div class="flex-1">
            <p class="font-bold text-gray-900 text-lg mb-3">
              Question ${index + 1}: ${question.question_text}
            </p>
            
            <div class="space-y-2 mb-4">
              <p class="text-sm">
                <span class="font-semibold">Your answer:</span> 
                <span class="${isCorrect ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}">${studentAnswer}</span>
                ${isCorrect ? ' ✓' : ' ✗'}
              </p>
              ${showCorrectAnswer && !isCorrect ? `
                <p class="text-sm">
                  <span class="font-semibold">Correct answer:</span> 
                  <span class="text-green-700 font-bold">${correctAnswer}</span> ✓
                </p>
              ` : ''}
            </div>

            ${showCorrectAnswer && question.explanation ? `
              <div class="bg-white border border-gray-300 rounded-lg p-4">
                <p class="font-semibold text-gray-800 mb-2">Explanation:</p>
                <p class="text-gray-700 leading-relaxed">${question.explanation}</p>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  renderMaxAttemptsReached() {
    const lastAttempt = this.previousAttempts[0];
    const percentage = Math.round((lastAttempt.correct_answers / lastAttempt.total_questions) * 100);
    
    const html = `
      <div class="max-w-4xl mx-auto">
        <div class="bg-red-50 border-2 border-red-500 rounded-lg p-8 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-4">
            <i class="fas fa-ban text-4xl text-white"></i>
          </div>
          <h2 class="text-3xl font-bold text-red-800 mb-4">
            Maximum Attempts Reached
          </h2>
          <p class="text-lg text-red-700 mb-4">
            You have used all ${this.maxAttempts} attempts for this quiz.
          </p>
          <p class="text-lg text-red-700 mb-6">
            Your best score: <strong>${lastAttempt.correct_answers}/${lastAttempt.total_questions} (${percentage}%)</strong>
          </p>
          <p class="text-gray-700 bg-white rounded-lg p-4 inline-block">
            Please contact your instructor for further assistance.
          </p>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }

  showError(message) {
    this.container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
        <p class="text-gray-700 text-xl mb-4">${message}</p>
        <button 
          onclick="location.reload()" 
          class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
        >
          <i class="fas fa-redo mr-2"></i>
          Try Again
        </button>
      </div>
    `;
  }
}

// Global reference for inline onclick handlers
let quizComponent = null;

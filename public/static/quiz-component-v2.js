// =====================================================
// STEP 3: QUIZ COMPONENT - Interactive Quiz System
// Features:
// - Display quiz questions
// - Track answers
// - Submit and grade
// - Show hints (no answers) if failed
// - Show full feedback if passed
// - Retake only wrong questions
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
        
        // Log first 3 questions to see their types
        console.log('[QuizComponent] Sample questions:', this.questions.slice(0, 3).map(q => ({
          order: q.order_number,
          type: q.question_type,
          text: q.question_text.substring(0, 50)
        })));
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
      // Don't throw - just continue without previous attempts
      this.previousAttempts = [];
      this.currentAttempt = null;
    }
  }

  render() {
    // Determine what to show based on attempt status
    if (!this.currentAttempt) {
      // First attempt - show all questions
      this.renderQuizForm(this.questions);
    } else if (this.currentAttempt.passed) {
      // Passed - show results with full explanations
      this.renderPassedResults();
    } else {
      // Failed - show results with hints, offer retake
      this.renderFailedResults();
    }
  }

  renderQuizForm(questions) {
    this.startTime = Date.now();
    
    const html = `
      <div class="quiz-container">
        <div class="quiz-header">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            📝 Module Quiz
          </h2>
          <p class="text-gray-600 mb-4">
            Answer all ${questions.length} questions. You need 70% to pass.
          </p>
          ${this.previousAttempts.length > 0 ? `
            <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
              <p class="text-yellow-700">
                <strong>Retake Attempt ${this.previousAttempts.length + 1}:</strong> 
                You're retaking ${questions.length} question(s) you got wrong.
              </p>
            </div>
          ` : ''}
        </div>

        <form id="quizForm" class="space-y-6">
          ${questions.map((q, index) => this.renderQuestion(q, index)).join('')}
          
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <button 
              type="submit" 
              class="w-full brand-bg text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition font-bold"
            >
              🎯 Submit Quiz
            </button>
          </div>
        </form>
      </div>
    `;
    
    this.container.innerHTML = html;
    
    // Attach submit handler
    document.getElementById('quizForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitQuiz();
    });
  }

  renderQuestion(question, index) {
    const options = question.options || [];
    const questionType = question.question_type || 'single_choice';
    const inputType = questionType === 'multiple_choice' ? 'checkbox' : 'radio';
    
    console.log('[QuizComponent] Rendering question', index + 1, {
      questionType,
      inputType,
      question: question.question_text.substring(0, 50)
    });
    
    return `
      <div class="question-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div class="flex items-start space-x-3 mb-4">
          <span class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold">
            ${index + 1}
          </span>
          <div class="flex-1">
            <p class="text-lg font-medium text-gray-800 mb-4">
              ${question.question_text}
            </p>
            
            ${questionType === 'multiple_choice' ? `
              <p class="text-sm text-blue-600 mb-3 font-semibold">
                <i class="fas fa-info-circle"></i> Select ALL that apply (multiple answers)
              </p>
            ` : ''}
            
            <div class="space-y-2">
              ${options.map((option, optIndex) => `
                <label class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input 
                    type="${inputType}" 
                    name="question_${question.id}${inputType === 'checkbox' ? `_${optIndex}` : ''}" 
                    value="${option}"
                    class="mt-1 flex-shrink-0"
                    data-question-id="${question.id}"
                    ${questionType === 'single_choice' || questionType === 'true_false' ? 'required' : ''}
                  >
                  <span class="text-gray-700 flex-1">${option}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex items-center space-x-2 text-sm">
          <span class="text-gray-500">${question.points || 1} point${(question.points || 1) > 1 ? 's' : ''}</span>
          ${this.getQuestionTypeLabel(questionType)}
        </div>
      </div>
    `;
  }
  
  getQuestionTypeLabel(type) {
    const labels = {
      'single_choice': '<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Single Answer</span>',
      'multiple_choice': '<span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Multiple Answers</span>',
      'true_false': '<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">True/False</span>'
    };
    return labels[type] || '';
  }

  getDifficultyClass(level) {
    switch(level) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  async submitQuiz() {
    // Collect answers
    const formData = new FormData(document.getElementById('quizForm'));
    this.studentAnswers = {};
    
    this.questions.forEach(q => {
      const questionType = q.question_type || 'single_choice';
      
      if (questionType === 'multiple_choice') {
        // For checkboxes, find all checked boxes with data-question-id attribute
        const checkedBoxes = document.querySelectorAll(`input[data-question-id="${q.id}"]:checked`);
        const selectedAnswers = Array.from(checkedBoxes).map(cb => cb.value);
        
        if (selectedAnswers.length > 0) {
          // Store as JSON array string to match the correct_answer format
          this.studentAnswers[q.id] = JSON.stringify(selectedAnswers.sort());
        }
      } else {
        // For radio buttons (single_choice and true_false)
        const answer = formData.get(`question_${q.id}`);
        if (answer) {
          this.studentAnswers[q.id] = answer;
        }
      }
    });
    
    // Validate all questions answered
    const unansweredCount = this.questions.length - Object.keys(this.studentAnswers).length;
    if (unansweredCount > 0) {
      alert(`Please answer all questions before submitting. ${unansweredCount} question(s) remaining.`);
      return;
    }
    
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
    console.log('[QuizComponent] Answer count:', Object.keys(this.studentAnswers).length);
    
    // Show loading
    this.container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Grading your quiz...</p>
      </div>
    `;
    
    try {
      // Submit to backend
      const response = await axios.post(`/api/student/module/${this.moduleId}/quiz/submit`, submissionData);
      
      console.log('[QuizComponent] Submit response:', response.data);
      
      if (response.data.success) {
        this.currentAttempt = response.data.attempt;
        
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
      if (error.response) {
        console.error('[QuizComponent] Error response:', error.response.data);
        console.error('[QuizComponent] Error status:', error.response.status);
      }
      this.showError(error.response?.data?.message || 'Failed to submit quiz. Please try again.');
    }
  }

  renderPassedResults() {
    const attempt = this.currentAttempt;
    const questionsWithResults = this.getQuestionsWithResults();
    
    const html = `
      <div class="quiz-results">
        <!-- Success Header -->
        <div class="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
          <div class="text-center">
            <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
            <h2 class="text-3xl font-bold text-green-800 mb-2">
              🎉 Congratulations! You Passed!
            </h2>
            <div class="flex justify-center space-x-8 mt-4">
              <div>
                <p class="text-4xl font-bold text-green-600">${attempt.percentage}%</p>
                <p class="text-gray-600">Your Score</p>
              </div>
              <div>
                <p class="text-4xl font-bold text-gray-700">${attempt.correct_answers}/${attempt.total_questions}</p>
                <p class="text-gray-600">Correct</p>
              </div>
              <div>
                <p class="text-4xl font-bold text-blue-600">${attempt.attempt_number}</p>
                <p class="text-gray-600">Attempt${attempt.attempt_number > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Feedback -->
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">
            📚 Detailed Feedback - All Questions
          </h3>
          <p class="text-gray-600 mb-4">
            Review your answers and learn from the explanations below:
          </p>
        </div>

        <div class="space-y-4">
          ${questionsWithResults.map((item, index) => this.renderDetailedFeedback(item, index)).join('')}
        </div>

        <!-- Action Buttons -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg mt-6">
          <button 
            id="completeModuleBtn"
            class="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition font-bold"
          >
            ✅ Close & Continue
          </button>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
    
    // Attach event listener with proper completion
    const self = this;
    const btn = document.getElementById('completeModuleBtn');
    
    console.log('[QuizComponent] Button found:', btn, 'ModuleId:', self.moduleId, 'EnrollmentId:', self.enrollmentId);
    
    if (!btn) {
      console.error('[QuizComponent] Complete button not found!');
      return;
    }
    
    btn.onclick = async function() {
      console.log('[QuizComponent] ===== BUTTON CLICKED =====');
      console.log('[QuizComponent] ModuleId:', self.moduleId);
      console.log('[QuizComponent] EnrollmentId:', self.enrollmentId);
      
      try {
        // Get session data
        const sessionData = JSON.parse(sessionStorage.getItem('studentSession') || localStorage.getItem('studentSession') || '{}');
        
        console.log('[QuizComponent] Session data:', sessionData);
        
        if (!sessionData.studentId) {
          alert('Session expired. Please login again.');
          window.location.href = '/student-login';
          return;
        }
        
        const apiUrl = `/api/student/module/${self.moduleId}/complete`;
        const requestBody = {
          studentId: sessionData.studentId,
          enrollmentId: self.enrollmentId
        };
        
        console.log('[QuizComponent] Calling API:', apiUrl);
        console.log('[QuizComponent] Request body:', requestBody);
        
        // Call the completion API
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log('[QuizComponent] Response status:', response.status);
        
        const result = await response.json();
        
        console.log('[QuizComponent] Response data:', result);
        
        if (result.success) {
          console.log('[QuizComponent] ✅ SUCCESS! Module marked as complete!');
          alert('🎉 Congratulations! Module completed successfully!');
          window.location.href = '/student/dashboard';
        } else {
          console.error('[QuizComponent] ❌ API returned failure:', result);
          alert('Failed to mark module complete: ' + (result.message || 'Unknown error'));
          // Don't redirect on failure
        }
      } catch (error) {
        console.error('[QuizComponent] ❌ EXCEPTION:', error);
        console.error('[QuizComponent] Error stack:', error.stack);
        alert('Error: ' + error.message);
        // Don't redirect on error
      }
    };
  }

  renderFailedResults() {
    const attempt = this.currentAttempt;
    const wrongQuestions = this.getWrongQuestions();
    const correctCount = attempt.correct_answers;
    const totalCount = attempt.total_questions;
    const required = Math.ceil(totalCount * 0.7);
    
    const html = `
      <div class="quiz-results">
        <!-- Failed Header -->
        <div class="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6 mb-6">
          <div class="text-center">
            <i class="fas fa-exclamation-circle text-6xl text-yellow-500 mb-4"></i>
            <h2 class="text-3xl font-bold text-yellow-800 mb-2">
              📚 Not Quite There Yet - Keep Learning!
            </h2>
            <div class="flex justify-center space-x-8 mt-4">
              <div>
                <p class="text-4xl font-bold text-yellow-600">${attempt.percentage}%</p>
                <p class="text-gray-600">Your Score</p>
              </div>
              <div>
                <p class="text-4xl font-bold text-gray-700">${correctCount}/${totalCount}</p>
                <p class="text-gray-600">Correct</p>
              </div>
              <div>
                <p class="text-4xl font-bold text-red-600">${required}</p>
                <p class="text-gray-600">Required (70%)</p>
              </div>
            </div>
            <p class="text-gray-700 mt-4">
              Don't worry! Review the hints below and try again.
            </p>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div class="flex items-start space-x-3">
            <i class="fas fa-info-circle text-blue-500 text-2xl"></i>
            <div>
              <p class="font-bold text-blue-800 mb-2">What happens next:</p>
              <ul class="text-blue-700 space-y-1">
                <li>✅ Questions you got right (${correctCount}) are <strong>locked</strong> - you don't need to answer them again</li>
                <li>❌ Questions you got wrong (${wrongQuestions.length}) - review the hints below</li>
                <li>📖 Study the module content and retake <strong>only the ${wrongQuestions.length} wrong questions</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Wrong Questions with Hints -->
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">
            ❌ Questions to Review (${wrongQuestions.length})
          </h3>
          <p class="text-gray-600 mb-4">
            Read the hints carefully. We're NOT showing you the answers - you need to learn!
          </p>
        </div>

        <div class="space-y-4">
          ${wrongQuestions.map((item, index) => this.renderHintFeedback(item, index)).join('')}
        </div>

        <!-- Action Buttons -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg mt-6 space-y-2">
          <button 
            onclick="window.location.reload()"
            class="w-full brand-bg text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition font-bold"
          >
            📖 Review Module Content
          </button>
          <button 
            onclick="quizComponent.retakeQuiz()"
            class="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition font-bold"
          >
            🔄 Retake Quiz (${wrongQuestions.length} questions)
          </button>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }

  renderDetailedFeedback(item, index) {
    const { question, isCorrect, studentAnswer } = item;
    const bgColor = isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300';
    const icon = isCorrect ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500';
    
    return `
      <div class="feedback-card border-2 ${bgColor} rounded-lg p-6">
        <div class="flex items-start space-x-3 mb-4">
          <i class="fas ${icon} text-2xl mt-1"></i>
          <div class="flex-1">
            <p class="font-bold text-gray-800 text-lg mb-2">
              Question ${index + 1}: ${question.question_text}
            </p>
            
            <div class="space-y-2 text-sm mb-4">
              <p>
                <span class="font-semibold">Your answer:</span> 
                <span class="${isCorrect ? 'text-green-700' : 'text-red-700'}">${studentAnswer}</span>
                ${isCorrect ? ' ✓' : ' ✗'}
              </p>
              ${!isCorrect ? `
                <p>
                  <span class="font-semibold">Correct answer:</span> 
                  <span class="text-green-700">${question.correct_answer}</span> ✓
                </p>
              ` : ''}
            </div>

            <!-- Feedback -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              ${isCorrect ? `
                <p class="text-gray-700 mb-2">${question.correct_feedback || question.explanation}</p>
              ` : `
                <p class="text-gray-700 mb-2">${question.detailed_explanation || question.explanation}</p>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderHintFeedback(item, index) {
    const { question, studentAnswer } = item;
    
    return `
      <div class="feedback-card border-2 bg-yellow-50 border-yellow-300 rounded-lg p-6">
        <div class="flex items-start space-x-3 mb-4">
          <i class="fas fa-lightbulb text-yellow-500 text-2xl mt-1"></i>
          <div class="flex-1">
            <p class="font-bold text-gray-800 text-lg mb-2">
              Question ${index + 1}: ${question.question_text}
            </p>
            
            <div class="space-y-2 text-sm mb-4">
              <p>
                <span class="font-semibold">Your answer:</span> 
                <span class="text-red-700">${studentAnswer} ✗</span>
              </p>
              <p class="text-gray-600 italic">
                (We're not showing you the correct answer yet - you need to learn!)
              </p>
            </div>

            <!-- Hint -->
            <div class="bg-white border border-yellow-200 rounded-lg p-4 mb-3">
              <p class="font-semibold text-yellow-800 mb-2">💡 Hint:</p>
              <p class="text-gray-700">${question.hint_feedback || question.explanation}</p>
            </div>

            <!-- Review Section -->
            ${question.review_section ? `
              <div class="flex items-center space-x-2 text-sm text-blue-600">
                <i class="fas fa-book"></i>
                <span>Review: <strong>${question.review_section}</strong></span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  getQuestionsWithResults() {
    return this.questions.map(question => ({
      question,
      studentAnswer: this.currentAttempt.answers[question.id],
      isCorrect: this.currentAttempt.results[question.id] === true
    }));
  }

  getWrongQuestions() {
    return this.questions
      .map(question => ({
        question,
        studentAnswer: this.currentAttempt.answers[question.id],
        isCorrect: this.currentAttempt.results[question.id] === true
      }))
      .filter(item => !item.isCorrect);
  }

  retakeQuiz() {
    // Get only wrong questions for retake
    const wrongQuestions = this.questions.filter(q => 
      this.currentAttempt.results[q.id] === false
    );
    
    if (wrongQuestions.length === 0) {
      alert('All questions answered correctly!');
      return;
    }
    
    // Reset for retake
    this.questions = wrongQuestions;
    this.studentAnswers = {};
    this.renderQuizForm(wrongQuestions);
  }

  showError(message) {
    this.container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
        <p class="text-gray-600 text-lg">${message}</p>
        <button onclick="location.reload()" class="mt-4 brand-bg text-white px-6 py-2 rounded hover:bg-blue-800">
          Try Again
        </button>
      </div>
    `;
  }
}

// Global reference for inline onclick handlers
let quizComponent = null;

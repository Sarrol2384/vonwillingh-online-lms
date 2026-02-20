// =====================================================
// MODULE PROGRESSION & QUIZ INTEGRATION SYSTEM
// Features:
// - Content completion tracking (time + scroll)
// - Quiz unlock after content completion
// - Module progression blocking
// - Dashboard status display
// - Admin reporting
// =====================================================

class ModuleProgressionManager {
  constructor(moduleId, studentId, enrollmentId) {
    this.moduleId = moduleId;
    this.studentId = studentId;
    this.enrollmentId = enrollmentId;
    
    this.contentStartTime = null;
    this.contentTimeSpent = 0;
    this.hasScrolledToBottom = false;
    this.contentCompleted = false;
    this.quizUnlocked = false;
    
    this.progressionRules = null;
    this.quizAttempts = [];
    
    // Track scroll position
    this.lastScrollPosition = 0;
    this.totalScrollHeight = 0;
  }

  async init() {
    try {
      // Load progression rules for this module
      await this.loadProgressionRules();
      
      // Load existing completion status
      await this.loadContentCompletion();
      
      // Load quiz attempts
      await this.loadQuizAttempts();
      
      // Start tracking if not completed
      if (!this.contentCompleted) {
        this.startContentTracking();
      } else {
        this.unlockQuiz();
      }
      
      // Update UI
      this.updateUI();
      
    } catch (error) {
      console.error('[Progression] Init error:', error);
    }
  }

  async loadProgressionRules() {
    try {
      const response = await axios.get(`/api/student/module/${this.moduleId}/progression-rules`);
      if (response.data.success) {
        this.progressionRules = response.data.rules;
        console.log('[Progression] Rules loaded:', this.progressionRules);
      }
    } catch (error) {
      console.warn('[Progression] No rules found, using defaults');
      this.progressionRules = {
        requires_content_completion: true,
        minimum_content_time_seconds: 1800, // 30 minutes
        requires_scroll_to_bottom: true,
        requires_quiz_pass: true,
        minimum_quiz_score: 70,
        max_quiz_attempts: 3
      };
    }
  }

  async loadContentCompletion() {
    try {
      const response = await axios.get(
        `/api/student/module/${this.moduleId}/content-completion?studentId=${this.studentId}`
      );
      
      if (response.data.success && response.data.completion) {
        const comp = response.data.completion;
        this.contentTimeSpent = comp.time_spent_seconds || 0;
        this.hasScrolledToBottom = comp.scrolled_to_bottom || false;
        this.contentCompleted = comp.content_fully_viewed || false;
        this.contentStartTime = comp.started_at ? new Date(comp.started_at) : null;
        
        console.log('[Progression] Content completion loaded:', {
          timeSpent: this.contentTimeSpent,
          scrolled: this.hasScrolledToBottom,
          completed: this.contentCompleted
        });
      }
    } catch (error) {
      console.warn('[Progression] No completion record found');
    }
  }

  async loadQuizAttempts() {
    try {
      const response = await axios.get(
        `/api/student/module/${this.moduleId}/quiz/attempts?studentId=${this.studentId}`
      );
      
      if (response.data.success) {
        this.quizAttempts = response.data.attempts || [];
        console.log('[Progression] Quiz attempts loaded:', this.quizAttempts.length);
      }
    } catch (error) {
      console.warn('[Progression] No quiz attempts found');
    }
  }

  startContentTracking() {
    if (!this.contentStartTime) {
      this.contentStartTime = new Date();
      this.saveContentCompletion('started');
    }
    
    // Track time spent (update every 30 seconds)
    this.timeTracker = setInterval(() => {
      this.contentTimeSpent = Math.floor((new Date() - this.contentStartTime) / 1000);
      this.checkContentCompletion();
      this.saveContentCompletion('update');
    }, 30000); // Every 30 seconds
    
    // Track scroll position
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    console.log('[Progression] Content tracking started');
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    this.lastScrollPosition = scrollTop;
    this.totalScrollHeight = documentHeight;
    
    // Check if scrolled to bottom (within 100px)
    const scrolledToBottom = (scrollTop + windowHeight) >= (documentHeight - 100);
    
    if (scrolledToBottom && !this.hasScrolledToBottom) {
      this.hasScrolledToBottom = true;
      console.log('[Progression] Scrolled to bottom!');
      this.checkContentCompletion();
      this.saveContentCompletion('scrolled');
    }
  }

  checkContentCompletion() {
    if (this.contentCompleted) return;
    
    const rules = this.progressionRules;
    if (!rules) return;
    
    // Check all requirements
    const timeRequirementMet = this.contentTimeSpent >= rules.minimum_content_time_seconds;
    const scrollRequirementMet = !rules.requires_scroll_to_bottom || this.hasScrolledToBottom;
    
    console.log('[Progression] Checking completion:', {
      timeSpent: this.contentTimeSpent,
      timeRequired: rules.minimum_content_time_seconds,
      timeMet: timeRequirementMet,
      scrolled: this.hasScrolledToBottom,
      scrollMet: scrollRequirementMet
    });
    
    if (timeRequirementMet && scrollRequirementMet) {
      this.contentCompleted = true;
      this.unlockQuiz();
      this.saveContentCompletion('completed');
      this.showCompletionNotification();
    }
  }

  unlockQuiz() {
    this.quizUnlocked = true;
    const startQuizBtn = document.getElementById('startQuizBtn');
    const quizSection = document.getElementById('quizSection');
    
    if (startQuizBtn) {
      startQuizBtn.disabled = false;
      startQuizBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      startQuizBtn.classList.add('hover:bg-blue-700');
    }
    
    if (quizSection) {
      quizSection.classList.remove('hidden');
    }
    
    console.log('[Progression] Quiz unlocked!');
  }

  showCompletionNotification() {
    // Show a toast notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <i class="fas fa-check-circle text-2xl"></i>
        <div>
          <p class="font-bold">Content Complete!</p>
          <p class="text-sm">You can now take the quiz</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  async saveContentCompletion(action) {
    try {
      const data = {
        studentId: this.studentId,
        enrollmentId: this.enrollmentId,
        timeSpentSeconds: this.contentTimeSpent,
        scrolledToBottom: this.hasScrolledToBottom,
        contentFullyViewed: this.contentCompleted,
        lastScrollPosition: this.lastScrollPosition,
        totalScrollHeight: this.totalScrollHeight,
        action: action
      };
      
      await axios.post(`/api/student/module/${this.moduleId}/content-completion`, data);
      console.log('[Progression] Content completion saved:', action);
    } catch (error) {
      console.error('[Progression] Failed to save completion:', error);
    }
  }

  updateUI() {
    // Update quiz button state
    const startQuizBtn = document.getElementById('startQuizBtn');
    const quizStatusDiv = document.getElementById('quizStatus');
    
    if (!this.contentCompleted) {
      // Content not complete - lock quiz
      if (startQuizBtn) {
        startQuizBtn.disabled = true;
        startQuizBtn.classList.add('opacity-50', 'cursor-not-allowed');
        startQuizBtn.classList.remove('hover:bg-blue-700');
        startQuizBtn.innerHTML = `
          <i class="fas fa-lock mr-2"></i>
          Complete Content First
        `;
      }
      
      // Show progress indicator
      this.showProgressIndicator();
    } else {
      // Content complete - unlock quiz
      this.unlockQuiz();
      
      // Show quiz status
      if (quizStatusDiv) {
        quizStatusDiv.innerHTML = this.getQuizStatusHTML();
      }
    }
  }

  showProgressIndicator() {
    const quizSection = document.getElementById('quizSection');
    if (!quizSection) return;
    
    const rules = this.progressionRules;
    if (!rules) return;
    
    const timeProgress = Math.min(100, (this.contentTimeSpent / rules.minimum_content_time_seconds) * 100);
    const scrollProgress = this.hasScrolledToBottom ? 100 : 0;
    
    const progressHTML = `
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
        <p class="font-bold text-yellow-800 mb-2">
          <i class="fas fa-info-circle mr-2"></i>
          Complete the module content to unlock the quiz
        </p>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-sm text-yellow-700 mb-1">
              <span>Time spent in module</span>
              <span>${Math.floor(this.contentTimeSpent / 60)}/${Math.floor(rules.minimum_content_time_seconds / 60)} minutes</span>
            </div>
            <div class="w-full bg-yellow-200 rounded-full h-2">
              <div class="bg-yellow-600 h-2 rounded-full transition-all" style="width: ${timeProgress}%"></div>
            </div>
          </div>
          ${rules.requires_scroll_to_bottom ? `
            <div>
              <div class="flex justify-between text-sm text-yellow-700 mb-1">
                <span>Scroll to bottom</span>
                <span>${this.hasScrolledToBottom ? 'Complete ✓' : 'Not yet'}</span>
              </div>
              <div class="w-full bg-yellow-200 rounded-full h-2">
                <div class="bg-yellow-600 h-2 rounded-full transition-all" style="width: ${scrollProgress}%"></div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // Insert before quiz button
    const existingProgress = quizSection.querySelector('.progress-indicator');
    if (existingProgress) {
      existingProgress.innerHTML = progressHTML;
    } else {
      const div = document.createElement('div');
      div.className = 'progress-indicator';
      div.innerHTML = progressHTML;
      quizSection.insertBefore(div, quizSection.firstChild);
    }
  }

  getQuizStatusHTML() {
    if (this.quizAttempts.length === 0) {
      return `
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p class="text-blue-800">
            <i class="fas fa-clipboard-check mr-2"></i>
            <strong>Quiz Status:</strong> Not Started
          </p>
        </div>
      `;
    }
    
    const lastAttempt = this.quizAttempts[0];
    const bestScore = Math.max(...this.quizAttempts.map(a => a.percentage || 0));
    const attemptsRemaining = this.progressionRules.max_quiz_attempts - this.quizAttempts.length;
    
    if (lastAttempt.passed) {
      return `
        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="text-green-800">
            <i class="fas fa-check-circle mr-2"></i>
            <strong>Quiz Status:</strong> Passed (${bestScore}%)
          </p>
          <p class="text-sm text-green-700 mt-1">
            You can proceed to Module 2
          </p>
        </div>
      `;
    } else {
      return `
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p class="text-yellow-800">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <strong>Quiz Status:</strong> Failed - ${attemptsRemaining} attempt(s) remaining
          </p>
          <p class="text-sm text-yellow-700 mt-1">
            Best score: ${bestScore}% | Need: ${this.progressionRules.minimum_quiz_score}%
          </p>
        </div>
      `;
    }
  }

  canAccessNextModule() {
    if (!this.progressionRules) return true;
    if (!this.progressionRules.is_required_for_next) return true;
    
    // Check if quiz passed
    if (this.progressionRules.requires_quiz_pass) {
      const passed = this.quizAttempts.some(a => a.passed);
      return passed;
    }
    
    return true;
  }

  getQuizStatus() {
    if (this.quizAttempts.length === 0) {
      return {
        status: 'not_started',
        label: 'Not Started',
        color: 'gray'
      };
    }
    
    const lastAttempt = this.quizAttempts[0];
    const bestScore = Math.max(...this.quizAttempts.map(a => a.percentage || 0));
    const attemptsRemaining = this.progressionRules.max_quiz_attempts - this.quizAttempts.length;
    
    if (lastAttempt.passed) {
      return {
        status: 'passed',
        label: `Passed (${bestScore}%)`,
        color: 'green',
        score: bestScore
      };
    } else if (attemptsRemaining > 0) {
      return {
        status: 'failed',
        label: `Failed - ${attemptsRemaining} attempts remaining`,
        color: 'yellow',
        score: bestScore,
        attemptsRemaining
      };
    } else {
      return {
        status: 'failed_max',
        label: `Failed - No attempts remaining`,
        color: 'red',
        score: bestScore
      };
    }
  }

  destroy() {
    if (this.timeTracker) {
      clearInterval(this.timeTracker);
    }
    window.removeEventListener('scroll', this.handleScroll);
  }
}

// Global instance
let progressionManager = null;

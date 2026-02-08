// Quiz Renderer for Module Viewer
// Extracts quiz questions from module content and renders them interactively

function initQuizRenderer() {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;
  
  const content = contentArea.innerHTML;
  
  // Check if content has quiz markers
  if (!content.includes('### Question') && !content.includes('**Question')) {
    return; // No quiz in this module
  }
  
  // Split content into main content and quiz
  const quizStartMarkers = [
    '---\n## Quiz',
    '<hr>\n<h2>Quiz</h2>',
    '### Question 1',
    '**Question 1'
  ];
  
  let splitIndex = -1;
  let splitMarker = '';
  
  for (const marker of quizStartMarkers) {
    const idx = content.indexOf(marker);
    if (idx > -1) {
      splitIndex = idx;
      splitMarker = marker;
      break;
    }
  }
  
  if (splitIndex === -1) return; // No clear quiz section
  
  // Separate main content from quiz
  const mainContent = content.substring(0, splitIndex);
  const quizContent = content.substring(splitIndex);
  
  // Parse quiz questions
  const questions = parseQuizQuestions(quizContent);
  
  if (questions.length === 0) return;
  
  // Render separated content
  contentArea.innerHTML = mainContent + renderQuizSection(questions);
  
  // Add quiz interaction handlers
  initQuizHandlers(questions);
}

function parseQuizQuestions(quizHtml) {
  const questions = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = quizHtml;
  
  // Try to extract questions using various patterns
  const text = tempDiv.textContent;
  
  // Pattern: ### Question X or **Question X
  const questionRegex = /(?:###\s*Question\s+(\d+)|Question\s+(\d+))[:\s]*(.*?)(?=(?:###\s*Question|\*\*Question|$))/gs;
  
  let match;
  while ((match = questionRegex.exec(text)) !== null) {
    const questionNum = match[1] || match[2];
    const questionText = match[3];
    
    // Extract question, options, and correct answer
    const lines = questionText.split('\n').filter(l => l.trim());
    
    if (lines.length === 0) continue;
    
    const question = {
      number: parseInt(questionNum),
      text: lines[0].replace(/\*\*/g, '').trim(),
      options: [],
      correctAnswer: '',
      explanation: ''
    };
    
    // Extract options (A), B), C), D) or numbered
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Options
      if (/^[A-D]\)/.test(line) || /^[1-4]\./.test(line)) {
        question.options.push(line.replace(/^[A-D]\)\s*|^[1-4]\.\s*/, '').trim());
      }
      // Correct Answer
      else if (line.includes('Correct Answer') || line.includes('**Answer**')) {
        question.correctAnswer = line.split(':').pop().trim().replace(/\*\*/g, '');
      }
      // Explanation
      else if (line.includes('Explanation') || (i > question.options.length + 2)) {
        question.explanation += line + ' ';
      }
    }
    
    if (question.text && question.options.length > 0) {
      questions.push(question);
    }
  }
  
  return questions;
}

function renderQuizSection(questions) {
  return `
    <hr class="my-8">
    <div id="quizSection" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mt-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <i class="fas fa-question-circle text-blue-600 mr-3"></i>
        Module Quiz
      </h2>
      <p class="text-gray-600 mb-6">Test your understanding of this module with ${questions.length} questions.</p>
      
      <div id="quizQuestions">
        ${questions.map((q, idx) => renderQuestion(q, idx)).join('')}
      </div>
      
      <div class="mt-6 flex justify-between items-center">
        <div id="quizScore" class="text-lg font-semibold text-gray-700 hidden">
          Score: <span id="scoreValue" class="text-blue-600">0</span>/${questions.length}
        </div>
        <button onclick="submitQuiz()" id="submitQuizBtn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <i class="fas fa-check mr-2"></i>Submit Quiz
        </button>
        <button onclick="resetQuiz()" id="resetQuizBtn" class="hidden px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
          <i class="fas fa-redo mr-2"></i>Try Again
        </button>
      </div>
    </div>
  `;
}

function renderQuestion(question, index) {
  return `
    <div class="mb-6 p-4 bg-white rounded-lg shadow-sm quiz-question" data-question="${index}">
      <h3 class="font-bold text-gray-900 mb-3">
        <span class="text-blue-600">Question ${question.number}:</span> ${question.text}
      </h3>
      <div class="space-y-2">
        ${question.options.map((option, optIdx) => `
          <label class="flex items-start p-3 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer transition">
            <input type="radio" name="question_${index}" value="${optIdx}" class="mt-1 mr-3">
            <span class="flex-1">${String.fromCharCode(65 + optIdx)}) ${option}</span>
          </label>
        `).join('')}
      </div>
      <div class="hidden mt-3 p-3 rounded feedback" data-question="${index}"></div>
    </div>
  `;
}

function initQuizHandlers(questions) {
  window.quizQuestions = questions;
  window.quizAnswers = {};
}

function submitQuiz() {
  const questions = window.quizQuestions;
  if (!questions) return;
  
  let score = 0;
  
  questions.forEach((question, idx) => {
    const selected = document.querySelector(`input[name="question_${idx}"]:checked`);
    const feedback = document.querySelector(`.feedback[data-question="${idx}"]`);
    
    if (!selected) {
      feedback.className = 'mt-3 p-3 rounded feedback bg-yellow-100 border border-yellow-300 text-yellow-800';
      feedback.textContent = '⚠️ Please select an answer';
      feedback.classList.remove('hidden');
      return;
    }
    
    const selectedAnswer = question.options[parseInt(selected.value)];
    const isCorrect = selectedAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase()) ||
                      question.correctAnswer.toLowerCase().includes(selectedAnswer.toLowerCase());
    
    if (isCorrect) {
      score++;
      feedback.className = 'mt-3 p-3 rounded feedback bg-green-100 border border-green-300 text-green-800';
      feedback.innerHTML = `<strong>✅ Correct!</strong> ${question.explanation || ''}`;
    } else {
      feedback.className = 'mt-3 p-3 rounded feedback bg-red-100 border border-red-300 text-red-800';
      feedback.innerHTML = `<strong>❌ Incorrect.</strong> Correct answer: ${question.correctAnswer}. ${question.explanation || ''}`;
    }
    
    feedback.classList.remove('hidden');
    
    // Disable all options
    document.querySelectorAll(`input[name="question_${idx}"]`).forEach(input => {
      input.disabled = true;
    });
  });
  
  // Show score
  document.getElementById('quizScore').classList.remove('hidden');
  document.getElementById('scoreValue').textContent = score;
  
  // Hide submit, show reset
  document.getElementById('submitQuizBtn').classList.add('hidden');
  document.getElementById('resetQuizBtn').classList.remove('hidden');
  
  // Show result message
  const percentage = (score / questions.length) * 100;
  let message = '';
  if (percentage >= 80) {
    message = '🎉 Excellent work!';
  } else if (percentage >= 60) {
    message = '👍 Good job!';
  } else {
    message = '📚 Review the material and try again.';
  }
  
  alert(`${message}\n\nYour Score: ${score}/${questions.length} (${percentage.toFixed(0)}%)`);
}

function resetQuiz() {
  const questions = window.quizQuestions;
  if (!questions) return;
  
  questions.forEach((question, idx) => {
    // Clear selections
    document.querySelectorAll(`input[name="question_${idx}"]`).forEach(input => {
      input.checked = false;
      input.disabled = false;
    });
    
    // Hide feedback
    document.querySelector(`.feedback[data-question="${idx}"]`).classList.add('hidden');
  });
  
  // Hide score and reset button
  document.getElementById('quizScore').classList.add('hidden');
  document.getElementById('resetQuizBtn').classList.add('hidden');
  document.getElementById('submitQuizBtn').classList.remove('hidden');
}

// Initialize when module content loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initQuizRenderer, 500);
  });
} else {
  setTimeout(initQuizRenderer, 500);
}

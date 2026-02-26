// Module Viewer Page Handler

let currentModule = null;
let currentSession = null;
let enrollmentId = null;

document.addEventListener('DOMContentLoaded', async function() {
  // Check if logged in
  currentSession = getSession();
  if (!currentSession) {
    window.location.href = '/student-login';
    return;
  }
  
  // Get module ID from URL
  const pathParts = window.location.pathname.split('/');
  const moduleId = pathParts[pathParts.length - 1];
  
  // Load module data
  await loadModule(moduleId);
});

function getSession() {
  const sessionStr = localStorage.getItem('studentSession') || sessionStorage.getItem('studentSession');
  return sessionStr ? JSON.parse(sessionStr) : null;
}

async function loadModule(moduleId) {
  try {
    // Load module data first to get course info
    const response = await axios.get(`/api/student/module/${moduleId}?studentId=${currentSession.studentId}`);
    
    if (response.data.success) {
      currentModule = response.data.module;
      const { module, progress, navigation } = response.data;
      
      // Check if student can access this module (check progression rules)
      const accessCheck = await axios.get(`/api/student/module/${moduleId}/can-access?studentId=${currentSession.studentId}`);
      
      if (accessCheck.data.success && !accessCheck.data.canAccess) {
        // Module is locked - show lock screen
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('moduleContent').innerHTML = `
          <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
              <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-lock text-orange-600 text-2xl"></i>
              </div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Module Locked</h2>
              <p class="text-gray-600 mb-6">${accessCheck.data.reason || 'You must complete the previous module quiz first'}</p>
              <a href="/student/course/${module.course_id}" 
                 class="inline-block brand-bg text-white px-6 py-3 rounded hover:bg-blue-800 transition">
                <i class="fas fa-arrow-left mr-2"></i>Back to Course
              </a>
            </div>
          </div>
        `;
        document.getElementById('moduleContent').classList.remove('hidden');
        return;
      }
      
      // Store enrollment ID for completion tracking
      enrollmentId = progress.enrollment_id;
      
      // Hide loading, show content
      document.getElementById('loadingScreen').classList.add('hidden');
      document.getElementById('moduleContent').classList.remove('hidden');
      
      // Update header
      document.getElementById('courseName').textContent = module.courses?.name || 'Course';
      document.getElementById('moduleTitle').textContent = module.title;
      document.getElementById('modulePosition').textContent = `Module ${navigation.current} of ${navigation.total}`;
      
      // Update content area
      document.getElementById('moduleHeading').textContent = module.title;
      document.getElementById('moduleDescription').textContent = module.description || '';
      document.getElementById('moduleContentArea').innerHTML = module.content || '<p>No content available.</p>';
      
      // Trigger professional renderer after content is loaded
      setTimeout(() => {
        if (window.ProfessionalModuleRenderer) {
          const contentArea = document.getElementById('moduleContentArea');
          const renderer = new window.ProfessionalModuleRenderer(contentArea);
          renderer.render();
        }
      }, 100);
      
      // Setup navigation buttons
      setupNavigation(navigation, module.course_id);
      
      // Setup complete button
      setupCompleteButton(moduleId, progress);
      
    } else {
      showError(response.data.message || 'Failed to load module');
    }
    
  } catch (error) {
    console.error('Module load error:', error);
    showError('Failed to load module data');
  }
}

function setupNavigation(navigation, courseId) {
  const previousBtn = document.getElementById('previousBtn');
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backToCourseBtn');
  
  // Previous button
  if (navigation.previous) {
    previousBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    previousBtn.disabled = false;
    previousBtn.onclick = () => {
      window.location.href = `/student/module/${navigation.previous.id}`;
    };
  } else {
    previousBtn.classList.add('opacity-50', 'cursor-not-allowed');
    previousBtn.disabled = true;
  }
  
  // Next button
  if (navigation.next) {
    nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    nextBtn.disabled = false;
    nextBtn.onclick = () => {
      window.location.href = `/student/module/${navigation.next.id}`;
    };
  } else {
    nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
    nextBtn.disabled = true;
    nextBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Course Complete';
  }
  
  // Back to course button
  backBtn.onclick = () => {
    window.location.href = `/student/course/${courseId}`;
  };
}

function setupCompleteButton(moduleId, progress) {
  const completeBtn = document.getElementById('completeBtn');
  
  if (progress.status === 'completed') {
    completeBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Completed';
    completeBtn.classList.remove('brand-bg', 'hover:bg-blue-800');
    completeBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    completeBtn.disabled = true;
  } else {
    completeBtn.onclick = async () => {
      await markAsComplete(moduleId);
    };
  }
}

async function markAsComplete(moduleId) {
  const completeBtn = document.getElementById('completeBtn');
  
  // Disable button
  completeBtn.disabled = true;
  completeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
  
  try {
    const response = await axios.post(`/api/student/module/${moduleId}/complete`, {
      studentId: currentSession.studentId,
      enrollmentId: enrollmentId
    });
    
    if (response.data.success) {
      // Update button
      completeBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Completed!';
      completeBtn.classList.remove('brand-bg', 'hover:bg-blue-800');
      completeBtn.classList.add('bg-green-500');
      
      // Show success message
      showSuccessMessage(response.data.progress);
      
      // If course is complete, show special message
      if (response.data.progress.courseComplete) {
        setTimeout(() => {
          if (confirm('Congratulations! You have completed all modules in this course. Would you like to return to the dashboard?')) {
            window.location.href = '/student/dashboard';
          }
        }, 2000);
      }
    } else {
      completeBtn.disabled = false;
      completeBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Mark as Complete';
      
      // Show quiz requirement message if applicable
      if (response.data.requiresQuiz) {
        showQuizRequiredMessage(response.data.moduleTitle);
      } else {
        alert(response.data.message || 'Failed to mark as complete');
      }
    }
    
  } catch (error) {
    console.error('Mark complete error:', error);
    completeBtn.disabled = false;
    completeBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Mark as Complete';
    
    // Check if it's a quiz requirement error
    if (error.response && error.response.data && error.response.data.requiresQuiz) {
      showQuizRequiredMessage(error.response.data.moduleTitle);
    } else {
      alert('An error occurred. Please try again.');
    }
  }
}

function showQuizRequiredMessage(moduleTitle) {
  const message = document.createElement('div');
  message.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  message.innerHTML = `
    <div class="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <i class="fas fa-exclamation-triangle text-3xl text-yellow-600"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Quiz Required!</h3>
        <p class="text-gray-600">
          You must pass the quiz before marking this module as complete.
        </p>
      </div>
      
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <p class="text-sm text-yellow-800">
          <strong>${moduleTitle || 'This module'}</strong> includes a quiz that you must pass (70% or higher) before you can proceed to the next module.
        </p>
      </div>
      
      <div class="space-y-3">
        <button onclick="this.closest('.fixed').remove(); document.getElementById('quizModal')?.classList.remove('hidden')" 
                class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold">
          <i class="fas fa-clipboard-check mr-2"></i>Go to Quiz
        </button>
        <button onclick="this.closest('.fixed').remove()" 
                class="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-semibold">
          <i class="fas fa-times mr-2"></i>Close
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(message);
}

function showSuccessMessage(progress) {
  const message = document.createElement('div');
  message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
  message.innerHTML = `
    <div class="flex items-center space-x-3">
      <i class="fas fa-check-circle text-2xl"></i>
      <div>
        <p class="font-bold">Module Complete!</p>
        <p class="text-sm">Progress: ${progress.completedModules}/${progress.totalModules} modules (${progress.progressPercentage}%)</p>
      </div>
    </div>
  `;
  document.body.appendChild(message);
  
  // Remove after 5 seconds
  setTimeout(() => {
    message.remove();
  }, 5000);
}

function showError(message) {
  document.getElementById('loadingScreen').innerHTML = `
    <div class="text-center">
      <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
      <p class="text-gray-600 text-lg">${message}</p>
      <a href="/student/dashboard" class="inline-block mt-4 brand-bg text-white px-6 py-2 rounded hover:bg-blue-800 transition">
        Return to Dashboard
      </a>
    </div>
  `;
}

// Course Detail Page Handler

// Make viewModule function globally accessible
window.viewModule = function(moduleId) {
  window.location.href = `/student/module/${moduleId}`;
};

document.addEventListener('DOMContentLoaded', async function() {
  // Check if logged in
  const session = getSession();
  if (!session) {
    window.location.href = '/student-login';
    return;
  }
  
  // Get course ID from URL
  const pathParts = window.location.pathname.split('/');
  const courseId = pathParts[pathParts.length - 1];
  
  // Load course data
  await loadCourseDetail(courseId, session.studentId);
});

function getSession() {
  const sessionStr = localStorage.getItem('studentSession') || sessionStorage.getItem('studentSession');
  return sessionStr ? JSON.parse(sessionStr) : null;
}

async function loadCourseDetail(courseId, studentId) {
  const loadingHeader = document.getElementById('loadingHeader');
  const courseHeader = document.getElementById('courseHeader');
  const loadingModules = document.getElementById('loadingModules');
  const modulesContainer = document.getElementById('modulesContainer');
  
  try {
    const response = await axios.get(`/api/student/course/${courseId}?studentId=${studentId}`);
    
    if (response.data.success) {
      const { course, enrollment, modules, totalModules, completedModules } = response.data;
      
      // Update course header
      courseHeader.innerHTML = `
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-2">${course.name}</h1>
            <p class="text-gray-600 mb-4">${course.description || 'Comprehensive course covering key concepts and practical applications.'}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span><i class="fas fa-graduation-cap mr-1"></i>${course.level}</span>
              <span><i class="fas fa-book mr-1"></i>${totalModules} Modules</span>
              <span><i class="fas fa-calendar mr-1"></i>Enrolled: ${new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      `;
      
      // Update progress
      const progressPercentage = enrollment.progress_percentage || 0;
      document.getElementById('progressBar').style.width = `${progressPercentage}%`;
      document.getElementById('progressText').textContent = `${progressPercentage.toFixed(0)}% Complete`;
      document.getElementById('progressDetails').textContent = `${completedModules} of ${totalModules} modules completed`;
      
      // Hide loading, show modules
      loadingModules.classList.add('hidden');
      modulesContainer.classList.remove('hidden');
      
      // Render modules
      modulesContainer.innerHTML = modules.map((module, index) => {
        const isCompleted = module.progress.status === 'completed';
        const isInProgress = module.progress.status === 'in_progress';
        
        // Check if module is locked: lock if it's not the first module AND previous module is not completed
        const isFirstModule = (module.order_number || index + 1) === 1;
        const previousModule = index > 0 ? modules[index - 1] : null;
        const previousCompleted = previousModule ? previousModule.progress.status === 'completed' : true;
        const isLocked = !isFirstModule && !previousCompleted;
        
        return `
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition ${isLocked ? 'opacity-50 bg-gray-50' : ''}">
            <div class="flex items-center justify-between">
              <div class="flex items-start space-x-4 flex-1">
                <div class="flex-shrink-0 w-12 h-12 rounded-full ${
                  isCompleted ? 'bg-green-500' : 
                  isInProgress ? 'bg-yellow-500' : 
                  isLocked ? 'bg-gray-400' : 'bg-gray-300'
                } flex items-center justify-center text-white font-bold">
                  ${isLocked ? '<i class="fas fa-lock"></i>' : 
                    isCompleted ? '<i class="fas fa-check"></i>' : 
                    (module.order_number || index + 1)}
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-lg mb-1 ${isLocked ? 'text-gray-500' : ''}">${module.title}</h4>
                  <p class="text-gray-600 text-sm mb-2">${module.description || 'Learn essential concepts about management in this comprehensive module.'}</p>
                  <div class="flex items-center space-x-3 text-sm text-gray-500">
                    <span><i class="fas fa-file-alt mr-1"></i>${module.content_type || 'lesson'}</span>
                    ${module.duration_minutes ? `<span><i class="fas fa-clock mr-1"></i>${module.duration_minutes} min</span>` : ''}
                    <span class="px-2 py-1 rounded-full text-xs ${
                      isCompleted ? 'bg-green-100 text-green-800' : 
                      isInProgress ? 'bg-yellow-100 text-yellow-800' :
                      isLocked ? 'bg-gray-200 text-gray-600' :
                      'bg-gray-100 text-gray-800'
                    }">
                      ${isLocked ? '<i class="fas fa-lock mr-1"></i>Locked' :
                        isCompleted ? 'Completed' : 
                        isInProgress ? 'In Progress' : 
                        'Not Started'}
                    </span>
                  </div>
                  ${isLocked ? `<p class="text-sm text-orange-600 mt-2"><i class="fas fa-info-circle mr-1"></i>Complete previous module's quiz to unlock</p>` : ''}
                </div>
              </div>
              <div>
                <button 
                  onclick="${isLocked ? '' : `viewModule('${module.id}')`}" 
                  ${isLocked ? 'disabled' : ''}
                  class="${isLocked ? 'bg-gray-400 cursor-not-allowed' : 'brand-bg hover:bg-blue-800'} text-white px-6 py-2 rounded transition">
                  ${isLocked ? '<i class="fas fa-lock mr-2"></i>Locked' :
                    isCompleted ? 'Review' : 
                    isInProgress ? 'Continue' : 
                    'Start'}
                  ${!isLocked ? '<i class="fas fa-arrow-right ml-2"></i>' : ''}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
    } else {
      courseHeader.innerHTML = `
        <div class="text-center text-red-600 py-8">
          <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
          <p>${response.data.message || 'Failed to load course'}</p>
        </div>
      `;
    }
    
  } catch (error) {
    console.error('Course load error:', error);
    courseHeader.innerHTML = `
      <div class="text-center text-red-600 py-8">
        <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
        <p>Failed to load course data</p>
      </div>
    `;
  }
}

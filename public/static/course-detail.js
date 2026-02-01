// Course Detail Page Handler

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
        const isLocked = false; // For now, all modules are unlocked
        
        return `
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition ${isLocked ? 'opacity-50' : ''}">
            <div class="flex items-center justify-between">
              <div class="flex items-start space-x-4 flex-1">
                <div class="flex-shrink-0 w-12 h-12 rounded-full ${
                  isCompleted ? 'bg-green-500' : isInProgress ? 'bg-yellow-500' : 'bg-gray-300'
                } flex items-center justify-center text-white font-bold">
                  ${isCompleted ? '<i class="fas fa-check"></i>' : module.module_number}
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-lg mb-1">${module.title}</h4>
                  <p class="text-gray-600 text-sm mb-2">${module.description || ''}</p>
                  <div class="flex items-center space-x-3 text-sm text-gray-500">
                    <span><i class="fas fa-file-alt mr-1"></i>${module.content_type}</span>
                    ${module.duration_minutes ? `<span><i class="fas fa-clock mr-1"></i>${module.duration_minutes} min</span>` : ''}
                    <span class="px-2 py-1 rounded-full text-xs ${
                      isCompleted ? 'bg-green-100 text-green-800' : 
                      isInProgress ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }">
                      ${isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button 
                  onclick="viewModule('${module.id}')" 
                  ${isLocked ? 'disabled' : ''}
                  class="brand-bg text-white px-6 py-2 rounded hover:bg-blue-800 transition ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}">
                  ${isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                  <i class="fas fa-arrow-right ml-2"></i>
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

function viewModule(moduleId) {
  window.location.href = `/student/module/${moduleId}`;
}

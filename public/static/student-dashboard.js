// Student Dashboard Handler

document.addEventListener('DOMContentLoaded', async function() {
  // Check if logged in
  const session = getSession();
  if (!session) {
    window.location.href = '/student-login';
    return;
  }
  
  // Display student name
  document.getElementById('studentName').textContent = session.fullName;
  document.getElementById('welcomeName').textContent = session.fullName.split(' ')[0];
  
  // Logout handler
  document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('studentSession');
    sessionStorage.removeItem('studentSession');
    window.location.href = '/student-login';
  });
  
  // Load dashboard data
  await loadDashboard();
});

function getSession() {
  const sessionStr = localStorage.getItem('studentSession') || sessionStorage.getItem('studentSession');
  return sessionStr ? JSON.parse(sessionStr) : null;
}

async function loadDashboard() {
  const session = getSession();
  const loadingDiv = document.getElementById('loadingCourses');
  const coursesContainer = document.getElementById('coursesContainer');
  const noCoursesMessage = document.getElementById('noCoursesMessage');
  
  try {
    const response = await axios.get(`/api/student/dashboard?studentId=${session.studentId}`);
    
    if (response.data.success) {
      const { enrollments } = response.data;
      
      // Update stats
      document.getElementById('enrolledCount').textContent = enrollments.length;
      const inProgress = enrollments.filter(e => !e.completion_date).length;
      const completed = enrollments.filter(e => e.completion_date).length;
      document.getElementById('inProgressCount').textContent = inProgress;
      document.getElementById('completedCount').textContent = completed;
      
      // Hide loading
      loadingDiv.classList.add('hidden');
      
      // Display courses
      if (enrollments.length === 0) {
        noCoursesMessage.classList.remove('hidden');
      } else {
        coursesContainer.classList.remove('hidden');
        coursesContainer.innerHTML = enrollments.map(enrollment => `
          <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-lg font-bold mb-2">${enrollment.courses.name}</h4>
                <p class="text-gray-600 text-sm mb-3">${enrollment.courses.description || 'Comprehensive course covering key concepts and practical applications.'}</p>
                
                <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span><i class="fas fa-graduation-cap mr-1"></i>${enrollment.courses.level}</span>
                  <span><i class="fas fa-clock mr-1"></i>${enrollment.courses.duration || 'Flexible duration'}</span>
                  <span class="px-3 py-1 rounded-full ${
                    enrollment.completion_date ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }">
                    <i class="fas ${enrollment.completion_date ? 'fa-check-circle' : 'fa-hourglass-half'} mr-1"></i>
                    ${enrollment.completion_date ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                
                ${enrollment.enrollment_date ? `
                  <p class="text-xs text-gray-500">
                    <i class="fas fa-calendar mr-1"></i>
                    Enrolled: ${new Date(enrollment.enrollment_date).toLocaleDateString()}
                  </p>
                ` : ''}
                
                ${enrollment.completion_date ? `
                  <p class="text-xs text-green-600 mt-2">
                    <i class="fas fa-trophy mr-1"></i>
                    Completed: ${new Date(enrollment.completion_date).toLocaleDateString()}
                  </p>
                ` : ''}
              </div>
              
              <div class="ml-4 flex flex-col space-y-2">
                ${enrollment.completion_date ? `
                  ${enrollment.certificate_url ? `
                    <button onclick="downloadCertificate('${enrollment.certificate_url}', '${enrollment.courses.name}')" 
                            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition flex items-center">
                      <i class="fas fa-certificate mr-2"></i>Download Certificate
                    </button>
                  ` : `
                    <button onclick="generateCertificate('${session.studentId}', ${enrollment.courses.id}, '${session.fullName}', '${enrollment.courses.name}', '${enrollment.courses.level}', '${enrollment.completion_date}')" 
                            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center">
                      <i class="fas fa-file-certificate mr-2"></i>Generate Certificate
                    </button>
                  `}
                ` : `
                  <button onclick="viewCourse(${enrollment.courses.id})" 
                          class="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition flex items-center">
                    <i class="fas fa-arrow-right mr-2"></i>Continue
                  </button>
                `}
              </div>
            </div>
          </div>
        `).join('');
      }
    }
    
  } catch (error) {
    console.error('Dashboard load error:', error);
    loadingDiv.innerHTML = `
      <div class="text-center text-red-600">
        <i class="fas fa-exclamation-circle text-3xl mb-2"></i>
        <p>Failed to load dashboard data</p>
      </div>
    `;
  }
}

function viewCourse(courseId) {
  window.location.href = `/student/course/${courseId}`;
}

async function generateCertificate(studentId, courseId, studentName, courseName, courseLevel, completionDate) {
  const button = event.target.closest('button');
  const originalHTML = button.innerHTML;
  
  try {
    // Show loading
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';
    
    // Check if certificate-generator.js is loaded
    if (typeof CertificateGenerator === 'undefined') {
      throw new Error('Certificate generator not loaded');
    }
    
    // Generate certificate ID
    const certificateId = `PBK-${courseId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().substring(8)}`;
    
    // Generate PDF
    const generator = new CertificateGenerator();
    const pdfBlob = await generator.generate({
      studentName,
      courseName,
      courseLevel,
      completionDate,
      certificateId
    });
    
    // Convert blob to base64 for sending to server
    const reader = new FileReader();
    reader.onloadend = async function() {
      const base64data = reader.result;
      
      // Send to server to save
      const response = await axios.post('/api/student/certificate/generate', {
        studentId,
        courseId,
        certificateBlob: base64data
      });
      
      if (response.data.success) {
        // Show success message
        showToast('Certificate generated successfully!', 'success');
        
        // Reload dashboard to show download button
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(response.data.message);
      }
    };
    reader.readAsDataURL(pdfBlob);
    
  } catch (error) {
    console.error('Certificate generation error:', error);
    showToast('Failed to generate certificate: ' + error.message, 'error');
    button.disabled = false;
    button.innerHTML = originalHTML;
  }
}

function downloadCertificate(certificateUrl, courseName) {
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = certificateUrl;
  link.download = `${courseName.replace(/\s+/g, '_')}_Certificate.pdf`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('Certificate download started', 'success');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
    ${message}
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Course Import Frontend JavaScript
let selectedFile = null;
let parsedData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeFileUpload();
  initializeEventListeners();
});

// Initialize file upload drag-drop
function initializeFileUpload() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const browseBtn = document.getElementById('browseBtn');

  // Browse button click
  browseBtn.addEventListener('click', () => {
    fileInput.click();
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // Drag and drop events
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-blue-500', 'bg-blue-50');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-blue-500', 'bg-blue-50');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-blue-500', 'bg-blue-50');
    
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
}

// Initialize other event listeners
function initializeEventListeners() {
  document.getElementById('importBtn').addEventListener('click', importCourse);
  document.getElementById('cancelBtn').addEventListener('click', resetForm);
}

// Handle file selection
function handleFile(file) {
  // Validate file type
  if (!file.name.endsWith('.json')) {
    showAlert('error', 'Please select a JSON file');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showAlert('error', 'File size must be less than 5MB');
    return;
  }

  selectedFile = file;
  
  // Read and parse file
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      parsedData = JSON.parse(content);
      
      // Validate JSON structure
      const validation = validateCourseData(parsedData);
      if (!validation.valid) {
        showAlert('error', validation.message);
        return;
      }

      // Show preview
      displayPreview(parsedData);
      
      // Update file info
      document.getElementById('fileName').textContent = file.name;
      document.getElementById('fileSize').textContent = formatFileSize(file.size);
      document.getElementById('fileInfo').classList.remove('hidden');
      
    } catch (error) {
      showAlert('error', 'Invalid JSON file: ' + error.message);
    }
  };
  
  reader.onerror = () => {
    showAlert('error', 'Error reading file');
  };
  
  reader.readAsText(file);
}

// Validate course data structure
function validateCourseData(data) {
  // Check root structure
  if (!data.course || !data.modules) {
    return { valid: false, message: 'JSON must have "course" and "modules" properties' };
  }

  const course = data.course;
  const modules = data.modules;

  // Validate course required fields
  const requiredCourseFields = ['name', 'code', 'level', 'description', 'duration', 'price'];
  for (const field of requiredCourseFields) {
    // Special handling for price field - allow 0 as valid value
    if (field === 'price') {
      if (course[field] === undefined || course[field] === null || course[field] === '') {
        return { valid: false, message: `Course is missing required field: ${field}` };
      }
    } else if (!course[field]) {
      return { valid: false, message: `Course is missing required field: ${field}` };
    }
  }

  // Validate course code format (alphanumeric, dashes, underscores)
  if (!/^[A-Za-z0-9_-]+$/.test(course.code)) {
    return { valid: false, message: 'Course code must contain only letters, numbers, dashes, and underscores' };
  }

  // Validate level
  const validLevels = ['Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor'];
  if (!validLevels.includes(course.level)) {
    return { valid: false, message: `Course level must be one of: ${validLevels.join(', ')}` };
  }

  // Validate price
  if (isNaN(course.price) || course.price < 0) {
    return { valid: false, message: 'Course price must be a positive number' };
  }

  // Validate modules is array
  if (!Array.isArray(modules) || modules.length === 0) {
    return { valid: false, message: 'Modules must be a non-empty array' };
  }

  // Validate each module
  const requiredModuleFields = ['title', 'description', 'order_number', 'content'];
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    
    for (const field of requiredModuleFields) {
      if (!module[field]) {
        return { valid: false, message: `Module ${i + 1} is missing required field: ${field}` };
      }
    }

    // Validate order_number
    if (!Number.isInteger(module.order_number) || module.order_number < 1) {
      return { valid: false, message: `Module ${i + 1}: order_number must be a positive integer` };
    }

    // Validate quiz structure if present
    if (module.quiz) {
      if (!Array.isArray(module.quiz.questions) || module.quiz.questions.length === 0) {
        return { valid: false, message: `Module ${i + 1}: quiz must have a non-empty questions array` };
      }

      // Validate each question
      for (let j = 0; j < module.quiz.questions.length; j++) {
        const question = module.quiz.questions[j];
        if (!question.question || !question.options || !question.correct_answer) {
          return { valid: false, message: `Module ${i + 1}, Question ${j + 1}: missing required fields (question, options, correct_answer)` };
        }
        if (!Array.isArray(question.options) || question.options.length < 2) {
          return { valid: false, message: `Module ${i + 1}, Question ${j + 1}: must have at least 2 options` };
        }
      }
    }
  }

  return { valid: true };
}

// Display preview of course data
function displayPreview(data) {
  const previewSection = document.getElementById('previewSection');
  const previewContent = document.getElementById('previewContent');

  const course = data.course;
  const modules = data.modules;

  // Count total quiz questions
  let totalQuestions = 0;
  modules.forEach(module => {
    if (module.quiz && module.quiz.questions) {
      totalQuestions += module.quiz.questions.length;
    }
  });

  previewContent.innerHTML = `
    <div class="space-y-6">
      <!-- Course Overview -->
      <div>
        <h4 class="text-lg font-semibold text-gray-900 mb-3">Course Overview</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="text-sm text-gray-600">Name:</span>
            <p class="font-medium text-gray-900">${escapeHtml(course.name)}</p>
          </div>
          <div>
            <span class="text-sm text-gray-600">Code:</span>
            <p class="font-medium text-gray-900">${escapeHtml(course.code)}</p>
          </div>
          <div>
            <span class="text-sm text-gray-600">Level:</span>
            <p class="font-medium text-gray-900">${escapeHtml(course.level)}</p>
          </div>
          <div>
            <span class="text-sm text-gray-600">Category:</span>
            <p class="font-medium text-gray-900">${escapeHtml(course.category || 'Not specified')}</p>
          </div>
          <div>
            <span class="text-sm text-gray-600">Duration:</span>
            <p class="font-medium text-gray-900">${escapeHtml(course.duration)}</p>
          </div>
          <div>
            <span class="text-sm text-gray-600">Price:</span>
            <p class="font-medium text-gray-900">R ${parseFloat(course.price).toFixed(2)}</p>
          </div>
        </div>
        <div class="mt-3">
          <span class="text-sm text-gray-600">Description:</span>
          <p class="text-gray-900 mt-1">${escapeHtml(course.description)}</p>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-blue-50 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-blue-600">${modules.length}</div>
          <div class="text-sm text-gray-600 mt-1">Modules</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-green-600">${totalQuestions}</div>
          <div class="text-sm text-gray-600 mt-1">Quiz Questions</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-4 text-center">
          <div class="text-3xl font-bold text-purple-600">${modules.filter(m => m.quiz).length}</div>
          <div class="text-sm text-gray-600 mt-1">Modules with Quiz</div>
        </div>
      </div>

      <!-- Import Mode Selection -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 class="text-lg font-semibold text-gray-900 mb-3">
          <i class="fas fa-cog mr-2 text-yellow-600"></i>Import Mode
        </h4>
        <div class="space-y-3">
          <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-white transition">
            <input type="radio" name="importMode" value="create" checked class="mt-1 mr-3">
            <div class="flex-1">
              <div class="font-semibold text-gray-900">Create New Course</div>
              <div class="text-sm text-gray-600 mt-1">
                Import as a new course. Will fail if course already exists.
              </div>
            </div>
          </label>
          
          <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-white transition">
            <input type="radio" name="importMode" value="update" class="mt-1 mr-3">
            <div class="flex-1">
              <div class="font-semibold text-gray-900">Update Course (Replace All Modules)</div>
              <div class="text-sm text-gray-600 mt-1">
                Replace existing course and <strong>delete all old modules</strong>, then add these ${modules.length} modules. Use this to completely refresh course content.
              </div>
            </div>
          </label>
          
          <label class="flex items-start p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-white transition">
            <input type="radio" name="importMode" value="append" class="mt-1 mr-3">
            <div class="flex-1">
              <div class="font-semibold text-gray-900">Append Modules</div>
              <div class="text-sm text-gray-600 mt-1">
                Keep existing modules and <strong>add</strong> these ${modules.length} new modules to the end. Module numbers will continue from the last existing module.
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Modules List -->
      <div>
        <h4 class="text-lg font-semibold text-gray-900 mb-3">Modules</h4>
        <div class="space-y-2">
          ${modules.map((module, index) => `
            <div class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <span class="font-semibold text-gray-900">${module.order_number}.</span>
                    <span class="font-medium text-gray-900">${escapeHtml(module.title)}</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">${escapeHtml(module.description)}</p>
                  ${module.quiz ? `
                    <div class="mt-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      <i class="fas fa-question-circle mr-1"></i>
                      ${module.quiz.questions.length} quiz questions
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  previewSection.classList.remove('hidden');
  document.getElementById('importBtn').disabled = false;
}

// Import course to database
async function importCourse() {
  if (!parsedData) {
    showAlert('error', 'No course data to import');
    return;
  }

  const importBtn = document.getElementById('importBtn');
  const originalText = importBtn.innerHTML;
  
  try {
    // Get selected import mode
    const importMode = document.querySelector('input[name="importMode"]:checked')?.value || 'create';
    
    // Disable button and show loading
    importBtn.disabled = true;
    importBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Importing...';

    // Send to API with import mode
    const response = await axios.post('/api/admin/courses/import', {
      ...parsedData,
      importMode: importMode
    });

    if (response.data.success) {
      showAlert('success', response.data.message);
      
      // Show success details
      const courseId = response.data.courseId;
      const courseName = parsedData.course.name;
      
      // Add view course button to alert
      setTimeout(() => {
        const alertDiv = document.getElementById('alert');
        alertDiv.innerHTML += `
          <div class="mt-3">
            <a href="/admin/courses/${courseId}" class="inline-flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
              <i class="fas fa-eye mr-2"></i>View Course
            </a>
          </div>
        `;
      }, 100);

      // Reset form after delay
      setTimeout(() => {
        resetForm();
      }, 5000);
    } else {
      showAlert('error', response.data.message || 'Import failed');
    }

  } catch (error) {
    console.error('Import error:', error);
    let errorMessage = 'Failed to import course';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showAlert('error', errorMessage);
  } finally {
    // Re-enable button
    importBtn.disabled = false;
    importBtn.innerHTML = originalText;
  }
}

// Reset form
function resetForm() {
  selectedFile = null;
  parsedData = null;
  
  document.getElementById('fileInput').value = '';
  document.getElementById('fileInfo').classList.add('hidden');
  document.getElementById('previewSection').classList.add('hidden');
  document.getElementById('importBtn').disabled = true;
  document.getElementById('alert').classList.add('hidden');
}

// Show alert message
function showAlert(type, message) {
  const alertDiv = document.getElementById('alert');
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle'
  };

  alertDiv.className = `border rounded-lg p-4 mb-6 ${colors[type]}`;
  alertDiv.innerHTML = `
    <div class="flex items-start">
      <i class="fas ${icons[type]} text-xl mr-3 mt-0.5"></i>
      <div class="flex-1">
        <p class="font-medium">${message}</p>
      </div>
      <button onclick="document.getElementById('alert').classList.add('hidden')" class="ml-4">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  alertDiv.classList.remove('hidden');

  // Scroll to alert
  alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Utility functions
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.toString().replace(/[&<>"']/g, m => map[m]);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

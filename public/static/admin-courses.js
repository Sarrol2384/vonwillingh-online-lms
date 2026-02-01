// Admin Courses Management JavaScript

let allCourses = [];
let filteredCourses = [];

// Load courses on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    setupEventListeners();
});

function setupEventListeners() {
    // Filters
    document.getElementById('levelFilter').addEventListener('change', applyFilters);
    document.getElementById('contentFilter').addEventListener('change', applyFilters);
    document.getElementById('courseSearch').addEventListener('input', applyFilters);
    document.getElementById('refreshBtn').addEventListener('click', loadCourses);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin-login';
    });
    
    // Modal close buttons
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('closeModalBtn2').addEventListener('click', closeModal);
    
    // Add course button (placeholder)
    document.getElementById('addCourseBtn').addEventListener('click', () => {
        alert('Add Course feature coming soon! For now, add courses directly in Supabase SQL Editor.');
    });
    
    // Add module button
    document.getElementById('addModuleBtn').addEventListener('click', () => {
        const courseId = document.getElementById('addModuleBtn').dataset.courseId;
        const courseName = document.getElementById('modalCourseTitle').textContent;
        if (courseId) {
            showAddModuleForm(courseId, courseName);
        }
    });
}

async function loadCourses() {
    try {
        showLoading(true);
        
        const response = await fetch('/api/admin/courses', {
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to load courses');
        }
        
        allCourses = data.courses;
        filteredCourses = allCourses;
        
        updateStats();
        displayCourses(filteredCourses);
        showLoading(false);
        
    } catch (error) {
        console.error('Error loading courses:', error);
        showError('Failed to load courses: ' + error.message);
        showLoading(false);
    }
}

function updateStats() {
    const total = allCourses.length;
    const withContent = allCourses.filter(c => c.has_content).length;
    const withoutContent = total - withContent;
    const totalModules = allCourses.reduce((sum, c) => sum + (c.module_count || 0), 0);
    
    document.getElementById('totalCourses').textContent = total;
    document.getElementById('coursesWithContent').textContent = withContent;
    document.getElementById('coursesWithoutContent').textContent = withoutContent;
    document.getElementById('totalModules').textContent = totalModules;
}

function displayCourses(courses) {
    const container = document.getElementById('coursesContainer');
    const tbody = document.getElementById('coursesTableBody');
    const emptyDiv = document.getElementById('emptyDiv');
    
    if (courses.length === 0) {
        container.classList.add('hidden');
        emptyDiv.classList.remove('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    emptyDiv.classList.add('hidden');
    
    tbody.innerHTML = courses.map(course => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${course.id}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                <div class="font-medium">${course.name}</div>
                <div class="text-gray-500 text-xs mt-1">${course.description || 'No description'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${getLevelBadgeClass(course.level)}">
                    ${course.level}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                R${course.price.toLocaleString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center space-x-2">
                    <span class="font-semibold ${course.module_count > 0 ? 'text-green-600' : 'text-gray-400'}">
                        ${course.module_count}
                    </span>
                    <i class="fas fa-list-ul text-gray-400"></i>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                ${course.has_content ? 
                    '<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold"><i class="fas fa-check-circle mr-1"></i>Active</span>' :
                    '<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold"><i class="fas fa-exclamation-circle mr-1"></i>No Content</span>'
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button onclick="viewModules(${course.id}, '${course.name.replace(/'/g, "\\'")}')" 
                        class="text-blue-600 hover:text-blue-800 font-medium">
                    <i class="fas fa-eye mr-1"></i>View Modules
                </button>
                <button onclick="deleteCourse(${course.id}, '${course.name.replace(/'/g, "\\'")}')" 
                        class="text-red-600 hover:text-red-800 font-medium ml-3">
                    <i class="fas fa-trash mr-1"></i>Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function getLevelBadgeClass(level) {
    const classes = {
        'Certificate': 'bg-gray-100 text-gray-800',
        'Diploma': 'bg-blue-100 text-blue-800',
        'Bachelor': 'bg-green-100 text-green-800',
        'Honours': 'bg-purple-100 text-purple-800',
        'Master': 'bg-indigo-100 text-indigo-800',
        'Doctorate': 'bg-red-100 text-red-800'
    };
    return classes[level] || 'bg-gray-100 text-gray-800';
}

function applyFilters() {
    const levelFilter = document.getElementById('levelFilter').value;
    const contentFilter = document.getElementById('contentFilter').value;
    const searchQuery = document.getElementById('courseSearch').value.toLowerCase();
    
    filteredCourses = allCourses.filter(course => {
        // Level filter
        if (levelFilter && course.level !== levelFilter) return false;
        
        // Content filter
        if (contentFilter === 'with' && !course.has_content) return false;
        if (contentFilter === 'without' && course.has_content) return false;
        
        // Search filter
        if (searchQuery && !course.name.toLowerCase().includes(searchQuery)) return false;
        
        return true;
    });
    
    displayCourses(filteredCourses);
}

async function viewModules(courseId, courseName) {
    try {
        const modal = document.getElementById('modulesModal');
        const modalTitle = document.getElementById('modalCourseTitle');
        const modulesContent = document.getElementById('modulesContent');
        
        // Show modal
        modal.classList.remove('hidden');
        modalTitle.textContent = courseName;
        modulesContent.innerHTML = '<p class="text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i>Loading modules...</p>';
        
        // Store course ID for add module button
        document.getElementById('addModuleBtn').dataset.courseId = courseId;
        
        // Fetch modules
        const response = await fetch(`/api/admin/courses/${courseId}/modules`, {
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to load modules');
        }
        
        const modules = data.modules;
        
        if (modules.length === 0) {
            modulesContent.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-folder-open text-6xl mb-4 text-gray-300"></i>
                    <p class="text-lg font-semibold mb-2">No Modules Yet</p>
                    <p class="text-sm">This course doesn't have any learning modules yet.</p>
                    <p class="text-sm mt-2">Click "Add Module" to create the first module.</p>
                </div>
            `;
        } else {
            modulesContent.innerHTML = `
                <div class="space-y-4">
                    ${modules.map((module, index) => `
                        <div class="border rounded-lg p-4 hover:shadow-md transition">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-3">
                                        <span class="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm">
                                            Module ${module.order_index}
                                        </span>
                                        <h4 class="text-lg font-semibold text-gray-900">${module.title}</h4>
                                    </div>
                                    <p class="text-gray-600 mt-2">${module.description || 'No description'}</p>
                                    <div class="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                        <span>
                                            <i class="fas fa-clock mr-1"></i>
                                            ${module.duration_hours || 0} hours
                                        </span>
                                        ${module.video_url ? '<span><i class="fas fa-video mr-1"></i>Has Video</span>' : ''}
                                        <span>
                                            <i class="fas fa-file-alt mr-1"></i>
                                            ${module.content ? (module.content.length > 100 ? 'Has Content' : 'Short Content') : 'No Content'}
                                        </span>
                                    </div>
                                </div>
                                <div class="ml-4 space-y-2">
                                    <button onclick="editModule('${module.id}')" 
                                            class="block text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        <i class="fas fa-edit mr-1"></i>Edit
                                    </button>
                                    <button onclick="deleteModule('${module.id}', ${courseId})" 
                                            class="block text-red-600 hover:text-red-800 text-sm font-medium">
                                        <i class="fas fa-trash mr-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm text-blue-800">
                        <i class="fas fa-info-circle mr-2"></i>
                        <strong>Total Modules:</strong> ${modules.length} | 
                        <strong>Total Duration:</strong> ${modules.reduce((sum, m) => sum + (m.duration_hours || 0), 0)} hours
                    </p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading modules:', error);
        document.getElementById('modulesContent').innerHTML = `
            <div class="text-center py-8 text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Failed to load modules: ${error.message}</p>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('modulesModal').classList.add('hidden');
}

async function editModule(moduleId) {
    try {
        // First, fetch the module data
        const courseId = document.getElementById('addModuleBtn').dataset.courseId;
        const courseName = document.getElementById('modalCourseTitle').textContent;
        
        const response = await fetch(`/api/admin/courses/${courseId}/modules`, {
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Failed to load module data');
        }
        
        const module = data.modules.find(m => m.id === moduleId);
        
        if (!module) {
            throw new Error('Module not found');
        }
        
        // Show edit form
        showEditModuleForm(courseId, courseName, module);
        
    } catch (error) {
        console.error('Error loading module for edit:', error);
        alert('Failed to load module: ' + error.message);
    }
}

async function deleteModule(moduleId, courseId) {
    if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/modules/${moduleId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to delete module');
        }
        
        alert('Module deleted successfully!');
        // Reload modules
        const courseName = document.getElementById('modalCourseTitle').textContent;
        viewModules(courseId, courseName);
        // Reload courses to update counts
        loadCourses();
        
    } catch (error) {
        console.error('Error deleting module:', error);
        alert('Failed to delete module: ' + error.message);
    }
}

function showAddModuleForm(courseId, courseName) {
    const modulesContent = document.getElementById('modulesContent');
    
    modulesContent.innerHTML = `
        <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Add New Module to ${courseName}</h3>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Module Title *</label>
                <input type="text" id="moduleTitle" class="w-full border border-gray-300 rounded px-4 py-2" 
                       placeholder="e.g., Introduction to Business">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="moduleDescription" class="w-full border border-gray-300 rounded px-4 py-2" rows="2"
                          placeholder="Brief description of this module"></textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Content (HTML) *</label>
                <textarea id="moduleContent" class="w-full border border-gray-300 rounded px-4 py-2 font-mono text-sm" rows="10"
                          placeholder="<h2>Module Title</h2>&#10;<p>Module content goes here...</p>"></textarea>
                <p class="text-xs text-gray-500 mt-1">
                    <i class="fas fa-info-circle"></i> Use HTML tags for formatting. Example: &lt;h2&gt;Heading&lt;/h2&gt;, &lt;p&gt;Paragraph&lt;/p&gt;, &lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;
                </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                    <input type="number" id="moduleDuration" class="w-full border border-gray-300 rounded px-4 py-2" 
                           placeholder="e.g., 4" min="0">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Video URL (optional)</label>
                    <input type="url" id="moduleVideoUrl" class="w-full border border-gray-300 rounded px-4 py-2" 
                           placeholder="https://youtube.com/watch?v=...">
                </div>
            </div>
            
            <div class="flex space-x-4">
                <button onclick="saveNewModule(${courseId}, '${courseName.replace(/'/g, "\\'")}' )" 
                        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    <i class="fas fa-save mr-2"></i>Save Module
                </button>
                <button onclick="viewModules(${courseId}, '${courseName.replace(/'/g, "\\'")}' )" 
                        class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition">
                    <i class="fas fa-times mr-2"></i>Cancel
                </button>
            </div>
        </div>
    `;
}

function showEditModuleForm(courseId, courseName, module) {
    const modulesContent = document.getElementById('modulesContent');
    
    // Escape HTML for safe display in value attributes
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    };
    
    modulesContent.innerHTML = `
        <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Edit Module</h3>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Module Title *</label>
                <input type="text" id="moduleTitle" class="w-full border border-gray-300 rounded px-4 py-2" 
                       value="${escapeHtml(module.title)}" placeholder="e.g., Introduction to Business">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="moduleDescription" class="w-full border border-gray-300 rounded px-4 py-2" rows="2"
                          placeholder="Brief description of this module">${escapeHtml(module.description)}</textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Content (HTML) *</label>
                <textarea id="moduleContent" class="w-full border border-gray-300 rounded px-4 py-2 font-mono text-sm" rows="10"
                          placeholder="<h2>Module Title</h2>&#10;<p>Module content goes here...</p>">${escapeHtml(module.content)}</textarea>
                <p class="text-xs text-gray-500 mt-1">
                    <i class="fas fa-info-circle"></i> Use HTML tags for formatting.
                </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                    <input type="number" id="moduleDuration" class="w-full border border-gray-300 rounded px-4 py-2" 
                           value="${module.duration_hours || ''}" placeholder="e.g., 4" min="0">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Video URL (optional)</label>
                    <input type="url" id="moduleVideoUrl" class="w-full border border-gray-300 rounded px-4 py-2" 
                           value="${escapeHtml(module.video_url)}" placeholder="https://youtube.com/watch?v=...">
                </div>
            </div>
            
            <div class="flex space-x-4">
                <button onclick="updateModule('${module.id}', ${courseId}, '${courseName.replace(/'/g, "\\'")}' )" 
                        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    <i class="fas fa-save mr-2"></i>Update Module
                </button>
                <button onclick="viewModules(${courseId}, '${courseName.replace(/'/g, "\\'")}' )" 
                        class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition">
                    <i class="fas fa-times mr-2"></i>Cancel
                </button>
            </div>
        </div>
    `;
}

async function saveNewModule(courseId, courseName) {
    try {
        const title = document.getElementById('moduleTitle').value.trim();
        const description = document.getElementById('moduleDescription').value.trim();
        const content = document.getElementById('moduleContent').value.trim();
        const duration_hours = parseInt(document.getElementById('moduleDuration').value) || null;
        const video_url = document.getElementById('moduleVideoUrl').value.trim() || null;
        
        if (!title) {
            alert('Please enter a module title');
            return;
        }
        
        if (!content) {
            alert('Please enter module content');
            return;
        }
        
        const response = await fetch(`/api/admin/courses/${courseId}/modules`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description: description || null,
                content,
                duration_hours,
                video_url
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to add module');
        }
        
        alert('Module added successfully!');
        // Reload modules
        viewModules(courseId, courseName);
        // Reload courses to update counts
        loadCourses();
        
    } catch (error) {
        console.error('Error adding module:', error);
        alert('Failed to add module: ' + error.message);
    }
}

async function updateModule(moduleId, courseId, courseName) {
    try {
        const title = document.getElementById('moduleTitle').value.trim();
        const description = document.getElementById('moduleDescription').value.trim();
        const content = document.getElementById('moduleContent').value.trim();
        const duration_hours = parseInt(document.getElementById('moduleDuration').value) || null;
        const video_url = document.getElementById('moduleVideoUrl').value.trim() || null;
        
        if (!title) {
            alert('Please enter a module title');
            return;
        }
        
        if (!content) {
            alert('Please enter module content');
            return;
        }
        
        const response = await fetch(`/api/admin/modules/${moduleId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description: description || null,
                content,
                duration_hours,
                video_url
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to update module');
        }
        
        alert('Module updated successfully!');
        // Reload modules
        viewModules(courseId, courseName);
        // Reload courses to update counts
        loadCourses();
        
    } catch (error) {
        console.error('Error updating module:', error);
        alert('Failed to update module: ' + error.message);
    }
}

function showLoading(show) {
    document.getElementById('loadingDiv').classList.toggle('hidden', !show);
}

function showError(message) {
    alert(message);
}

// Delete course function
async function deleteCourse(courseId, courseName) {
    // Confirm deletion
    const confirmed = confirm(
        `Are you sure you want to delete this course?\n\n` +
        `Course: ${courseName}\n` +
        `ID: ${courseId}\n\n` +
        `This will also delete all modules associated with this course.\n` +
        `This action cannot be undone!`
    );
    
    if (!confirmed) {
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`/api/admin/courses/${courseId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to delete course');
        }
        
        alert(`Course "${courseName}" has been deleted successfully!`);
        
        // Reload courses
        await loadCourses();
        
    } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course: ' + error.message);
        showLoading(false);
    }
}

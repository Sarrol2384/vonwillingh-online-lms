// Change Password Handler

document.addEventListener('DOMContentLoaded', function() {
  // Check if logged in
  const session = getSession();
  if (!session) {
    window.location.href = '/student-login';
    return;
  }
  
  // If not using temporary password, redirect to dashboard
  if (!session.isTemporaryPassword) {
    window.location.href = '/student/dashboard';
    return;
  }
  
  const form = document.getElementById('changePasswordForm');
  const alertBox = document.getElementById('alertBox');
  const changeBtn = document.getElementById('changeBtn');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      showAlert('error', 'New passwords do not match');
      return;
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      showAlert('error', 'Password must be at least 8 characters long');
      return;
    }
    
    // Disable button
    changeBtn.disabled = true;
    changeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Changing password...';
    
    try {
      const response = await axios.post('/api/student/change-password', {
        studentId: session.studentId,
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        showAlert('success', 'Password changed successfully! Redirecting...');
        
        // Update session
        session.isTemporaryPassword = false;
        if (localStorage.getItem('studentSession')) {
          localStorage.setItem('studentSession', JSON.stringify(session));
        } else {
          sessionStorage.setItem('studentSession', JSON.stringify(session));
        }
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/student/dashboard';
        }, 2000);
        
      } else {
        showAlert('error', response.data.message || 'Failed to change password');
        changeBtn.disabled = false;
        changeBtn.innerHTML = '<i class="fas fa-key mr-2"></i>Change Password';
      }
      
    } catch (error) {
      console.error('Change password error:', error);
      showAlert('error', error.response?.data?.message || 'An error occurred');
      changeBtn.disabled = false;
      changeBtn.innerHTML = '<i class="fas fa-key mr-2"></i>Change Password';
    }
  });
  
  function showAlert(type, message) {
    alertBox.className = `mb-4 p-4 rounded-lg ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
    }`;
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
  }
  
  function getSession() {
    const sessionStr = localStorage.getItem('studentSession') || sessionStorage.getItem('studentSession');
    return sessionStr ? JSON.parse(sessionStr) : null;
  }
});

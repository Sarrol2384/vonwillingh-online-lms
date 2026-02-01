// Student Login Handler

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const alertBox = document.getElementById('alertBox');
  const loginBtn = document.getElementById('loginBtn');
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Disable button during login
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
    
    try {
      const response = await axios.post('/api/student/login', {
        email,
        password
      });
      
      if (response.data.success) {
        // Store session
        const sessionData = {
          studentId: response.data.student.id,
          fullName: response.data.student.full_name,
          email: response.data.student.email,
          isTemporaryPassword: response.data.student.isTemporaryPassword,
          loginTime: new Date().toISOString()
        };
        
        if (rememberMe) {
          localStorage.setItem('studentSession', JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem('studentSession', JSON.stringify(sessionData));
        }
        
        // Show success message
        showAlert('success', 'Login successful! Redirecting...');
        
        // Redirect based on temporary password status
        setTimeout(() => {
          if (response.data.student.isTemporaryPassword) {
            window.location.href = '/student/change-password';
          } else {
            window.location.href = '/student/dashboard';
          }
        }, 1000);
        
      } else {
        showAlert('error', response.data.message || 'Login failed');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Sign In';
      }
      
    } catch (error) {
      console.error('Login error:', error);
      showAlert('error', error.response?.data?.message || 'An error occurred during login');
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Sign In';
    }
  });
  
  function showAlert(type, message) {
    alertBox.className = `mb-4 p-4 rounded-lg ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
    }`;
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
  }
});

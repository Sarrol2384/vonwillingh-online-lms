// Admin Login Script
const form = document.getElementById('loginForm');
const alertDiv = document.getElementById('alert');
const submitBtn = document.getElementById('submitBtn');

function showAlert(message, type) {
  alertDiv.className = `mb-4 p-4 rounded-lg ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
  alertDiv.textContent = message;
  alertDiv.classList.remove('hidden');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
  
  try {
    const response = await axios.post('/api/admin/login', {
      email,
      password
    });
    
    if (response.data.success) {
      localStorage.setItem('adminSession', JSON.stringify(response.data.session));
      showAlert('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/admin-dashboard';
      }, 1000);
    } else {
      showAlert(response.data.message || 'Login failed', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-lock mr-2"></i>Sign In to Admin Panel';
    }
  } catch (error) {
    showAlert(error.response?.data?.message || 'An error occurred. Please try again.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-lock mr-2"></i>Sign In to Admin Panel';
  }
});

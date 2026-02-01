// Payment Upload Script for Students
document.addEventListener('DOMContentLoaded', function() {
  const uploadForm = document.getElementById('paymentUploadForm');
  const fileInput = document.getElementById('proofFile');
  const uploadBtn = document.getElementById('uploadBtn');
  const alertDiv = document.getElementById('alert');
  const applicationId = document.getElementById('applicationId').value;

  function showAlert(message, type) {
    alertDiv.className = `mb-4 p-4 rounded-lg ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
    alertDiv.textContent = message;
    alertDiv.classList.remove('hidden');
  }

  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('File size must be less than 5MB', 'error');
        this.value = '';
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showAlert('Only JPG, PNG, and PDF files are allowed', 'error');
        this.value = '';
        return;
      }
    }
  });

  uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      showAlert('Please select a file to upload', 'error');
      return;
    }

    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Uploading...';

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('proofFile', file);
      formData.append('applicationId', applicationId);

      // Upload proof
      const response = await axios.post('/api/payments/upload-proof', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        showAlert('Proof of payment uploaded successfully! We will verify your payment within 1-2 business days.', 'success');
        
        // Reload page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showAlert(response.data.message || 'Upload failed', 'error');
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload mr-2"></i>Upload Proof';
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'An error occurred. Please try again.', 'error');
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = '<i class="fas fa-upload mr-2"></i>Upload Proof';
    }
  });
});

// Admin Payments Management Script
const session = JSON.parse(localStorage.getItem('adminSession') || 'null');
if (!session || !session.access_token) {
  window.location.href = '/admin-login';
}

let allPayments = [];

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('adminSession');
  window.location.href = '/admin-login';
});

// Load payments
async function loadPayments() {
  try {
    const response = await axios.get('/api/admin/payments', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (response.data.success) {
      allPayments = response.data.payments || [];
      renderPayments();
      updateStats();
    }
  } catch (error) {
    console.error('Error loading payments:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('adminSession');
      window.location.href = '/admin-login';
    }
  }
}

// Update statistics
function updateStats() {
  const total = allPayments.length;
  const pending = allPayments.filter(p => p.payment_status === 'proof_uploaded').length;
  const verified = allPayments.filter(p => p.payment_status === 'verified').length;
  const rejected = allPayments.filter(p => p.payment_status === 'rejected').length;

  document.getElementById('totalPayments').textContent = total;
  document.getElementById('pendingPayments').textContent = pending;
  document.getElementById('verifiedPayments').textContent = verified;
  document.getElementById('rejectedPayments').textContent = rejected;
}

// Render payments
function renderPayments() {
  const statusFilter = document.getElementById('statusFilter').value;
  
  let filtered = allPayments.filter(payment => {
    const matchesStatus = !statusFilter || payment.payment_status === statusFilter;
    return matchesStatus;
  });

  const tbody = document.getElementById('paymentsTableBody');
  const loadingDiv = document.getElementById('loadingDiv');
  const container = document.getElementById('paymentsContainer');
  const emptyDiv = document.getElementById('emptyDiv');

  loadingDiv.classList.add('hidden');

  if (filtered.length === 0) {
    container.classList.add('hidden');
    emptyDiv.classList.remove('hidden');
    return;
  }

  emptyDiv.classList.add('hidden');
  container.classList.remove('hidden');

  tbody.innerHTML = filtered.map(payment => {
    const statusColors = {
      pending: 'bg-gray-100 text-gray-800',
      proof_uploaded: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const statusLabels = {
      pending: 'Awaiting Proof',
      proof_uploaded: 'Pending Verification',
      verified: 'Verified',
      rejected: 'Rejected'
    };

    const date = payment.payment_uploaded_at 
      ? new Date(payment.payment_uploaded_at).toLocaleDateString() 
      : payment.submitted_at 
        ? new Date(payment.submitted_at).toLocaleDateString()
        : 'N/A';
    const studentName = payment.students?.full_name || 'N/A';
    const studentEmail = payment.students?.email || 'N/A';
    const courseName = payment.courses?.name || 'N/A';
    const amount = payment.courses?.price ? `R ${parseFloat(payment.courses.price).toLocaleString()}` : 'N/A';

    return `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${studentName}</div>
          <div class="text-sm text-gray-500">${studentEmail}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${courseName}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          ${amount}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[payment.payment_status] || 'bg-gray-100 text-gray-800'}">
            ${statusLabels[payment.payment_status] || payment.payment_status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${date}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          ${payment.payment_status === 'proof_uploaded' ? `
            <button onclick="viewPayment('${payment.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
              <i class="fas fa-eye"></i> View
            </button>
            <button onclick="verifyPayment('${payment.id}')" class="text-green-600 hover:text-green-900 mr-3">
              <i class="fas fa-check"></i> Verify
            </button>
            <button onclick="rejectPayment('${payment.id}')" class="text-red-600 hover:text-red-900">
              <i class="fas fa-times"></i> Reject
            </button>
          ` : payment.payment_proof_url ? `
            <button onclick="viewPayment('${payment.id}')" class="text-blue-600 hover:text-blue-900">
              <i class="fas fa-eye"></i> View
            </button>
          ` : `
            <span class="text-gray-400">
              <i class="fas fa-hourglass"></i> Awaiting Upload
            </span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

// View payment details
window.viewPayment = function(id) {
  const payment = allPayments.find(p => p.id === id);
  if (!payment) return;

  if (payment.payment_proof_url) {
    window.open(payment.payment_proof_url, '_blank');
  } else {
    alert('No proof of payment uploaded yet.');
  }
}

// Verify payment
window.verifyPayment = async function(id) {
  if (!confirm('Are you sure you want to verify this payment? This will grant the student access to the portal.')) return;

  try {
    const response = await axios.post('/api/admin/payments/verify', {
      applicationId: id,
      action: 'verify'
    }, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (response.data.success) {
      alert('Payment verified successfully! Student login credentials have been created.');
      loadPayments();
    }
  } catch (error) {
    alert('Error verifying payment: ' + (error.response?.data?.message || error.message));
  }
}

// Reject payment
window.rejectPayment = async function(id) {
  const reason = prompt('Please enter rejection reason:');
  if (!reason) return;

  try {
    const response = await axios.post('/api/admin/payments/verify', {
      applicationId: id,
      action: 'reject',
      notes: reason
    }, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (response.data.success) {
      alert('Payment rejected. Student will be notified to upload new proof.');
      loadPayments();
    }
  } catch (error) {
    alert('Error rejecting payment: ' + (error.response?.data?.message || error.message));
  }
}

// Event listeners
document.getElementById('statusFilter').addEventListener('change', renderPayments);
document.getElementById('refreshBtn').addEventListener('click', loadPayments);

// Initial load
loadPayments();

// Admin Dashboard Script
const session = JSON.parse(localStorage.getItem('adminSession') || 'null');
if (!session || !session.access_token) {
  window.location.href = '/admin-login';
}

let allApplications = [];

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('adminSession');
  window.location.href = '/admin-login';
});

// Load applications
async function loadApplications() {
  try {
    const response = await axios.get('/api/admin/applications', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (response.data.success) {
      allApplications = response.data.applications || [];
      renderApplications();
      updateStats();
    }
  } catch (error) {
    console.error('Error loading applications:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('adminSession');
      window.location.href = '/admin-login';
    }
  }
}

// Update statistics
function updateStats() {
  const total = allApplications.length;
  const pending = allApplications.filter(app => app.status === 'pending').length;
  const approved = allApplications.filter(app => app.status === 'approved').length;
  const rejected = allApplications.filter(app => app.status === 'rejected').length;

  document.getElementById('totalApps').textContent = total;
  document.getElementById('pendingApps').textContent = pending;
  document.getElementById('approvedApps').textContent = approved;
  document.getElementById('rejectedApps').textContent = rejected;
}

// Render applications
function renderApplications() {
  const statusFilter = document.getElementById('statusFilter').value;
  const emailSearch = document.getElementById('emailSearch').value.toLowerCase();

  let filtered = allApplications.filter(app => {
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesEmail = !emailSearch || app.students?.email?.toLowerCase().includes(emailSearch);
    return matchesStatus && matchesEmail;
  });

  const tbody = document.getElementById('applicationsTableBody');
  const loadingDiv = document.getElementById('loadingDiv');
  const container = document.getElementById('applicationsContainer');
  const emptyDiv = document.getElementById('emptyDiv');

  loadingDiv.classList.add('hidden');

  if (filtered.length === 0) {
    container.classList.add('hidden');
    emptyDiv.classList.remove('hidden');
    return;
  }

  emptyDiv.classList.add('hidden');
  container.classList.remove('hidden');

  tbody.innerHTML = filtered.map(app => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const date = new Date(app.submitted_at).toLocaleDateString();
    const studentName = app.students?.full_name || 'N/A';
    const studentEmail = app.students?.email || 'N/A';
    const courseName = app.courses?.name || 'N/A';
    
    // Payment status badge
    const paymentStatusBadge = app.payment_status ? `
      <div class="text-xs mt-1">
        <span class="px-2 py-1 rounded ${
          app.payment_status === 'verified' ? 'bg-green-100 text-green-800' :
          app.payment_status === 'proof_uploaded' ? 'bg-yellow-100 text-yellow-800' :
          app.payment_status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }">
          ${app.payment_status === 'verified' ? '✓ Paid' :
            app.payment_status === 'proof_uploaded' ? '⏳ Proof Uploaded' :
            app.payment_status === 'rejected' ? '✗ Payment Rejected' :
            '$ Pending Payment'}
        </span>
      </div>
    ` : '';

    return `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${studentName}</div>
          <div class="text-sm text-gray-500">${studentEmail}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${courseName}</div>
          ${paymentStatusBadge}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}">
            ${app.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${date}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          ${app.status === 'pending' ? `
            <button onclick="approveApplication('${app.id}')" class="text-green-600 hover:text-green-900 mr-3">
              <i class="fas fa-check"></i> Approve
            </button>
            <button onclick="rejectApplication('${app.id}')" class="text-red-600 hover:text-red-900">
              <i class="fas fa-times"></i> Reject
            </button>
          ` : app.status === 'approved' && app.payment_status === 'pending' ? `
            <a href="/payment-instructions/${app.id}" target="_blank" class="text-blue-600 hover:text-blue-900">
              <i class="fas fa-money-check-alt"></i> Payment Link
            </a>
          ` : `
            <span class="text-gray-400">
              <i class="fas fa-check-circle"></i> Processed
            </span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

// Approve application
window.approveApplication = async function(id) {
  if (!confirm('Are you sure you want to approve this application?')) return;

  try {
    const response = await axios.post(`/api/admin/applications/${id}/approve`, {}, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (response.data.success) {
      alert('Application approved successfully!');
      loadApplications();
    }
  } catch (error) {
    alert('Error approving application: ' + (error.response?.data?.message || error.message));
  }
}

// Reject application
window.rejectApplication = async function(id) {
  const reason = prompt('Please enter rejection reason:');
  if (!reason) return;

  try {
    const response = await axios.post(`/api/admin/applications/${id}/reject`, {
      reason
    }, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (response.data.success) {
      alert('Application rejected successfully!');
      loadApplications();
    }
  } catch (error) {
    alert('Error rejecting application: ' + (error.response?.data?.message || error.message));
  }
}

// Event listeners
document.getElementById('statusFilter').addEventListener('change', renderApplications);
document.getElementById('emailSearch').addEventListener('input', renderApplications);
document.getElementById('refreshBtn').addEventListener('click', loadApplications);

// Initial load
loadApplications();

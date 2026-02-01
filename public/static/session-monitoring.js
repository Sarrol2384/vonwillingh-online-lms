// Student Session Monitoring Dashboard
let sessions = [];
let filteredSessions = [];

async function loadSessions() {
    try {
        const response = await axios.get('/api/admin/sessions');
        if (response.data.success) {
            sessions = response.data.sessions;
            filteredSessions = sessions;
            updateStats();
            renderSessions();
        }
    } catch (error) {
        console.error('Error loading sessions:', error);
        showAlert('error', 'Failed to load session data');
    }
}

function updateStats() {
    const stats = {
        total: sessions.length,
        active: sessions.filter(s => s.status === 'active').length,
        ended: sessions.filter(s => s.status === 'ended').length,
        expired: sessions.filter(s => s.status === 'expired').length
    };
    
    document.getElementById('totalSessions').textContent = stats.total;
    document.getElementById('activeSessions').textContent = stats.active;
    document.getElementById('endedSessions').textContent = stats.ended;
    document.getElementById('expiredSessions').textContent = stats.expired;
}

function renderSessions() {
    const tbody = document.getElementById('sessionsTable');
    
    if (filteredSessions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-2"></i>
                    <p>No sessions found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredSessions.map(session => `
        <tr class="hover:bg-gray-50 border-b">
            <td class="px-6 py-4">
                <div class="font-medium text-gray-900">${session.student_name || 'Unknown'}</div>
                <div class="text-sm text-gray-500">${session.student_email || ''}</div>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <i class="fas fa-user-graduate mr-1"></i> Student
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                ${formatDateTime(session.login_time)}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                ${session.logout_time ? formatDateTime(session.logout_time) : '-'}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                ${formatDuration(session.duration)}
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center text-sm">
                    <i class="fas ${getDeviceIcon(session.device_info)} mr-2 text-gray-400"></i>
                    <span>${session.browser || 'Unknown'} - ${session.os || 'Unknown'}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
                ${session.ip_address || '-'}
            </td>
            <td class="px-6 py-4">
                ${getStatusBadge(session.status)}
            </td>
        </tr>
    `).join('');
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDuration(duration) {
    if (!duration) return '-';
    
    // Duration comes as PostgreSQL interval (e.g., "01:23:45")
    const parts = duration.split(':');
    if (parts.length >= 2) {
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }
    
    return duration;
}

function getDeviceIcon(device) {
    if (!device) return 'fa-desktop';
    const d = device.toLowerCase();
    if (d.includes('mobile') || d.includes('phone')) return 'fa-mobile-alt';
    if (d.includes('tablet')) return 'fa-tablet-alt';
    return 'fa-desktop';
}

function getStatusBadge(status) {
    const badges = {
        active: '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-circle mr-1"></i> Active</span>',
        ended: '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i class="fas fa-check-circle mr-1"></i> Ended</span>',
        expired: '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><i class="fas fa-clock mr-1"></i> Expired</span>'
    };
    return badges[status] || badges.expired;
}

function filterSessions() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    
    filteredSessions = sessions.filter(session => {
        const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
        const matchesSearch = !searchQuery || 
            (session.student_name && session.student_name.toLowerCase().includes(searchQuery)) ||
            (session.student_email && session.student_email.toLowerCase().includes(searchQuery));
        
        return matchesStatus && matchesSearch;
    });
    
    renderSessions();
}

function refreshSessions() {
    const btn = document.getElementById('refreshBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-sync-alt fa-spin mr-2"></i>Refreshing...';
    
    loadSessions().finally(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Refresh';
    });
}

function showAlert(type, message) {
    const alertDiv = document.getElementById('alert');
    const alertClass = type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200';
    
    alertDiv.className = `mb-4 p-4 rounded-lg border ${alertClass}`;
    alertDiv.textContent = message;
    alertDiv.classList.remove('hidden');
    
    setTimeout(() => {
        alertDiv.classList.add('hidden');
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSessions();
    
    // Set up event listeners
    document.getElementById('statusFilter').addEventListener('change', filterSessions);
    document.getElementById('searchInput').addEventListener('input', filterSessions);
    document.getElementById('refreshBtn').addEventListener('click', refreshSessions);
    
    // Auto-refresh every 30 seconds
    setInterval(loadSessions, 30000);
});

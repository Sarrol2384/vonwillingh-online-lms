// Direct API approach to fix duplicate enrollments
const https = require('https');

const API_KEY = 'vonwillingh-lms-import-key-2026';
const BASE_URL = 'https://vonwillingh-online-lms.pages.dev';

// Create a simple API endpoint call to delete duplicates
const fixDuplicates = async () => {
    console.log('🔧 Fixing duplicate enrollments...');
    
    // We'll use the course import API to re-import which should fix enrollments
    // Or we can try direct database connection
    
    console.log('Attempting to connect and fix...');
};

fixDuplicates();

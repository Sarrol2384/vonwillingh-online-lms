// Quiz Renderer for Module Viewer - Clean up repeated quiz text
console.log('🎯 Quiz Renderer Script Loaded!');

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuizCleanup);
} else {
  initQuizCleanup();
}

function initQuizCleanup() {
  console.log('📚 Initializing quiz cleanup...');
  
  // Wait for content to be loaded by module-viewer.js
  let attempts = 0;
  const maxAttempts = 10;
  
  const checkInterval = setInterval(() => {
    attempts++;
    const contentArea = document.getElementById('contentArea');
    
    console.log(`Attempt ${attempts}: Checking for content area...`);
    
    if (contentArea && contentArea.innerHTML.length > 100) {
      console.log('✓ Content area found! Length:', contentArea.innerHTML.length);
      clearInterval(checkInterval);
      cleanupQuizText();
    } else if (attempts >= maxAttempts) {
      console.log('✗ Max attempts reached, no content found');
      clearInterval(checkInterval);
    }
  }, 1000);
}

function cleanupQuizText() {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) {
    console.log('✗ No content area found');
    return;
  }
  
  let html = contentArea.innerHTML;
  console.log('📝 Content HTML length:', html.length);
  
  // Count how many times "Question" appears
  const questionMatches = html.match(/Question\s+\d+/gi) || [];
  console.log('📊 Found', questionMatches.length, 'question references');
  
  // If there are many repeated questions (more than 15), it's the messy quiz text
  if (questionMatches.length < 15) {
    console.log('ℹ️ Not enough questions to indicate messy quiz text');
    return;
  }
  
  console.log('🧹 Detected messy quiz text! Cleaning up...');
  
  // Strategy: Keep content until we hit the first occurrence of the repeated pattern
  // Look for patterns like "**Question 1" or "### Question 1" etc.
  const cutoffPatterns = [
    '## Quiz ### Question 1',
    '**Question 1',
    '### Question 1',
    'Question 1 What is an important concept'
  ];
  
  let cutoffIndex = -1;
  let foundPattern = '';
  
  for (const pattern of cutoffPatterns) {
    const index = html.indexOf(pattern);
    if (index > 0 && (cutoffIndex === -1 || index < cutoffIndex)) {
      cutoffIndex = index;
      foundPattern = pattern;
    }
  }
  
  if (cutoffIndex > 0) {
    console.log('✂️ Found cutoff at index', cutoffIndex, 'with pattern:', foundPattern);
    
    // Keep everything before the messy quiz section
    const cleanHtml = html.substring(0, cutoffIndex);
    
    // Add a nice message about the quiz
    const quizNotice = `
      <hr class="my-8 border-gray-300">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-blue-900">Module Quiz</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>This module includes quiz questions to test your understanding.</p>
              <p class="mt-2"><strong>Note:</strong> Interactive quiz functionality will be available in the next update. For now, review the learning objectives above.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    contentArea.innerHTML = cleanHtml + quizNotice;
    console.log('✅ Quiz text cleaned up successfully!');
  } else {
    console.log('⚠️ Could not find a clear cutoff point for quiz text');
  }
}

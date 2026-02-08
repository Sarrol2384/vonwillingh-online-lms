// Quiz Renderer - Cleans up and hides repeated quiz text
// Simply hides all the messy repeated quiz questions

function initQuizRenderer() {
  // Wait a bit for content to load
  setTimeout(() => {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
    let html = contentArea.innerHTML;
    
    // Check if there are repeated quiz patterns
    const hasRepeatedQuestions = (html.match(/Question\s+\d+/g) || []).length > 10;
    
    if (!hasRepeatedQuestions) return;
    
    console.log('Detected repeated quiz text, cleaning up...');
    
    // Find where the repetition starts by looking for the pattern
    // Usually the content is good until we hit the first "**Question" or similar
    const patterns = [
      /\*\*Question\s+1/i,
      /<p>\s*Question\s+1/i,
      /###\s*Question\s+1/i
    ];
    
    let cutoffIndex = -1;
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        cutoffIndex = html.indexOf(match[0]);
        break;
      }
    }
    
    if (cutoffIndex > 100) {
      // Keep only the content before the repeated quiz mess
      const cleanContent = html.substring(0, cutoffIndex);
      
      // Add a note about the quiz
      const quizNote = `
        <hr class="my-8 border-gray-300">
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 class="text-lg font-bold text-blue-900 mb-2">
            <i class="fas fa-info-circle mr-2"></i>Module Quiz
          </h3>
          <p class="text-blue-800">
            This module includes quiz questions that will be made interactive in the next update.
            For now, focus on learning the content above!
          </p>
        </div>
      `;
      
      contentArea.innerHTML = cleanContent + quizNote;
      console.log('Content cleaned successfully');
    }
  }, 600);
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuizRenderer);
} else {
  initQuizRenderer();
}

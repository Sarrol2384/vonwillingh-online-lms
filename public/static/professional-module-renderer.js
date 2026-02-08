/**
 * Professional Module Content Renderer
 * Transforms raw module content into beautiful, readable format
 */

class ProfessionalModuleRenderer {
    constructor(contentElement) {
        this.contentElement = contentElement;
        this.rawContent = contentElement.innerHTML;
    }

    render() {
        console.log('🎨 Professional Module Renderer: Starting...');
        
        // Step 1: Clean up the content
        let cleanContent = this.cleanContent(this.rawContent);
        
        // Step 2: Remove duplicate paragraphs and quiz text
        cleanContent = this.removeDuplicates(cleanContent);
        
        // Step 3: Separate quiz from main content
        const { mainContent, quizContent } = this.separateQuizContent(cleanContent);
        
        // Step 4: Format main content professionally
        const formattedMain = this.formatMainContent(mainContent);
        
        // Step 5: Render quiz if present
        const formattedQuiz = quizContent ? this.renderQuiz(quizContent) : '';
        
        // Step 6: Update the DOM
        this.contentElement.innerHTML = formattedMain + formattedQuiz;
        
        console.log('✅ Professional Module Renderer: Complete!');
    }

    cleanContent(content) {
        // Remove excessive whitespace
        content = content.replace(/\n{3,}/g, '\n\n');
        content = content.trim();
        return content;
    }

    removeDuplicates(content) {
        // Split into paragraphs
        const paragraphs = content.split(/\n\n+/);
        const seen = new Set();
        const unique = [];
        
        for (const para of paragraphs) {
            const normalized = para.trim().toLowerCase().substring(0, 100);
            if (!seen.has(normalized) && para.trim().length > 10) {
                seen.add(normalized);
                unique.push(para);
            }
        }
        
        return unique.join('\n\n');
    }

    separateQuizContent(content) {
        // Find where quiz starts (multiple patterns)
        const quizPatterns = [
            /##\s*Module Quiz/i,
            /###\s*Quiz/i,
            /\*\*Question 1[\s\S]*?\*\*Question 2/i,
            /<h[23]>.*?Quiz.*?<\/h[23]>/i
        ];
        
        let quizStartIndex = -1;
        let foundPattern = null;
        
        for (const pattern of quizPatterns) {
            const match = content.match(pattern);
            if (match && match.index < quizStartIndex || quizStartIndex === -1) {
                quizStartIndex = match.index;
                foundPattern = pattern;
            }
        }
        
        if (quizStartIndex > -1) {
            console.log(`📝 Found quiz content at index ${quizStartIndex}`);
            return {
                mainContent: content.substring(0, quizStartIndex).trim(),
                quizContent: content.substring(quizStartIndex).trim()
            };
        }
        
        return {
            mainContent: content,
            quizContent: null
        };
    }

    formatMainContent(content) {
        // Apply professional styling to main content
        let formatted = content;
        
        // Wrap in a professional container
        formatted = `
            <div class="prose prose-lg max-w-none">
                <div class="module-main-content space-y-6">
                    ${this.processMarkdown(formatted)}
                </div>
            </div>
        `;
        
        return formatted;
    }

    processMarkdown(content) {
        // Convert markdown-style headers to HTML
        content = content.replace(/^##\s+(.+)$/gm, '<h2 class="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-4 border-purple-300">$1</h2>');
        content = content.replace(/^###\s+(.+)$/gm, '<h3 class="text-2xl font-bold text-gray-800 mt-6 mb-3">$1</h3>');
        content = content.replace(/^####\s+(.+)$/gm, '<h4 class="text-xl font-semibold text-gray-700 mt-4 mb-2">$1</h4>');
        
        // Convert **bold** to <strong>
        content = content.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
        
        // Convert bullet points
        content = content.replace(/^[-*]\s+(.+)$/gm, '<li class="ml-6">$1</li>');
        
        // Wrap lists
        content = content.replace(/(<li.*?<\/li>\s*)+/g, '<ul class="list-disc list-inside space-y-2 my-4 text-gray-700">$&</ul>');
        
        // Convert paragraphs
        const lines = content.split('\n');
        const processedLines = lines.map(line => {
            line = line.trim();
            if (!line) return '';
            if (line.startsWith('<')) return line; // Already HTML
            return `<p class="text-gray-700 leading-relaxed mb-4">${line}</p>`;
        });
        
        return processedLines.join('\n');
    }

    renderQuiz(quizContent) {
        console.log('📝 Rendering quiz section...');
        
        // Parse quiz questions
        const questions = this.parseQuizQuestions(quizContent);
        
        if (questions.length === 0) {
            return `
                <div class="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl">
                    <h2 class="text-3xl font-bold text-blue-900 mb-4 flex items-center">
                        <span class="text-4xl mr-3">📝</span> Module Quiz
                    </h2>
                    <p class="text-lg text-blue-800">
                        Interactive quiz functionality will be available in the next update.
                    </p>
                </div>
            `;
        }
        
        // Render interactive quiz
        const questionsHtml = questions.map((q, index) => this.renderQuestion(q, index)).join('');
        
        return `
            <div class="mt-12 quiz-container" id="quiz-container">
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-8">
                    <h2 class="text-3xl font-bold text-purple-900 mb-6 flex items-center">
                        <span class="text-4xl mr-3">🎯</span> Module Quiz
                    </h2>
                    <div class="space-y-6">
                        ${questionsHtml}
                    </div>
                    <button 
                        onclick="submitQuiz()" 
                        class="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
                    >
                        Submit Quiz
                    </button>
                    <div id="quiz-results" class="mt-6 hidden"></div>
                </div>
            </div>
        `;
    }

    parseQuizQuestions(quizContent) {
        const questions = [];
        
        // Try to parse structured quiz questions
        // Pattern: **Question X: Question text?**
        const questionPattern = /\*\*Question\s+(\d+):\s*(.+?)\*\*\s*\n\s*Options?:\s*\n([\s\S]+?)(?=\*\*Question|\*\*Correct Answer|$)/gi;
        
        let match;
        while ((match = questionPattern.exec(quizContent)) !== null) {
            const [, number, questionText, optionsText] = match;
            
            // Parse options (A), B), C), D) format
            const optionPattern = /([A-D])\)\s*(.+?)(?=\n[A-D]\)|\n\*\*|$)/gi;
            const options = [];
            let optionMatch;
            
            while ((optionMatch = optionPattern.exec(optionsText)) !== null) {
                options.push({
                    letter: optionMatch[1],
                    text: optionMatch[2].trim()
                });
            }
            
            if (options.length > 0) {
                questions.push({
                    number: parseInt(number),
                    question: questionText.trim(),
                    options: options
                });
            }
        }
        
        console.log(`✅ Parsed ${questions.length} quiz questions`);
        return questions;
    }

    renderQuestion(question, index) {
        const optionsHtml = question.options.map((opt, i) => `
            <label class="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all">
                <input 
                    type="radio" 
                    name="question-${index}" 
                    value="${opt.letter}" 
                    class="mt-1 mr-3 w-5 h-5 text-purple-600"
                />
                <span class="text-gray-800">
                    <strong class="text-purple-700">${opt.letter})</strong> ${opt.text}
                </span>
            </label>
        `).join('');
        
        return `
            <div class="question-item bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 class="text-xl font-bold text-gray-900 mb-4">
                    Question ${question.number}: ${question.question}
                </h3>
                <div class="space-y-3">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Professional Module Renderer: Initializing...');
    
    // Wait for content to load
    setTimeout(() => {
        const contentArea = document.getElementById('moduleContentArea');
        if (contentArea && contentArea.innerHTML.trim().length > 0) {
            console.log('✅ Content area found! Rendering...');
            const renderer = new ProfessionalModuleRenderer(contentArea);
            renderer.render();
        } else {
            console.log('⏳ Content not ready yet, will retry...');
            // Retry after module loads
            setTimeout(() => {
                const contentArea = document.getElementById('moduleContentArea');
                if (contentArea && contentArea.innerHTML.trim().length > 0) {
                    const renderer = new ProfessionalModuleRenderer(contentArea);
                    renderer.render();
                }
            }, 1000);
        }
    }, 500);
});

// Quiz submission function
function submitQuiz() {
    console.log('📝 Submitting quiz...');
    // This will be implemented later with actual quiz logic
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.className = 'mt-6 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg';
    resultsDiv.innerHTML = `
        <p class="text-lg font-semibold text-yellow-800">
            <span class="text-2xl mr-2">ℹ️</span>
            Quiz grading functionality will be added in the next update.
        </p>
    `;
    resultsDiv.classList.remove('hidden');
}

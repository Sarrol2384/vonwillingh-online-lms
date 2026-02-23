#!/bin/bash

# EMERGENCY DEPLOYMENT SCRIPT
# This bundles the fixed files so VonWillingh can manually deploy

echo "🚨 EMERGENCY: Creating deployment bundle..."
echo ""

cd /home/user/webapp || exit 1

# Create a deployment package
DEPLOY_DIR="emergency-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

echo "📦 Copying critical files..."

# Copy the main fixed file
cp public/static/quiz-component-v3.js "$DEPLOY_DIR/"
cp src/index.tsx "$DEPLOY_DIR/"

# Create instructions
cat > "$DEPLOY_DIR/DEPLOY_INSTRUCTIONS.txt" << 'EOF'
🚨 EMERGENCY DEPLOYMENT - TRUE/FALSE QUIZ FIX

WHAT'S IN THIS FOLDER:
======================
1. quiz-component-v3.js - Frontend fix (sends "True"/"False" instead of "A"/"B")
2. index.tsx - Backend fix (trims whitespace in answers)

HOW TO DEPLOY:
==============

METHOD 1: Copy Files Directly to Server
----------------------------------------
1. Upload quiz-component-v3.js to: /public/static/
2. Upload index.tsx to: /src/
3. Run: npm run build
4. Run: npx wrangler pages deploy dist --project-name vonwillingh-online-lms

METHOD 2: Deploy via GitHub Web UI
-----------------------------------
1. Go to: https://github.com/Sarrol2384/vonwillingh-online-lms
2. Navigate to: public/static/quiz-component-v3.js
3. Click "Edit" (pencil icon)
4. Delete all content
5. Copy-paste content from quiz-component-v3.js in this folder
6. Commit with message: "fix: True/False answer values"
7. Wait 2-3 minutes for auto-deploy

METHOD 3: Use This Command (If Git Works)
------------------------------------------
cd /home/user/webapp
git push origin main

THE BUG:
========
- Students select "True" or "False"
- Frontend sends "A" or "B" (WRONG!)
- Backend expects "True" or "False"
- Result: All True/False questions marked wrong

THE FIX:
========
Line 253 in quiz-component-v3.js changed from:
  value="${option.label}"
to:
  value="${isTrueFalse ? option.value : option.label}"

Backend index.tsx now trims whitespace before comparison.

VERIFICATION:
=============
After deploy, check browser console for:
  [GRADING] Q16 (true_false): { studentAnswer: "False", correctAnswer: "False", isCorrect: true }

URGENCY: HIGH
Students cannot pass quiz until this is deployed!

Questions 16-23 (True/False) are ALL being marked wrong currently.
EOF

# Create a simple patch file
cat > "$DEPLOY_DIR/quiz-component-v3.patch" << 'EOF'
--- a/public/static/quiz-component-v3.js
+++ b/public/static/quiz-component-v3.js
@@ -250,7 +250,7 @@
         <input 
           type="${inputType}" 
           name="question_${question.id}" 
-          value="${option.label}"
+          value="${isTrueFalse ? option.value : option.label}"
           class="quiz-${inputType} mt-1 flex-shrink-0"
           data-question-id="${question.id}"
           style="width: 20px; height: 20px; cursor: pointer; ${inputType === 'checkbox' ? 'border-radius: 4px;' : ''}"
EOF

echo "✅ Deployment bundle created: $DEPLOY_DIR"
echo ""
echo "📁 Contents:"
ls -lh "$DEPLOY_DIR"
echo ""
echo "📄 Read DEPLOY_INSTRUCTIONS.txt for deployment options"
echo ""
echo "🚀 FASTEST METHOD: Copy quiz-component-v3.js to GitHub via web UI"
echo "   https://github.com/Sarrol2384/vonwillingh-online-lms/blob/main/public/static/quiz-component-v3.js"

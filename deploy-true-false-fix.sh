#!/bin/bash

# 🚀 DEPLOY TRUE/FALSE FIX TO PRODUCTION

echo "=================================="
echo "🐛 TRUE/FALSE ANSWER VALUE FIX"
echo "=================================="
echo ""
echo "This will deploy the fix for True/False questions"
echo "being marked wrong even when correct."
echo ""
echo "Commits to deploy:"
echo "  - ce39de0: fix: Send True/False text values instead of A/B letters"
echo "  - 77e6d70: docs: Document true/false answer value bug and fix"
echo ""
echo "Press Enter to continue, or Ctrl+C to cancel..."
read

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Not in webapp directory!"
  exit 1
fi

# Show current branch
echo ""
echo "📍 Current branch:"
git branch --show-current
echo ""

# Push to GitHub (triggers Cloudflare Pages auto-deploy)
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SUCCESS! Code pushed to GitHub."
  echo ""
  echo "⏳ Cloudflare Pages will now automatically:"
  echo "   1. Detect the new commit"
  echo "   2. Run 'npm run build'"
  echo "   3. Deploy to: https://vonwillingh-online-lms.pages.dev"
  echo ""
  echo "⏱️  Deployment usually takes 2-3 minutes."
  echo ""
  echo "🔗 Check deployment status at:"
  echo "   https://dash.cloudflare.com/pages"
  echo ""
  echo "🧪 After deployment, test the quiz:"
  echo "   1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
  echo "   2. Open Module 1 quiz"
  echo "   3. Answer all 30 questions"
  echo "   4. Submit and verify True/False questions (16-23) are graded correctly"
  echo ""
  echo "Expected score if all correct: 97/97 (100%)"
  echo ""
else
  echo ""
  echo "❌ FAILED! Could not push to GitHub."
  echo ""
  echo "Common issues:"
  echo "  1. Not authenticated - Run: git config credential.helper store"
  echo "  2. Wrong remote URL - Run: git remote -v"
  echo "  3. Network issues - Check internet connection"
  echo ""
  echo "Manual deployment:"
  echo "  1. Commit is already made locally"
  echo "  2. Build is complete (dist/ folder ready)"
  echo "  3. Push manually: git push origin main"
  echo "  OR"
  echo "  4. Deploy directly: npx wrangler pages deploy dist --project-name vonwillingh-online-lms"
  echo ""
  exit 1
fi

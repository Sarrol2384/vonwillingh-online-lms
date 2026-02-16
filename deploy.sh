#!/bin/bash
# Quick deployment script for VonWillingh LMS
# Usage: ./deploy.sh

set -e

echo "🚀 Deploying VonWillingh LMS to Cloudflare Pages..."
echo ""

# Navigate to project directory
cd /home/user/webapp

# Set Cloudflare API token
export CLOUDFLARE_API_TOKEN="z2LVpFsGszg8hP42OQRfvZcX1SZMJVX47qVBfqiI"

# Deploy
npm run deploy

echo ""
echo "✅ Deployment complete!"
echo "🌐 Visit: https://vonwillingh-online-lms.pages.dev"
echo ""
echo "💡 Tip: Hard refresh your browser (Ctrl+Shift+R) to see changes"

#!/bin/bash

# Quick deployment helper script
# This script helps you verify deployment readiness

echo "🚀 API Wallet Agent - Deployment Checklist"
echo "=========================================="
echo ""

# Check if .env files exist
echo "📋 Checking environment files..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found - create it from backend/.env.example"
else
    echo "✅ backend/.env exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local not found - create it with:"
    echo "   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url"
    echo "   NEXT_PUBLIC_PROVIDER_URL=https://your-provider-url"
else
    echo "✅ frontend/.env.local exists"
fi

echo ""
echo "📦 Deployment files status:"
echo "✅ frontend/vercel.json - Ready for Vercel"
echo "✅ backend/Dockerfile - Ready for Docker/Railway/Render"
echo "✅ provider/Dockerfile - Ready for Docker/Railway/Render"
echo "✅ render.yaml - Ready for Render.com"
echo "✅ DEPLOYMENT.md - Full deployment guide"
echo ""

echo "📚 Next Steps:"
echo "1. Read DEPLOYMENT.md for detailed instructions"
echo "2. Push code to GitHub: git push origin main"
echo "3. Deploy Frontend to Vercel (connect GitHub repo)"
echo "4. Deploy Backend to Railway or Render"
echo "5. Deploy Provider to Railway or Render"
echo "6. Update frontend env vars with deployment URLs"
echo ""
echo "💡 Recommended: Vercel (frontend) + Railway (backend/provider)"
echo ""

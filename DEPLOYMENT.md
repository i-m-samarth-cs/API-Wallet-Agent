# 🚀 Deployment Guide - API Wallet Agent

Complete deployment guide for all components of the API Wallet Agent application.

## 📋 Overview

The application consists of:
1. **Frontend** (Next.js) → Deploy to Vercel (Free - Recommended) or Netlify
2. **Backend** (FastAPI) → Deploy to Render.com (Free) or Fly.io (Free)
3. **Provider** (FastAPI) → Deploy to Render.com (Free) or Fly.io (Free)
4. **Smart Contracts** → Already deployed on Arc blockchain

**All options are 100% free! No credit card required.**

---

## 🌐 Option 1: Quick Deploy with Vercel + Render.com (100% Free - Recommended)

### Frontend - Vercel (Free Tier)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) (free signup)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory
   - Add Environment Variables (update after backend is deployed):
     ```
     NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
     NEXT_PUBLIC_PROVIDER_URL=https://your-provider.onrender.com
     ```
   - Click "Deploy"
   - Vercel will auto-deploy on every push

### Backend - Render.com (Free Tier)

1. **Deploy Backend**
   - Go to [render.com](https://render.com) (free signup)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name**: `api-wallet-backend`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: `Docker`
     - **Dockerfile Path**: `backend/Dockerfile`
     - **Instance Type**: Free (spins down after 15min inactivity, wakes on request)
   - Add Environment Variables:
     ```
     GEMINI_API_KEY=your_gemini_key
     GROQ_API_KEY=your_groq_key
     ARC_RPC_URL=https://rpc.arc.xyz
     ARC_CHAIN_ID=5042002
     USDC_ADDRESS=your_usdc_address
     APIWALLET_CONTRACT=your_contract_address
     SIMULATION_MODE=true
     ```
   - Click "Create Web Service"
   - Render will provide: `https://api-wallet-backend.onrender.com`
   - ⚠️ First deploy takes 5-10 minutes

2. **Deploy Provider**
   - In Render dashboard, click "New +" → "Web Service"
   - Connect same GitHub repository
   - Settings:
     - **Name**: `api-wallet-provider`
     - **Root Directory**: `provider`
     - **Runtime**: `Docker`
     - **Dockerfile Path**: `provider/Dockerfile`
     - **Instance Type**: Free
   - Click "Create Web Service"
   - Render will provide: `https://api-wallet-provider.onrender.com`

3. **Update Frontend Environment Variables**
   - Go back to Vercel dashboard
   - Go to your project → Settings → Environment Variables
   - Update with Render URLs:
     ```
     NEXT_PUBLIC_BACKEND_URL=https://api-wallet-backend.onrender.com
     NEXT_PUBLIC_PROVIDER_URL=https://api-wallet-provider.onrender.com
     ```
   - Redeploy frontend (Vercel auto-deploys on env var changes)

---

## 🔵 Option 2: Deploy with Fly.io (Alternative Free Option)

Fly.io offers free tier with 3 shared-cpu-1x VMs (256MB RAM each).

### Setup

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   fly launch --name api-wallet-backend --region iad
   # When asked, don't deploy yet
   # Set secrets (environment variables):
   fly secrets set GEMINI_API_KEY=your_key GROQ_API_KEY=your_key ARC_RPC_URL=https://rpc.arc.xyz SIMULATION_MODE=true
   fly deploy
   ```

4. **Deploy Provider**
   ```bash
   cd provider
   fly launch --name api-wallet-provider --region iad
   fly deploy
   ```

5. **Update Frontend Env Vars**
   - Get your URLs: `fly status` in each directory
   - Update Vercel environment variables with Fly.io URLs

---

## 🐳 Option 3: Docker Deployment (Any Platform)

### Build and Run Locally (Test)

```bash
# Backend
cd backend
docker build -t api-wallet-backend .
docker run -p 8000:8000 --env-file .env api-wallet-backend

# Provider
cd provider
docker build -t api-wallet-provider .
docker run -p 9000:9000 api-wallet-provider
```

### Deploy to Docker Hub

```bash
# Tag and push
docker tag api-wallet-backend yourusername/api-wallet-backend
docker push yourusername/api-wallet-backend

docker tag api-wallet-provider yourusername/api-wallet-provider
docker push yourusername/api-wallet-provider
```

---

## 📝 Environment Variables Reference

### Backend Required Variables

```bash
# AI APIs (at least one required)
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Arc Blockchain
ARC_RPC_URL=https://rpc.arc.xyz
ARC_CHAIN_ID=5042002
USDC_ADDRESS=0xYourUSDCAddress
APIWALLET_CONTRACT=0xYourDeployedContract

# Circle (optional, uses simulation if not set)
CIRCLE_API_KEY=your_circle_key
CIRCLE_BASE_URL=https://api.circle.com
CIRCLE_WALLET_ID=your_wallet_id
SIMULATION_MODE=true
```

### Frontend Required Variables

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_PROVIDER_URL=https://your-provider-url.com
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible (test: `https://your-backend.com/health`)
- [ ] Provider is accessible (test: `https://your-provider.com/.well-known/x402`)
- [ ] Frontend loads and shows the UI
- [ ] Frontend can call backend API (check browser console)
- [ ] CORS is working (no CORS errors in browser)
- [ ] Environment variables are set correctly
- [ ] Payment flow works end-to-end

---

## 🔧 Troubleshooting

### CORS Errors
- Backend already has CORS configured for `*` origins
- If issues persist, update `main.py` to allow specific frontend URL

### Port Issues
- Backend/Provider use `$PORT` environment variable (auto-set by platforms)
- Dockerfiles expose ports 8000 and 9000

### Build Failures
- Check that all environment variables are set
- Verify Docker builds locally first
- Check platform logs for specific errors

### API Connection Issues
- Verify environment variables in frontend are correct
- Check that backend/provider URLs are accessible
- Test endpoints directly: `/health`, `/.well-known/x402`

---

## 🌍 Production URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://api-wallet-backend.onrender.com` (Render) or `https://api-wallet-backend.fly.dev` (Fly.io)
- **Provider**: `https://api-wallet-provider.onrender.com` (Render) or `https://api-wallet-provider.fly.dev` (Fly.io)

Update your frontend environment variables with these URLs!

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 💰 Cost Estimate (100% Free!)

- **Vercel**: Free tier (hobby plan) - Unlimited
- **Render**: Free tier - Spins down after 15min inactivity, auto-wakes on request
- **Fly.io**: Free tier - 3 shared-cpu-1x VMs (256MB RAM each)
- **Total**: $0/month for small projects!

**Note**: Render free tier services spin down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds to wake up. This is normal for free tier.

---

**Happy Deploying! 🚀**

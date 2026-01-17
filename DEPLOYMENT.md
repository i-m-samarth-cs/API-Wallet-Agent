# 🚀 Deployment Guide - API Wallet Agent

Complete deployment guide for all components of the API Wallet Agent application.

## 📋 Overview

The application consists of:
1. **Frontend** (Next.js) → Deploy to Vercel (Recommended) or Netlify
2. **Backend** (FastAPI) → Deploy to Railway, Render, or Fly.io
3. **Provider** (FastAPI) → Deploy to Railway, Render, or Fly.io
4. **Smart Contracts** → Already deployed on Arc blockchain

---

## 🌐 Option 1: Quick Deploy with Vercel + Railway (Recommended)

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
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory
   - Add Environment Variables:
     ```
     NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
     NEXT_PUBLIC_PROVIDER_URL=https://your-provider.railway.app
     ```
   - Click "Deploy"
   - Vercel will auto-deploy on every push

### Backend - Railway (Free Tier)

1. **Deploy Backend**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add a new service → Select `backend` folder
   - Railway will detect the Dockerfile automatically
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
   - Railway will provide a URL like `https://your-backend.railway.app`

2. **Deploy Provider**
   - In the same Railway project, add another service
   - Select `provider` folder
   - No environment variables needed for provider
   - Railway will provide a URL like `https://your-provider.railway.app`

3. **Update Frontend Environment Variables**
   - Go back to Vercel
   - Update environment variables with Railway URLs:
     ```
     NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
     NEXT_PUBLIC_PROVIDER_URL=https://your-provider.railway.app
     ```
   - Redeploy frontend

---

## 🔵 Option 2: Deploy with Render.com (Alternative)

### Setup

1. **Push code to GitHub** (if not already done)

2. **Deploy Backend**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: `api-wallet-backend`
     - **Root Directory**: `backend`
     - **Runtime**: Docker
     - **Dockerfile Path**: `backend/Dockerfile`
   - Add Environment Variables (same as Railway)
   - Click "Create Web Service"
   - Render will provide: `https://api-wallet-backend.onrender.com`

3. **Deploy Provider**
   - Repeat step 2 with:
     - **Name**: `api-wallet-provider`
     - **Root Directory**: `provider`
     - **Dockerfile Path**: `provider/Dockerfile`

4. **Deploy Frontend**
   - Go to Render → "New +" → "Static Site"
   - Connect repository
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/.next`
   - Add Environment Variables:
     ```
     NEXT_PUBLIC_BACKEND_URL=https://api-wallet-backend.onrender.com
     NEXT_PUBLIC_PROVIDER_URL=https://api-wallet-provider.onrender.com
     ```

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
- **Backend**: `https://your-backend.railway.app`
- **Provider**: `https://your-provider.railway.app`

Update your frontend environment variables with these URLs!

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 💰 Cost Estimate

- **Vercel**: Free tier (hobby plan)
- **Railway**: Free tier with $5 credit/month
- **Render**: Free tier available
- **Total**: ~$0/month for small projects

---

**Happy Deploying! 🚀**

# API Wallet Agent

AI-powered API payment system using USDC on Arc blockchain with x402-style micropayments and Gemini routing.

## Components

- **contracts/**: Solidity smart contract for on-chain USDC payments
- **backend/**: FastAPI agent with Gemini integration
- **provider/**: Mock API provider with x402 metadata
- **frontend/**: Next.js UI for chat and payment history

## Quick Start

### 1. Deploy Contract (Arc Testnet)
```bash
cd contracts
npm install
cp .env.example .env
# Edit .env with your Arc RPC and private key
npm run deploy
```

### 2. Start Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Gemini API key
uvicorn main:app --reload --port 8000
```

### 3. Start Provider Mock
```bash
cd provider
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 9000
```

### 4. Start Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000

## Demo Flow

1. Enter task: "Generate 3 images of Dhule skyline"
2. Set max budget: $0.05
3. Click "Pay + Execute"
4. View payment receipt and transaction hash
5. Check payment history

## Technologies

- **Arc blockchain**: USDC payments with native gas
- **Circle**: Wallet & Gateway API for USDC
- **Gemini 2.0 Flash**: AI routing and plan selection
- **x402**: Web-native payment protocol
- **FastAPI**: Backend agent service
- **Next.js**: Frontend UI

## 🚀 Deployment

Ready to deploy? Check out the comprehensive **[DEPLOYMENT.md](./DEPLOYMENT.md)** guide!

**Quick Deploy:**
- **Frontend**: Deploy to [Vercel](https://vercel.com) (free tier)
- **Backend/Provider**: Deploy to [Railway](https://railway.app) or [Render](https://render.com) (free tier)

All deployment configurations are included:
- ✅ Dockerfiles for backend and provider
- ✅ Vercel configuration for frontend
- ✅ Railway/Render configurations
- ✅ Complete deployment documentation

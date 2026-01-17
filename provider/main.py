from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Mock Provider")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROVIDER = {
    "name": "Image API Provider",
    "price_usd": 0.01,
    "provider_wallet": "0xPROVIDER_WALLET_ON_ARC",
    "currency": "USDC",
    "chain": "Arc",
    "endpoint": "/generate"
}

@app.get("/")
def root():
    return {
        "service": "Mock Provider",
        "version": "1.0.0",
        "endpoints": {
            "x402_metadata": "GET /.well-known/x402",
            "generate": "POST /generate",
            "docs": "GET /docs"
        }
    }

@app.get("/.well-known/x402")
def x402():
    return PROVIDER

class GenReq(BaseModel):
    prompt: str
    quantity: int
    receipt_tx: str

@app.post("/generate")
def generate(req: GenReq):
    imgs = [f"https://dummy.image/{i}?prompt={req.prompt}" for i in range(req.quantity)]
    return {"ok": True, "images": imgs, "receipt_tx": req.receipt_tx}

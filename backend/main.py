import os
import uuid
from dotenv import load_dotenv

# Load environment variables before other imports that might need them
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from x402 import fetch_x402_metadata
from gemini_agent import choose_plan
from circle_client import send_usdc_circle
from store import add_payment, list_payments

app = FastAPI(title="API Wallet Agent")

# CORS middleware - must be before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Additional CORS headers for all responses
@app.middleware("http")
async def add_cors_header(request, call_next):
    if request.method == "OPTIONS":
        response = JSONResponse(content={})
    else:
        response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.options("/{full_path:path}")
async def options_handler():
    return JSONResponse(content={}, headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*",
    })

class PayRequest(BaseModel):
    task: str
    max_usd: float
    provider_url: str

@app.get("/")
def root():
    return {
        "service": "API Wallet Agent",
        "version": "1.0.0",
        "endpoints": {
            "health": "GET /health",
            "payments": "GET /payments",
            "pay_api": "POST /pay-api",
            "docs": "GET /docs"
        }
    }

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/payments")
def payments():
    return {"payments": list_payments()}

@app.post("/pay-api")
async def pay_api(req: PayRequest):
    try:
        invoice_id = "inv_" + uuid.uuid4().hex

        # Fetch x402 metadata
        try:
            x402 = fetch_x402_metadata(req.provider_url)
            price_per_unit = float(x402["price_usd"])
            provider_address = x402["provider_wallet"]
        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={
                    "ok": False,
                    "error": f"Failed to fetch provider metadata: {str(e)}"
                }
            )

        # Choose plan using AI (Gemini or Groq fallback)
        try:
            plan = choose_plan(req.task, req.max_usd, price_per_unit)
            quantity = int(plan["quantity"])
            total_cost = float(plan["total_cost_usd"])
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={
                    "ok": False,
                    "error": f"Failed to generate payment plan: {str(e)}",
                    "details": "Please check GEMINI_API_KEY or GROQ_API_KEY in .env"
                }
            )

        if total_cost > req.max_usd:
            return JSONResponse(
                status_code=400,
                content={
                    "ok": False,
                    "error": "Budget exceeded",
                    "plan": plan,
                    "total_cost": total_cost,
                    "max_budget": req.max_usd
                }
            )

        # Send payment (simulated or real)
        try:
            pay_result = send_usdc_circle(provider_address, total_cost)
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={
                    "ok": False,
                    "error": f"Payment failed: {str(e)}"
                }
            )

        record = {
            "invoiceId": invoice_id,
            "provider": x402["name"],
            "provider_url": req.provider_url,
            "provider_wallet": provider_address,
            "price_usd_per_unit": price_per_unit,
            "quantity": quantity,
            "total_cost_usd": total_cost,
            "txHash": pay_result["txHash"],
            "status": pay_result["status"],
        }
        add_payment(record)

        return {
            "ok": True,
            "receipt": record,
            "result": {
                "message": f"Paid {total_cost} USDC for {quantity} unit(s). Provider can now execute task.",
            }
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "ok": False,
                "error": f"Internal server error: {str(e)}"
            }
        )

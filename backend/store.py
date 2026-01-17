from typing import List, Dict
from datetime import datetime

PAYMENTS: List[Dict] = []

def add_payment(p: Dict):
    p["created_at"] = datetime.utcnow().isoformat() + "Z"
    PAYMENTS.append(p)

def list_payments():
    return PAYMENTS[::-1]

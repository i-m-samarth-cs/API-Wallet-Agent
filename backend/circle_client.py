import os
import requests
import uuid

SIM = os.getenv("SIMULATION_MODE", "true").lower() == "true"

def send_usdc_circle(to_address: str, amount_usdc: float):
    """
    For MVP: either call Circle APIs OR simulate.
    Return txHash-like string for UI.
    """
    if SIM:
        return {
            "status": "simulated",
            "txHash": "0xSIMULATED_" + uuid.uuid4().hex,
        }

    raise NotImplementedError("Circle live transfer not wired in this skeleton")

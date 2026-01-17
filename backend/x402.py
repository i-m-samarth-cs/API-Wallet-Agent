import requests

def fetch_x402_metadata(provider_base_url: str):
    url = provider_base_url.rstrip("/") + "/.well-known/x402"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    return r.json()

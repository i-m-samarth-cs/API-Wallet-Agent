import os
import json
import re

_client_gemini = None
_use_groq = False

def get_gemini_client():
    global _client_gemini
    if _client_gemini is None:
        try:
            from google import genai
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key:
                _client_gemini = genai.Client(api_key=api_key)
            else:
                raise ValueError("GEMINI_API_KEY not set")
        except Exception as e:
            print(f"Gemini initialization failed: {e}")
            _client_gemini = None
    return _client_gemini

def choose_plan(task: str, max_usd: float, provider_price_usd: float):
    """
    Choose payment plan using Gemini or Groq as fallback.
    Returns dict with: quantity (int), reason (str), total_cost_usd (float)
    """
    prompt = f"""
You are a routing agent. Convert the user request into a quantity integer.
Task: {task}
Max budget USD: {max_usd}
Provider price per unit USD: {provider_price_usd}

Return ONLY JSON with:
quantity (int), reason (string), total_cost_usd (float)

Example: {{"quantity": 3, "reason": "Task requires 3 images", "total_cost_usd": 0.03}}
"""
    
    # Try Gemini first
    client = get_gemini_client()
    if client:
        try:
            resp = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
            )
            text = resp.text.strip()
            # Clean up JSON if it's wrapped in markdown code blocks
            text = re.sub(r'```json\s*', '', text)
            text = re.sub(r'```\s*', '', text)
            text = text.strip()
            return json.loads(text)
        except Exception as e:
            print(f"Gemini API call failed: {e}, trying Groq fallback...")
    
    # Fallback to Groq
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        raise ValueError("Neither GEMINI_API_KEY nor GROQ_API_KEY is set. Please set at least one.")
    
    try:
        import requests
        
        # Try different Groq models in order
        groq_models = [
            "llama-3.1-70b-versatile",
            "llama-3.1-8b-instant",
            "mixtral-8x7b-32768"
        ]
        
        last_error = None
        for model_name in groq_models:
            try:
                response = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {groq_key.strip()}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model_name,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a routing agent. Always respond with valid JSON only. No markdown, no explanations, just JSON."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.3,
                        "max_tokens": 200,
                        "response_format": {"type": "json_object"}
                    },
                    timeout=30
                )
                
                if response.status_code == 200:
                    result = response.json()
                    text = result["choices"][0]["message"]["content"].strip()
                    
                    # Clean up JSON if wrapped in code blocks
                    text = re.sub(r'```json\s*', '', text)
                    text = re.sub(r'```\s*', '', text)
                    text = text.strip()
                    
                    parsed = json.loads(text)
                    # Ensure required fields exist
                    if "quantity" not in parsed or "total_cost_usd" not in parsed:
                        raise ValueError("Invalid response format from Groq")
                    
                    return parsed
                else:
                    last_error = f"HTTP {response.status_code}: {response.text}"
                    continue
                    
            except json.JSONDecodeError as e:
                last_error = f"JSON decode error: {str(e)}"
                continue
            except KeyError as e:
                last_error = f"Missing key in response: {str(e)}"
                continue
            except Exception as e:
                last_error = f"Model {model_name} failed: {str(e)}"
                continue
        
        # If all models failed, try simple calculation as fallback
        print(f"All Groq models failed. Last error: {last_error}. Using calculation fallback.")
        return calculate_plan_fallback(task, max_usd, provider_price_usd)
        
    except Exception as e:
        print(f"Groq API error: {e}. Using calculation fallback.")
        return calculate_plan_fallback(task, max_usd, provider_price_usd)

def calculate_plan_fallback(task: str, max_usd: float, provider_price_usd: float):
    """
    Fallback calculation when AI APIs fail.
    Extracts numbers from task and calculates quantity based on budget.
    """
    import re
    
    # Try to extract number from task (e.g., "3 images" -> 3)
    numbers = re.findall(r'\d+', task)
    if numbers:
        requested_quantity = int(numbers[0])
    else:
        # Default to 1 if no number found
        requested_quantity = 1
    
    # Calculate maximum affordable quantity
    max_affordable = int(max_usd / provider_price_usd) if provider_price_usd > 0 else 1
    
    # Use the minimum of requested and affordable
    quantity = min(requested_quantity, max_affordable, 10)  # Cap at 10
    total_cost = quantity * provider_price_usd
    
    return {
        "quantity": quantity,
        "reason": f"Calculated from task: requested {requested_quantity}, budget allows {max_affordable}. Using {quantity} units.",
        "total_cost_usd": round(total_cost, 6)
    }

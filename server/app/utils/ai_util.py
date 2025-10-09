import os
import json
import requests
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def clean_product_with_ai(product_data, upc=None):
    """
    Cleans and enriches raw product JSON using OpenAI.

    - Shortens overly long names
    - Extracts product size (e.g., '3.4 oz')
    - Summarizes long descriptions to 30 words
    - Classifies into one of defined product categories
    - Optionally adds price data from an external API
    """

    categories = [
        "Men's Fragrances",
        "Women's Fragrances",
        "Mini",
        "Gift Sets",
        "Bath & Body",
    ]

    # 🧠 Updated prompt
    prompt = f"""
    You are a data-cleaning assistant for an e-commerce backend.

    TASKS:
    1. Clean the product JSON below.
    2. Add/modify the following fields:
       - "name": concise and readable, remove size or brand redundancy
       - "size": extract from name/description if present (e.g., "3.4 oz" or "100ml")
       - "description": summarize to at most 30 words
       - "category": choose exactly ONE from this list:
         Rules for classification:
         - Use "Men's" if the fragrance is clearly for men or has masculine branding.
         - Use "Women's" if it’s for women or has feminine branding.
         - Use "Mini" for travel-size or miniature fragrances.
         - Use "Gift Sets" for any set or collection with multiple items.
         - Use "Bath & Body" for aftershaves, deodorants, lotions, creams, body mists, etc.
       - Keep "brand" and "gender" if available.
    3. Return **only valid JSON**, no text or commentary.

    Raw JSON:
    {product_data}
    """

    cleaned_product = product_data

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2, 
        )

        cleaned_text = response.choices[0].message.content.strip()
        cleaned_product = json.loads(cleaned_text)

    except Exception as e:
        print(f"[AI_CLEANUP_ERROR]: {e}")
    if upc:
        try:
            price_api = f"https://api.upcitemdb.com/prod/trial/lookup?upc={upc}"
            res = requests.get(price_api)
            if res.status_code == 200:
                items = res.json().get("items", [])
                if items and "lowest_recorded_price" in items[0]:
                    cleaned_product["price"] = items[0]["lowest_recorded_price"]
        except Exception as e:
            print(f"[PRICE_LOOKUP_FAILED]: {e}")

    return cleaned_product
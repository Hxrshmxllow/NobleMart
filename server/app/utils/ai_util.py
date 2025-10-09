import os
import json
import requests
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def clean_product_with_ai(product_data, upc=None):
    prompt = f"""
        You are a product data–cleaning and categorization assistant for an e-commerce backend.

        Your goal is to transform the raw product JSON below into a clean, structured, standardized JSON object.

        You must follow these rules carefully:

        CLEANING RULES:
        - "name": concise and professional. Remove redundant brand, size, or format details (e.g., remove "3.4 oz", "Eau de Toilette Spray" if redundant).
        - "size": extract from the name or description if mentioned (e.g., "3.4 oz", "100 ml"). If not found, use null.
        - "description": rewrite or summarize to at most 30 words. Must be human-readable and marketing-friendly.
        - "brand": keep if available.
        - "gender": keep or infer if obvious ("Pour Homme" → male, "Pour Femme" → female, "Unisex" → neutral).
        - Do NOT invent new fields. Keep existing ones if valid.

        CATEGORY CLASSIFICATION:
        Choose exactly ONE category from this list:
        [
        "Men's Fragrances",
        "Women's Fragrances",
        "Mini",
        "Gift Sets",
        "Bath & Body"
        ]

        Follow this hierarchy and logic for classification:

        1. If the product mentions “set”, “gift”, “bundle”, or includes multiple items → "Gift Sets"
        2. If the product name or size suggests travel size, mini, sample, rollerball, or “0.3 oz / 10 ml or less” → "Mini"
        3. If it includes words like “lotion”, “cream”, “body wash”, “aftershave”, “deodorant”, “mist”, or “gel” → "Bath & Body"
        4. Otherwise, classify as a fragrance based on gender cues:
        - Use "Men's Fragrances" if it’s for men, labeled "Pour Homme", "Men", "Cologne", or has woody/spicy/amber notes.
        - Use "Women's Fragrances" if it’s for women, labeled "Pour Femme", "Women", "Perfume", or has floral/fruity/vanilla notes.
        - For "Unisex" fragrances, infer dominant tone:
            - More woody/spicy → "Men's Fragrances"
            - More floral/sweet → "Women's Fragrances"

        OUTPUT REQUIREMENTS:
        - Output only valid JSON, nothing else.
        - Include the following fields: ["name", "brand", "size", "category", "description", "gender"]
        - Do not add explanations or markdown, only JSON.

        RAW JSON:
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
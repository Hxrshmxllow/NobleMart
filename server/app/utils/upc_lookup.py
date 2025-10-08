import requests

def retrieveItemData(upc_code):
    response = requests.get(f"https://api.upcitemdb.com/prod/trial/lookup?upc={upc_code}")

    if response.status_code == 200:
        data = response.json()
        if data['code'] == "OK" and data['items']:
            item = data['items'][0]
            name = item.get('title', '')
            brand = item.get('brand', '')
            description = item.get('description', '')
            category = item.get('category', '')
            img = item['images'][0] if item['images'] else None
            return {
                "name": name,
                "brand": brand,
                "description": description,
                "category": category,
                "image": img
            }
    return None

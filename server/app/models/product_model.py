import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
products_table = dynamodb.Table('Products')

def get_products_by_category(category):
    try:
        response = products_table.scan(
            FilterExpression=Attr("category").eq(category)
        )
        return response.get("Items", [])
    except Exception as e:
        print("Error scanning products by category:", e)
        return []

def get_all_products(start_key=None):
    try:
        scan_kwargs = {"Limit": 20}

        if start_key:
            scan_kwargs["ExclusiveStartKey"] = start_key

        response = products_table.scan(**scan_kwargs)

        return {
            "items": response.get("Items", []),
            "nextKey": response.get("LastEvaluatedKey") 
        }

    except Exception as e:
        print("Error getting all products:", e)
        return {"items": [], "nextKey": None}
    
def get_product(upc):
    try:
        response = products_table.get_item(Key={"upc": upc})
        return response.get("Item")
    except Exception as e:
        print(f"Error fetching product with UPC {upc}: {e}")
        return None
    
def get_all_brands():
    try:
        brands = set()
        scan_kwargs = {}
        while True:
            response = products_table.scan(**scan_kwargs)
            for item in response.get("Items", []):
                brand = item.get("brand")
                if brand:
                    brands.add(brand.strip())
            if "LastEvaluatedKey" not in response:
                break
            scan_kwargs["ExclusiveStartKey"] = response["LastEvaluatedKey"]

        return sorted(list(brands))
    except Exception as e:
        print("Error fetching all brands:", e)
        return []

def get_products_by_brand(brand):
    try:
        response = products_table.scan(
            FilterExpression=Attr("brand").eq(brand)
        )
        return response.get("Items", [])
    except Exception as e:
        print(f"Error scanning products by brand '{brand}':", e)
        return []
    
def fetch_new_arrivals(limit=6):
    try:
        response = products_table.scan()
        items = response.get("Items", [])
        items.sort(
            key=lambda x: x.get("created_at", 0),
            reverse=True
        )
        return items[:limit]

    except Exception as e:
        print("Error fetching new arrivals:", e)
        return []

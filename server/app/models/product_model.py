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
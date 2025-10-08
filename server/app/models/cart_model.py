import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
cart_table = dynamodb.Table('Cart')  # You must create this table in AWS

def add_to_cart(item):
    try:
        response = cart_table.put_item(Item=item)
        return response
    except ClientError as e:
        print(f"Error adding to cart: {e}")
        return None

def get_cart(user_id):
    try:
        response = cart_table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('userId').eq(user_id)
        )
        return response.get("Items", [])
    except ClientError as e:
        print(f"Error retrieving cart: {e}")
        return []

def remove_from_cart(user_id, upc):
    try:
        response = cart_table.delete_item(
            Key={
                "userId": user_id,
                "upc": upc
            }
        )
        return response
    except ClientError as e:
        print(f"Error removing item: {e}")
        return None

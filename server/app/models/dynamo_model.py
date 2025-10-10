import boto3
from botocore.exceptions import ClientError
import os
import time
import uuid
from datetime import datetime
from boto3.dynamodb.conditions import Key

region = os.environ.get("AWS_REGION", "us-east-1")
dynamodb = boto3.resource(
    'dynamodb',
    region_name=region,
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY")
)

products_table = dynamodb.Table('Products')
users_table = dynamodb.Table('Users')


def put_product(item):
    try:
        item["created_at"] = int(time.time())
        response = products_table.put_item(Item=item)
        return response
    except ClientError as e:
        print(f"Error uploading to DynamoDB: {e}")
        return None

def put_user(email, name, address):
    try:
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        random_suffix = str(uuid.uuid4().int)[:6]  
        account_number = f"NM{timestamp}{random_suffix}"
        item = {
            "accountNumber": account_number,
            "email": email,
            "name": name,
            "address": address,
            "isAdmin": False,
            "createdAt": datetime.utcnow().isoformat(),
        }
        users_table.put_item(Item=item)
        return {
            "status": "success",
            "message": "User added successfully.",
            "accountNumber": account_number,
        }
    except Exception as e:
        print(f"[ERROR] Failed to add user {email}:", e)
        return {
            "status": "error",
            "message": str(e),
        }
    

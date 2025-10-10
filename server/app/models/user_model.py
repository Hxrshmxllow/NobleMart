import uuid
from datetime import datetime
from boto3.dynamodb.conditions import Key
import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
users_table = dynamodb.Table('Users')


def get_user_by_email(email: str):
    try:
        res = users_table.query(
            IndexName="email-index",
            KeyConditionExpression=Key("email").eq(email)
        )
        items = res.get("Items", [])
        return items[0] if items else None
    except Exception as e:
        print(f"[ERROR] get_user_by_email: {e}")
        return None


def get_user_by_account(account_number: str):
    try:
        res = users_table.get_item(Key={"accountNumber": account_number})
        return res.get("Item")
    except Exception as e:
        print(f"[ERROR] get_user_by_account: {e}")
        return None


def update_user(account_number: str, name: str, address: str):
    try:
        users_table.update_item(
            Key={"accountNumber": account_number},
            UpdateExpression="SET #n = :name, address = :addr",
            ExpressionAttributeNames={"#n": "name"},
            ExpressionAttributeValues={
                ":name": name,
                ":addr": address,
            },
        )
        return {"status": "success", "message": "Profile updated."}
    except Exception as e:
        print(f"[ERROR] update_user: {e}")
        return {"status": "error", "message": str(e)}

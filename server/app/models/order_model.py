import uuid
import boto3
from datetime import datetime
from boto3.dynamodb.conditions import Key, Attr
from decimal import Decimal, ROUND_HALF_UP

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
orders_table = dynamodb.Table('Orders')


def put_order(account_number: str, items: list, total: str, address: str, status="Pending"):
    try:
        date_str = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        short_id = str(uuid.uuid4())[:8].upper()
        order_number = f"ORD-{date_str}-{short_id}"

        order_item = {
            "accountNumber": account_number,
            "orderNumber": order_number,
            "date": datetime.utcnow().isoformat(),
            "status": status,
            "items": items,  
            "total": Decimal(total).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            "shippingAddress": address,
        }

        orders_table.put_item(Item=order_item)
        print(f"[INFO] Created order {order_number} for {account_number}")
        return {"status": "success", "data": order_item}

    except Exception as e:
        print(f"[ERROR] put_order: {e}")
        return {"status": "error", "message": str(e)}

def get_orders_by_user(account_number: str):
    try:
        response = orders_table.query(
            KeyConditionExpression=Key("accountNumber").eq(account_number)
        )
        return {"status": "success", "orders": response.get("Items", [])}
    except Exception as e:
        print(f"[ERROR] get_orders_by_user: {e}")
        return {"status": "error", "message": str(e)}

def get_order_details(account_number: str, order_number: str):
    try:
        response = orders_table.get_item(
            Key={"accountNumber": account_number, "orderNumber": order_number}
        )
        item = response.get("Item")
        if not item:
            return {"status": "error", "message": "Order not found"}
        return {"status": "success", "order": item}
    except Exception as e:
        print(f"[ERROR] get_order_details: {e}")
        return {"status": "error", "message": str(e)}

def get_all_orders(status: str):
    if status == "pending":
        try:
            response = orders_table.scan(
                FilterExpression=Attr("status").ne("Delivered")
            )
            return {"status": "success", "orders": response.get("Items", [])}
        except Exception as e:
            print(f"[ERROR] get_all_orders_{status}: {e}")
            return {"status": "error", "message": str(e)}
    else:
        try:
            response = orders_table.scan(
                FilterExpression=Attr("status").eq(status)
            )
            return {"status": "success", "orders": response.get("Items", [])}
        except Exception as e:
            print(f"[ERROR] get_all_orders_{status}: {e}")
            return {"status": "error", "message": str(e)}
        
def update_order(accountNumber, orderNumber, status):
    try:
        response = orders_table.update_item(
            Key={
                'accountNumber': accountNumber,  
                'orderNumber': orderNumber       
            },
            UpdateExpression="SET #s = :new_status",
            ExpressionAttributeNames={
                '#s': 'status'
            },
            ExpressionAttributeValues={
                ':new_status': status
            },
            ConditionExpression="attribute_exists(accountNumber) AND attribute_exists(orderNumber)",
            ReturnValues="ALL_NEW"
        )

        print("✅ Order status updated successfully!")
        return response['Attributes']

    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            print("⚠️ Order does not exist — no update made.")
        else:
            print(f"❌ Failed to update order: {e.response['Error']['Message']}")
        return None
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb', region_name='us-east-1') 
table = dynamodb.Table('Products')  

def put_product(item):
    try:
        response = table.put_item(Item=item)
        return response
    except ClientError as e:
        print(f"Error uploading to DynamoDB: {e}")
        return None
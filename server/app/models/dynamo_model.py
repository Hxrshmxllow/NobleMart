import boto3
from botocore.exceptions import ClientError
import os

region = os.environ.get("AWS_REGION", "us-east-1")
dynamodb = boto3.resource(
    'dynamodb',
    region_name=region,
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY")
)

table = dynamodb.Table('Products')

def put_product(item):
    try:
        response = table.put_item(Item=item)
        return response
    except ClientError as e:
        print(f"Error uploading to DynamoDB: {e}")
        return None
    

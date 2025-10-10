import boto3
import hmac
import hashlib
import base64
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")
CLIENT_SECRET = os.getenv("COGNITO_CLIENT_SECRET")
USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
REGION = os.getenv("AWS_REGION")

client = boto3.client("cognito-idp", region_name=REGION)

def generate_secret_hash(username):
    message = bytes(username + CLIENT_ID, 'utf-8')
    key = bytes(CLIENT_SECRET, 'utf-8')
    secret_hash = base64.b64encode(hmac.new(key, message, digestmod=hashlib.sha256).digest()).decode()
    return secret_hash


def signup_user(email, password, name):
    try:
        response = client.sign_up(
            ClientId=CLIENT_ID,
            SecretHash=generate_secret_hash(email),
            Username=email,
            Password=password,
            UserAttributes=[
                {"Name": "name", "Value": name},
                {"Name": "email", "Value": email},
            ],
        )
        return {"status": "success", "data": response}
    except client.exceptions.UsernameExistsException:
        return {"status": "error", "message": "User already exists."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def confirm_signup(email, code):
    try:
        response = client.confirm_sign_up(
            ClientId=CLIENT_ID,
            SecretHash=generate_secret_hash(email),
            Username=email,
            ConfirmationCode=code,
        )
        return {"status": "success", "data": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def signin_user(email, password):
    try:
        response = client.initiate_auth(
            ClientId=CLIENT_ID,
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": email,
                "PASSWORD": password,
                "SECRET_HASH": generate_secret_hash(email),
            },
        )
        return {"status": "success", "data": response["AuthenticationResult"]}
    except Exception as e:
        return {"status": "error", "message": str(e)}

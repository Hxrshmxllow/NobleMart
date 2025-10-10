import os
import hmac
import hashlib
import base64
import boto3
import requests
import time
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv
from jose import jwk, jwt
from jose.utils import base64url_decode

load_dotenv()

REGION = os.getenv("AWS_REGION")
USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")
CLIENT_SECRET = os.getenv("COGNITO_CLIENT_SECRET")

client = boto3.client("cognito-idp", region_name=REGION)
JWKS_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"

JWKS_CACHE = {"keys": None, "last_fetch": 0}


def get_jwks():
    now = time.time()
    if JWKS_CACHE["keys"] is None or now - JWKS_CACHE["last_fetch"] > 3600:
        try:
            print("[INFO] Fetching new JWKS keys...")
            response = requests.get(JWKS_URL, timeout=5)
            response.raise_for_status()
            JWKS_CACHE["keys"] = response.json()["keys"]
            JWKS_CACHE["last_fetch"] = now
        except Exception as e:
            print("[ERROR] Failed to fetch JWKS keys:", e)
            JWKS_CACHE["keys"] = []
    return JWKS_CACHE["keys"]


def generate_secret_hash(username: str) -> str:
    """Generate a Cognito-compatible secret hash."""
    message = bytes(username + CLIENT_ID, "utf-8")
    key = bytes(CLIENT_SECRET, "utf-8")
    return base64.b64encode(hmac.new(key, message, digestmod=hashlib.sha256).digest()).decode()


def signup_user(email: str, password: str, name: str):
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
        print("[ERROR] signup_user:", e)
        return {"status": "error", "message": str(e)}


def confirm_signup(email: str, code: str):
    try:
        response = client.confirm_sign_up(
            ClientId=CLIENT_ID,
            SecretHash=generate_secret_hash(email),
            Username=email,
            ConfirmationCode=code,
        )
        return {"status": "success", "data": response}
    except Exception as e:
        print("[ERROR] confirm_signup:", e)
        return {"status": "error", "message": str(e)}


def signin_user(email: str, password: str):
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
        print("[ERROR] signin_user:", e)
        return {"status": "error", "message": str(e)}


def verify_cognito_token(token: str):
    """Verify AWS Cognito JWT token using cached JWKS."""
    try:
        headers = jwt.get_unverified_headers(token)
        kid = headers.get("kid")
        keys = get_jwks()

        key = next((k for k in keys if k["kid"] == kid), None)
        if not key:
            raise Exception("Public key not found in JWKS")

        public_key = jwk.construct(key)
        message, encoded_sig = token.rsplit(".", 1)
        decoded_sig = base64url_decode(encoded_sig.encode("utf-8"))

        if not public_key.verify(message.encode("utf-8"), decoded_sig):
            raise Exception("Signature verification failed")

        claims = jwt.get_unverified_claims(token)
        if claims.get("aud") != CLIENT_ID:
            raise Exception("Invalid audience")
        if claims.get("exp") and claims["exp"] < time.time():
            raise Exception("Token expired")

        return claims

    except Exception as e:
        print("[ERROR] Token verification failed:", e)
        return None


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]
        claims = verify_cognito_token(token)
        if not claims:
            return jsonify({"error": "Invalid or expired token"}), 401

        current_user = {
            "email": claims.get("email"),
            "sub": claims.get("sub"),
        }

        return f(current_user, *args, **kwargs)
    return decorated

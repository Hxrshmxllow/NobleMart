from flask import Flask, request
from flask_cors import CORS
from .routes.products import products_bp
from .routes.cart import cart_bp
from .routes.admin import admin_bp
from .routes.auth import auth_bp
from .routes.account import account_bp
from .routes.orders import orders_bp
import os
from dotenv import load_dotenv

def create_app():
    app = Flask(__name__)

    load_dotenv()

    CORS(
        app,
        origins=["http://localhost:5173", "http://noblemart.s3-website-us-east-1.amazonaws.com"],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )
    
    app.secret_key = os.getenv("NobleMart")
    app.config.from_object("config.Config")

    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(cart_bp, url_prefix="/api/cart")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")     
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(account_bp, url_prefix="/api/account")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")

    @app.route("/api")
    def root():
        return {"message": "NobleMart backend running on AWS-ready Flask app"}
    
    

    return app

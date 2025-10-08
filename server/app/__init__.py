from flask import Flask
from flask_cors import CORS
from .routes.products import products_bp
from .routes.cart import cart_bp

def create_app():
    app = Flask(__name__)

    app.config.from_object("config.Config")

    CORS(app)

    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(cart_bp, url_prefix="/api/cart")

    @app.route("/api")
    def root():
        return {"message": "NobleMart backend running on AWS-ready Flask app"}

    return app
